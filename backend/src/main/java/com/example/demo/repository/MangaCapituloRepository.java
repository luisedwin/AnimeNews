package com.example.demo.repository;

import com.example.demo.model.MangaCapitulo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MangaCapituloRepository extends JpaRepository<MangaCapitulo, Long> {

    List<MangaCapitulo> findByMangaIdOrderByNumeroAsc(Long mangaId);
}
