package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DespesaService {

    private final DespesaRepository repository;

    public Despesa create(Despesa despesa) {
        return repository.save(despesa);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        repository.deleteById(id);
    }
}
