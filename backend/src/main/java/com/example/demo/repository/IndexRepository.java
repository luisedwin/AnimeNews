package com.example.demo.repository;

import com.example.demo.model.Index;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IndexRepository extends JpaRepository<Index, Long> {
    List<Index> findByGeneroIgnoreCase(String genero);
    List<Index> findTop5ByOrderByRatingDesc();
}