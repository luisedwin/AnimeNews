import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from './api.service';
import { Manga, MangaCapitulo } from './models';

@Component({
  selector: 'app-manga-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container manga-detail-page">
      <a routerLink="/manga" class="d-inline-block my-4"><i class="fas fa-arrow-left me-2"></i>Volver a mangas</a>
      <p *ngIf="loading()" class="text-muted" role="status">Cargando manga...</p>
      <p *ngIf="error()" class="alert alert-warning" role="alert">{{ error() }}</p>
      <ng-container *ngIf="manga() as item">
        <article class="manga-detail">
          <div class="manga-detail-cover"><img [src]="item.imageUrl || ''" [alt]="item.titulo" fetchpriority="high"></div>
          <div class="manga-detail-content">
            <span class="manga-badge">DETALLE DEL MANGA</span>
            <h1>{{ item.titulo }}</h1>
            <dl class="manga-detail-meta">
              <div><dt>Autor</dt><dd>{{ item.autor || 'No especificado' }}</dd></div>
              <div><dt>Género</dt><dd>{{ item.genero || 'No especificado' }}</dd></div>
              <div><dt>ID</dt><dd>{{ item.id }}</dd></div>
            </dl>
            <section class="manga-detail-description"><h2>Sinopsis</h2><p>{{ item.descipcion || 'No hay una descripción disponible para este manga.' }}</p></section>
          </div>
        </article>

        <section class="manga-chapters" aria-labelledby="chapters-heading">
          <details class="manga-chapter-form-panel">
            <summary>Agregar capítulo</summary>
            <form class="manga-chapter-form" (submit)="saveChapter($event)">
              <div class="manga-chapter-form-grid">
                <label>Número del capítulo<input type="number" name="numero" min="1" step="1" required></label>
                <label>Título<input type="text" name="titulo" maxlength="255" required></label>
                <label>Fecha de publicación<input type="date" name="fechaPublicacion"></label>
                <label>Archivo PDF (máximo 25 MB)<input type="file" name="archivoPdf" accept="application/pdf,.pdf" required></label>
                <label class="manga-chapter-form-description">Descripción<textarea name="descripcion" rows="3" maxlength="5000"></textarea></label>
              </div>
              <div class="manga-chapter-form-actions">
                <button type="submit" class="manga-chapter-read" [disabled]="saving()">Guardar capítulo</button>
                <p class="manga-chapter-form-message" [class.is-error]="messageIsError()" role="status" aria-live="polite">{{ message() }}</p>
              </div>
            </form>
          </details>
          <div class="manga-chapters-heading">
            <div><span class="manga-badge">LECTURA</span><h2 id="chapters-heading">Capítulos</h2></div>
            <span class="manga-chapter-count">{{ chapterCount() }} capítulos</span>
          </div>
          <ol class="manga-chapter-list" *ngIf="capitulos().length">
            <li class="manga-chapter-item" *ngFor="let capitulo of capitulos(); trackBy: trackCapitulo">
              <div class="manga-chapter-number">Capítulo {{ capitulo.numero }}</div>
              <div class="manga-chapter-info">
                <h3>{{ capitulo.titulo }}</h3>
                <p *ngIf="capitulo.descripcion">{{ capitulo.descripcion }}</p>
                <time *ngIf="capitulo.fechaPublicacion" [attr.datetime]="capitulo.fechaPublicacion">{{ capitulo.fechaPublicacion }}</time>
              </div>
              <a *ngIf="capitulo.urlLectura" class="manga-chapter-read" [href]="capitulo.urlLectura" target="_blank" rel="noopener noreferrer" aria-label="Abrir capítulo para leer">Leer <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i></a>
            </li>
          </ol>
          <p class="manga-chapters-empty" *ngIf="!chaptersLoading() && !capitulos().length">Todavía no hay capítulos registrados para este manga.</p>
        </section>
      </ng-container>
    </main>
  `,
})
export class MangaDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  readonly manga = signal<Manga | undefined>(undefined);
  readonly capitulos = signal<MangaCapitulo[]>([]);
  readonly loading = signal(true);
  readonly chaptersLoading = signal(true);
  readonly error = signal('');
  readonly saving = signal(false);
  readonly message = signal('Si el backend no está disponible, los cambios solo se guardarán durante esta sesión.');
  readonly messageIsError = signal(false);
  readonly chapterCount = computed(() => this.capitulos().length);

  trackCapitulo(_index: number, capitulo: MangaCapitulo): number {
    return capitulo.id;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isSafeInteger(id) || id < 1) {
      this.error.set('El identificador del manga no es válido.');
      this.loading.set(false);
      this.chaptersLoading.set(false);
      return;
    }
    this.api.getManga(id).subscribe({
      next: (manga) => {
        this.manga.set(manga);
        document.title = `${manga.titulo} - AnimeNews`;
        this.loading.set(false);
      },
      error: (error: { status?: number }) => {
        this.error.set(error.status === 404 ? 'No encontramos ese manga.' : 'No se pudo cargar el manga.');
        this.loading.set(false);
      },
    });
    this.loadChapters(id);
  }

  saveChapter(event: Event): void {
    event.preventDefault();
    const form = event.target;
    const manga = this.manga();
    if (!(form instanceof HTMLFormElement) || !manga) return;
    const file = (form.elements.namedItem('archivoPdf') as HTMLInputElement).files?.[0];
    if (!file || file.size > 25 * 1024 * 1024 || file.type !== 'application/pdf') {
      this.setMessage('Selecciona un archivo PDF válido de hasta 25 MB.', true);
      return;
    }
    this.saving.set(true);
    this.messageIsError.set(false);
    this.message.set('Guardando capítulo...');
    const formData = new FormData(form);
    this.api.crearCapitulo(manga.id, formData).subscribe({
      next: () => {
        this.setMessage('Capítulo guardado correctamente.', false);
        this.saving.set(false);
        form.reset();
        this.loadChapters(manga.id);
      },
      error: () => {
        this.setMessage('No se pudo guardar el capítulo. Revisa los datos e inténtalo de nuevo.', true);
        this.saving.set(false);
      },
    });
  }

  private loadChapters(id: number): void {
    this.api.getCapitulos(id).subscribe({
      next: (capitulos) => {
        this.capitulos.set(capitulos);
        this.chaptersLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los capítulos.');
        this.chaptersLoading.set(false);
      },
    });
  }

  private setMessage(message: string, isError: boolean): void {
    this.message.set(message);
    this.messageIsError.set(isError);
  }
}
