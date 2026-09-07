# Guia del proyecto Magic FIN

## Que es cada cosa

La aplicacion es una API REST creada con NestJS, TypeScript, Prisma y PostgreSQL. La interfaz HTML basica se sirve desde la misma API en `GET /`.

Los datos de las cartas son reales y provienen de Scryfall, una fuente publica de informacion de Magic. Scryfall se consulta solamente cuando se ejecuta `npm run import:cards`; no se consulta cada vez que el usuario abre una carta.

## Flujo de datos

```text
Scryfall
  |  npm run import:cards
  v
Prisma ORM
  v
PostgreSQL remoto (Railway)
  ^
  |  consultas locales de la API
NestJS
  |-- GET /cards
  |-- GET /rarities
  |-- GET /card-types
  |-- GET /
  v
Insomnia o navegador
```

La imagen es la unica parte que sigue dependiendo de internet despues de la importacion: la base de datos guarda `imageUrl`, normalmente apuntando a `cards.scryfall.io`. Los textos, nombres, rarezas, tipos y demas campos se consultan desde PostgreSQL a traves de nuestra API.

## Archivos importantes

| Archivo o carpeta | Funcion |
|---|---|
| `src/app.controller.ts` | Sirve la interfaz HTML y sus consultas `fetch`. |
| `src/app.module.ts` | Une los modulos de la aplicacion. |
| `src/cards/` | Endpoints y logica CRUD de cartas, busqueda y filtro por rareza. |
| `src/rarities/` | Endpoint `GET /rarities`. |
| `src/card-types/` | Endpoint `GET /card-types`. |
| `src/prisma/` | Conexion de NestJS con Prisma y PostgreSQL. |
| `prisma/schema.prisma` | Modelo de datos `Card`, `Rarity` y `CardType`. |
| `prisma/migrations/` | Cambios versionados de la estructura de PostgreSQL. |
| `scripts/import-cards.ts` | Importa cartas FIN desde Scryfall usando `upsert`. |
| `test/app.e2e-spec.ts` | Prueba e2e de la API. |
| `.env` | Configuracion real local. Nunca debe subirse a Git. |
| `package.json` | Comandos y dependencias. |
| `package-lock.json` | Versiones exactas instaladas por npm. |

## Archivos que no forman parte del codigo fuente

- `dist/`: salida compilada. Se puede borrar; `npm run build` la vuelve a crear.
- `node_modules/`: dependencias instaladas. Se puede regenerar con `npm install`, pero se conserva para ejecutar el proyecto.
- `coverage/`: resultados de cobertura, si aparecen. Es regenerable.
- `plan.md`: no es necesario para ejecutar la API, pero se conserva porque documenta el objetivo academico y las decisiones del proyecto.

## Arranque

Desde esta carpeta:

```bash
npm install
npm run build
npm start
```

Para desarrollo con recarga automatica:

```bash
npm run start:dev
```

La interfaz queda en `http://localhost:3000/`.

## Prueba con Insomnia

Usa esta variable de entorno en Insomnia:

```text
base_url = http://localhost:3000
```

### Consultas de lectura

1. `GET {{ base_url }}/cards`
   - Comprueba que devuelve `{ "data": [...] }`.
   - Debe devolver cartas guardadas en PostgreSQL.

2. `GET {{ base_url }}/cards?search=Aerith`
   - Comprueba la busqueda parcial por nombre.

3. `GET {{ base_url }}/cards?rarity=rare`
   - Comprueba el filtro de rareza.

4. `GET {{ base_url }}/cards/1`
   - Consulta una carta por su id.

5. `GET {{ base_url }}/rarities`
   - Obtiene las rarezas disponibles para el menu.

6. `GET {{ base_url }}/card-types`
   - Obtiene los tipos guardados.

7. `GET {{ base_url }}/`
   - Devuelve la interfaz HTML, no un JSON.

### CRUD opcional

Para crear una carta usa `POST {{ base_url }}/cards` con `Content-Type: application/json`:

```json
{
  "name": "Carta de prueba",
  "type": "Creature",
  "rarity": "rare",
  "collectorNumber": "TEST-001",
  "manaCost": "{2}{U}",
  "oracleText": "Texto de prueba",
  "power": "2",
  "toughness": "2",
  "setCode": "FIN",
  "artist": "Artista de prueba",
  "imageUrl": "https://cards.scryfall.io/normal/front/example.jpg"
}
```

Para no modificar datos reales durante la demostracion, prioriza las consultas `GET`. Si creas una carta de prueba, puedes borrarla con `DELETE /cards/:id`.

## Importacion de datos

```bash
npm run import:cards
```

Este comando:

- consulta todas las paginas del set `FIN` en Scryfall;
- guarda nombres, textos, rarezas, tipos, artistas y URLs de imagen;
- usa `upsert` con `setCode + collectorNumber` para evitar duplicados;
- puede ejecutarse mas de una vez.

Necesita internet y una conexion valida a PostgreSQL.

## Que ocurre sin internet

La API puede seguir iniciando solo si PostgreSQL es accesible. En este proyecto PostgreSQL esta alojado en Railway, por lo que normalmente tambien se necesita internet para consultar la base de datos. Aunque PostgreSQL responda, las imagenes no cargaran si el navegador no puede llegar a `cards.scryfall.io`.

Scryfall no se consulta al navegar por la interfaz. Si la pagina falla sin internet, las causas esperadas son la conexion a PostgreSQL remoto o la carga de las imagenes externas, no una consulta oculta a Scryfall desde `/cards`.
