package com.example.demo.service;

import com.example.demo.model.Noticias;
import com.example.demo.repository.NoticiasRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class NoticiasService {

    private final NoticiasRepository noticiasRepository;

    public NoticiasService(NoticiasRepository noticiasRepository) {
        this.noticiasRepository = noticiasRepository;
    }

    @Transactional(readOnly = true)
    public List<Noticias> listarTodas() {
        return noticiasRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaPublicacion"));
    }

    @Transactional(readOnly = true)
    public Noticias obtenerPorId(Long id) {
        return noticiasRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No se encontró la noticia con id " + id));
    }

    public Noticias crear(Noticias noticia) {
        noticia.setId(null);
        return noticiasRepository.save(noticia);
    }

    /*Metodo para actualizar noticia */
    public Noticias actualizar(Long id, Noticias datos) {
        Noticias noticia = obtenerPorId(id);
        noticia.setTitulo(datos.getTitulo());
        noticia.setResumen(datos.getResumen());
        noticia.setContenido(datos.getContenido());
        noticia.setCategoria(datos.getCategoria());
        noticia.setAnimeRelacionado(datos.getAnimeRelacionado());
        noticia.setImagenUrl(datos.getImagenUrl());
        noticia.setAutor(datos.getAutor());
        noticia.setFechaPublicacion(datos.getFechaPublicacion());
        noticia.setDestacada(datos.isDestacada());
        return noticiasRepository.save(noticia);
    }

    public void eliminar(Long id) {
        Noticias noticia = obtenerPorId(id);
        noticiasRepository.delete(noticia);
    }
}
