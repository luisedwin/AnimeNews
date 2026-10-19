package com.example.demo.service;

import com.example.demo.model.Anime;
import java.util.List;
import java.util.Optional;

public interface AnimeService {
    List<Anime> listarTodos();
    List<Anime> listarDestacados();
    Optional<Anime> obtenerPorId(Long id);
    Anime guardar(Anime anime);
}