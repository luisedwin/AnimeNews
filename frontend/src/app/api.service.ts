import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Anime, Manga, MangaCapitulo, Noticia } from './models';

const API_BASE_URL = environment.apiBaseUrl;

const ANIMES: Anime[] = [
  {
    id: 1,
    titulo: 'Frieren: Más allá del final del viaje',
    descripcion: 'Una maga elfa emprende un nuevo viaje para comprender mejor a las personas que conoció.',
    genero: 'Fantasía',
    imagenUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    rating: 9.3,
  },
  {
    id: 2,
    titulo: 'Jujutsu Kaisen',
    descripcion: 'Yuji Itadori se enfrenta a maldiciones y descubre el precio de proteger a los demás.',
    genero: 'Acción',
    imagenUrl: 'https://images.unsplash.com/photo-1614583225154-5fc32b8c2f96?auto=format&fit=crop&w=800&q=80',
    rating: 8.7,
  },
  {
    id: 3,
    titulo: 'Spy x Family',
    descripcion: 'Un espía, una asesina y una niña telepática forman una familia muy poco convencional.',
    genero: 'Comedia',
    imagenUrl: 'https://images.unsplash.com/photo-1560972550-abe3b5f9fef4?auto=format&fit=crop&w=800&q=80',
    rating: 8.5,
  },
  {
    id: 4,
    titulo: 'Demon Slayer: Kimetsu no Yaiba',
    descripcion: 'Tanjiro busca una cura para su hermana mientras combate demonios.',
    genero: 'Aventura',
    imagenUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    rating: 8.6,
  },
];

const NOTICIAS: Noticia[] = [
  {
    id: 1,
    titulo: 'La fantasía sigue conquistando a los fans del anime',
    resumen: 'Las historias de aventura y mundos fantásticos continúan entre las favoritas de la temporada.',
    contenido: 'Las nuevas producciones de fantasía combinan mundos imaginativos, personajes memorables y relatos que invitan a descubrir cada episodio.',
    categoria: 'ANIME',
    animeRelacionado: 'Frieren: Más allá del final del viaje',
    imagenUrl: ANIMES[0].imagenUrl,
    autor: 'Redacción AnimeNews',
    fechaPublicacion: '2026-06-13',
    destacada: true,
  },
  {
    id: 2,
    titulo: 'Acción sobrenatural: títulos para agregar a tu lista',
    resumen: 'Estas series mezclan combates intensos con personajes que dejan huella.',
    contenido: 'Si buscas una nueva serie para ver, los animes de acción sobrenatural ofrecen aventuras para todos los gustos.',
    categoria: 'RECOMENDACIONES',
    animeRelacionado: 'Jujutsu Kaisen',
    imagenUrl: ANIMES[1].imagenUrl,
    autor: 'Redacción AnimeNews',
    fechaPublicacion: '2026-06-10',
    destacada: false,
  },
  {
    id: 3,
    titulo: 'Cuando la familia más extraña se vuelve la más querida',
    resumen: 'La comedia y la aventura familiar también tienen su lugar en la cartelera.',
    contenido: 'Las historias que equilibran humor, acción y vida cotidiana son una excelente opción para disfrutar en familia.',
    categoria: 'CULTURA',
    animeRelacionado: 'Spy x Family',
    imagenUrl: ANIMES[2].imagenUrl,
    autor: 'Redacción AnimeNews',
    fechaPublicacion: '2026-06-05',
    destacada: false,
  },
];

