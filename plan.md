# Proyecto: REST API de Magic: The Gathering — FINAL FANTASY

Quiero construir desde cero una **API REST funcional** para consultar información de cartas de:

**Magic: The Gathering — Universes Beyond: FINAL FANTASY (FIN)**

Repositorio del proyecto:

https://github.com/Shousset/magic-x-ff-rest-api

## 1. OBJETIVO PRINCIPAL

El objetivo académico del proyecto es **crear una API REST desde cero**, construyendo la infraestructura, módulos, servicios, controladores, modelos y conexión con PostgreSQL necesarios para poder consultar la información de las cartas.

La prioridad absoluta es:

> Tener la información de las cartas almacenada localmente y disponible mediante endpoints REST en formato JSON estructurado.

Las imágenes **NO necesitan almacenarse físicamente de manera local**.

Para las imágenes es suficiente guardar en la base de datos la URL proporcionada por una fuente externa, de manera que el JSON de cada carta pueda incluir la URL de su imagen.

---

# 2. TECNOLOGÍAS OBLIGATORIAS

Utilizar:

* **Node.js**
* **NestJS**
* **TypeScript**
* **PostgreSQL**
* **Prisma ORM**
* **REST API**
* **JSON**
* **Insomnia** para realizar las pruebas

No utilizar tecnologías innecesarias.

No agregar:

* Docker
* Redis
* Kubernetes
* Microservicios
* GraphQL
* JWT
* Sistemas de autenticación
* Arquitecturas excesivamente complejas

La aplicación debe ser sencilla, clara y apropiada para un proyecto académico.

---

# 3. CONSTRUIR EL PROYECTO DESDE CERO

Antes de escribir código:

1. Inspeccionar el repositorio.
2. Revisar qué archivos existen.
3. Revisar `package.json`.
4. Revisar la configuración de NestJS.
5. Revisar cualquier configuración existente de Prisma.
6. Revisar las variables de entorno.
7. Revisar la conexión existente con PostgreSQL.
8. Identificar si existe algún código que pueda reutilizarse.

Si el repositorio está vacío, crear la estructura completa del proyecto desde cero.

No asumir que existen módulos, servicios o controladores.

---

# 4. ARQUITECTURA ESPERADA

La arquitectura debe ser aproximadamente:

```text
Cliente / Insomnia
        │
        ▼
   REST API
     NestJS
        │
        ▼
 Controllers
        │
        ▼
   Services
        │
        ▼
     Prisma
        │
        ▼
   PostgreSQL
```

Opcionalmente, para cargar los datos iniciales:

```text
Fuente externa de cartas
          │
          ▼
    Script de importación
          │
          ▼
 PostgreSQL
          │
          ▼
     REST API
```

La fuente externa solamente sirve para **obtener los datos iniciales**.

La API que estoy desarrollando debe ser mi propia API.

---

# 5. INFORMACIÓN DE LAS CARTAS

La información de cada carta debe almacenarse de forma estructurada.

Como mínimo, intentar manejar campos como:

```json
{
  "id": 1,
  "name": "Nombre de la carta",
  "manaCost": "{2}{U}",
  "type": "Legendary Creature",
  "oracleText": "Texto de reglas de la carta",
  "power": "3",
  "toughness": "3",
  "rarity": "rare",
  "setCode": "FIN",
  "collectorNumber": "123",
  "artist": "Nombre del artista",
  "imageUrl": "https://..."
}
```

IMPORTANTE:

No inventar información.

Los nombres y datos deben provenir de una fuente real de información de Magic: The Gathering.

Si una carta no tiene determinado campo, permitir `null`.

Por ejemplo:

```json
{
  "power": null,
  "toughness": null
}
```

Esto es necesario porque no todas las cartas son criaturas.

---

# 6. FUENTE DE DATOS

Para conseguir la información inicial de las cartas se puede utilizar una API pública de cartas de Magic: The Gathering.

Una fuente preferente es **Scryfall**, siempre que sus endpoints actuales sean compatibles con esta implementación.

La aplicación debe:

1. Consultar la fuente externa.
2. Obtener las cartas pertenecientes al set FINAL FANTASY.
3. Procesar la respuesta.
4. Convertir los datos al modelo utilizado por nuestra aplicación.
5. Guardarlos en PostgreSQL.
6. Posteriormente, nuestra API debe consultar PostgreSQL y devolver JSON.

