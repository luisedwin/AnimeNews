import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../api.service';
import { Anime } from '../../models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
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
