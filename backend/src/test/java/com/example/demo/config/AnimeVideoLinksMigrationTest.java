package com.example.demo.config;

import com.example.demo.model.Anime;
import com.example.demo.repository.AnimeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultApplicationArguments;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AnimeVideoLinksMigrationTest {

    @Test
    void corrigeLosEnlacesExistentesYNoGuardaSiYaEstanActualizados() throws Exception {
        List<Anime> animes = List.of(
                anime("Blue Period: El Arte del Despertar", "https://www.youtube.com/embed/3v7z0v1q7wE"),
                anime("Spy x Family", "https://www.youtube.com/embed/05G4RyT9DjY"),
                anime("Kaguya-sama: Love Is War", "https://www.youtube.com/embed/pSdTVKy2XoI"),
                anime("Horimiya", "https://www.youtube.com/embed/j0xtuYULJNM"),
                anime("Clannad: After Story", "https://www.youtube.com/embed/6X_Dc9SJ0ZU"),
                anime("K-On!", "https://www.youtube.com/embed/EYdCd00TJhI")
        );
        AnimeRepository repository = mock(AnimeRepository.class);
        when(repository.findByTituloIn(anyCollection())).thenReturn(animes);
        AnimeVideoLinksMigration migration = new AnimeVideoLinksMigration(repository);

        migration.run(new DefaultApplicationArguments(new String[0]));

        assertEquals("https://www.youtube.com/embed/IV0-SYn3YuM", animes.get(0).getVideoUrl());
        assertEquals("https://www.youtube.com/embed/ofXigq9aIpo", animes.get(1).getVideoUrl());
        assertEquals("https://www.youtube.com/embed/rZ95aZmQu_8", animes.get(2).getVideoUrl());
        assertEquals("https://www.youtube.com/embed/W3dimUB-Rbo", animes.get(3).getVideoUrl());
        assertEquals("https://www.youtube.com/embed/IecYMqp1N4k", animes.get(4).getVideoUrl());
        assertEquals("https://www.youtube.com/embed/DATm0SCVQn4", animes.get(5).getVideoUrl());
        verify(repository, times(1)).saveAll(anyList());

        migration.run(new DefaultApplicationArguments(new String[0]));

        verify(repository, times(1)).saveAll(anyList());
        verify(repository, never()).save(any(Anime.class));
    }

    private Anime anime(String titulo, String videoUrl) {
        Anime anime = new Anime();
        anime.setTitulo(titulo);
        anime.setVideoUrl(videoUrl);
        return anime;
    }
}
