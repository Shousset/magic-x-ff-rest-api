# Guía 11 — Entender el primer login con NestJS, Passport y JWT

## 1. Primero, el recorrido completo

Partimos de una cuenta creada de forma controlada con [Users, guía 10](10-crear-modulo-users-nestjs-prisma.md)

```text
username + password → POST /api/v1/auth/login → token JWT
Authorization: Bearer <token> → GET /api/v1/auth/me → usuario público actual
```

Son dos preguntas distintas:

- **Login:** ¿la contraseña coincide con la cuenta? Si coincide, el servidor firma un token temporal.
- **Me:** ¿el token es válido y el usuario todavía existe? Si lo es, devuelve sus cinco campos públicos.

Un JWT es un token firmado, **no cifrado**. Su contenido puede leerse: nunca coloques contraseñas ni hashes dentro. Autenticar identifica una cuenta; autorizar decide qué puede hacer. Esta implementación no agrega permisos por rol automáticamente.

## 2. Preparar el entorno

Ejecutá comandos desde `backend/`. Las dependencias ya están declaradas en [package.json](../backend/package.json); no necesitás reinstalarlas para este cambio:

| Dependencia | Para qué sirve |
|---|---|
| `@nestjs/jwt` | Firmar tokens e integrar JWT con Nest |
| `@nestjs/passport` y `passport` | Conectar guards y estrategias de autenticación |
| `passport-jwt` | Extraer Bearer y verificar firma/expiración |
| `@types/passport-jwt` | Tipos para desarrollo |
| `node:crypto` (incluido en Node) | Derivar y comparar hashes scrypt; no usamos bcrypt ni argon2 |

La aplicación necesita dependencias instaladas, Prisma Client generado y PostgreSQL preparado. Configurá de forma privada:

| Variable | Requisito real |
|---|---|
| `DATABASE_URL` | Conexión PostgreSQL válida para [PrismaService](../backend/src/prisma/prisma.service.ts) |
| `JWT_SECRET` | Secreto aleatorio privado; no puede faltar ni ser solo espacios |
| `JWT_EXPIRES_IN` | Segundos como entero positivo seguro, por ejemplo `3600`; no `1h`, `0`, `-1` ni decimales |


[main.ts](../backend/src/main.ts) carga el entorno mediante `dotenv/config`. Podés usar un archivo local privado o el proveedor de despliegue; nunca versionar secretos. El frontend no debe conocer `JWT_SECRET`.

[jwtOptions()](../backend/src/auth/auth.config.ts) falla al iniciar si falta configuración JWT válida: no tiene secreto ni duración de respaldo. Firma con `HS256`; la estrategia también acepta exclusivamente `HS256`. La validación comprueba que el secreto no esté vacío.

## 3. Leer en este orden

| Fuente | Responsabilidad |
|---|---|
| [login.dto.ts](../backend/src/auth/dto/login.dto.ts) | Valida la entrada HTTP |
| [auth.controller.ts](../backend/src/auth/auth.controller.ts) | Expone login y me; no consulta Prisma |
| [auth.service.ts](../backend/src/auth/auth.service.ts) | Busca credenciales, verifica y firma |
| [users.service.ts](../backend/src/users/users.service.ts) | Consulta interna de credenciales y consulta pública por ID |
| [password.ts](../backend/src/auth/password.ts) | Única frontera de generación/verificación scrypt |
| [jwt-auth.guard.ts](../backend/src/auth/jwt-auth.guard.ts) | Aplica la estrategia `jwt` al endpoint |
| [jwt.strategy.ts](../backend/src/auth/jwt.strategy.ts) | Configura verificación y obtiene el usuario actual |
| [auth.module.ts](../backend/src/auth/auth.module.ts) | Ensambla Users, Passport, JWT, controller, service, strategy y guard |

`AuthModule` importa `UsersModule`, que exporta `UsersService`. Nest inyecta ese service y `JwtService` en `AuthService`. Users puede llamar a la función `hashPassword` sin importar `AuthModule`: el helper no depende de Nest ni de la base de datos. Así mantenemos pocas piezas sin mezclar HTTP, persistencia y criptografía.

## 4. Recibir un login válido

`POST /api/v1/auth/login` recibe `{ username, password }`. El [DTO](../backend/src/auth/dto/login.dto.ts) usa:

- `@IsString()` para exigir texto.
- `@Matches(/\S/)` en ambos campos: debe existir algún carácter que no sea espacio.
- `@MinLength(8)` en password: mínimo ocho caracteres, igual que al crear usuarios.


## 5. `AuthService.login()`

Este es el flujo:

