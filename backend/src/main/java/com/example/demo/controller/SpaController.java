package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
            "/",
            "/noticias",
            "/detalle-noticias/{id}",
            "/estrenos",
            "/anime",
            "/manga",
            "/manga/{id}"
    })
    public String index() {
        return "forward:/index.html";
    }
}
