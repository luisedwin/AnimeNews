package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "animes")
public class Index {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String genero;

    @Column(name = "imagen_url")
    private String imagenUrl;

    @Column(name = "video_url")
    private String videoUrl;

    private Double rating;

    public Index() {}

    public Index(String titulo, String descripcion, String genero, String imagenUrl, String videoUrl, Double rating) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.genero = genero;
        this.imagenUrl = imagenUrl;
        this.videoUrl = videoUrl;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }
}