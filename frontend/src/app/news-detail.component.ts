import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from './api.service';
import { Noticia } from './models';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
    <main class="container my-5 animate-fade-up">
      <a class="detalle-volver d-inline-block mb-4" routerLink="/noticias"><i class="fas fa-arrow-left me-2"></i>Volver a noticias</a>
      <p *ngIf="loading()" class="text-muted" role="status">Cargando noticia...</p>
      <p *ngIf="error()" class="alert alert-warning" role="alert">{{ error() }}</p>
      <article *ngIf="noticia() as item">
        <section class="detalle-hero mb-4">
          <img *ngIf="item.imagenUrl" class="detalle-hero-imagen" [src]="item.imagenUrl" [alt]="'Imagen: ' + item.titulo">
          <div class="detalle-hero-overlay"></div>
          <div class="detalle-hero-contenido">
            <span class="news-badge">{{ item.categoria || 'ANIME' }}</span>
            <h1>{{ item.titulo }}</h1>
            <div class="detalle-meta">
              <span *ngIf="item.animeRelacionado"><i class="fas fa-tv"></i>Anime: {{ item.animeRelacionado }}</span>
              <span *ngIf="item.autor"><i class="fas fa-user"></i>Por {{ item.autor }}</span>
              <time *ngIf="item.fechaPublicacion" [attr.datetime]="item.fechaPublicacion">{{ item.fechaPublicacion | date:'long':'':'es' }}</time>
            </div>
          </div>
        </section>
        <section class="detalle-articulo">
          <p *ngIf="item.resumen" class="detalle-resumen">{{ item.resumen }}</p>
          <div class="detalle-contenido mt-4">{{ item.contenido || item.resumen || 'Esta noticia todavía no tiene contenido.' }}</div>
        </section>
      </article>
    </main>
  `,
  styles: [`
    .detalle-hero{position:relative;min-height:clamp(340px,55vw,620px);overflow:hidden;border:1px solid rgba(255,51,102,.3);border-radius:14px;background:#18181b;box-shadow:0 10px 30px #0008,0 0 20px #ff33661a}
    .detalle-hero-imagen{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .detalle-hero-overlay{position:absolute;inset:0;background:linear-gradient(0deg,rgba(13,13,15,.98),rgba(13,13,15,.12) 85%)}
    .detalle-hero-contenido{position:absolute;inset:auto 0 0;padding:clamp(24px,6vw,56px)}
    .detalle-hero h1{max-width:950px;margin:16px 0;color:#fff;font:800 clamp(2rem,5vw,3.5rem)/1.15 'Poppins',sans-serif}
    .detalle-meta{display:flex;flex-wrap:wrap;gap:12px 24px;color:#d4d4d8}
    .detalle-meta i{color:#ff3366;margin-right:7px}
    .detalle-articulo{background:#18181b;border:1px solid #ffffff0f;border-radius:12px;padding:clamp(24px,5vw,48px)}
    .detalle-resumen{color:#e4e4e7;font-size:1.15rem;line-height:1.8;border-left:3px solid #ff3366;padding-left:18px}
    .detalle-contenido{color:#c4c4cc;font-size:1.05rem;line-height:1.95;white-space:pre-line;overflow-wrap:anywhere}
    .detalle-volver{color:#ff6689;text-decoration:none;font-weight:600}
    .detalle-volver:hover{color:#fff}
  `],
})
export class NewsDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  readonly noticia = signal<Noticia | undefined>(undefined);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error.set('El identificador de la noticia no es válido.');
      this.loading.set(false);
      return;
    }
    this.api.getNoticia(id).subscribe({
      next: (noticia) => {
        this.noticia.set(noticia);
        document.title = `${noticia.titulo || 'Noticia'} - AnimeNews`;
        this.loading.set(false);
      },
      error: (error: { status?: number }) => {
        this.error.set(error.status === 404
          ? 'No encontramos esa noticia.'
          : 'No se pudo cargar la noticia. Intenta nuevamente más tarde.');
        this.loading.set(false);
      },
    });
  }
}