const MANGAS: Manga[] = [
  {
    id: 1,
    titulo: 'One Piece',
    autor: 'Eiichiro Oda',
    imageUrl: 'https://images.unsplash.com/photo-1614583225154-5fc32b8c2f96?auto=format&fit=crop&w=800&q=80',
    descipcion: 'Monkey D. Luffy y su tripulación recorren los mares en busca del legendario tesoro One Piece.',
    genero: 'Aventura',
  },
  {
    id: 2,
    titulo: 'Berserk',
    autor: 'Kentaro Miura',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    descipcion: 'La historia de Guts, un guerrero que lucha por sobrevivir en un mundo oscuro y peligroso.',
    genero: 'Fantasía oscura',
  },
  {
    id: 3,
    titulo: 'Spy x Family',
    autor: 'Tatsuya Endo',
    imageUrl: 'https://images.unsplash.com/photo-1560972550-abe3b5f9fef4?auto=format&fit=crop&w=800&q=80',
    descipcion: 'Una familia improvisada intenta mantener sus secretos mientras vive divertidas aventuras.',
    genero: 'Comedia',
  },
  {
    id: 4,
    titulo: 'Demon Slayer',
    autor: 'Koyoharu Gotouge',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    descipcion: 'Tanjiro inicia un viaje para salvar a su hermana y proteger a la humanidad de los demonios.',
    genero: 'Acción',
  },
];

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  private readonly capitulos = new Map<number, MangaCapitulo[]>([
    [1, [
      { id: 1, numero: 1, titulo: 'Romance Dawn', descripcion: 'El comienzo de una gran aventura.', fechaPublicacion: '2026-01-01' },
      { id: 2, numero: 2, titulo: 'Aquel chico llamado Luffy', descripcion: 'Un nuevo viaje comienza.', fechaPublicacion: '2026-01-08' },
    ]],
    [2, [
      { id: 3, numero: 1, titulo: 'El espadachín negro', descripcion: 'Una historia de supervivencia.', fechaPublicacion: '2026-01-01' },
    ]],
  ]);
  private siguienteIdCapitulo = 4;

  getDestacados(): Observable<Anime[]> {
    return this.withLocalFallback(
      this.http.get<Anime[]>(`${API_BASE_URL}/animes/destacados`),
      () => of(ANIMES.slice(0, 3)),
    );
  }

  getAnimes(): Observable<Anime[]> {
    return this.withLocalFallback(
      this.http.get<Anime[]>(`${API_BASE_URL}/animes`),
      () => of([...ANIMES]),
    );
  }

  getNoticias(): Observable<Noticia[]> {
    return this.withLocalFallback(
      this.http.get<Noticia[]>(`${API_BASE_URL}/noticias`),
      () => of([...NOTICIAS]),
    );
  }

  getNoticia(id: number): Observable<Noticia> {
    return this.withLocalFallback(
      this.http.get<Noticia>(`${API_BASE_URL}/noticias/${id}`),
      () => {
        const noticia = NOTICIAS.find((item) => item.id === id);
        return noticia ? of({ ...noticia }) : throwError(() => ({ status: 404 }));
      },
    );
  }

  getMangas(): Observable<Manga[]> {
    return this.withLocalFallback(
      this.http.get<Manga[]>(`${API_BASE_URL}/mangas`),
      () => of([...MANGAS]),
    );
  }

  getManga(id: number): Observable<Manga> {
    return this.withLocalFallback(
      this.http.get<Manga>(`${API_BASE_URL}/mangas/${id}`),
      () => {
        const manga = MANGAS.find((item) => item.id === id);
        return manga ? of({ ...manga }) : throwError(() => ({ status: 404 }));
      },
    );
  }

  getCapitulos(mangaId: number): Observable<MangaCapitulo[]> {
    return this.withLocalFallback(
      this.http.get<MangaCapitulo[]>(`${API_BASE_URL}/mangas/${mangaId}/capitulos`),
      () => of([...(this.capitulos.get(mangaId) ?? [])]),
    );
  }

  crearCapitulo(mangaId: number, datos: FormData): Observable<MangaCapitulo> {
    return this.withLocalFallback(
      this.http.post<MangaCapitulo>(`${API_BASE_URL}/mangas/${mangaId}/capitulos`, datos),
      () => of(this.crearCapituloLocal(mangaId, datos)),
    );
  }

  private withLocalFallback<T>(
    request: Observable<T>,
    fallback: () => Observable<T>,
  ): Observable<T> {
    return request.pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          return fallback();
        }
        return throwError(() => error);
      }),
    );
  }

  private crearCapituloLocal(mangaId: number, datos: FormData): MangaCapitulo {
    const file = datos.get('archivoPdf');
    const capitulo: MangaCapitulo = {
      id: this.siguienteIdCapitulo++,
      numero: Number(datos.get('numero')),
      titulo: String(datos.get('titulo') ?? ''),
      descripcion: String(datos.get('descripcion') ?? ''),
      fechaPublicacion: String(datos.get('fechaPublicacion') ?? ''),
      urlLectura: file instanceof File && file.size ? URL.createObjectURL(file) : undefined,
    };
    const capitulosManga = this.capitulos.get(mangaId) ?? [];
    capitulosManga.push(capitulo);
    this.capitulos.set(mangaId, capitulosManga);
    return { ...capitulo };
  }
}
