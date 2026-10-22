package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "capitulos", uniqueConstraints = {
        @UniqueConstraint(name = "uk_capitulo_manga_numero", columnNames = {"manga_id", "numero"})
})
@Getter
@Setter
@NoArgsConstructor
public class MangaCapitulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer numero;

    @Column(nullable = false)
    private String titulo;

    @Column(length = 5000)
    private String descripcion;

    private LocalDate fechaPublicacion;

    private String urlLectura;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "manga_id", nullable = false)
    @JsonIgnore
    private Manga manga;
}
