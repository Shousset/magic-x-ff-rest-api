Interfaz Next.js para el catálogo. En desarrollo funciona junto con la API NestJS del directorio raíz.

## Ejecutar frontend y API en local

Abre dos terminales desde la raíz del proyecto (`magic-x-ff-rest-api`).

En la primera, inicia la API:

```powershell
cd "C:\ruta\al\proyecto\magic-x-ff-rest-api"
npm run start:dev
```

NestJS escucha en `http://localhost:3002` (variable `PORT` del `.env`).

En la segunda, inicia el frontend:

```powershell
cd "C:\ruta\al\proyecto\magic-x-ff-rest-api\frontend"
npm run dev
```

Abre <http://localhost:3001>. El frontend usa rutas relativas como `/cards` y Next.js las reenvía a NestJS en `http://localhost:3002` mediante los rewrites de `next.config.ts`. Si cambias el puerto de la API, ajusta `NEST_API_ORIGIN` y reinicia Next.js.

No es necesario llamar a la API desde el navegador con una URL absoluta ni cambiar la base de datos; las solicitudes pasan por el servidor Next.js.

## Comandos

```powershell
npm run dev
npm run lint
npm run build
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
