package com.example.demo.service;

import com.example.demo.model.MangaCapitulo;
import com.example.demo.model.Manga;
import com.example.demo.repository.MangaCapituloRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MangaCapituloService {

    private final MangaCapituloRepository mangaCapituloRepository;

    public MangaCapituloService(MangaCapituloRepository mangaCapituloRepository) {
        this.mangaCapituloRepository = mangaCapituloRepository;
    }

    public List<MangaCapitulo> obtenerPorManga(Long mangaId) {
        return mangaCapituloRepository.findByMangaIdOrderByNumeroAsc(mangaId);
    }

    public MangaCapitulo guardar(Manga manga, MangaCapitulo capitulo) {
        capitulo.setId(null);
        manga.agregarCapitulo(capitulo);
        return mangaCapituloRepository.save(capitulo);
    }
}
