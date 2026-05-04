package com.mauriti3d.backend.pedido;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/despesas")
@RequiredArgsConstructor
public class DespesaController {

    private final DespesaService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Despesa create(@RequestBody @Valid Despesa despesa) {
        return service.create(despesa);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