```ts
const user = await this.users.findCredentialsByUsername(username);
const valid = await verifyPassword(password, user ? user.passwordHash : dummyHash);
if (!user || !valid) throw new UnauthorizedException('Invalid credentials');
const access_token = await this.jwt.signAsync({ sub: user.id });
const payload = this.jwt.decode<{ exp: number; iat: number }>(access_token);
return { access_token, token_type: 'Bearer' as const, expires_in: payload.exp - payload.iat };
```

1. `findCredentialsByUsername` busca por username único y pide **solo `id` y `passwordHash`**. No está expuesto como endpoint. El login no necesita rol, fechas ni username en el resultado.
2. `verifyPassword` compara la contraseña con el hash real; si el usuario no existe, recibe `dummyHash`.
3. `!user || !valid` rechaza tanto cuenta desconocida como contraseña incorrecta con el mismo `401 Unauthorized — Invalid credentials`. No informa cuál falló.
4. `signAsync({ sub: user.id })` firma el UUID como sujeto del token; JWT agrega `iat` (emisión) y `exp` (expiración). No se firma el objeto de Prisma completo.
5. `decode` lee los tiempos del token que **acabamos de firmar** para calcular su duración. Decodificar no verifica tokens externos; eso corresponde a la estrategia.
6. La respuesta conserva `{ access_token, token_type: 'Bearer', expires_in }`. `as const` expresa el literal `'Bearer'` para TypeScript; no agrega seguridad en ejecución. `expires_in` se expresa en segundos.



## 6. La contraseña se verifica, no se descifra

[password.ts](../backend/src/auth/password.ts) concentra `hashPassword` y `verifyPassword`. La [guía Users](10-crear-modulo-users-nestjs-prisma.md#5-crear-una-operación-por-línea) explica la generación. El formato almacenado no cambia:

```text
scrypt$16384$8$1$<salt hexadecimal de 32 caracteres>$<clave hexadecimal de 128 caracteres>
```

Los parámetros son `N=16384`, `r=8`, `p=1`, salt aleatorio de 16 bytes y clave de 64 bytes. Son los defaults usados por la llamada actual a scrypt; la función de verificación solo admite ese formato.

Para leer `verifyPassword(password, hash)`:

1. `typeof hash !== 'string'` devuelve `false` para valores no textuales.
2. La expresión regular reconoce el algoritmo, parámetros y longitudes exactos, con hexadecimal minúsculo. Un hash malformado o con otro costo devuelve `false` antes de derivar.
3. `match[1]` es el salt y `match[2]` es la clave almacenada.
4. `await deriveKey(password, match[1], 64)` calcula una clave candidata. **El salt se pasa como texto hexadecimal**, igual que al crear el usuario; decodificarlo como bytes rompería hashes existentes.
5. `Buffer.from(match[2], 'hex')` sí decodifica la **clave** almacenada, no el salt.
6. `timingSafeEqual` compara las claves binarias de igual longitud evitando una comparación de strings con salida temprana.
7. El `catch` devuelve `false` ante un fallo de comparación. No expone detalles criptográficos por HTTP.



## 7. Usar el token: `/auth/me`

El controller protege `GET /api/v1/auth/me` con `@UseGuards(JwtAuthGuard)`. El cliente envía:

```http
Authorization: Bearer <token recibido en login>
```

El recorrido del servidor es:

1. Passport extrae el token del header Bearer.
2. Verifica firma con `JWT_SECRET`, algoritmo `HS256` y expiración (`ignoreExpiration: false`).
3. `JwtStrategy.validate` exige `sub` textual con UUID válido y `exp` numérico.
4. `UsersService.findOne(sub)` consulta el usuario **actual** y aplica la proyección pública explícita `toPublicUser`.
5. Si el usuario ya no existe, transforma su `404` en `401`. Otros errores de persistencia no se ocultan como credenciales incorrectas.
6. Passport coloca ese usuario público en `request.user`; el controller lo devuelve.


## 8. Probar el flujo

Recorrido manual , **no ejecutado contra PostgreSQL ni navegador en esta revisión**:

1. Prepará variables y base; iniciá `npm run start:dev`.
2. Obtené una cuenta de prueba autorizada mediante el provisioning controlado de la guía 10. No hay cuenta inicial incluida.
3. Abrí `http://localhost:3001/api/v1/docs` y enviá `/auth/login` con esas credenciales. Esperá `200` y los tres campos de la respuesta de login.
4. En **Authorize**, pegá solo el token recibido; Swagger agrega `Bearer`. No guardes el token en capturas ni documentación.
5. Ejecutá `/auth/me`: esperá únicamente los cinco campos públicos.
6. Probá una contraseña incorrecta de al menos ocho caracteres: esperá el mismo `401` que para username inexistente. Un password corto o solo espacios produce `400` por validación.
7. Probá `/auth/me` sin token o con uno inválido/expirado: esperá `401`.


