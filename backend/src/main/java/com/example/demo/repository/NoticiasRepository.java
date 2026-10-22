package com.example.demo.repository;

import com.example.demo.model.Noticias;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticiasRepository extends JpaRepository<Noticias, Long> {
}
