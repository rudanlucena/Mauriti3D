package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

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

    @GetMapping("/diario")
    public DashboardDiario getDiario(@RequestParam(required = false) String data) {
        LocalDate d = data != null ? LocalDate.parse(data) : LocalDate.now();
        return service.getResumoDiario(d);
    }
}
