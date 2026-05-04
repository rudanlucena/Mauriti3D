package com.mauriti3d.backend.pedido;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/datas")
@RequiredArgsConstructor
public class DataComemorativaController {

    private final DataComemorativaService service;

    @GetMapping
    public List<DataComemorativa> findAll() {
        return service.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DataComemorativa create(@RequestBody @Valid DataComemorativa data) {
        return service.create(data);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/{id}/stats")
    public DataComemorativaStats getStats(@PathVariable Long id) {
        return service.getStats(id);
    }
}
