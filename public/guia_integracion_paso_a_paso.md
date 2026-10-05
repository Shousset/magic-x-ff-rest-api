# Guía de integración — Auth + Collections en `magic-x-ff-rest-api`

Este documento explica **cómo aplicar** los cambios del zip (`magic-fin-api-auth-collections.zip`) en pasos chicos, cada uno con su propio commit, en vez de un solo commit gigante. Así el historial de git queda legible y cada parte se puede probar por separado antes de seguir con la siguiente.

Asumo que ya tenés el zip descomprimido en algún lado (por ejemplo `~/Descargas/cambios_magic_api/`) y tu repo clonado en otra carpeta. Todos los comandos `git` se corren **desde la carpeta de tu repo** (`magic-x-ff-rest-api/`), no desde la carpeta del zip.

Antes de arrancar, creá una rama para no tocar `main` directamente:

```bash
git checkout -b feature/auth-and-collections
```

---

## Paso 0 — Dependencias y variables de entorno

**Qué se copia:** `package.json`, `.env.example`.

```bash
cp ~/Descargas/cambios_magic_api/package.json ./package.json
cp ~/Descargas/cambios_magic_api/.env.example ./.env.example

npm install
```

`package.json` ahora tiene:
- `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt` → para firmar y verificar JWT.
- `class-validator`, `class-transformer` → para los DTOs nuevos (login, usuarios, colección).
- `@types/passport-jwt` en `devDependencies`.
- Un script nuevo: `create-admin`.

Actualizá tu `.env` real (el que no se sube a git) agregando las variables nuevas que pide `.env.example`: `JWT_SECRET`, `JWT_EXPIRES_IN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`. Si no tenés `.env` todavía, copiá `.env.example` a `.env` y completá `DATABASE_URL` con tu conexión real.

No hace falta levantar el server todavía en este paso — todavía no hay módulos nuevos que rompan nada.

**Commit:**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: agregar dependencias de JWT, Passport y class-validator"
```

---

## Paso 1 — Modelo de datos: `User`, `UserRole` y `CollectionEntry`

**Qué se copia:** `prisma/schema.prisma`.

```bash
cp ~/Descargas/cambios_magic_api/prisma/schema.prisma ./prisma/schema.prisma
```

Qué cambió exactamente en el schema:
- `enum UserRole { ADMINISTRATOR PLAYER }`.
- `model User` (id UUID, `username` único, `passwordHash`, `role`, timestamps).
- `model CollectionEntry` (id UUID, `userId`, `cardId` numérico, `quantity`, `isFoil`, relación con `User` en cascada y con `Card` en modo `Restrict`).
- Dentro de `model Card` se agregó **una sola línea**: `collectionEntries CollectionEntry[]` (la relación inversa). No se tocó ningún campo existente de `Card`, `Rarity` ni `CardType`.

Generá y aplicá la migración (esto sí necesita tu conexión real a PostgreSQL):

```bash
npx prisma migrate dev --name add_auth_and_collections
```

Revisá el `.sql` que Prisma generó en `prisma/migrations/<timestamp>_add_auth_and_collections/` antes de seguir, para confirmar que solo crea tablas nuevas (`User`, `CollectionEntry`) y no toca las existentes.

**Commit** (el schema y la carpeta de migración que generó Prisma van juntos):

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(db): agregar modelos User, UserRole y CollectionEntry"
```

---

## Paso 2 — Módulo `auth`: login, JWT, guards de rol

**Qué se copia (todo nuevo, ningún archivo existente se toca en este paso):**

