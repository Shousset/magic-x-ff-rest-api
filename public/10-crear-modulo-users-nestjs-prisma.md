# Guía 10 — Crear y consultar usuarios con NestJS y Prisma


## Entender la entrada antes de guardarla

La creación recibe `{ username, password, role }`. En el DTO:

- `@IsString()` exige texto.
- `@IsNotEmpty()` rechaza un string vacío.
- `@Matches(/\S/)` exige al menos un carácter que no sea espacio en username y password.
- `@MinLength(8)` exige una contraseña de al menos ocho caracteres.
- `@IsEnum(UserRole)` limita el rol a `ADMINISTRATOR` o `EVALUATOR`.


## Crear

El centro de `UsersService.create()` es:

```ts
const passwordHash = await hashPassword(dto.password);
const user = await this.prisma.user.create({
  data: { username: dto.username, role: dto.role, passwordHash },
  select: { id: true, username: true, role: true, createdAt: true, updatedAt: true },
});
return toPublicUser(user);
```

1. `await hashPassword(...)` espera el cálculo del hash; no guarda la contraseña original.
2. `this.prisma.user.create(...)` inserta un usuario. Prisma y la base generan UUID y fechas según el modelo.
3. `data` enumera lo que se escribe: username, rol y hash.
4. `select` enumera lo que se lee como resultado: los cinco campos públicos, sin hash.
5. `toPublicUser(user)` construye el objeto que saldrá de la API.


### Qué hace `hashPassword()`

En [password.ts](../backend/src/auth/password.ts):

```ts
const salt = randomBytes(16).toString('hex');
const key = (await deriveKey(password, salt, 64)) as Buffer;
return `scrypt$16384$8$1$${salt}$${key.toString('hex')}`;
```

- `randomBytes(16)` genera un salt aleatorio; `toString('hex')` lo representa con 32 caracteres hexadecimales. El salt no es secreto.
- `deriveKey` es `scrypt` convertido a promesa con `promisify`, para usar `await` sin bloquear con una versión síncrona.
- `64` es la longitud de la clave en bytes. `as Buffer` le indica el tipo a TypeScript; no transforma los bytes.
- Se conservan los parámetros por defecto de Node: `N=16384`, `r=8`, `p=1`. La clave se guarda como 128 caracteres hexadecimales.
- El resultado tiene el formato exacto `scrypt$16384$8$1$<salt>$<clave>`.

## 6. Separar el tipo público de la protección real

El tipo explícito permite leer el contrato sin conocer utilidades genéricas de Prisma:

```ts
type PublicUser = {
  id: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

function toPublicUser(user: PublicUser): PublicUser {
  const { id, username, role, createdAt, updatedAt } = user;
  return { id, username, role, createdAt, updatedAt };
}
```

- `type PublicUser` describe los cinco campos. `UserRole` reutiliza los valores del modelo; las fechas son `Date` dentro de Node y strings ISO al serializarse a JSON.
- La desestructuración toma solo los cinco valores permitidos.
- `return { ... }` crea un objeto nuevo únicamente con esos valores. No es `return user` ni `{ ...user }`.


## 7. Consultar y preparar el login

`GET /api/v1/users/:id` pasa por `ParseUUIDPipe`: un UUID inválido produce `400` antes de consultar Prisma. `findOne(id)` busca por ID con el mismo `select` público, devuelve `404 Not Found — User not found` si no existe y aplica `toPublicUser` si existe.

Auth necesita otra consulta, **interna**, no otro endpoint:

```ts
async findCredentialsByUsername(username: string) {
  return this.prisma.user.findUnique({
    where: { username },
    select: { id: true, passwordHash: true },
  });
}
```

`where` busca el username único. `select` trae solo el ID para el JWT y el hash para verificar la contraseña. Auth no necesita username, rol ni fechas durante el login; `/auth/me` recupera después el usuario público actualizado. No devuelvas esta consulta desde un controller.
