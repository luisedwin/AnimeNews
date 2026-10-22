package com.example.demo.service;

import com.example.demo.model.Anime;
import com.example.demo.repository.IndexRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IndexServiceImpl implements IndexService {

    private final IndexRepository indexRepository;

    public IndexServiceImpl(IndexRepository indexRepository) {
        this.indexRepository = indexRepository;
    }

    @Override
    public List<Anime> listarTodos() {
        return indexRepository.findAll();
    }

    @Override
    public List<Anime> listarDestacados() {
        return indexRepository.findTop5ByOrderByRatingDesc();
    }

    @Override
    public Optional<Anime> obtenerPorId(Long id) {
        return indexRepository.findById(id);
    }

    @Override
    public Anime guardar(Anime index) {
        return indexRepository.save(index);
    }
}