```bash
mkdir -p src/auth/dto
cp ~/Descargas/cambios_magic_api/src/auth/password.ts        src/auth/password.ts
cp ~/Descargas/cambios_magic_api/src/auth/auth.config.ts     src/auth/auth.config.ts
cp ~/Descargas/cambios_magic_api/src/auth/auth.service.ts    src/auth/auth.service.ts
cp ~/Descargas/cambios_magic_api/src/auth/auth.controller.ts src/auth/auth.controller.ts
cp ~/Descargas/cambios_magic_api/src/auth/auth.module.ts     src/auth/auth.module.ts
cp ~/Descargas/cambios_magic_api/src/auth/jwt.strategy.ts    src/auth/jwt.strategy.ts
cp ~/Descargas/cambios_magic_api/src/auth/jwt-auth.guard.ts  src/auth/jwt-auth.guard.ts
cp ~/Descargas/cambios_magic_api/src/auth/roles.decorator.ts src/auth/roles.decorator.ts
cp ~/Descargas/cambios_magic_api/src/auth/roles.guard.ts     src/auth/roles.guard.ts
cp ~/Descargas/cambios_magic_api/src/auth/dto/login.dto.ts   src/auth/dto/login.dto.ts
```

Qué hace cada archivo (para que no sea una caja negra):

| Archivo | Para qué sirve |
|---|---|
| `password.ts` | Hashea y verifica contraseñas con `scrypt` nativo de Node. Nunca se guarda la contraseña real. Incluye `dummyHash`, un hash de relleno para que el login tarde lo mismo aunque el username no exista (no filtra por tiempo de respuesta si la cuenta existe). |
| `auth.config.ts` | Lee `JWT_SECRET`/`JWT_EXPIRES_IN` del entorno. Si faltan o son inválidos, **la app no arranca** — mejor fallar rápido que arrancar mal configurada. |
| `auth.service.ts` | `login()`: busca el usuario, verifica la contraseña, firma el JWT (`sub: user.id`) y devuelve `{ access_token, token_type, expires_in }`. |
| `jwt.strategy.ts` | Passport: verifica firma/expiración del token y vuelve a consultar el usuario **actual** en la base (no confía en lo que decía el token al firmarse). |
| `jwt-auth.guard.ts` | El guard que se pone en cualquier endpoint que exija `Authorization: Bearer <token>`. |
| `roles.decorator.ts` / `roles.guard.ts` | `@Roles(UserRole.ADMINISTRATOR)` + `RolesGuard`: además de estar logueado, exige un rol específico. Devuelve `403` (no `401`) si el rol no alcanza. |
| `dto/login.dto.ts` | Valida `{ username, password }` con `class-validator` antes de que el request llegue al service. |

Este módulo todavía **no está conectado a nada** (no se tocó `app.module.ts`), así que compilar en este paso puede fallar si tu editor resuelve imports circulares — es normal, se resuelve en el paso 4 cuando se registra en `AppModule`. Si preferís que cada paso compile de forma aislada, podés adelantar el paso 4 (`app.module.ts`) junto con este.

**Commit:**

```bash
git add src/auth/
git commit -m "feat(auth): login con JWT, scrypt y guards de rol"
```

---

## Paso 3 — Módulo `users`

**Qué se copia (todo nuevo):**

```bash
mkdir -p src/users/dto
cp ~/Descargas/cambios_magic_api/src/users/users.service.ts    src/users/users.service.ts
cp ~/Descargas/cambios_magic_api/src/users/users.controller.ts src/users/users.controller.ts
cp ~/Descargas/cambios_magic_api/src/users/users.module.ts     src/users/users.module.ts
cp ~/Descargas/cambios_magic_api/src/users/dto/create-user.dto.ts src/users/dto/create-user.dto.ts
```

- `users.service.ts` tiene `create()` (con `try/catch` que traduce `P2002` → `409` si el username ya existe), `findOne()` (proyección pública, `404` si no existe) y `findCredentialsByUsername()` (consulta **interna**, no expuesta como endpoint, usada solo por `auth.service.ts` para el login).
- `users.controller.ts` expone `POST /users` y `GET /users/:id`, **ambos protegidos** con `JwtAuthGuard` + `RolesGuard(ADMINISTRATOR)`. No hay registro público a propósito: solo un admin ya logueado puede crear otras cuentas.

**Commit:**

```bash
git add src/users/
git commit -m "feat(users): alta de usuarios y consulta protegida por rol"
```

---

