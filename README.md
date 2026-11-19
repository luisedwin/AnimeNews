# AnimeNews

AnimeNews es un portal web de noticias sobre anime, manga, estrenos y cultura japonesa. El frontend está construido con Angular y se comunica con una API REST de Spring Boot; los datos se almacenan en PostgreSQL/Supabase.

## Novedades

- El frontend se migró a Angular en `frontend/`.
- Angular y Spring Boot son aplicaciones independientes: Angular sirve la interfaz y Spring Boot expone únicamente la API REST bajo `/api`.
- Se integro Supabase, una base de datos en la nube.
- Los datos de la pagina se trasladaron a la base de datos y fueron inyectados a la pagina por sus respectivos enpoints.
- Cada integrante configuro un workflow para el control de calidad de su rama respectiva.
- Se creó un entorno de prueba con Docker.


## ¿En qué consiste la página?

La web está orientada a ser una landing page y un portal informativo para fans del anime. Presenta:

- una portada principal con noticia destacada
- tarjetas de contenido de última hora
- secciones para noticias, estrenos, anime y manga
- barras laterales con tendencias y contenido recomendado
- un estilo visual inspirado en medios digitales de entretenimiento

El proyecto no incluye autenticación.

## ¿Qué se implementó?

Se construyeron varias páginas principales con un diseño coherente y reutilizable:

- Inicio: página principal con hero banner, noticia destacada, lista de noticias recientes y sidebar
- Noticias: sección más editorial con artículos destacados, listado de noticias y boletín
- Estrenos: vista enfocada en lanzamientos y novedades del calendario anime
- Anime: página con categorías como shonen, seinen y slice of life, además de paneles de tendencia
- Manga: sección tipo explorador con tarjetas de manga, etiquetas por género y diseño de catálogo

Además, se aplicaron varios elementos visuales y de estilo:

- navegación principal con menú fijo y diseño moderno
- buscador visual en el header
- tarjetas con imágenes, categorías, fechas y metadatos
- uso de Bootstrap para estructura y responsive design
- tipografías personalizadas de Google Fonts
- iconos con Font Awesome
- paleta oscura y estilo editorial para dar sensación de portal digital
- animaciones suaves para mejorar la experiencia visual

## Tecnologías utilizadas

- Angular
- Java 21 y Spring Boot
- PostgreSQL / Supabase
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (en algunos elementos interactivos y controles visuales)
- Google Fonts
- Font Awesome

## Estructura del proyecto

- `frontend/` — SPA Angular, páginas, rutas, cliente HTTP y proxy local.
- `backend/` — API REST Spring Boot y persistencia.
- `frontend/` — SPA Angular y sus recursos estáticos (CSS/audio).
- `docker-compose.yml` — servicios frontend y backend independientes; el backend se conecta a PostgreSQL en Supabase.

Angular usa señales para el estado y `computed` para filtros/listas derivados. Las páginas se cargan bajo demanda con rutas lazy-loaded, y los enlaces internos usan `routerLink` para navegar sin recargar la SPA.

## Cómo ejecutarlo en desarrollo

1. Configura `SPRING_DATASOURCE_PASSWORD` en el entorno. Para subir PDFs también configura `SUPABASE_SERVICE_ROLE_KEY`; no guardes estas credenciales en archivos versionados.
2. Inicia el backend: `cd backend` y `.\mvnw.cmd spring-boot:run` (Windows) o `./mvnw spring-boot:run` (macOS/Linux).
3. En otra terminal, inicia Angular: `cd frontend`, `npm ci` y `npm start`.
4. Abre `http://localhost:4200`. El navegador llama directamente a `http://localhost:8080/api`; Spring Boot permite CORS para `http://localhost:4200` por defecto. Para otros despliegues, establece `CORS_ALLOWED_ORIGINS` en el backend con el origen real del frontend. Puedes indicar varios orígenes separados por comas. CSS y audio se sirven desde el propio frontend.

Para construir y ejecutar ambos servicios independientes con Docker, configura `SPRING_DATASOURCE_PASSWORD` antes de usar `docker compose up --build` desde la raíz (en PowerShell: `$env:SPRING_DATASOURCE_PASSWORD = "tu-contraseña"`). El frontend queda en `http://localhost:4200` y el backend API en `http://localhost:8080`. Angular recibe `API_BASE_URL` al arrancar el contenedor frontend; el valor predeterminado para este entorno local es `http://localhost:8080/api`. Configura `CORS_ALLOWED_ORIGINS` con el origen del frontend cuando cambie. Compose conecta Spring Boot a PostgreSQL de Supabase; no inicia una base local. El usuario y la URL pueden personalizarse con `SPRING_DATASOURCE_USERNAME` y `SPRING_DATASOURCE_URL`. Para subir PDFs también configura `SUPABASE_SERVICE_ROLE_KEY`. No guardes credenciales en archivos versionados.

