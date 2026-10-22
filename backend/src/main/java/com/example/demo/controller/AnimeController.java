package com.example.demo.controller;

import com.example.demo.service.AnimeService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AnimeController {

    private final AnimeService animeService;

    public AnimeController(AnimeService animeService) {
        this.animeService = animeService;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("destacados", animeService.listarDestacados());
        return "index";
    }
}