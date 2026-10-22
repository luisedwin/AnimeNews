package com.example.demo.service;

import com.example.demo.model.Anime;
import com.example.demo.repository.AnimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AnimeService {

    @Autowired
    private AnimeRepository animeRepository;

    public List<Anime> obtenerTodos() {
        return animeRepository.findAll();
    }
    
    public List<Anime> obtenerPorGenero(String genero) {
        return animeRepository.findByGenero(genero);
    }
    
    public Anime guardar(Anime anime) {
        return animeRepository.save(anime);
    }
}