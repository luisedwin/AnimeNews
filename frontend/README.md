# Frontend Angular

El frontend Angular es una aplicación independiente: sirve sus propios archivos HTML, CSS y multimedia, y llama al backend únicamente para consumir la API REST. No necesita que Spring Boot sirva la SPA.

## Desarrollo local

Configura `SPRING_DATASOURCE_PASSWORD` y arranca el backend en una terminal:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

En otra terminal, inicia Angular:

```powershell
cd frontend
npm ci
npm start
```

Abre `http://localhost:4200`. Angular llama directamente a `http://localhost:8080/api`; el backend debe permitir el origen `http://localhost:4200` mediante `CORS_ALLOWED_ORIGINS`. No hay proxy de frontend para API, CSS o multimedia.

## Docker independiente

Desde la raíz, ejecuta `docker compose up --build` con `SPRING_DATASOURCE_PASSWORD` definido. El frontend queda en `http://localhost:4200` y el backend API en `http://localhost:8080`. Configura `API_BASE_URL` para que apunte al backend accesible desde el navegador y `CORS_ALLOWED_ORIGINS` con el origen exacto del frontend. La URL del API se lee al iniciar el contenedor frontend, así que puede cambiarse sin recompilar Angular.

Para compilar o ejecutar las pruebas usa `npm run build` y `npm test -- --watch=false`.
