package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/configuracao")
@RequiredArgsConstructor
public class ConfiguracaoController {

    private final ConfiguracaoService service;

    @GetMapping
    public Configuracao get() {
        return service.get();
    }

    @PutMapping
    public Configuracao update(@RequestBody Configuracao cfg) {
        return service.update(cfg);
    }
}
