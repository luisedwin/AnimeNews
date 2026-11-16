package com.example.demo.controller;

import com.example.demo.service.IndexService;
import com.example.demo.model.Anime;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/animes")
public class IndexController {

    private final IndexService indexService;

    public IndexController(IndexService indexService) {
        this.indexService = indexService;
    }

    @GetMapping("/destacados")
    public List<Anime> listarDestacados() {
        return indexService.listarDestacados();
    }
}