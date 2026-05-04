package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataComemorativaService {

    private final DataComemorativaRepository repository;
    private final PedidoRepository pedidoRepository;

    public List<DataComemorativa> findAll() {
        return repository.findAllByOrderByMesAscDiaAsc();
    }

    public DataComemorativa create(DataComemorativa data) {
        return repository.save(data);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        repository.deleteById(id);
    }

    public DataComemorativaStats getStats(Long id) {
        DataComemorativa dc = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        LocalDate hoje = LocalDate.now();
        LocalDate dataEvento = LocalDate.of(hoje.getYear(), dc.getMes(), dc.getDia());
        if (!dataEvento.isAfter(hoje)) dataEvento = dataEvento.plusYears(1);
        int diasRestantes = (int) ChronoUnit.DAYS.between(hoje, dataEvento);

        List<Object[]> rawList = pedidoRepository.getStatsByDataComemorativa(id);
        Object[] raw = rawList.isEmpty() ? new Object[]{0L, null} : rawList.get(0);
        long total = raw[0] != null ? ((Number) raw[0]).longValue() : 0L;
        BigDecimal valor = raw[1] != null ? new BigDecimal(raw[1].toString()) : BigDecimal.ZERO;

        return new DataComemorativaStats(id, dc.getNome(), dc.getMes(), dc.getDia(),
                dc.getCor(), diasRestantes, total, valor);
    }
}
