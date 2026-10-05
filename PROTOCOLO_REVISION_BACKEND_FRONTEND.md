# Protocolo de revisión: backend y frontend

## Propósito

Usar este protocolo para continuar el desarrollo de `magic-x-ff-rest-api` con cambios controlados. La prioridad es encontrar y corregir errores de integración, exposición de datos y problemas de implementación del backend. La interfaz debe conservarse casi sin cambios.

## Alcance y reglas de trabajo

1. Diagnosticar y reproducir el problema antes de cambiar código.
2. Revisar el contrato entre la interfaz y la API: URL, método, headers, token, cuerpo, respuesta y códigos HTTP.
3. Verificar los flujos con ambos usuarios de prueba, sin copiar contraseñas a código, documentación nueva, capturas ni logs.
4. Corregir primero el backend o la integración mínima necesaria. No rediseñar ni reescribir el frontend.
5. Antes de cambiar una interacción visible o introducir un framework, explicar el impacto y confirmar la decisión.
6. Añadir pruebas enfocadas al comportamiento corregido; ejecutar las pruebas relevantes y el build.
7. Informar qué se observó, qué se cambió, qué se verificó y qué queda pendiente. No presentar una hipótesis como causa confirmada.

## Decisión de frontend: Next.js, Angular o interfaz actual

NestJS y Next.js **sí pueden ejecutarse simultáneamente**. No es necesario que uno esté anidado dentro del otro: lo habitual es que NestJS ejecute la API y Next.js la aplicación web como procesos/servicios separados. También pueden compartir repositorio y exponerse bajo el mismo dominio mediante un proxy. La interfaz puede llamar a la API de NestJS de forma asíncrona con `fetch` o `HttpClient`.

**Decisión confirmada: migrar toda la interfaz actual a Next.js, conservando su diseño y flujos, y mantener NestJS como API.** La migración no incluye un rediseño. Next.js será una aplicación separada, y su comunicación con NestJS se configurará para que las rutas y la autenticación actuales sigan funcionando sin exponer tokens.

Si más adelante se decide migrar el frontend a un framework, **Angular es la alternativa que mejor encaja con el material existente**, porque el repositorio ya contiene una muestra bajo `src/collections/angular-v18/`. Angular y NestJS también serían dos aplicaciones separadas: Angular se compila como archivos estáticos y NestJS puede servir ese build, manteniendo la API y el frontend bajo el mismo origen. Sin embargo, portar toda la interfaz a Angular sí implica cambios de frontend, por lo que requiere una decisión aparte y no forma parte del arreglo de colecciones.

La ejecución será por etapas para poder detectar regresiones: inventario y referencia del comportamiento actual, estructura de Next.js, migración de diseño/assets y flujos, integración API/autenticación, y pruebas de paridad. Next.js es ahora la interfaz de usuario; NestJS conserva las rutas API.

### Estado actual de ejecución

