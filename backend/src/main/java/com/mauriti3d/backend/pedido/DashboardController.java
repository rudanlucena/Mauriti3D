package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    @GetMapping("/mensal")
    public DashboardResumo getMensal(
            @RequestParam(defaultValue = "0") int mes,
            @RequestParam(defaultValue = "0") int ano) {
        return service.getResumoMensal(mes, ano);
    }
}
