package com.mauriti3d.backend.pedido;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataComemorativaInitializer {

    private final DataComemorativaRepository repository;

    @PostConstruct
    public void init() {
        if (repository.count() > 0) return;

        repository.saveAll(List.of(
            dc("Ano Novo",          1,  1, "#3b82f6"),
            dc("Carnaval",          3,  3, "#ec4899"),
            dc("Páscoa",            4, 20, "#f97316"),
            dc("Dia das Mães",      5, 11, "#ec4899"),
            dc("Dia dos Namorados", 6, 12, "#ef4444"),
            dc("Dia dos Pais",      8, 10, "#3b82f6"),
            dc("Dia das Crianças", 10, 12, "#22c55e"),
            dc("Halloween",        10, 31, "#f97316"),
            dc("Natal",            12, 25, "#22c55e"),
            dc("Réveillon",        12, 31, "#a855f7")
        ));
    }

    private DataComemorativa dc(String nome, int mes, int dia, String cor) {
        return DataComemorativa.builder().nome(nome).mes(mes).dia(dia).cor(cor).build();
    }
}
