package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
public class RelatoriosController {

    private final RelatoriosService service;

    @GetMapping
    public RelatoriosData getRelatorios(@RequestParam(defaultValue = "6") int meses) {
        return service.getRelatorios(meses);
    }
}
