package com.example.demo.repository;

import com.example.demo.model.Anime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnimeRepository extends JpaRepository<Anime, Long> {
    // Método para buscar por género (útil para los filtros)
    List<Anime> findByGenero(String genero);
}