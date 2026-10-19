package com.example.demo.service;

import com.example.demo.model.Anime;
import com.example.demo.repository.AnimeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimeServiceImpl implements AnimeService {

    private final AnimeRepository animeRepository;

    public AnimeServiceImpl(AnimeRepository animeRepository) {
        this.animeRepository = animeRepository;
    }

    @Override
    public List<Anime> listarTodos() {
        return animeRepository.findAll();
    }

    @Override
    public List<Anime> listarDestacados() {
        return animeRepository.findTop5ByOrderByRatingDesc();
    }

    @Override
    public Optional<Anime> obtenerPorId(Long id) {
        return animeRepository.findById(id);
    }

    @Override
    public Anime guardar(Anime anime) {
        return animeRepository.save(anime);
    }
}