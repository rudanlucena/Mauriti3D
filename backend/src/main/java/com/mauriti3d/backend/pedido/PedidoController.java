package com.mauriti3d.backend.pedido;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService service;

    @GetMapping
    public List<Pedido> findAtivos(@RequestParam(defaultValue = "") String nome) {
        return service.findAtivos(nome);
    }

    @GetMapping("/finalizados")
    public Page<Pedido> findFinalizados(
            @RequestParam(defaultValue = "") String nome,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.findFinalizados(nome, page, size);
    }

    @GetMapping("/{id}")
    public Pedido findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido create(@RequestBody @Valid Pedido pedido) {
        return service.create(pedido);
    }

    @PutMapping("/{id}")
    public Pedido update(@PathVariable Long id, @RequestBody @Valid Pedido pedido) {
        return service.update(id, pedido);
    }

    @PatchMapping("/{id}/status")
    public Pedido updateStatus(@PathVariable Long id, @RequestParam StatusPedido status) {
        return service.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