NO quiero que cada petición:

```text
GET /cards/:id
```

tenga que consultar obligatoriamente Scryfall.

La información debe estar persistida localmente en PostgreSQL.

---

# 7. IMPORTACIÓN DE CARTAS

Crear un mecanismo sencillo para importar las cartas.

Puede ser, por ejemplo:

```text
scripts/import-cards.ts
```

o un servicio/módulo equivalente.

Debe poder ejecutarse mediante un comando como:

```bash
npm run import:cards
```

El proceso debe:

1. Obtener las cartas de FINAL FANTASY.
2. Recorrer todas las páginas de resultados si la fuente externa utiliza paginación.
3. Extraer los campos necesarios.
4. Guardar las cartas en PostgreSQL.
5. Guardar también `imageUrl`.
6. Evitar duplicados.
7. Mostrar en consola el progreso de la importación.

Ejemplo:

```text
Obteniendo cartas de FINAL FANTASY...

Página 1...
Página 2...
Página 3...

Cartas procesadas: 300+
Cartas insertadas: XXX
Cartas actualizadas: XXX

Importación completada.
```

El script debe ser seguro de ejecutar más de una vez.

Utilizar `upsert` o una estrategia equivalente para evitar duplicados.

---

# 8. MÓDULO CARDS

Crear un módulo NestJS:

```text
src/cards/
```

Con una estructura similar a:

```text
cards/
├── cards.module.ts
├── cards.controller.ts
├── cards.service.ts
├── dto/
│   ├── create-card.dto.ts
│   └── update-card.dto.ts
└── entities/
    └── card.entity.ts
```

Si consideras que alguna parte no es necesaria, mantener la arquitectura simple.

---

# 9. ENDPOINT PRINCIPAL

La API debe permitir consultar todas las cartas:

```http
GET /cards
```

Respuesta:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Cloud, Ex-SOLDIER",
      "manaCost": "...",
      "type": "...",
      "oracleText": "...",
      "rarity": "...",
      "setCode": "FIN",
      "collectorNumber": "...",
      "artist": "...",
      "imageUrl": "https://..."
    }
  ]
}
```

No devolver HTML.

No devolver texto plano.

Las respuestas de la API deben ser JSON.

---

# 10. CONSULTAR UNA CARTA INDIVIDUAL

Crear:

```http
GET /cards/:id
```

Ejemplo:

```http
GET /cards/1
```

Debe devolver:

```json
{
  "id": 1,
  "name": "Nombre de la carta",
  "manaCost": "...",
  "type": "...",
  "oracleText": "...",
  "power": null,
  "toughness": null,
  "rarity": "rare",
  "setCode": "FIN",
  "collectorNumber": "123",
  "artist": "...",
  "imageUrl": "https://..."
}
```

Este endpoint es especialmente importante porque demuestra que la API puede obtener individualmente la información de una carta.

---

# 11. BÚSQUEDA POR NOMBRE

Crear:

```http
GET /cards/search?name=Cloud
```

Debe devolver todas las cartas cuyo nombre coincida o contenga el término buscado.

Ejemplo:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Cloud, Ex-SOLDIER",
      "imageUrl": "https://..."
    }
  ]
}
```

---

# 12. FILTROS

Implementar filtros sencillos si son apropiados para el modelo.

Por ejemplo:

```http
GET /cards?rarity=rare
```

```http
GET /cards?type=Creature
```

```http
GET /cards?setCode=FIN
```

No complicar innecesariamente los filtros.

---

# 13. CRUD

La API debe demostrar las operaciones REST fundamentales.

Implementar:

```http
GET    /cards
GET    /cards/:id
POST   /cards
PATCH  /cards/:id
DELETE /cards/:id
```

### POST

Ejemplo:

```json
{
  "name": "Carta de prueba",
  "manaCost": "{2}{U}",
  "type": "Creature",
  "oracleText": "Texto de prueba",
  "rarity": "common",
  "setCode": "FIN",
  "collectorNumber": "999",
  "imageUrl": "https://example.com/card.jpg"
}
```

El endpoint debe validar los datos recibidos.

---

# 14. VALIDACIÓN

Utilizar:

