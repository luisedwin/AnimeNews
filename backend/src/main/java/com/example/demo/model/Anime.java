package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "animes")
public class Anime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descripcion;
    private String imagenUrl;
    private String videoUrl; // Aquí irá el link de YouTube para el modal
    private Double rating;
    private String genero; // "Shonen", "Seinen", "Slice of Life"

    // Constructores
    public Anime() {}

    // Getters y Setters (Puedes generarlos con Alt+Insert en IntelliJ)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
}