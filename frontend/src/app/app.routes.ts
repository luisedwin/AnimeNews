import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home.component').then((module) => module.HomeComponent), title: 'AnimeNews - Inicio' },
  { path: 'noticias', loadComponent: () => import('./news.component').then((module) => module.NewsComponent), title: 'Noticias - AnimeNews' },
  { path: 'detalle-noticias/:id', loadComponent: () => import('./news-detail.component').then((module) => module.NewsDetailComponent), title: 'Detalle de noticia - AnimeNews' },
  { path: 'estrenos', loadComponent: () => import('./releases.component').then((module) => module.ReleasesComponent), title: 'Estrenos - AnimeNews' },
  { path: 'anime', loadComponent: () => import('./anime.component').then((module) => module.AnimeComponent), title: 'Anime - AnimeNews' },
  { path: 'manga', loadComponent: () => import('./manga.component').then((module) => module.MangaComponent), title: 'Manga - AnimeNews' },
  { path: 'manga/:id', loadComponent: () => import('./manga-detail.component').then((module) => module.MangaDetailComponent), title: 'Detalle del manga - AnimeNews' },
  { path: '**', redirectTo: '' },
];
