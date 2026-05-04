package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DespesaRepository despesaRepository;
    private final PedidoRepository pedidoRepository;

    public DashboardResumo getResumoMensal(int mes, int ano) {
        LocalDate hoje = LocalDate.now();
        int m = mes > 0 ? mes : hoje.getMonthValue();
        int a = ano > 0 ? ano : hoje.getYear();

        BigDecimal despesas   = safe(despesaRepository.sumByMes(a, m));
        BigDecimal arrecadado = safe(pedidoRepository.sumArrecadadoByMes(a, m));
        BigDecimal saldo      = safe(pedidoRepository.sumSaldoByMes(a, m));
        List<Despesa> lista   = despesaRepository.findByMes(a, m);

        return new DashboardResumo(m, a, despesas, arrecadado, saldo, lista);
    }

    private BigDecimal safe(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }
}
