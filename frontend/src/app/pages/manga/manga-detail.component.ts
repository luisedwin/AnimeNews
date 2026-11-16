import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { Manga, MangaCapitulo } from '../../models';

@Component({
  selector: 'app-manga-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manga-detail.component.html',
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