```text
class-validator
class-transformer
```

Configurar `ValidationPipe` global.

Validar correctamente los DTO.

Por ejemplo:

* `name` obligatorio.
* `setCode` válido.
* `imageUrl` debe ser URL cuando se proporcione.
* Los campos opcionales deben aceptar `null` cuando corresponda.

---

# 15. MANEJO DE ERRORES

Implementar respuestas HTTP correctas.

Por ejemplo:

Si una carta no existe:

```http
GET /cards/999999
```

debe responder:

```http
404 Not Found
```

con JSON similar a:

```json
{
  "statusCode": 404,
  "message": "Card not found"
}
```

No devolver errores internos directamente al usuario.

---

# 16. PRISMA

Utilizar Prisma como ORM.

Crear:

```text
prisma/
├── schema.prisma
```

y el servicio correspondiente dentro de NestJS.

Por ejemplo:

```text
src/prisma/
├── prisma.module.ts
└── prisma.service.ts
```

El `PrismaService` debe integrarse mediante inyección de dependencias de NestJS.

No crear conexiones manuales innecesarias.

---

# 17. BASE DE DATOS

La aplicación debe utilizar PostgreSQL.

Configurar:

```env
DATABASE_URL="..."
```

Nunca colocar credenciales directamente dentro del código.

Si existe una base de datos proporcionada por el profesor, respetar su estructura.

No ejecutar:

```bash
prisma migrate reset
```

No eliminar datos existentes.

No reemplazar la base de datos.

No modificar destructivamente tablas existentes sin justificarlo.

Si la base de datos está vacía y necesitamos crear el esquema, documentar claramente qué tablas se crean.

---

# 18. IMÁGENES

NO es obligatorio descargar las imágenes.

La solución preferida es almacenar:

```json
{
  "imageUrl": "https://..."
}
```

La API debe devolver esa URL.

Por ejemplo:

```json
{
  "name": "Cloud, Ex-SOLDIER",
  "imageUrl": "https://cards.scryfall.io/..."
}
```

De esta manera, un frontend futuro podría utilizar directamente:

```html
<img src="imageUrl">
```

No implementar almacenamiento de archivos si no es necesario.

---

# 19. SWAGGER

Agregar Swagger para documentar la API.

La documentación debe estar disponible en una ruta como:

```text
/api
```

Documentar como mínimo:

* GET `/cards`
* GET `/cards/:id`
* GET `/cards/search`
* POST `/cards`
* PATCH `/cards/:id`
* DELETE `/cards/:id`

---

# 20. INSOMNIA

La API debe quedar preparada para probarse fácilmente con Insomnia.

Crear y probar solicitudes para:

### Obtener cartas

```http
GET http://localhost:3000/cards
```

### Obtener una carta

```http
GET http://localhost:3000/cards/1
```

### Buscar

```http
GET http://localhost:3000/cards/search?name=Cloud
```

### Crear

```http
POST http://localhost:3000/cards
```

### Actualizar

```http
PATCH http://localhost:3000/cards/1
```

### Eliminar

```http
DELETE http://localhost:3000/cards/1
```

---

# 21. PAGINACIÓN

Si la colección contiene cientos de cartas, implementar paginación básica.

Ejemplo:

```http
GET /cards?page=1&limit=20
```

