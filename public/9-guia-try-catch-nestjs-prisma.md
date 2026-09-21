# Guía 9 — `try/catch` en NestJS + Prisma

Esta guía explica cómo usar `try/catch` para traducir errores conocidos de Prisma a excepciones HTTP de NestJS. No es un mecanismo para convertir cualquier error en el mismo status code: cada error debe conservar su significado.

## 1. Qué hace `try/catch`

`try` ejecuta un bloque de código que puede fallar. Si dentro ocurre un `throw`, o una operación asíncrona rechaza su Promise, `catch` recibe el error y permite:

- reconocer un error conocido;
- lanzar una excepción HTTP apropiada;
- o volver a lanzar el error si no se sabe manejar.

```ts
try {
  const project = await this.prisma.project.create({ data: dto });
  return project;
} catch (error) {
  // Decidir qué hacer con error.
}
```

El `catch` no arregla el error ni hace que la operación haya sido exitosa. Solo permite decidir cómo continúa la propagación.

## 2. Por qué `async/await` importa

Las consultas de Prisma devuelven Promises. Para que un `try/catch` capture el rechazo de una consulta, hay que esperar esa Promise dentro del `try` con `await`:

```ts
async create(dto: CreateProjectDto) {
  try {
    return await this.prisma.project.create({ data: dto });
  } catch (error) {
    // Captura un rechazo de create().
    throw error;
  }
}
```

Este código **no** captura el rechazo de Prisma, porque el `try` termina antes de que la Promise rechace:

```ts
try {
  return this.prisma.project.create({ data: dto });
} catch (error) {
  // No recibe el rechazo asíncrono.
}
```

También se podría manejar la Promise con `.catch()`, pero `await` hace más claro el flujo y permite agrupar varias operaciones en el mismo `try`. El método que usa `await` debe ser `async` y devolver una Promise.

## 3. Dónde colocar el `try/catch`

En una arquitectura NestJS habitual, colocá el `try/catch` en el **service**, alrededor de la llamada a Prisma. El service conoce la operación de persistencia y puede traducir sus códigos a excepciones de NestJS.

```ts
// Service: conoce Prisma y el significado del error.
try {
  return await this.prisma.category.create({ data: dto });
} catch (error) {
  // P2002 puede convertirse en ConflictException.
}
```

El controller normalmente solo recibe parámetros, body y pipes, y delega:

```ts
@Post()
create(@Body() dto: CreateCategoryDto) {
  return this.categoriesService.create(dto);
}
```

No hace falta envolver cada controller en `try/catch` para volver a lanzar la misma excepción. NestJS ya captura las excepciones que salen del service y construye la respuesta HTTP.

## 4. Reconocer errores Prisma por código exacto

Prisma expone errores conocidos como `Prisma.PrismaClientKnownRequestError`. Primero verificá el tipo y después compará el código exacto:

```ts
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

try {
  return await this.prisma.category.create({ data: dto });
} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    throw new ConflictException('Category already exists');
  }
  throw error;
}
```

No alcanza con preguntar si el error “parece de Prisma”, ni conviene comparar mensajes de texto: los mensajes pueden cambiar y no expresan el contrato de forma tan precisa como el código.

### Códigos usados por la implementación actual

La implementación ya presente en estos services aplica estas traducciones:

| Service | Operación | Código Prisma | Excepción NestJS | Significado |
|---|---|---|---|---|
| `categories/categories.service.ts` | `create`, `update` | `P2002` | `ConflictException` (`409`) | Categoría duplicada |
| `categories/categories.service.ts` | `update`, `remove` | `P2025` | `NotFoundException` (`404`) | Categoría inexistente |
| `categories/categories.service.ts` | `remove` | `P2003` | `ConflictException` (`409`) | No se puede eliminar por relaciones |
| `category-editions/category-editions.service.ts` | `create` | `P2002` | `ConflictException` (`409`) | Edición duplicada |
| `category-editions/category-editions.service.ts` | `create` | `P2003` | `NotFoundException` (`404`) | Categoría o período relacionado inexistente |
| `category-editions/category-editions.service.ts` | `update`, `remove` | `P2025` | `NotFoundException` (`404`) | Edición inexistente |
| `category-editions/category-editions.service.ts` | `update` | `P2002` | `ConflictException` (`409`) | Edición duplicada |
| `category-editions/category-editions.service.ts` | `remove` | `P2003` | `ConflictException` (`409`) | No se puede eliminar por relaciones |
| `evaluation-periods/evaluation-periods.service.ts` | `create`, `update` | `P2002` | `ConflictException` (`409`) | Período duplicado |
| `evaluation-periods/evaluation-periods.service.ts` | `update` | `P2025` | `NotFoundException` (`404`) | Período inexistente |
| `evaluation-periods/evaluation-periods.service.ts` | `remove` | `P2025` | `NotFoundException` (`404`) | Período inexistente |
| `projects/projects.service.ts` | `create` | `P2003` | `NotFoundException` (`404`) | `Category edition` relacionada inexistente |

