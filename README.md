# AnimeNews

AnimeNews es un portal web de noticias sobre anime, manga, estrenos y cultura japonesa. El frontend está construido con Angular y se comunica con una API REST de Spring Boot; los datos se almacenan en PostgreSQL/Supabase.

## Novedades

- El frontend se migró a Angular en `frontend/`.
- Spring Boot sirve la SPA y expone la API REST bajo `/api`.
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
- `backend/` — API REST Spring Boot, persistencia y recursos compartidos (CSS/audio).
- `docker-compose.yml` — aplicación y PostgreSQL para desarrollo/despliegue.

Angular usa señales para el estado y `computed` para filtros/listas derivados. Las páginas se cargan bajo demanda con rutas lazy-loaded, y los enlaces internos usan `routerLink` para navegar sin recargar la SPA.

## Cómo ejecutarlo en desarrollo

1. Configura `SPRING_DATASOURCE_PASSWORD` en el entorno. Para subir PDFs también configura `SUPABASE_SERVICE_ROLE_KEY`; no guardes estas credenciales en archivos versionados.
2. Inicia el backend: `cd backend` y `.\mvnw.cmd spring-boot:run` (Windows) o `./mvnw spring-boot:run` (macOS/Linux).
3. En otra terminal, inicia Angular: `cd frontend`, `npm ci` y `npm start`.
4. Abre `http://localhost:4200`. El proxy de Angular conecta `/api`, `/css` y `/music` con Spring Boot en `http://localhost:8080`. El backend también permite CORS para `http://localhost:4200` en `/api/**`; para producción, establece `CORS_ALLOWED_ORIGINS` con el origen real de Angular. Puedes indicar varios orígenes separados por comas.

Para construir y ejecutar la aplicación con Docker, usa `docker compose up --build` desde la raíz. El contenedor compila Angular y Spring Boot y sirve la SPA y la API desde el puerto 8080.

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