Respuesta:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 300,
    "totalPages": 15
  }
}
```

Mantener la implementación sencilla.

---

# 22. VARIABLES DE ENTORNO

Crear:

```text
.env
```


Por ejemplo:

```env
DATABASE_URL=
PORT=3000
```

Agregar `.env` al `.gitignore`.

---

# 23. README

Crear un README explicando:

1. Qué es el proyecto.
2. Tecnologías utilizadas.
3. Requisitos.
4. Instalación.
5. Configuración de PostgreSQL.
6. Configuración de `.env`.
7. Configuración de Prisma.
8. Cómo ejecutar la API.
9. Cómo importar las cartas.
10. Endpoints disponibles.
11. Ejemplos JSON.
12. Cómo probarla con Insomnia.

Comandos esperados:

```bash
npm install
```

```bash
npm run start:dev
```

```bash
npm run import:cards
```

---

# 24. ORDEN DE IMPLEMENTACIÓN

No intentes construir todo de una sola vez.

Trabajar exactamente en este orden:

## FASE 1 — Inspección

Revisar el repositorio y explicar:

* Qué existe.
* Qué falta.
* Qué archivos deben crearse.
* Cómo está configurada la base de datos.

No modificar todavía cosas innecesarias.

---

## FASE 2 — Crear infraestructura NestJS

Crear/configurar:

```text
NestJS
TypeScript
Prisma
PostgreSQL
Variables de entorno
```

Comprobar que la aplicación inicia correctamente.

---

## FASE 3 — Modelo Card

Crear el modelo `Card`.

Definir claramente los campos necesarios para representar una carta.

Comprobar la conexión Prisma → PostgreSQL.

---

## FASE 4 — Cards Module

Crear:

```text
CardsModule
CardsController
CardsService
DTOs
```

Implementar:

```text
GET /cards
GET /cards/:id
```

Primero comprobar que funcionan.

---

## FASE 5 — CRUD

Agregar:

```text
POST
PATCH
DELETE
```

Agregar validaciones y manejo de errores.

---

## FASE 6 — Búsqueda y filtros

Agregar:

```text
/search
```

y filtros sencillos.

---

## FASE 7 — Importación de FINAL FANTASY

Crear el script para obtener las cartas desde una fuente externa.

Transformar los datos externos al modelo `Card`.

Guardar los datos en PostgreSQL.

Verificar que se obtienen cientos de cartas correctamente.

---

## FASE 8 — Imágenes

Guardar solamente las URLs de las imágenes.

Verificar que cada carta tenga su `imageUrl` cuando la fuente lo proporcione.

---

## FASE 9 — Swagger

Documentar los endpoints.

---

## FASE 10 — Pruebas

Probar toda la API con Insomnia.

Verificar:

```text
GET
GET/:id
SEARCH
POST
PATCH
DELETE
```

También comprobar errores:

```text
404
400
500
```

cuando corresponda.

---

# 25. REGLA IMPORTANTE PARA COPILOT

No quiero que generes todo el proyecto de manera descontrolada.

Trabaja **fase por fase**.

Después de cada fase:

1. Explica qué implementaste.
2. Indica los archivos creados/modificados.
3. Ejecuta las comprobaciones necesarias.
4. Corrige los errores encontrados.
5. Comprueba que la aplicación continúa funcionando.
6. Solo después continúa con la siguiente fase.

Si encuentras un problema con PostgreSQL, Prisma o el esquema existente, detente y explica el problema antes de hacer cambios destructivos.

---

# 26. RESULTADO FINAL ESPERADO

Al terminar, debo poder ejecutar:

```bash
npm run start:dev
```

y tener mi propia API funcionando localmente.

Después de importar las cartas:

```bash
npm run import:cards
```

debo poder consultar:

```http
GET http://localhost:3000/cards
```

y obtener JSON con las cartas.

También:

```http
GET http://localhost:3000/cards/1
```

debe devolver la información individual de una carta.

El resultado final debe ser una API REST académica, clara y funcional que demuestre:

* Creación de una API desde cero.
* Arquitectura modular con NestJS.
* REST.
* PostgreSQL.
* Prisma ORM.
* Modelado de datos.
* CRUD.
* Consultas.
* Filtros.
* Validación.
* Manejo de errores.
* Consumo de una fuente externa para cargar datos.
* Persistencia local.
* Respuestas JSON.
* Documentación Swagger.
* Pruebas con Insomnia.

## PRIORIDAD

La prioridad del proyecto es, en este orden:

1. **API NestJS funcionando.**
2. **PostgreSQL funcionando.**
3. **Prisma funcionando.**
4. **Modelo estructurado de cartas.**
5. **CRUD de cartas.**
6. **Consultar individualmente una carta en JSON.**
7. **Importar las cartas reales de FINAL FANTASY.**
8. **Guardar las URLs de las imágenes.**
9. **Búsqueda y filtros.**
10. **Swagger e Insomnia.**

No sacrificar la estabilidad de la API por funcionalidades secundarias.

La aplicación debe ser entendible para un estudiante y fácil de explicar al profesor.

**Comienza ahora únicamente con la FASE 1: inspecciona el repositorio y explícame qué estructura debemos crear. No avances a la siguiente fase hasta terminar correctamente la inspección.**
