# Guía 8 — Códigos de estado HTTP en NestJS

Esta guía explica qué significa cada código, cuándo usarlo y cómo configurarlo en un controller de NestJS. El código de estado forma parte del contrato de la API: le indica al cliente si la operación terminó correctamente, si debe corregir la solicitud o si ocurrió un problema del servidor.

## 1. Tabla práctica de códigos

| Código | Nombre | Cuándo usarlo en NestJS | Ejemplo de endpoint |
|---:|---|---|---|
| `200` | `OK` | La operación terminó correctamente y la respuesta incluye un body. | `GET /users/42`, `PATCH /users/42` |
| `201` | `Created` | Se creó un recurso correctamente. | `POST /users` |
| `202` | `Accepted` | La solicitud fue aceptada, pero el procesamiento continúa de forma asíncrona. | `POST /reports/export` |
| `204` | `No Content` | La operación terminó correctamente y no debe devolver body. | `DELETE /users/42` |
| `400` | `Bad Request` | La solicitud tiene datos inválidos, malformados o parámetros incorrectos. | `GET /users/no-es-un-uuid` |
| `401` | `Unauthorized` | Falta autenticación o las credenciales no son válidas. | `GET /profile` sin token válido |
| `403` | `Forbidden` | El cliente está autenticado, pero no tiene permiso para esa operación. | `DELETE /admin/users/42` |
| `404` | `Not Found` | El recurso solicitado no existe. | `GET /users/999` |
| `409` | `Conflict` | La solicitud válida entra en conflicto con el estado actual. | `POST /users` con email duplicado |
| `422` | `Unprocessable Entity` | La estructura es válida, pero los datos no pueden procesarse según una regla de negocio. | `POST /orders` con una cantidad no permitida |
| `429` | `Too Many Requests` | El cliente superó el límite de solicitudes. | `POST /login` después de muchos intentos |
| `500` | `Internal Server Error` | Ocurrió un error inesperado en el servidor. | Falla no prevista de base de datos o infraestructura |

No uses `200` para informar un error dentro del body, por ejemplo `{ statusCode: 404 }`. El status HTTP real debe ser `404`.

## 2. Defaults de NestJS

Cuando un handler devuelve un valor normalmente, NestJS asigna un status según el verbo HTTP:

- `POST` devuelve `201 Created` por defecto.
- `GET`, `PUT`, `PATCH` y `DELETE` devuelven `200 OK` por defecto.

El valor retornado por el método determina el body, pero no cambia automáticamente el status. Por ejemplo, este endpoint responde `200`:

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

Una excepción HTTP interrumpe el flujo normal y NestJS usa el código asociado a la excepción. Por ejemplo, `NotFoundException` produce `404` sin que el controller tenga que construir manualmente el body de error.

## 3. Dónde poner cada decisión de status

La decisión debe estar cerca del lugar que conoce el resultado, pero el status de éxito pertenece al contrato HTTP del controller.

### En el controller: status de éxito y protocolo HTTP

Usá el controller para declarar:

- qué verbo y ruta atiende el endpoint;
- qué status representa su éxito (`200`, `201`, `202` o `204`);
- parámetros, body y pipes de entrada;
- la respuesta HTTP que se entrega al cliente.

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto); // 201 por default
}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(@Param('id') id: string): Promise<void> {
  await this.usersService.remove(id);
}
```

### En pipes y validación: errores de entrada (`400`)

Un `ValidationPipe`, `ParseUUIDPipe` u otro pipe puede rechazar la solicitud antes de llamar al service. En esos casos NestJS responde `400`.

```ts
@Get(':id')
findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.usersService.findOne(id);
}
```

Un valor como `no-es-un-uuid` produce `400`. En cambio, un UUID con formato correcto pero inexistente debe producir `404`.

### En guards o autenticación: `401` y `403`

- `401` significa que no se pudo autenticar al cliente.
- `403` significa que el cliente sí está autenticado, pero no tiene autorización suficiente.

Estas decisiones normalmente ocurren en guards, estrategias de autenticación o decoradores de autorización, no en el service que consulta el recurso.

### En el service o caso de uso: significado de errores de negocio

El service puede detectar que un recurso no existe o que una operación entra en conflicto, y lanzar la excepción NestJS correspondiente:

```ts
const user = await this.prisma.user.findUnique({ where: { id } });

