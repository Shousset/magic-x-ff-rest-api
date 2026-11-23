Interfaz Next.js para el catálogo. En desarrollo funciona junto con la API NestJS del directorio `backend/`.

## Ejecutar frontend y API en local

Abre dos terminales desde la raíz del proyecto (`magic-x-ff-rest-api`).

En la primera, inicia la API:

```powershell
cd "C:\ruta\al\proyecto\magic-x-ff-rest-api\backend"
npm run start:dev
```

NestJS escucha en `http://localhost:3003` (variable `PORT` de `backend/.env`).

En la segunda, inicia el frontend:

```powershell
cd "C:\ruta\al\proyecto\magic-x-ff-rest-api\frontend"
npm run dev
```

Abre <http://localhost:3004>. Las solicitudes del navegador usan rutas `/api/...`; el handler de Next.js las reenvía a NestJS con `NEST_API_ORIGIN`. En desarrollo, el valor predeterminado es `http://localhost:3003`.

No es necesario llamar a la API desde el navegador con una URL absoluta ni cambiar la base de datos; las solicitudes pasan por el servidor Next.js.

## Comandos

```powershell
npm run dev
npm run lint
npm run build
npm test
```

En producción, configura `NEST_API_ORIGIN` como el origen HTTP(S) público del servicio backend. El contenedor usa el puerto `PORT` que Railway inyecta.
