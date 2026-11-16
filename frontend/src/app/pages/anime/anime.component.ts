import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { Anime } from '../../models';
import { toYouTubeEmbedUrl } from '../../video-url';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './anime.component.html',
  styles: [`
    .video-backdrop{position:fixed;inset:0;z-index:1100;display:grid;place-items:center;padding:1rem;background:#000c}
    .video-dialog{width:min(1100px,100%);padding:1rem;background:#18181b;border:1px solid #444;border-radius:12px}
    .video-dialog .btn-close{display:block;margin-bottom:1rem}
    .search-box{display:flex;align-items:center;gap:.5rem}
    .search-box input{min-width:220px}
    .hero-buttons .btn-more-info{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:50px;padding:12px 24px;border:1px solid rgba(255,255,255,.38);border-radius:50px;color:#fff;font-size:.98rem;font-weight:700;line-height:1;text-decoration:none;background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.06));box-shadow:0 6px 20px rgba(0,0,0,.24);transition:transform .25s ease,border-color .25s ease,background .25s ease,box-shadow .25s ease}
    .hero-buttons .btn-more-info i{display:grid;width:27px;height:27px;place-items:center;border-radius:50%;background:rgba(255,255,255,.17);font-size:.75rem;transition:transform .25s ease,background .25s ease}
    .hero-buttons .btn-more-info:hover{color:#fff;border-color:#ff4d6d;background:linear-gradient(135deg,rgba(255,51,102,.38),rgba(255,255,255,.12));box-shadow:0 9px 26px rgba(255,51,102,.25);transform:translateY(-3px)}
    .hero-buttons .btn-more-info:hover i{background:#ff3366;transform:translateX(3px)}
    .hero-buttons .btn-more-info:focus-visible{outline:3px solid #fff;outline-offset:4px}
    @media (max-width:480px){.hero-buttons .btn-more-info{padding:11px 18px;font-size:.92rem}}
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
    const embedUrl = toYouTubeEmbedUrl(url);
    if (!embedUrl) {
      this.videoUrl.set(null);
      this.videoError.set('El enlace del video no es válido o no está permitido.');
      return;
    }

    this.videoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl));
    this.videoError.set('');
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
