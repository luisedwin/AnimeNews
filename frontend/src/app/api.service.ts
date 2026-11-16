import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Anime, Manga, MangaCapitulo, Noticia } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  getDestacados(): Observable<Anime[]> {
    return this.http.get<Anime[]>('/api/animes/destacados');
  }

  getAnimes(): Observable<Anime[]> {
    return this.http.get<Anime[]>('/api/animes');
  }

  getNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>('/api/noticias');
  }

  getNoticia(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`/api/noticias/${id}`);
  }

  getMangas(): Observable<Manga[]> {
    return this.http.get<Manga[]>('/api/mangas');
  }

  getManga(id: number): Observable<Manga> {
    return this.http.get<Manga>(`/api/mangas/${id}`);
  }

  getCapitulos(mangaId: number): Observable<MangaCapitulo[]> {
    return this.http.get<MangaCapitulo[]>(`/api/mangas/${mangaId}/capitulos`);
  }

  crearCapitulo(mangaId: number, datos: FormData): Observable<MangaCapitulo> {
    return this.http.post<MangaCapitulo>(`/api/mangas/${mangaId}/capitulos`, datos);
  }
}