## Kubernetes con Docker Desktop

El manifiesto [`k8s.yml`](./k8s.yml) crea un Pod con dos contenedores: `backend` (Spring Boot) y `frontend` (Angular servido por Nginx). Nginx reenvía `/api` al backend dentro del mismo Pod. El Service es `NodePort` en el puerto `30080`; en este clúster kind de Docker Desktop el NodePort no queda accesible automáticamente desde Windows, así que se usa `kubectl port-forward`. PostgreSQL/Supabase continúa siendo una base de datos externa; Kubernetes no crea una base de datos local. Las imágenes se almacenan en un registry local de Docker Desktop, sin publicarlas en Docker Hub o GHCR.

### Desplegar la aplicación

1. En Docker Desktop, abre la vista **Kubernetes**, activa Kubernetes y espera a que el clúster aparezca como iniciado. En esa vista, activa **Show system containers (advanced)** para poder configurar el nodo.
2. Desde PowerShell, en la raíz del repositorio, selecciona el contexto local y comprueba que el nodo esté listo y visible en Docker:

   ```powershell
   kubectl config use-context docker-desktop
   kubectl get nodes
   $node = docker ps --format '{{.Names}}' | Where-Object { $_ -like '*desktop-control-plane*' } | Select-Object -First 1
   if (-not $node) { throw "No aparece el contenedor del nodo. Activa Show system containers (advanced) en Docker Desktop." }
   docker exec $node sh -c 'grep -n "config_path" /etc/containerd/config.toml'
   ```

   El último comando debe mostrar una configuración que apunte a `/etc/containerd/certs.d`. Si no muestra esa ruta, detente: el nodo no está configurado para leer el alias del registry y hay que revisar el clúster antes de continuar.

3. Inicia un registry local en la red `kind`. El puerto queda limitado a tu computadora; el volumen conserva las imágenes si se elimina y vuelve a crear el contenedor:

   ```powershell
   docker run -d --restart=always --name animenews-registry `
     --network kind `
     -p 127.0.0.1:5001:5000 `
     -v animenews-registry-data:/var/lib/registry `
     registry:3
   curl.exe http://localhost:5001/v2/
   ```

   La respuesta de `curl.exe` debería ser `{}`. Si ya existe el contenedor `animenews-registry`, no vuelvas a ejecutar `docker run`.

