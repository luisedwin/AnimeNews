package com.example.demo.controller;

import com.example.demo.service.IndexService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IndexController {

    private final IndexService indexService;

    public IndexController(IndexService indexService) {
        this.indexService = indexService;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("destacados", indexService.listarDestacados());
        return "index";
    }
}