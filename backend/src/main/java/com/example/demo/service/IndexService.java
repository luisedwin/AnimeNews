package com.example.demo.service;

import com.example.demo.model.Index;
import java.util.List;
import java.util.Optional;

public interface IndexService {
    List<Index> listarTodos();
    List<Index> listarDestacados();
    Optional<Index> obtenerPorId(Long id);
    Index guardar(Index index);
}