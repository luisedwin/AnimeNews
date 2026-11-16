import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Anime } from './models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container my-4 animate-fade-up">
      <section class="hero">
        <img class="hero-img" src="https://a.storyblok.com/f/178900/1920x1080/cdf83a3e19/solo-leveling-season-2-key-visual-wide.png" alt="Solo Leveling temporada 2">
        <div class="hero-content">
          <span class="custom-badge">🔥 DESTACADO</span>
          <h2>Solo Leveling: fecha confirmada para la segunda temporada</h2>
          <div class="hero-meta"><span><i class="far fa-calendar-alt"></i> 13 de junio, 2026</span></div>
          <p>El regreso del cazador más fuerte del mundo llega en octubre con nuevo estudio y prometedor tráiler.</p>
          <a class="btn-custom" routerLink="/noticias">Leer más →</a>
        </div>
      </section>
      <div class="row g-4 mt-2">
        <section class="col-lg-8 main-news">
          <div class="section-title">Últimas Noticias y Estrenos</div>
          <p *ngIf="error()" class="alert alert-warning" role="status">{{ error() }}</p>
          <div class="cards-grid">
            <article class="custom-card" *ngFor="let anime of animes(); trackBy: trackAnime">
              <img class="card-img" [src]="anime.imagenUrl || ''" [alt]="anime.titulo" loading="lazy">
              <div class="card-content">
                <span class="card-category">{{ anime.genero || 'ANIME' }}</span>
                <h3>{{ anime.titulo }}</h3>
                <p>{{ anime.descripcion }}</p>
                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-secondary">
                  <span class="fw-bold text-warning">⭐ {{ anime.rating ?? '—' }}</span>
                  <span class="card-date">Destacado</span>
                </div>
              </div>
            </article>
          </div>
          <p *ngIf="!loading() && !error() && !animes().length" class="text-muted">Todavía no hay animes destacados.</p>
        </section>
        <aside class="col-lg-4 sidebar">
          <div class="custom-widget">
            <h3><i class="fas fa-fire"></i> Tendencias</h3>
            <ul class="trending-list">
              <li><span class="trending-num">1</span> Chainsaw Man – Reze regresa</li>
              <li><span class="trending-num">2</span> Kaiju No. 8 – tráiler oficial</li>
              <li><span class="trending-num">3</span> Jujutsu Kaisen – Nueva temporada</li>
            </ul>
          </div>
          <div class="custom-widget">
            <h3><i class="fas fa-share-alt"></i> Síguenos</h3>
            <div class="social-icons"><a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a><a href="#" aria-label="Discord"><i class="fab fa-discord"></i></a><a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a></div>
          </div>
        </aside>
      </div>
    </main>
  `,
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly animes = signal<Anime[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  trackAnime(_index: number, anime: Anime): number {
    return anime.id;
  }

  ngOnInit(): void {
    this.api.getDestacados().subscribe({
      next: (animes) => {
        this.animes.set(animes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los animes destacados.');
        this.loading.set(false);
      },
    });
  }
}
