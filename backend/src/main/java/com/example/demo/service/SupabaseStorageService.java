package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    private static final long MAX_PDF_SIZE = 25L * 1024 * 1024;
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final String supabaseUrl;
    private final String serviceRoleKey;
    private final String bucket;

    public SupabaseStorageService(
            @Value("${supabase.url:}") String supabaseUrl,
            @Value("${supabase.service-role-key:}") String serviceRoleKey,
            @Value("${supabase.storage.bucket:manga-capitulos}") String bucket) {
        this.supabaseUrl = supabaseUrl;
        this.serviceRoleKey = serviceRoleKey;
        this.bucket = bucket;
    }

    public String subirPdf(Long mangaId, MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selecciona un archivo PDF.");
        }
        if (archivo.getSize() > MAX_PDF_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El PDF no puede superar los 25 MB.");
        }

        byte[] contenido;
        try {
            contenido = archivo.getBytes();
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No se pudo leer el archivo PDF.", exception);
        }
        if (!esPdf(contenido)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El archivo seleccionado no es un PDF válido.");
        }
        if (supabaseUrl.isBlank() || serviceRoleKey.isBlank() || bucket.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Configura Supabase Storage antes de subir capítulos.");
        }

        String objectPath = "manga/" + mangaId + "/" + UUID.randomUUID() + ".pdf";
        String encodedPath = encodePath(bucket) + "/" + encodePath(objectPath);
        URI uploadUri = URI.create(trimTrailingSlash(supabaseUrl) + "/storage/v1/object/" + encodedPath);
        HttpRequest request = HttpRequest.newBuilder(uploadUri)
                .timeout(Duration.ofSeconds(90))
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("apikey", serviceRoleKey)
                .header("Content-Type", "application/pdf")
                .header("x-upsert", "false")
                .POST(HttpRequest.BodyPublishers.ofByteArray(contenido))
                .build();

        try {
            HttpResponse<String> response = HTTP_CLIENT.send(
                    request,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                String detalle = response.body() == null ? "" : response.body().replaceAll("\\s+", " ").trim();
                if (detalle.length() > 300) {
                    detalle = detalle.substring(0, 300);
                }
                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Supabase Storage rechazó el PDF (HTTP " + response.statusCode() + ")"
                                + (detalle.isBlank() ? "." : ": " + detalle));
            }
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Se interrumpió la subida del PDF.", exception);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "No fue posible conectar con Supabase Storage.", exception);
        }

        return trimTrailingSlash(supabaseUrl) + "/storage/v1/object/public/" + encodedPath;
    }

    private boolean esPdf(byte[] contenido) {
        return contenido.length >= 5
                && contenido[0] == '%'
                && contenido[1] == 'P'
                && contenido[2] == 'D'
                && contenido[3] == 'F'
                && contenido[4] == '-';
    }

    private String encodePath(String path) {
        String[] segments = path.split("/");
        return java.util.Arrays.stream(segments)
                .map(segment -> URLEncoder.encode(segment, StandardCharsets.UTF_8).replace("+", "%20"))
                .collect(java.util.stream.Collectors.joining("/"));
    }

    private String trimTrailingSlash(String value) {
        return value.replaceAll("/+$", "");
    }
}
