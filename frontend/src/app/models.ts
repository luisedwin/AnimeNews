export interface Anime {
  id: number;
  titulo: string;
  descripcion?: string;
  genero?: string;
  imagenUrl?: string;
  videoUrl?: string;
  rating?: number;
}

export interface Noticia {
  id: number;
  titulo: string;
  resumen: string;
  contenido?: string;
  categoria?: string;
  animeRelacionado?: string;
  imagenUrl?: string;
  autor?: string;
  fechaPublicacion?: string;
  destacada: boolean;
}

export interface Manga {
  id: number;
  titulo: string;
  autor?: string;
  imageUrl?: string;
  descipcion?: string;
  genero?: string;
}

export interface MangaCapitulo {
  id: number;
  numero: number;
  titulo: string;
  descripcion?: string;
  fechaPublicacion?: string;
  urlLectura?: string;
}