## Paso 4 — Conectar `auth` y `users` a la app, y crear el primer admin

**Qué se copia/modifica:**

```bash
cp ~/Descargas/cambios_magic_api/src/app.module.ts src/app.module.ts
cp ~/Descargas/cambios_magic_api/src/main.ts        src/main.ts
cp ~/Descargas/cambios_magic_api/scripts/create-admin.ts scripts/create-admin.ts
```

- `app.module.ts`: se agregaron `UsersModule` y `AuthModule` a los `imports` (`CollectionsModule` se agrega recién en el paso 6, así este paso queda chico y fácil de revisar).
- `main.ts`: se agregó `app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: false }))`. Ojo con el `whitelist: false`: es a propósito, para que los DTOs viejos de `cards` (sin decoradores de `class-validator`) sigan funcionando exactamente igual que antes. Solo los DTOs nuevos (que sí tienen decoradores) quedan validados.
- `scripts/create-admin.ts`: script de una sola vez para crear (o resetear la contraseña de) el primer usuario `ADMINISTRATOR`, ya que no hay endpoint público de registro.

En este punto ya podés compilar y probar login:

```bash
npm run build
npm run create-admin        # usa ADMIN_USERNAME / ADMIN_PASSWORD de tu .env
npm run start:dev
```

Probá manualmente (o con la carpeta **Auth** de `insomnia_collection.json`, que se agrega en el paso 7):
- `POST /auth/login` con las credenciales del admin → `200` + `access_token`.
- `GET /auth/me` con ese token → `200` con los 5 campos públicos.
- `GET /auth/me` sin token → `401`.

**Commit:**

```bash
git add src/app.module.ts src/main.ts scripts/create-admin.ts
git commit -m "feat(auth): conectar auth/users a la app y agregar script create-admin"
```

---

## Paso 5 — Proteger la escritura del catálogo de cartas

**Qué se modifica (no se reescribe la lógica existente, solo se agregan guards):**

```bash
cp ~/Descargas/cambios_magic_api/src/cards/cards.controller.ts src/cards/cards.controller.ts
cp ~/Descargas/cambios_magic_api/src/cards/cards.service.ts    src/cards/cards.service.ts
```

- `cards.controller.ts`: `POST`, `PATCH` y `DELETE /cards` ahora llevan `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMINISTRATOR)`. Los `GET` (`/cards`, `/cards/:id`) siguen 100% públicos, sin cambios.
- `cards.service.ts`: el único cambio real es en `remove()` — se agregó un `try/catch` que traduce el error `P2003` de Prisma (borrar una carta que está referenciada por alguna `CollectionEntry`) a `409 Conflict` en vez de dejar que explote como `500`. Esto era necesario porque recién ahora, con `CollectionEntry` apuntando a `Card` con `onDelete: Restrict`, ese error puede ocurrir. El resto de `cards.service.ts` (validaciones manuales, `create`, `update`, `findAll`, `findOne`) **no se tocó**.

Probá con la carpeta **Cards** de Insomnia: crear una carta sin token debe dar `401`; con token de admin, `201`.

**Commit:**

```bash
git add src/cards/cards.controller.ts src/cards/cards.service.ts
git commit -m "feat(cards): proteger escritura con JWT+rol y traducir P2003 a 409 al borrar"
```

---

## Paso 6 — Módulo `collections`

**Qué se copia (todo nuevo):**

```bash
mkdir -p src/collections/dto
cp ~/Descargas/cambios_magic_api/src/collections/collections.service.ts    src/collections/collections.service.ts
cp ~/Descargas/cambios_magic_api/src/collections/collections.controller.ts src/collections/collections.controller.ts
cp ~/Descargas/cambios_magic_api/src/collections/collections.module.ts    src/collections/collections.module.ts
cp ~/Descargas/cambios_magic_api/src/collections/dto/create-collection-entry.dto.ts src/collections/dto/create-collection-entry.dto.ts
cp ~/Descargas/cambios_magic_api/src/collections/dto/update-collection-entry.dto.ts src/collections/dto/update-collection-entry.dto.ts
```

