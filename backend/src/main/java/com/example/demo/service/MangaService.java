package com.example.demo.service;

import com.example.demo.model.Manga;
import com.example.demo.repository.MangaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MangaService {

    private final MangaRepository mangaRepository;

    public MangaService(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }

    public List<Manga> obtenerTodos() {
        return mangaRepository.findAll();
    }

    public Optional<Manga> obtenerPorId(Long id) {
        return mangaRepository.findById(id);
    }

    public Manga guardar(Manga manga) {
        return mangaRepository.save(manga);
    }

    public void eliminar(Long id) {
        mangaRepository.deleteById(id);
    }
}
