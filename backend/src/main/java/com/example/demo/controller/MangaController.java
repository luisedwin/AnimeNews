package com.example.demo.controller;

import com.example.demo.model.Manga;
import com.example.demo.model.MangaCapitulo;
import com.example.demo.service.MangaCapituloService;
import com.example.demo.service.MangaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.URI;
import java.util.List;

@Controller
public class MangaController {

    private final MangaService mangaService;
    private final MangaCapituloService capituloService;

    public MangaController(MangaService mangaService, MangaCapituloService capituloService) {
        this.mangaService = mangaService;
        this.capituloService = capituloService;
    }

    @GetMapping("/manga")
    public String mostrarMangas(Model model) {
        List<Manga> mangas = mangaService.obtenerTodos();
        model.addAttribute("mangas", mangas);
        model.addAttribute("mangaDestacado", mangaService.obtenerAleatorio(mangas).orElse(null));
        return "manga";
    }

    @GetMapping("/manga/{id}")
    public String mostrarDetalleManga(@PathVariable Long id, Model model) {
        Manga manga = mangaService.obtenerPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manga no encontrado"));
        model.addAttribute("manga", manga);
        model.addAttribute("capitulos", capituloService.obtenerPorManga(id));
        return "manga-detalle";
    }

    @GetMapping("/api/mangas")
    @ResponseBody
    public List<Manga> obtenerTodos() {
        return mangaService.obtenerTodos();
    }

    @GetMapping("/api/mangas/{id}")
    @ResponseBody
    public ResponseEntity<Manga> obtenerPorId(@PathVariable Long id) {
        return mangaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/api/mangas/{mangaId}/capitulos")
    @ResponseBody
    public ResponseEntity<List<MangaCapitulo>> obtenerCapitulos(@PathVariable Long mangaId) {
        if (mangaService.obtenerPorId(mangaId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(capituloService.obtenerPorManga(mangaId));
    }

    @PostMapping("/api/mangas/{mangaId}/capitulos")
    @ResponseBody
    public ResponseEntity<MangaCapitulo> crearCapitulo(
            @PathVariable Long mangaId,
            @RequestBody MangaCapitulo capitulo) {
        Manga manga = mangaService.obtenerPorId(mangaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Manga no encontrado"));
        MangaCapitulo capituloGuardado = capituloService.guardar(manga, capitulo);
        return ResponseEntity.created(URI.create("/api/mangas/" + mangaId + "/capitulos"))
                .body(capituloGuardado);
    }

    @PostMapping("/api/mangas")
    @ResponseBody
    public ResponseEntity<Manga> crear(@RequestBody Manga manga) {
        manga.setId(null);
        Manga mangaGuardado = mangaService.guardar(manga);
        return ResponseEntity.created(URI.create("/api/mangas/" + mangaGuardado.getId()))
                .body(mangaGuardado);
    }

    @PutMapping("/api/mangas/{id}")
    @ResponseBody
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

    @DeleteMapping("/api/mangas/{id}")
    @ResponseBody
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (mangaService.obtenerPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        mangaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
