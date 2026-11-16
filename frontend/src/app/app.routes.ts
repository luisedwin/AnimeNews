import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/inicio/home.component').then((module) => module.HomeComponent), title: 'AnimeNews - Inicio' },
  { path: 'noticias', loadComponent: () => import('./pages/noticias/news.component').then((module) => module.NewsComponent), title: 'Noticias - AnimeNews' },
  { path: 'detalle-noticias/:id', loadComponent: () => import('./pages/noticias/news-detail.component').then((module) => module.NewsDetailComponent), title: 'Detalle de noticia - AnimeNews' },
  { path: 'estrenos', loadComponent: () => import('./pages/estrenos/releases.component').then((module) => module.ReleasesComponent), title: 'Estrenos - AnimeNews' },
  { path: 'anime', loadComponent: () => import('./pages/anime/anime.component').then((module) => module.AnimeComponent), title: 'Anime - AnimeNews' },
  { path: 'manga', loadComponent: () => import('./pages/manga/manga.component').then((module) => module.MangaComponent), title: 'Manga - AnimeNews' },
  { path: 'manga/:id', loadComponent: () => import('./pages/manga/manga-detail.component').then((module) => module.MangaDetailComponent), title: 'Detalle del manga - AnimeNews' },
  { path: '**', redirectTo: '' },
];
