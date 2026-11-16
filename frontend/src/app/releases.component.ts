import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Estreno {
  titulo: string;
  genero: string;
  dia: string;
  imagen: string;
  temporada: string;
  anio: number;
}

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container my-5 animate-fade-up">
      <div class="estrenos-header mb-4">
        <h2 class="display-5 fw-bold font-heading text-white">Estrenos</h2>
        <div class="subtitle-border"><p class="mb-0">Descubre los animes más esperados de la temporada.</p></div>
      </div>
      <div class="filter-bar d-flex flex-wrap align-items-center justify-content-between p-3 mb-5 rounded">
        <div class="d-flex flex-wrap gap-3">
          <select class="form-select bg-dark text-white border-secondary w-auto" [ngModel]="temporada()" (ngModelChange)="temporada.set($event)">
            <option value="">Temporada: Todas</option><option>Primavera</option><option>Verano</option><option>Otoño</option><option>Invierno</option>
          </select>
          <select class="form-select bg-dark text-white border-secondary w-auto" [ngModel]="anio()" (ngModelChange)="anio.set($event)">
            <option value="">Año: Todos</option><option value="2026">2026</option><option value="2025">2025</option><option value="2024">2024</option>
          </select>
          <select class="form-select bg-dark text-white border-secondary w-auto" [ngModel]="genero()" (ngModelChange)="genero.set($event)">
            <option value="">Género: Todos</option><option>Shonen</option><option>Isekai</option><option>Seinen</option><option>Fantasy</option><option>Mecha</option>
          </select>
        </div>
        <button class="btn btn-outline-light mt-3 mt-md-0" type="button" (click)="clearFilters()"><i class="fas fa-filter me-2"></i>Limpiar filtros</button>
      </div>
      <div class="cards-grid">
        <article class="card dark-card" *ngFor="let estreno of filtered(); trackBy: trackEstreno">
          <div class="card-img card-img-full position-relative" [style.background-image]="'url(' + estreno.imagen + ')'" style="height:400px">
            <span class="custom-badge position-absolute top-0 start-0 m-3 shadow" *ngIf="estreno === estrenos[0]">🔥 DESTACADO</span>
          </div>
          <div class="card-content text-white">
            <span class="card-category text-primary">{{ estreno.genero }}</span>
            <h3 class="font-heading fs-5 mt-2 mb-0">{{ estreno.titulo }}</h3>
          </div>
          <div class="card-footer-custom">
            <span class="text-muted small"><i class="far fa-calendar-alt me-1"></i>{{ estreno.temporada }} {{ estreno.anio }} · {{ estreno.dia }}</span>
            <button class="bookmark-btn" type="button" [attr.aria-label]="'Guardar ' + estreno.titulo"><i class="far fa-bookmark"></i></button>
          </div>
        </article>
      </div>
      <p *ngIf="!filtered().length" class="text-muted text-center">No hay estrenos que coincidan con los filtros.</p>
    </main>
  `,
})
export class ReleasesComponent {
  readonly temporada = signal('');
  readonly anio = signal('');
  readonly genero = signal('');
  readonly estrenos: Estreno[] = [
    { titulo: 'Lord Of Mistery', genero: 'DARK FANTASY', dia: 'Sábados', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVNujp_l9PzYgB6j8kOG5BvBk2I1WtgQVB9MWfbntIpg&s=10', temporada: 'Primavera', anio: 2026 },
    { titulo: 'Neon Genesis Overture', genero: 'MECHA', dia: 'Domingos', imagen: 'https://static.wikia.nocookie.net/evangelion/images/d/d2/Neon_Genesis_Evangelion_Platinum.jpg/revision/latest?cb=20230829054407&path-prefix=es', temporada: 'Primavera', anio: 2026 },
    { titulo: 'Reincarnated as a Grand Magus', genero: 'ISEKAI', dia: 'Miércoles', imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXOPJggfGt9_UNntOWus_XbjYqZlRdW5OTRtsmD_gzZPApVG1c6yI4upN9&s=10', temporada: 'Verano', anio: 2025 },
    { titulo: 'El regreso del cazador de suicidios clase SSS', genero: 'FANTASY / SHONEN', dia: 'Viernes', imagen: 'https://m.media-amazon.com/images/I/91vQnWvGC-L._AC_UF1000,1000_QL80_.jpg', temporada: 'Otoño', anio: 2025 },
  ];

  readonly filtered = computed(() => {
    const temporada = this.temporada();
    const anio = this.anio();
    const genero = this.genero();
    return this.estrenos.filter((estreno) =>
      (!temporada || estreno.temporada === temporada) &&
      (!anio || estreno.anio === Number(anio)) &&
      (!genero || estreno.genero.toLowerCase().includes(genero.toLowerCase())),
    );
  });

  trackEstreno(_index: number, estreno: Estreno): string {
    return estreno.titulo;
  }

  clearFilters(): void {
    this.temporada.set('');
    this.anio.set('');
    this.genero.set('');
  }
}