El `P2002` representa una violación de unicidad. `P2025` indica que la operación esperaba encontrar un registro y no lo encontró. `P2003` indica una violación de una relación o clave foránea; su status depende del significado de la operación. Por eso la implementación lo traduce a `409` al impedir una eliminación, pero a `404` cuando falta la relación requerida para crear un proyecto o una edición.

## 5. Lanzar excepciones HTTP de NestJS

Después de reconocer el error, usá `throw` con la excepción que corresponda:

```ts
throw new ConflictException('Category already exists'); // 409
throw new NotFoundException('Category not found');       // 404
```

NestJS transforma esas excepciones en respuestas HTTP. El controller no tiene que construir manualmente un objeto con `statusCode`.

La traducción debe ser específica. No hagas esto:

```ts
catch (error) {
  throw new ConflictException('Something went wrong');
}
```

Así convertirías una base caída, un error de programación o una configuración inválida en un falso `409 Conflict`. `409` significa conflicto con el estado actual del recurso, no “cualquier cosa falló”.

## 6. Por qué los errores desconocidos se vuelven a lanzar

El patrón correcto termina con `throw error`:

```ts
catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('Resource already exists');
    }
    if (error.code === 'P2025') {
      throw new NotFoundException('Resource not found');
    }
  }
  throw error;
}
```

Esto conserva la información de un error que el service no sabe traducir. NestJS o un filtro global podrá registrarlo y responder normalmente `500 Internal Server Error`, sin exponer detalles internos al cliente. Rethrow también evita ocultar fallas nuevas: si mañana Prisma agrega otro caso, no quedará silenciosamente disfrazado como un error conocido.

## 7. Ejemplos por operación

### Crear: `create`

```ts
async create(dto: CreateCategoryDto) {
  try {
    return await this.prisma.category.create({ data: dto });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Category already exists');
    }
    throw error;
  }
}
```

### Actualizar: `update`

```ts
async update(id: string, dto: UpdateCategoryDto) {
  try {
    return await this.prisma.category.update({
      where: { id },
      data: dto,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Category already exists');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
    }
    throw error;
  }
}
```

### Eliminar: `delete`

```ts
async remove(id: string): Promise<void> {
  try {
    await this.prisma.category.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new ConflictException('Category cannot be deleted');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Category not found');
      }
    }
    throw error;
  }
}
```

### Buscar uno: `findOne`

No todos los métodos necesitan `try/catch`. `findUnique` devuelve `null` cuando no encuentra el registro; por eso el service puede convertir ese resultado directamente:

```ts
async findOne(id: string) {
  const category = await this.prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new NotFoundException('Category not found');
  }
  return category;
}
```

La implementación actual usa este patrón en `categories`, `category-editions` y `evaluation-periods`. Si ocurre un error inesperado en `findUnique`, al no capturarlo llega al manejo global de NestJS como `500`.

## 8. Validación y pipes: cuándo no interviene tu `try/catch`

Los errores de validación suelen ocurrir antes de que NestJS invoque al service:

```ts
@Post()
create(@Body() dto: CreateCategoryDto) {
  return this.categoriesService.create(dto);
}
```

Con `ValidationPipe`, un body que no cumple el DTO produce normalmente `400 Bad Request` en el borde HTTP. Un `ParseUUIDPipe` también puede rechazar un `id` mal formado antes de llegar al service. El `try/catch` del service no captura esos errores porque la consulta a Prisma todavía no empezó.

En `evaluation-periods`, además, `validateDateRange` lanza `BadRequestException` para un rango inválido. Esa validación de dominio tampoco necesita envolverse en un `catch` que la transforme en otro status.

Distinguí entonces:

- entrada inválida o formato incorrecto: `ValidationPipe`/pipes, normalmente `400`;
- dato válido pero inexistente en la base: `NotFoundException`, `404`;
- conflicto de unicidad: `ConflictException`, `409`;
- error inesperado: rethrow y manejo global, normalmente `500`.

## 9. Errores comunes

- Poner `try/catch` alrededor del controller sin una traducción concreta.
- Olvidar `await` dentro del `try` y creer que se capturó el rechazo de Prisma.
- Capturar todo y convertirlo en `ConflictException` o `BadRequestException`.
- Comparar el mensaje textual en vez del tipo y el código exacto.
- Manejar solo el código conocido y olvidar `throw error` para los demás.
- Duplicar la validación que ya hace `ValidationPipe`.
- Exponer el error de Prisma, SQL o el stack trace en la respuesta HTTP.
- Agregar un `try/catch` a un `findOne` que ya expresa claramente el `null` como `404`, sin aportar una traducción nueva.


