# Magic X - despliegue en Railway

Aplicación con API NestJS + Prisma y frontend Next.js. Se despliegan como dos servicios Railway, cada uno desde su propio directorio Docker.

## Estructura

- `backend/`: API, esquema y migraciones de Prisma.
- `frontend/`: aplicación Next.js y proxy API del mismo origen.

## Desarrollo local

1. Instala dependencias dentro de cada directorio:

   ```powershell
   cd backend
   npm ci
   npx prisma generate
   ```

   ```powershell
   cd ..\frontend
   npm ci
   ```

2. Copia `backend/.env.example` a `backend/.env` y configura `DATABASE_URL` y `JWT_SECRET`. El `.env` local está ignorado por Git y Docker.
3. Inicia la API desde `backend/` con `npm run start:dev`.
4. Inicia Next.js desde `frontend/` con `npm run dev`. En desarrollo su proxy usa por defecto `http://localhost:3003`; ajusta `NEST_API_ORIGIN` si la API usa otro origen.

## Railway

Configura dos servicios con builder Dockerfile:

| Servicio | Directorio raíz | Dockerfile   |
| -------- | --------------- | ------------ |
| API      | `backend/`      | `Dockerfile` |
| Web      | `frontend/`     | `Dockerfile` |

Variables del servicio API:

- `DATABASE_URL`: URL PostgreSQL de Railway.
- `JWT_SECRET`: secreto aleatorio de al menos 32 caracteres.
- `JWT_EXPIRES_IN`: expiración del token en segundos (opcional; predeterminado `86400`).
- `CORS_ORIGINS`: origen del servicio frontend.
- `PORT`: inyectada por Railway.

Variables del servicio web:

- `NEST_API_ORIGIN`: origen HTTP(S) del servicio API, sin ruta ni credenciales.
- `PORT`: inyectada por Railway.

Configura ambas variables de origen con las URLs de los servicios Railway correspondientes. Las llamadas del navegador usan `/api/...` en el mismo origen; el handler de Next.js las dirige al backend en tiempo de ejecución.

La aplicación requiere PostgreSQL y Prisma. Aplica las migraciones existentes con `npx prisma migrate deploy` desde `backend/` y con `DATABASE_URL` configurada antes de iniciar la API. Las credenciales de despliegue se configuran como variables del servicio, no en la imagen ni en `.env.example`.

## Validación local

```powershell
cd backend
npm ci
npm run build
npm run test:e2e
docker build -t magic-x-backend .
docker run --rm -p 3000:3000 -e PORT=3000 --env-file .env magic-x-backend
```

Configura una base de datos de prueba en `backend/.env` antes de `npm run test:e2e`. Comprueba `http://localhost:3000/health`.

```powershell
cd ..\frontend
npm ci
npm run build
npm test
docker build -t magic-x-frontend .
docker run --rm -p 8080:8080 -e PORT=8080 -e NEST_API_ORIGIN=http://host.docker.internal:3000 magic-x-frontend
```

Abre `http://localhost:8080` y recarga una ruta interna. Para validar llamadas de API, el backend debe estar ejecutándose en el origen configurado.

## Archivos de entorno e historial

El `.env` local permanece fuera de Git y de los contextos Docker. Si una credencial se publicó previamente, quitar el archivo de los commits no la invalida; las copias en clones, forks o caches tampoco se pueden retirar con una reescritura del repositorio.
