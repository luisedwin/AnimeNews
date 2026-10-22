package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PaginaController {

    @GetMapping("/noticias")
    public String noticias() {
        return "noticias";
    }

    @GetMapping("/detalle-noticias/{id}")
    public String detalleNoticia() {
        return "detalle-noticias";
    }
}