if (!user) {
  throw new NotFoundException('User not found'); // 404
}
```

El controller no debería devolver siempre `200` y esperar que el cliente interprete un error en el body. Tampoco debería capturar indiscriminadamente todos los errores y convertirlos en `409`.

### En filtros de excepciones o fallback global: `500`

Un error inesperado debe llegar al manejo de excepciones de NestJS o a un filtro global. El servidor puede registrarlo internamente y responder `500`, sin exponer SQL, stack traces, credenciales ni detalles de infraestructura.

## 4. Cómo cambiar el status de un endpoint con `@HttpCode` y `HttpStatus`

`@HttpCode()` reemplaza el status por defecto del handler. Conviene usar `HttpStatus` en vez de números sueltos, porque hace explícito el significado del código.

### Antes: `DELETE` devuelve `200`

```ts
@Delete(':id')
async remove(@Param('id') id: string) {
  await this.usersService.remove(id);
  return { deleted: true };
}
```

Por ser un `DELETE` sin configuración adicional, NestJS responde `200 OK` y devuelve el objeto.

### Después: `DELETE` devuelve `204` sin body

```ts
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(@Param('id') id: string): Promise<void> {
  await this.usersService.remove(id);
}
```

Ahora el éxito es `204 No Content`. El método no debe devolver un objeto, porque una respuesta `204` no tiene body.

También se puede cambiar un `POST` de `201` a `202` cuando el trabajo se encola y todavía no terminó:

```ts
@Post('export')
@HttpCode(HttpStatus.ACCEPTED)
startExport(@Body() dto: ExportDto) {
  return this.reportsService.enqueueExport(dto);
}
```

## 5. Cómo devolver status codes desde un controller

La forma recomendada para códigos fijos es `@HttpCode`:

```ts
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Post('health-check')
@HttpCode(HttpStatus.OK)
healthCheck() {
  return { status: 'ok' };
}
```

Para el status habitual del verbo, no hace falta escribir el decorador. Este `POST` ya devuelve `201`:

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

También existe `@Res()` para controlar directamente la respuesta de Express o Fastify:

```ts
@Get(':id')
findOne(@Param('id') id: string, @Res() response: Response) {
  const user = this.usersService.findOne(id);
  return response.status(HttpStatus.OK).json(user);
}
```

Sin embargo, el uso directo de `@Res()` acopla el controller al adaptador HTTP y puede cambiar el comportamiento estándar de NestJS. Para status conocidos y estáticos, preferí retornar valores y usar `@HttpCode`.

## 6. Lanzar excepciones HTTP de NestJS

Importá la excepción que representa el resultado y lanzala con `throw`. NestJS convierte la excepción en una respuesta HTTP con `statusCode`, `message` y `error`.

```ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
```

### `400 Bad Request`

Usalo para datos malformados o inválidos para el contrato de entrada:

```ts
if (!dto.email) {
  throw new BadRequestException('Email is required');
}
```

En muchos casos lo produce automáticamente `ValidationPipe`.

### `401 Unauthorized`

Usalo cuando no hay autenticación válida:

```ts
if (!token) {
  throw new UnauthorizedException('Authentication required');
}
```

### `403 Forbidden`

Usalo cuando el usuario está autenticado, pero no puede realizar la operación:

```ts
if (!user.isAdmin) {
  throw new ForbiddenException('Admin role required');
}
```

### `404 Not Found`

Usalo cuando el recurso no existe:

```ts
const order = await this.ordersService.findOne(id);

if (!order) {
  throw new NotFoundException('Order not found');
}
```

### `409 Conflict`

Usalo cuando la solicitud válida contradice el estado actual, por ejemplo, una unicidad duplicada:

```ts
if (await this.usersService.emailExists(dto.email)) {
  throw new ConflictException('Email already exists');
}
```

### `422 Unprocessable Entity`

Usalo cuando el JSON tiene una forma válida, pero una regla de negocio impide procesarlo:

```ts
if (dto.quantity > product.availableStock) {
  throw new UnprocessableEntityException('Insufficient stock');
}
```

La diferencia práctica con `400` es que `400` suele indicar un problema de sintaxis o contrato de entrada, mientras que `422` indica que la solicitud bien formada no puede ejecutarse según el dominio.

### `429 Too Many Requests`

Usalo cuando el cliente excede un límite. Puede lanzarlo un guard, un throttler o una regla propia:

```ts
if (attempts >= MAX_LOGIN_ATTEMPTS) {
  throw new TooManyRequestsException('Too many login attempts');
}
```

### `500 Internal Server Error`

No conviertas errores inesperados en un mensaje técnico para el cliente. Si no hay una excepción HTTP específica, NestJS responde `500` mediante su manejo predeterminado:

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  // Si ocurre una falla inesperada y no se captura, NestJS responde 500.
  return this.usersService.findOne(id);
}
```

