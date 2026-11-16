import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { Noticia } from '../../models';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.component.html',
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
