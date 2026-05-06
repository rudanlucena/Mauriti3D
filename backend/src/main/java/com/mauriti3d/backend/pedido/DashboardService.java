package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    public DashboardDiario getResumoDiario(LocalDate data) {
        List<Object[]> daily = pedidoRepository.statsByDia(data.getDayOfMonth(), data.getMonthValue(), data.getYear());
        int totalMinutos = 0;
        BigDecimal totalValor = BigDecimal.ZERO;
        int totalPedidos = 0;
        if (!daily.isEmpty() && daily.get(0)[0] != null) {
            Object[] d = daily.get(0);
            totalMinutos = ((Number) d[0]).intValue();
            totalValor   = (BigDecimal) d[1];
            totalPedidos = ((Number) d[2]).intValue();
        }

        LocalDate hoje = LocalDate.now();
        long diasDecorridos = (data.getYear() == hoje.getYear() && data.getMonthValue() == hoje.getMonthValue())
                ? hoje.getDayOfMonth()
                : data.lengthOfMonth();

        List<Object[]> monthly = pedidoRepository.statsMensaisParaMedia(data.getYear(), data.getMonthValue());
        int mediaMinutos = 0;
        BigDecimal mediaValor = BigDecimal.ZERO;
        if (!monthly.isEmpty()) {
            Object[] m = monthly.get(0);
            long totalMesMinutos = ((Number) m[0]).longValue();
            BigDecimal totalMesValor = new BigDecimal(m[1].toString());
            mediaMinutos = (int) (totalMesMinutos / diasDecorridos);
            mediaValor   = totalMesValor.divide(BigDecimal.valueOf(diasDecorridos), 2, RoundingMode.HALF_UP);
        }

        return new DashboardDiario(data.toString(), totalMinutos, totalValor, totalPedidos, mediaMinutos, mediaValor);
    }

    private BigDecimal safe(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }
}
