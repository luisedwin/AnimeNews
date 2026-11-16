package com.example.demo.config;

import com.example.demo.model.Anime;
import com.example.demo.repository.AnimeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class AnimeVideoLinksMigration implements ApplicationRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(AnimeVideoLinksMigration.class);
    private static final Map<String, String> VIDEO_URLS = Map.of(
            "Blue Period: El Arte del Despertar", "https://www.youtube.com/embed/IV0-SYn3YuM",
            "Spy x Family", "https://www.youtube.com/embed/ofXigq9aIpo",
            "Kaguya-sama: Love Is War", "https://www.youtube.com/embed/rZ95aZmQu_8",
            "Horimiya", "https://www.youtube.com/embed/W3dimUB-Rbo",
            "Clannad: After Story", "https://www.youtube.com/embed/IecYMqp1N4k",
            "K-On!", "https://www.youtube.com/embed/DATm0SCVQn4"
    );

    private final AnimeRepository animeRepository;

    public AnimeVideoLinksMigration(AnimeRepository animeRepository) {
        this.animeRepository = animeRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<Anime> animes = animeRepository.findByTituloIn(VIDEO_URLS.keySet());
        List<Anime> corregidos = animes.stream()
                .filter(anime -> !VIDEO_URLS.get(anime.getTitulo()).equals(anime.getVideoUrl()))
                .peek(anime -> anime.setVideoUrl(VIDEO_URLS.get(anime.getTitulo())))
                .toList();

        if (!corregidos.isEmpty()) {
            animeRepository.saveAll(corregidos);
            LOGGER.info("Se corrigieron los enlaces de video de {} animes.", corregidos.size());
        }
    }
}
