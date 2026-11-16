import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from './api.service';
import { Noticia } from './models';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container my-5 animate-fade-up">
      <div class="row g-4">
        <div class="col-lg-8">
          <p *ngIf="loading()" class="text-muted" role="status">Cargando noticias...</p>
          <p *ngIf="error()" class="alert alert-warning" role="alert">{{ error() }}</p>
          <article class="news-hero-card mb-4" *ngIf="destacada() as noticia">
            <img *ngIf="noticia.imagenUrl" [src]="noticia.imagenUrl" [alt]="noticia.titulo">
            <div class="card-overlay"></div>
            <div class="card-content">
              <span class="news-badge">DESTACADO</span>
              <h2>{{ noticia.titulo }}</h2>
              <p>{{ noticia.resumen }}</p>
              <a class="btn-news-primary" [routerLink]="['/detalle-noticias', noticia.id]">Leer Artículo <i class="fas fa-arrow-right ms-2"></i></a>
            </div>
          </article>
          <div class="row g-4">
            <div class="col-md-6" *ngFor="let noticia of restantes(); trackBy: trackNoticia">
              <article class="news-standard-card">
                <a class="noticia-card-link" [routerLink]="['/detalle-noticias', noticia.id]" [attr.aria-label]="'Leer noticia: ' + noticia.titulo">
                  <div class="img-wrapper" *ngIf="noticia.imagenUrl"><img [src]="noticia.imagenUrl" [alt]="noticia.titulo" loading="lazy"></div>
                  <div class="content">
                    <span class="category">{{ noticia.categoria || 'ANIME' }}</span>
                    <h3>{{ noticia.titulo }}</h3>
                    <p>{{ noticia.resumen }}</p>
                  </div>
                </a>
              </article>
            </div>
          </div>
          <p *ngIf="!loading() && !error() && !noticias().length" class="text-muted">Todavía no hay noticias publicadas.</p>
        </div>
        <aside class="col-lg-4">
          <div class="news-sidebar-widget mb-4">
            <h3 class="widget-title"><i class="fas fa-chart-line text-primary me-2"></i> Lo más leído</h3>
            <ul class="most-read-list">
              <li *ngFor="let noticia of topNoticias(); let i = index; trackBy: trackNoticia">
                <span class="number">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <div class="info"><h4><a [routerLink]="['/detalle-noticias', noticia.id]">{{ noticia.titulo }}</a></h4></div>
              </li>
            </ul>
          </div>
          <div class="news-sidebar-widget newsletter-box text-center">
            <i class="fas fa-envelope newsletter-icon"></i>
            <h3 class="mt-3 mb-2 text-white">Boletín Informativo</h3>
            <p class="text-muted small mb-4">Recibe las últimas noticias y estrenos directamente en tu correo.</p>
            <form (submit)="$event.preventDefault()">
              <input type="email" class="form-control newsletter-input mb-3" placeholder="Tu correo electrónico" aria-label="Tu correo electrónico">
              <button type="submit" class="btn-news-primary w-100">SUSCRIBIRSE</button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  `,
})
export class NewsComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly noticias = signal<Noticia[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly destacada = computed(() => this.noticias().find((noticia) => noticia.destacada));
  readonly restantes = computed(() => {
    const destacada = this.destacada();
    return destacada ? this.noticias().filter((noticia) => noticia.id !== destacada.id) : this.noticias();
  });
  readonly topNoticias = computed(() => this.noticias().slice(0, 4));

  trackNoticia(_index: number, noticia: Noticia): number {
    return noticia.id;
  }

  ngOnInit(): void {
    this.api.getNoticias().subscribe({
      next: (noticias) => {
        this.noticias.set(noticias);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las noticias. Intenta nuevamente más tarde.');
        this.loading.set(false);
      },
    });
  }
}
