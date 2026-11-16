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
  templateUrl: './releases.component.html',
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
