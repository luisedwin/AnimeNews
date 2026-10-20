package com.example.demo.controller;

import com.example.demo.model.Manga;
import com.example.demo.service.MangaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/mangas")
public class MangaRestController {

    private final MangaService mangaService;

    public MangaRestController(MangaService mangaService) {
        this.mangaService = mangaService;
    }

    @GetMapping
    public List<Manga> obtenerTodos() {
        return mangaService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Manga> obtenerPorId(@PathVariable Long id) {
        return mangaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Manga> crear(@RequestBody Manga manga) {
        manga.setId(null);
        Manga mangaGuardado = mangaService.guardar(manga);
        return ResponseEntity.created(URI.create("/api/mangas/" + mangaGuardado.getId()))
                .body(mangaGuardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Manga> actualizar(@PathVariable Long id, @RequestBody Manga manga) {
        return mangaService.obtenerPorId(id)
                .map(mangaExistente -> {
                    mangaExistente.setTitulo(manga.getTitulo());
                    mangaExistente.setAutor(manga.getAutor());
                    mangaExistente.setImageUrl(manga.getImageUrl());
                    mangaExistente.setDescipcion(manga.getDescipcion());
                    mangaExistente.setGenero(manga.getGenero());
                    return ResponseEntity.ok(mangaService.guardar(mangaExistente));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (mangaService.obtenerPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        mangaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