Y ahora sí se agrega `CollectionsModule` a `app.module.ts` (ya deberías tener ese archivo del paso 4; solo falta esta línea):

```ts
// src/app.module.ts
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [
    // ...los que ya estaban...
    CollectionsModule,
  ],
  // ...
})
```

Reglas de negocio a tener presentes al revisar el código:
- `POST /collections`: hace `upsert` — si el usuario ya tiene esa carta+versión (`isFoil`), **suma** `quantity` en vez de duplicar la fila o fallar con `409`.
- `cardId` inexistente → `404` (se traduce el `P2003` de la clave foránea), no `500`.
- `PATCH`/`DELETE` sobre una entrada que es de **otro** usuario → `404`, no `403`: no se revela que la fila existe pero es ajena.
- El `userId` sale siempre de `request.user.id` (del token), nunca del body.

**Commit:**

```bash
git add src/collections/ src/app.module.ts
git commit -m "feat(collections): colección personal por usuario (alta, edición, baja, resumen)"
```

---

## Paso 7 — Documentación y colección de Insomnia

**Qué se copia/modifica:**

```bash
cp ~/Descargas/cambios_magic_api/insomnia_collection.json ./insomnia_collection.json
cp ~/Descargas/cambios_magic_api/PROJECT_GUIDE.md          ./PROJECT_GUIDE.md
cp ~/Descargas/cambios_magic_api/README.md                 ./README.md
```

- `PROJECT_GUIDE.md`: se agregaron las secciones de autenticación, roles, colección personal, cómo crear el primer admin, y se actualizaron la tabla de archivos y el diagrama de flujo.
- `README.md`: pasos de ejecución actualizados (variables nuevas, `create-admin`) y lista de endpoints nueva.
- `insomnia_collection.json`: carpetas **Auth**, **Cards**, **Users** y **Collections**, listas para importar (`Insomnia → Create → Import From File`).

**Commit:**

```bash
git add insomnia_collection.json PROJECT_GUIDE.md README.md
git commit -m "docs: documentar auth, roles y collections; agregar colección de Insomnia"
```

---

## Paso 8 — Probar todo de punta a punta antes de mergear

Con el server corriendo (`npm run start:dev`) y `insomnia_collection.json` importado:

1. **Auth**: login válido → `200`; login con password mala → `401`; login con username inexistente → mismo `401`; `/auth/me` con y sin token.
2. **Cards**: `GET /cards` sigue público; `POST /cards` sin token → `401`; con token de admin → `201`; `DELETE` de una carta que está en una colección → `409`.
3. **Users**: `POST /users` creando un `PLAYER`, con el token del admin.
4. **Collections**: agregar una carta, agregarla de nuevo (verificar que suma cantidad), listar, editar, borrar, y probar `cardId` inexistente (`404`).

Si algo falla, arreglalo en el commit del paso correspondiente (`git commit --amend` si todavía no hiciste push, o un commit nuevo si ya hiciste push) en vez de mezclarlo en un commit final gigante.

## Paso 9 — Subir la rama y abrir el PR

```bash
git push -u origin feature/auth-and-collections
```

Abrí el pull request contra `main`/`master` con esta misma lista de 8 commits — queda como changelog legible de la entrega: dependencias → modelo de datos → auth → users → conectar → proteger cards → collections → documentación.

---

## Resumen rápido (por si solo querés copiar los commits)

```text
1. chore: agregar dependencias de JWT, Passport y class-validator
2. feat(db): agregar modelos User, UserRole y CollectionEntry
3. feat(auth): login con JWT, scrypt y guards de rol
4. feat(users): alta de usuarios y consulta protegida por rol
5. feat(auth): conectar auth/users a la app y agregar script create-admin
6. feat(cards): proteger escritura con JWT+rol y traducir P2003 a 409 al borrar
7. feat(collections): colección personal por usuario (alta, edición, baja, resumen)
8. docs: documentar auth, roles y collections; agregar colección de Insomnia
```
