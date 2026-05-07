package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ConfiguracaoService {

    private final ConfiguracaoRepository repository;

    public Configuracao get() {
        return repository.findById(1L).orElseGet(() -> {
            Configuracao c = new Configuracao();
            c.setId(1L);
            c.setMetaHorasDia(8);
            c.setMetaMinutosDia(0);
            c.setMetaValorDia(BigDecimal.valueOf(100));
            return repository.save(c);
        });
    }

    public Configuracao update(Configuracao cfg) {
        cfg.setId(1L);
        return repository.save(cfg);
    }
}