Solo lanzá `InternalServerErrorException` cuando necesites traducir explícitamente un fallo interno después de registrarlo:

```ts
try {
  return await this.usersService.findOne(id);
} catch (error) {
  this.logger.error(error);
  throw new InternalServerErrorException('Unexpected server error');
}
```

## 7. Ejemplos completos por endpoint

### `200 OK`: obtener o actualizar un recurso

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id); // 200 con el usuario
}

@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
  return this.usersService.update(id, dto); // 200 con el usuario actualizado
}
```

### `201 Created`: crear un recurso

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto); // 201 por default
}
```

### `202 Accepted`: aceptar trabajo asíncrono

```ts
@Post('exports')
@HttpCode(HttpStatus.ACCEPTED)
startExport(@Body() dto: ExportDto) {
  return this.exportsService.enqueue(dto); // 202, no espera el resultado final
}
```

### `204 No Content`: eliminar sin body

```ts
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(@Param('id') id: string): Promise<void> {
  await this.usersService.remove(id); // 204
}
```

### `400 Bad Request`: entrada inválida

```ts
@Get(':id')
findOne(@Param('id', new ParseUUIDPipe()) id: string) {
  return this.usersService.findOne(id);
}
// GET /users/no-es-un-uuid -> 400
```

### `401 Unauthorized`: falta autenticación

```ts
@UseGuards(AuthGuard('jwt'))
@Get('profile')
profile(@Request() request: Request) {
  return request.user; // Sin token válido, el guard responde 401
}
```

### `403 Forbidden`: falta autorización

```ts
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Delete('admin/:id')
removeAsAdmin(@Param('id') id: string) {
  return this.usersService.remove(id); // Usuario no admin -> 403
}
```

### `404 Not Found`: recurso inexistente

```ts
const user = await this.prisma.user.findUnique({ where: { id } });
if (!user) {
  throw new NotFoundException('User not found');
}
return user;
```

### `409 Conflict`: estado incompatible

```ts
try {
  return await this.prisma.user.create({ data: dto });
} catch (error) {
  if (isPrismaUniqueError(error)) {
    throw new ConflictException('Email already exists');
  }
  throw error;
}
```

### `422 Unprocessable Entity`: regla de negocio

```ts
@Post('orders')
createOrder(@Body() dto: CreateOrderDto) {
  if (dto.items.length === 0) {
    throw new UnprocessableEntityException('An order needs at least one item');
  }
  return this.ordersService.create(dto);
}
```

### `429 Too Many Requests`: límite excedido

```ts
@Post('login')
login(@Body() dto: LoginDto) {
  if (this.loginGuard.isBlocked(dto.email)) {
    throw new TooManyRequestsException('Try again later');
  }
  return this.authService.login(dto);
}
```

### `500 Internal Server Error`: falla no prevista

```ts
@Get('report/:id')
getReport(@Param('id') id: string) {
  // Una excepción no controlada llega al filtro de NestJS y produce 500.
  return this.reportsService.generate(id);
}
```

## 8. Regla rápida para elegir el código

1. ¿La solicitud terminó bien y devuelve datos? `200`.
2. ¿Creó un recurso? `201`.
3. ¿La tarea quedó encolada y seguirá después? `202`.
4. ¿Terminó bien y no hay body? `204`.
5. ¿La entrada es inválida o está mal formada? `400`.
6. ¿No hay autenticación válida? `401`.
7. ¿Está autenticado, pero no tiene permiso? `403`.
8. ¿El recurso no existe? `404`.
9. ¿La solicitud choca con el estado actual, como una unicidad duplicada? `409`.
10. ¿La forma es válida, pero una regla de negocio impide procesarla? `422`.
11. ¿Se excedió un límite? `429`.
12. ¿Falló algo inesperado del servidor? `500`.

La implementación final debe expresar esta decisión en el lugar correcto: `@HttpCode` para el éxito del endpoint, pipes y guards para errores del borde HTTP, excepciones NestJS para errores conocidos y el manejo global de NestJS para fallas inesperadas.
