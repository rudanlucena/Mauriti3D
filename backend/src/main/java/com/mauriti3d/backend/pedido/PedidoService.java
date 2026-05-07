package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository repository;

    public List<Pedido> findAtivos(String nome) {
        return repository.findAtivos(nome == null ? "" : nome);
    }

    public Page<Pedido> findFinalizados(String nome, int page, int size) {
        return repository.findFinalizados(nome == null ? "" : nome, PageRequest.of(page, size));
    }

    public Pedido findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado"));
    }

    public Pedido create(Pedido pedido) {
        return repository.save(pedido);
    }

    public Pedido update(Long id, Pedido pedido) {
        Pedido existing = findById(id);
        pedido.setId(existing.getId());
        pedido.setCriadoEm(existing.getCriadoEm());
        if (pedido.getStatusPedido() == StatusPedido.FINALIZADO) {
            pedido.setDataFinalizacao(
                existing.getDataFinalizacao() != null ? existing.getDataFinalizacao() : LocalDate.now()
            );
        } else {
            pedido.setDataFinalizacao(null);
        }
        return repository.save(pedido);
    }

    public Pedido updateStatus(Long id, StatusPedido status) {
        Pedido existing = findById(id);
        existing.setStatusPedido(status);
        if (status == StatusPedido.FINALIZADO && existing.getDataFinalizacao() == null) {
            existing.setDataFinalizacao(LocalDate.now());
        } else if (status != StatusPedido.FINALIZADO) {
            existing.setDataFinalizacao(null);
        }
        return repository.save(existing);
    }

    public List<CargaDiaDto> getCargaPorDia(int mes, int ano) {
        return repository.cargaPorDia(ano, mes).stream()
            .map(r -> new CargaDiaDto(
                r[0].toString(),
                ((Number) r[1]).intValue(),
                ((Number) r[2]).intValue()
            ))
            .collect(Collectors.toList());
    }

    public void delete(Long id) {
        findById(id);
        repository.deleteById(id);
    }
}