- La aplicación Next.js está en `frontend/` y se ejecuta separadamente de NestJS; por defecto usa el puerto `3001` y el proxy apunta a `http://localhost:3000`. Se puede cambiar el destino de la API con `NEST_API_ORIGIN`.
- Ya están portados el catálogo, filtros, detalle, tema, login, acciones de administración y operaciones de colección. Next.js es la interfaz en `frontend/`; NestJS ya no contiene ni sirve la página HTML anterior.
- Se reorganizó la aplicación frontend: la ruta raíz de Next.js es un wrapper pequeño, el cliente API está en `frontend/src/lib/`, los tipos compartidos en `frontend/src/types/` y la interfaz de Magic y formulario de administración en `frontend/src/features/`. Se retiraron los archivos scaffold de Next que no se usaban.
- Nest ya no registra el controlador raíz que generaba HTML ni copia/sirve archivos estáticos; `/` queda sin ruta de frontend. Los recursos usados por la interfaz están en `frontend/public/img/`.
- Se corrigió en la interfaz Next.js un problema visual/funcional de la pestaña personal: la regla CSS heredada `.user-collection-section { display: none; }` ocultaba el contenido aunque la pestaña estuviera activa. Ahora el panel y el aviso para usuarios desconectados se muestran.
- Verificado en navegador: catálogo y filtros; panel de colección sin sesión; contrato de login simulado `{ access_token, token_type, expires_in }` seguido de `/auth/me`; acción administrativa visible para el rol administrador; cierre de sesión y eliminación del token del almacenamiento local.
- Con ambas cuentas de prueba reales: inicio de sesión correcto y respuestas `200` en `GET /collections` y `GET /collections/summary`. La primera cuenta tenía dos entradas; la segunda mostró una colección vacía. La segunda cuenta, con rol de usuario, no ve la acción de crear cartas.
- Se probó temporalmente el CRUD en ambas cuentas sin alterar sus entradas preexistentes: `POST` agregó una carta que no estaba registrada, `PATCH` elevó cantidad de 1 a 2 y el cambio persistió tras recargar; `DELETE` eliminó solo la entrada temporal y, tras otra recarga, cada cuenta conservó su estado original (dos entradas en la primera y cero en la segunda).
- Verificado también por el proxy Next.js: `GET /collections` sin token devuelve `401`, como corresponde a una ruta protegida.
- La instrumentación del navegador registró `net::ERR_ABORTED` en las solicitudes `DELETE`, aunque la interfaz completó el flujo y la ausencia de la entrada quedó confirmada tras recargar. Si se vuelve a reproducir en una sesión normal, investigar el evento; no se interpretó como fallo del backend porque el resultado persistido fue correcto.
- La compilación de Nest y Next pasó y ESLint de Next pasó tras los cambios. La suite e2e no pudo arrancar por el error previo de Jest al cargar `@nestjs/testing` como ESM; el test de raíz quedó actualizado, pero debe ejecutarse cuando se resuelva esa configuración.
- Pendiente: reiniciar/reemplazar el proceso Nest que ya estaba activo para que deje de servir el bundle anterior y completar los recorridos de paridad visual. El código compilado nuevo ya no incluye el controlador HTML; el proceso anterior no se terminó automáticamente.
- La auditoría previa informó cero vulnerabilidades de dependencias de producción y cinco alertas altas en dependencias de desarrollo. La corrección automática sugerida implicaba degradar de forma mayor la configuración de Next.js; no se aplicó. Revaluar antes de publicar y actualizar solo cuando haya una corrección compatible y verificable.

## Estado conocido del proyecto

- NestJS es la API para cartas, tipos, rarezas, usuarios, autenticación y colecciones; Next.js es la interfaz web.
- `frontend/src/app/page.tsx` delega en `frontend/src/features/magic/MagicCatalogApp.tsx`. El cliente HTTP común está en `frontend/src/lib/api.ts` y los contratos de datos están en `frontend/src/types/magic.ts`.
- Se retiró `src/app.controller.ts` y se actualizó la prueba e2e para que `/` no se considere una ruta del frontend. `scripts/verify-assets.ts` también se retiró porque comprobaba el HTML anterior de Nest.
- Se simplificaron los scripts de build y desarrollo de Nest al retirar el copiado de `public/`; los módulos y contratos de API no se modificaron.
- `CollectionsController` protege sus rutas con `JwtAuthGuard` y toma el usuario desde el token, no desde el cuerpo de la petición.
- Existe otra superficie de ejemplo en `src/collections/angular-v18/`. Su servicio de colecciones usa rutas relativas y no muestra un mecanismo de autenticación Bearer. Antes de considerarla parte del producto, hay que confirmar si se ejecuta o si es únicamente material de referencia.
- Se identificó y corrigió una falla de integración en el login de la interfaz anterior: buscaba `accessToken`, pero `/auth/login` entrega `access_token`; el nombre y el rol se obtienen de `/auth/me`. Ese frontend ya fue retirado y Next.js conserva el contrato correcto; se verificó el login real con ambas cuentas.
- El proyecto tiene `whitelist` y `forbidNonWhitelisted` habilitados en el `ValidationPipe` global. Los DTO deben tener decoradores de validación para aceptar las propiedades permitidas.

## Alcance confirmado de la migración a Next.js

La interfaz completa ya está en Next.js, preservando el diseño visual, los textos y los flujos existentes. NestJS mantiene las rutas y responsabilidades de API; se retiró su entrega de HTML para evitar mantener dos puntos de entrada de interfaz.

### Inventario funcional que debe preservarse

- Navegación entre catálogo, búsqueda por colección y colección personal.
- Catálogo de cartas: carga, búsqueda por nombre, filtro por rareza y filtro por set; detalle de carta.
- Tema claro/oscuro y diseño responsive.
- Login, persistencia y cierre de sesión con el comportamiento actual, sin exponer tokens.
- Colección personal: resumen, listado, alta de carta con cantidad/foil, actualización de cantidad y eliminación; aislamiento por usuario.
- Acciones administrativas para crear cartas, visibles solo para administradores.
- Modales, estados de carga/vacío/error, mensajes toast y assets de `public/img`.

Las credenciales de prueba incrustadas en la interfaz anterior no se portaron a Next.js. Los secretos no se deben incluir en el código, el frontend, ejemplos, logs ni documentación nueva.

### Etapas de ejecución

