package com.example.demo.controller;

import com.example.demo.model.Anime;
import com.example.demo.service.AnimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class AnimeController {

    @Autowired
    private AnimeService animeService;

    @GetMapping("/anime")
    public String mostrarAnime(Model model) {
        // 1. Obtenemos todos los animes de la BD
        List<Anime> listaAnimes = animeService.obtenerTodos();
        
        // 2. Los agrupamos por género (Ej: {"Shonen": [anime1, anime2], "Seinen": [anime3]})
        Map<String, List<Anime>> animesPorGenero = listaAnimes.stream()
                .collect(Collectors.groupingBy(Anime::getGenero));
        
        // 3. Enviamos la lista completa (por si la necesitas) y el mapa agrupado al HTML
        model.addAttribute("animes", listaAnimes);
        model.addAttribute("animesPorGenero", animesPorGenero);
        
        return "anime"; 
    }
}