import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';
import { Anime } from './models';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="anime-hero animate-fade-up">
      <div class="hero-bg" style="background-image:url('https://imgmedia.larepublica.pe/1000x590/larepublica/original/2022/06/19/62afabbd119a8801813a5692.webp')"></div>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <span class="hero-badge">DESTACADO</span>
        <h1>Chainsaw Man: La Nueva Era del Shonen</h1>
        <p>Tras una espera agónica, Denji regresa para revolucionar la industria del anime con una animación sin precedentes. Descubre por qué esta temporada está rompiendo todos los récords de audiencia global.</p>
        <div class="hero-buttons">
          <button class="btn-primary-glow" type="button" (click)="openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ')"><i class="fas fa-play"></i> Ver Ahora</button>
          <a class="btn-glass" routerLink="/noticias">Más Información</a>
        </div>
      </div>
    </section>
    <main class="container my-5 animate-fade-up">
      <div class="d-flex justify-content-end mb-4">
        <label class="search-box" role="search">
          <input type="search" [ngModel]="search()" (ngModelChange)="search.set($event)" placeholder="Buscar anime..." aria-label="Buscar anime">
          <i class="fas fa-search" aria-hidden="true"></i>
        </label>
      </div>
      <p *ngIf="loading()" class="text-muted" role="status">Cargando animes...</p>
      <p *ngIf="error()" class="alert alert-warning" role="alert">{{ error() }}</p>
      <p *ngIf="videoError()" class="alert alert-warning" role="alert">{{ videoError() }}</p>
      <p *ngIf="!loading() && !error() && !filteredGroups().length" class="text-center py-5">
        <i class="fas fa-search mb-3" style="font-size:3rem;color:var(--anime-primary)"></i>
        <span class="d-block">No se encontraron animes</span>
        <small class="text-muted">Intenta con otro título.</small>
      </p>
      <section class="content-section mb-5 seccion-genero" *ngFor="let group of filteredGroups(); trackBy: trackGroup">
        <div class="section-header d-flex justify-content-between align-items-end mb-4"><h2>{{ group.genero }}</h2></div>
        <div class="crunchy-carousel">
          <article class="crunchy-card" *ngFor="let anime of group.animes; trackBy: trackAnime" (click)="openVideo(anime.videoUrl)">
            <div class="crunchy-img-wrapper">
              <img [src]="anime.imagenUrl || ''" [alt]="anime.titulo" loading="lazy">
              <button class="btn-favorito" type="button" [attr.aria-label]="isFavorite(anime) ? 'Quitar de favoritos' : 'Agregar a favoritos'" (click)="$event.stopPropagation(); toggleFavorite(anime)">
                <i [class]="isFavorite(anime) ? 'fas fa-heart text-danger' : 'far fa-heart text-white'"></i>
              </button>
              <div class="crunchy-overlay">
                <h3 class="titulo-anime">{{ anime.titulo }}</h3>
                <span class="crunchy-meta">⭐ {{ anime.rating ?? '—' }} | {{ anime.genero || 'Anime' }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
    <div class="video-backdrop" *ngIf="videoUrl()" (click)="closeVideo()" role="presentation">
      <section class="video-dialog" role="dialog" aria-modal="true" aria-label="Reproductor de anime" (click)="$event.stopPropagation()">
        <button class="btn-close btn-close-white ms-auto" type="button" (click)="closeVideo()" aria-label="Cerrar"></button>
        <div class="ratio ratio-16x9"><iframe [src]="videoUrl()" title="Reproductor de video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
      </section>
    </div>
    <div class="music-player-widget">
      <audio #audioPlayer loop><source src="/music/music.mp3" type="audio/mpeg"></audio>
      <button class="music-toggle-btn" type="button" (click)="toggleMusic(audioPlayer)">
        <i [class]="musicPlaying() ? 'fas fa-pause' : 'fas fa-play'"></i>
        <span>{{ musicPlaying() ? 'Pausar' : 'Activar' }}</span>
      </button>
      <div class="volume-control">
        <i class="fas fa-volume-down text-white text-opacity-75"></i>
        <input type="range" min="0" max="1" step="0.05" [value]="volume()" (input)="setVolume(audioPlayer, $event)" class="volume-slider" aria-label="Volumen">
      </div>
    </div>
  `,
  styles: [`
    .video-backdrop{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:1rem;background:#000c}
    .video-dialog{width:min(1100px,100%);padding:1rem;background:#18181b;border:1px solid #444;border-radius:12px}
    .video-dialog .btn-close{display:block;margin-bottom:1rem}
    .search-box{display:flex;align-items:center;gap:.5rem}
    .search-box input{min-width:220px}
  `],
})
export class AnimeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly animes = signal<Anime[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly search = signal('');
  readonly videoUrl = signal<SafeResourceUrl | null>(null);
  readonly videoError = signal('');
  readonly musicPlaying = signal(false);
  readonly volume = signal(0.3);
  private readonly favoriteIds = signal(this.readFavorites());
  readonly filteredGroups = computed(() => {
    const query = this.search().trim().toLocaleLowerCase();
    const groups = new Map<string, Anime[]>();
    for (const anime of this.animes()) {
      if (query && !anime.titulo.toLocaleLowerCase().includes(query)) continue;
      const genero = anime.genero || 'Otros';
      const animesPorGenero = groups.get(genero);
      if (animesPorGenero) {
        animesPorGenero.push(anime);
      } else {
        groups.set(genero, [anime]);
      }
    }
    return Array.from(groups, ([genero, animes]) => ({ genero, animes }));
  });

  trackAnime(_index: number, anime: Anime): number {
    return anime.id;
  }

  trackGroup(_index: number, group: { genero: string }): string {
    return group.genero;
  }

  ngOnInit(): void {
    this.api.getAnimes().subscribe({
      next: (animes) => {
        this.animes.set(animes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los animes.');
        this.loading.set(false);
      },
    });
  }

  isFavorite(anime: Anime): boolean {
    return this.favoriteIds().includes(String(anime.id));
  }

  toggleFavorite(anime: Anime): void {
    const id = String(anime.id);
    const favorites = this.favoriteIds();
    const updated = favorites.includes(id)
      ? favorites.filter((favorite) => favorite !== id)
      : [...favorites, id];
    this.favoriteIds.set(updated);
    try {
      localStorage.setItem('favoritosAnime', JSON.stringify(updated));
    } catch {
      this.error.set('No se pudieron guardar los favoritos en este navegador.');
    }
  }

  openVideo(url?: string): void {
    if (!url) {
      this.videoError.set('Este anime no tiene un video disponible.');
      return;
    }
    try {
      const parsed = new URL(url);
      const hostsPermitidos = ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'];
      if (parsed.protocol === 'https:' && hostsPermitidos.includes(parsed.hostname) && parsed.pathname.startsWith('/embed/')) {
        this.videoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(parsed.toString()));
        this.videoError.set('');
        return;
      }
    } catch {
      this.videoError.set('El enlace del video no es válido o no está permitido.');
      return;
    }
    this.videoUrl.set(null);
    this.videoError.set('El enlace del video no es válido o no está permitido.');
  }

  closeVideo(): void {
    this.videoUrl.set(null);
  }

  async toggleMusic(audio: HTMLAudioElement): Promise<void> {
    if (this.musicPlaying()) {
      audio.pause();
      this.musicPlaying.set(false);
      return;
    }
    audio.volume = this.volume();
    try {
      await audio.play();
      this.musicPlaying.set(true);
    } catch {
      this.error.set('No se pudo reproducir la música. Comprueba el archivo de audio e inténtalo de nuevo.');
    }
  }

  setVolume(audio: HTMLAudioElement, event: Event): void {
    const volume = Number((event.target as HTMLInputElement).value);
    this.volume.set(volume);
    audio.volume = volume;
  }

  private readFavorites(): string[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem('favoritosAnime') || '[]');
      return Array.isArray(stored) ? stored.map(String) : [];
    } catch {
      this.error.set('No se pudieron leer los favoritos guardados en este navegador.');
      return [];
    }
  }
}
