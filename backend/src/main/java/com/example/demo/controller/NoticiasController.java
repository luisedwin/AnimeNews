package com.example.demo.controller;

import com.example.demo.model.Noticias;
import com.example.demo.service.NoticiasService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/noticias")
public class NoticiasController {

    private final NoticiasService noticiasService;

    public NoticiasController(NoticiasService noticiasService) {
        this.noticiasService = noticiasService;
    }

    @GetMapping
    public List<Noticias> listarTodas() {
        return noticiasService.listarTodas();
    }

    @GetMapping("/{id}")
    public Noticias obtenerPorId(@PathVariable Long id) {
        return noticiasService.obtenerPorId(id);
    }

    @PostMapping
    public ResponseEntity<Noticias> crear(@RequestBody Noticias noticia) {
        Noticias creada = noticiasService.crear(noticia);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{id}")
    public Noticias actualizar(@PathVariable Long id, @RequestBody Noticias noticia) {
        return noticiasService.actualizar(id, noticia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        noticiasService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
