package com.example.demo.service;

import com.example.demo.model.MangaCapitulo;
import com.example.demo.model.Manga;
import com.example.demo.repository.MangaCapituloRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class MangaCapituloService {

    private final MangaCapituloRepository mangaCapituloRepository;
    private final SupabaseStorageService supabaseStorageService;

    public MangaCapituloService(
            MangaCapituloRepository mangaCapituloRepository,
            SupabaseStorageService supabaseStorageService) {
        this.mangaCapituloRepository = mangaCapituloRepository;
        this.supabaseStorageService = supabaseStorageService;
    }

    public List<MangaCapitulo> obtenerPorManga(Long mangaId) {
        return mangaCapituloRepository.findByMangaIdOrderByNumeroAsc(mangaId);
    }

    public MangaCapitulo guardar(Manga manga, MangaCapitulo capitulo) {
        capitulo.setId(null);
        manga.agregarCapitulo(capitulo);
        return mangaCapituloRepository.save(capitulo);
    }

    public MangaCapitulo guardarConPdf(Manga manga, MangaCapitulo capitulo, MultipartFile archivoPdf) {
        capitulo.setUrlLectura(supabaseStorageService.subirPdf(manga.getId(), archivoPdf));
        return guardar(manga, capitulo);
    }
}