1. **Inventario y referencia:** documentar pantallas, interacciones, llamadas HTTP, estados y assets del frontend actual. Reproducir y registrar por separado el problema de colecciones.
2. **Aplicación Next.js aislada:** crear una aplicación frontend separada, con su propio `package.json`, sin alterar aún cómo NestJS sirve la interfaz existente.
3. **Paridad visual:** trasladar estilos y assets y construir componentes/layouts React; comparar contra la interfaz original antes de retirar cualquier pantalla.
4. **Paridad funcional e integración:** portar autenticación, catálogo, filtros, administración y colecciones; configurar la comunicación/proxy hacia NestJS y validar respuestas y autorización.
5. **Verificación:** ejecutar build, pruebas y recorridos de navegador para los flujos normales, errores y ambos usuarios.
6. **Ejecución de frontend:** Next.js es el punto de entrada de usuario; reiniciar los procesos locales/deployment de Nest para aplicar la retirada de su HTML y operar Next.js como servicio separado.

La retirada del HTML del backend no cambia rutas ni datos de la API. Antes de publicar, configurar ambos servicios y verificar que el proxy/dominio enrute el frontend Next.js y las rutas API NestJS según el entorno.

## Incidente prioritario: colecciones

### Reproducción y diagnóstico

Probar cada flujo por separado con una sesión/token nuevo para cada usuario:

1. Iniciar sesión, leer `access_token` de `/auth/login` y validar la identidad/rol con `/auth/me`.
2. Cargar `GET /collections/summary` y `GET /collections` con el header `Authorization: Bearer <token-de-prueba>`.
3. Desde una carta del catálogo, probar `POST /collections` con `cardId`, `quantity` e `isFoil`.
4. Probar `PATCH /collections/:id` para cambiar cantidad y `DELETE /collections/:id` para eliminar una entrada.
5. Repetir con ambos usuarios, confirmando que cada uno ve y modifica únicamente su propia colección.
6. En cada solicitud registrar para el diagnóstico: usuario de prueba (sin contraseña ni token), método, ruta, status HTTP, forma del mensaje de error y resultado esperado/obtenido. Revisar también la consola del navegador y los logs del servidor, eliminando tokens y datos sensibles.

### Criterios de aceptación

- Ambos usuarios pueden cargar su colección y su resumen.
- Agregar, cambiar cantidad y eliminar funcionan desde la interfaz existente.
- Una colección vacía se presenta como vacía; no se confunde con un fallo de autenticación o de red.
- Las entradas de un usuario no aparecen ni se pueden modificar con el token del otro.
- Una solicitud sin token o con token inválido obtiene una respuesta de autenticación apropiada.
- Los campos inválidos o desconocidos reciben errores claros y controlados.
- Hay pruebas para los casos de éxito y los límites de autorización afectados.

## Revisión de fugas y riesgos de implementación

En la revisión, comprobar de forma enfocada:

- Credenciales, tokens, claves, cadenas de conexión o datos personales en archivos versionados, respuestas, logs y documentación. Si una credencial es real o reutilizada, tratarla como expuesta: rotarla y retirar el valor de los lugares versionados de acuerdo con el flujo del repositorio. No copiarla a este protocolo.
- Almacenamiento y ciclo de vida del JWT en el navegador; no imprimirlo en consola ni incluirlo en URLs.
- Aislamiento de datos por usuario en todas las operaciones de colección.
- Inserción de valores de la API en HTML. La interfaz actual construye partes de la colección con `innerHTML`; verificar que datos como nombres y URL de imágenes no permitan inyección de HTML o scripts y preferir renderizado seguro cuando corresponda.
- Validación del contenido y tipo de datos en los DTO, errores, permisos y exposición innecesaria en las respuestas.
- CORS, teniendo en cuenta que la interfaz actual usa rutas relativas y tokens Bearer. No habilitar credenciales de cookies junto con un origen comodín.

Estos puntos son una lista de revisión; no implican por sí solos que se haya confirmado una vulnerabilidad explotable.

## Secuencia de cambios

1. Reproducir y aislar el fallo de colecciones con ambos usuarios.
2. Compartir el diagnóstico y el cambio mínimo propuesto.
3. Corregir el contrato o la lógica de backend/integración, evitando cambios visuales no necesarios.
4. Añadir o ajustar pruebas y ejecutar build y pruebas relevantes.
5. Verificar de nuevo los flujos con ambas identidades y comprobar el aislamiento.
6. Revisar fugas relacionadas con los archivos o el flujo afectado.
7. Migrar toda la interfaz a Next.js por etapas, manteniendo NestJS como API y conservando la versión actual hasta completar las pruebas de paridad.
