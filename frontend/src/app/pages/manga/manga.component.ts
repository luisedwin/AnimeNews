import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { Manga } from '../../models';

@Component({
  selector: 'app-manga',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './manga.component.html',
})
export class MangaComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly mangas = signal<Manga[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly destacado = computed(() => this.mangas()[0]);

  trackManga(_index: number, manga: Manga): number {
    return manga.id;
  }

  ngOnInit(): void {
    this.api.getMangas().subscribe({
      next: (mangas) => {
        this.mangas.set(mangas);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los mangas.');
        this.loading.set(false);
      },
    });
  }
}