4. Configura el nodo para que containerd resuelva `localhost:5001` hacia el registry local:

   ```powershell
   docker exec $node sh -c 'mkdir -p /etc/containerd/certs.d/localhost:5001'

   $hostsToml = @(
     '[host."http://animenews-registry:5000"]'
     '  capabilities = ["pull", "resolve"]'
   )
   $hostsToml | docker exec -i $node sh -c 'cat > /etc/containerd/certs.d/localhost:5001/hosts.toml'
   docker exec $node cat /etc/containerd/certs.d/localhost:5001/hosts.toml
   ```

   Esta configuración es del nodo de Docker Desktop y puede perderse al restablecer o recrear el clúster. La configuración sigue el patrón de la [guía de registry local de kind](https://kind.sigs.k8s.io/docs/user/local-registry/).

5. Construye las imágenes, etiquétalas con la dirección del registry local y súbelas:

   ```powershell
   docker build -t animenews-backend:local -f backend/Dockerfile .
   docker build -t animenews-frontend:local -f frontend/Dockerfile .\frontend

   docker tag animenews-backend:local localhost:5001/animenews-backend:local
   docker push localhost:5001/animenews-backend:local
   docker tag animenews-frontend:local localhost:5001/animenews-frontend:local
   docker push localhost:5001/animenews-frontend:local
   ```

6. Crea el Secret de Kubernetes con la conexión a PostgreSQL/Supabase. Introduce los valores en PowerShell; la contraseña se solicita sin mostrarla. El Secret no queda escrito en `k8s.yml` ni en el repositorio:

   ```powershell
   $env:SPRING_DATASOURCE_URL = Read-Host "JDBC URL de PostgreSQL/Supabase"
   $env:SPRING_DATASOURCE_USERNAME = Read-Host "Usuario de PostgreSQL/Supabase"
   if ($env:SPRING_DATASOURCE_URL -notmatch '^jdbc:postgresql://[^/]+/.+') { throw "La URL debe tener el formato jdbc:postgresql://host/base-de-datos." }
   if ([string]::IsNullOrWhiteSpace($env:SPRING_DATASOURCE_USERNAME)) { throw "El usuario no puede estar vacío." }
   $securePassword = Read-Host "Contraseña de PostgreSQL/Supabase" -AsSecureString
   if ($securePassword.Length -eq 0) { throw "La contraseña no puede estar vacía." }
   $passwordPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
   try {
     $env:SPRING_DATASOURCE_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($passwordPointer)
   } finally {
     [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($passwordPointer)
   }
   if ([string]::IsNullOrWhiteSpace($env:SPRING_DATASOURCE_PASSWORD)) { throw "La contraseña no puede estar vacía." }

   kubectl create secret generic animenews-secrets `
     --from-literal="SPRING_DATASOURCE_URL=$env:SPRING_DATASOURCE_URL" `
     --from-literal="SPRING_DATASOURCE_USERNAME=$env:SPRING_DATASOURCE_USERNAME" `
     --from-literal="SPRING_DATASOURCE_PASSWORD=$env:SPRING_DATASOURCE_PASSWORD" `
     --dry-run=client -o yaml | kubectl apply -f -
   if ($LASTEXITCODE -ne 0) { throw "No se pudo crear o actualizar el Secret." }

   Remove-Item Env:SPRING_DATASOURCE_URL, Env:SPRING_DATASOURCE_USERNAME, Env:SPRING_DATASOURCE_PASSWORD
   ```

   El Secret se crea o actualiza. Si también necesitas subir PDFs, agrega `SUPABASE_SERVICE_ROLE_KEY` como otra opción `--from-literal` y define esa variable de entorno antes de ejecutar el comando. No pegues la clave directamente en el README ni en el manifiesto.
7. Aplica el manifiesto y espera a que el Pod esté listo:

   ```powershell
   kubectl apply -f .\k8s.yml
   kubectl rollout status deployment/animenews --timeout=180s
   kubectl get pods,services
   ```

8. En una segunda terminal de PowerShell, inicia el reenvío del Service y déjalo ejecutándose:

   ```powershell
   kubectl port-forward service/animenews 30080:80
   ```

   Mientras ese comando siga activo, abre `http://localhost:30080`. Si el puerto `30080` ya está ocupado, usa `kubectl port-forward service/animenews 8081:80` y abre `http://localhost:8081`. Para detener el reenvío, presiona `Ctrl+C`.

   Para revisar los registros de cada contenedor:

   ```powershell
   kubectl logs deployment/animenews -c backend
   kubectl logs deployment/animenews -c frontend
   ```

Cuando cambies el código, vuelve a construir, etiquetar y subir la imagen correspondiente, y reinicia el Deployment para que Kubernetes la descargue:

```powershell
docker build -t animenews-backend:local -f backend/Dockerfile .
docker tag animenews-backend:local localhost:5001/animenews-backend:local
docker push localhost:5001/animenews-backend:local

docker build -t animenews-frontend:local -f frontend/Dockerfile .\frontend
docker tag animenews-frontend:local localhost:5001/animenews-frontend:local
docker push localhost:5001/animenews-frontend:local

kubectl rollout restart deployment/animenews
kubectl rollout status deployment/animenews --timeout=180s
```

Para eliminar los recursos de Kubernetes, ejecuta `kubectl delete -f .\k8s.yml`. El Secret y el registry local se conservan; elimínalos por separado si ya no los necesitas.

Aunque sea un proyecto universitario, las credenciales reales no deben guardarse en archivos versionados: un repositorio puede copiarse o hacerse público. Si una clave real ya se subió al repositorio, rótala en Supabase; eliminarla del archivo no la borra del historial de Git.

## Resumen

Las secciones de anime, noticias y manga consumen los endpoints del backend. Los estrenos siguen siendo contenido estático hasta que se incorpore su modelo y endpoint de datos.

Al iniciar Spring Boot se corrigen, si hace falta, los enlaces de tráiler guardados para Blue Period, Spy x Family, Kaguya-sama, Horimiya, Clannad: After Story y K-On!.
## Gist:

Luis M.:

1-https://gist.github.com/luisedwin/1dc91018ced90f4102e2158430b58535

2-
https://gist.github.com/luisedwin/a78da96fbc8731982ce7f4089e093770

Angelo C.:

1-
https://gist.github.com/anngello601/0c67071f6d34009800d1aa925ea86f7c

2-
https://gist.github.com/anngello601/437d6ca5a56dae6a79e7c1e73ab30966

Leonardo M.:

1-
https://gist.github.com/jleo417/f5f90ea42359e24ddb947bb44222df58

2-
https://gist.github.com/jleo417/5a257ee28b134d01e65dc67664e063e5

Leandro C.:

1-
https://gist.github.com/Leandr0mar/737b57d02605cee77ee143cf93ee2215

2-
https://gist.github.com/Leandr0mar/f7fb04347c539c646e53406086a6eb85

Angel M.:

1-https://gist.github.com/lAngeLqI/94fea374fdeefb96900e9863ed1067c4

2-https://gist.github.com/lAngeLqI/98dcd3ae21f968ecd612743ec0f5ba92


## Página:
https://luisedwin.github.io/AnimeNews/noticias.html
