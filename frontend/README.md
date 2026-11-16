# Frontend Angular

Este frontend Angular consume la API REST de Spring Boot. Desde la raíz del proyecto:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

En otra terminal:

```powershell
cd frontend
npm ci
npm start
```

Abre `http://localhost:4200`. El proxy de desarrollo reenvía `/api`, `/css` y `/music` al backend en `http://localhost:8080`. Para compilar o ejecutar las pruebas usa `npm run build` y `npm test -- --watch=false`.
