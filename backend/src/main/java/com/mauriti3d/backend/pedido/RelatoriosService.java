package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RelatoriosService {

    private final PedidoRepository pedidoRepository;
    private final DespesaRepository despesaRepository;

    private static final String[] DIAS   = {"Dom","Seg","Ter","Qua","Qui","Sex","Sáb"};
    private static final String[] MESES  = {"Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"};
    private static final Map<String,String> STATUS_LABEL = Map.of(
        "FILA","Na Fila","INICIADO","Iniciado","FINALIZADO","Finalizado","CANCELADO","Cancelado");

    public RelatoriosData getRelatorios(int meses) {
        return new RelatoriosData(
            getKpis(),
            getMensal(meses),
            getTopClientes(6),
            getDiasSemana(),
            getStatus()
        );
    }

    private RelatoriosKpi getKpis() {
        Object[] r = pedidoRepository.kpisGerais().get(0);
        long finalizados = num(r[0]);
        long ativos      = num(r[1]);
        long cancelados  = num(r[2]);
        long total       = num(r[3]);
        BigDecimal receita = dec(r[4]);
        int totalMin     = (int) num(r[5]);
        int mediaMin     = finalizados > 0 ? (int)(totalMin / finalizados) : 0;
        long base        = total - cancelados;
        double taxa      = base > 0 ? Math.min((finalizados * 100.0) / base, 100.0) : 0;
        return new RelatoriosKpi(finalizados, ativos, cancelados, receita, totalMin, mediaMin, taxa);
    }

    private List<RelatoriosMes> getMensal(int meses) {
        LocalDate hoje = LocalDate.now();

        Map<String, BigDecimal[]> pedData = new HashMap<>();
        for (Object[] r : pedidoRepository.statsMensais(meses)) {
            String key = r[0] + "-" + r[1];
            pedData.put(key, new BigDecimal[]{dec(r[2]), BigDecimal.valueOf(num(r[3])),
                BigDecimal.valueOf(num(r[4])), BigDecimal.valueOf(num(r[5]))});
        }

        Map<String, BigDecimal> despData = new HashMap<>();
        for (Object[] r : despesaRepository.statsMensais(meses)) {
            despData.put(r[0] + "-" + r[1], dec(r[2]));
        }

        List<RelatoriosMes> result = new ArrayList<>();
        for (int i = meses - 1; i >= 0; i--) {
            LocalDate d  = hoje.minusMonths(i);
            String key   = d.getYear() + "-" + d.getMonthValue();
            String rotulo = MESES[d.getMonthValue() - 1] + "/" + String.valueOf(d.getYear()).substring(2);
            BigDecimal[] pd = pedData.getOrDefault(key,
                new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO});
            BigDecimal receita  = pd[0];
            int minutos         = pd[1].intValue();
            long totalPed       = pd[2].longValue();
            long finalizados    = pd[3].longValue();
            BigDecimal despesas = despData.getOrDefault(key, BigDecimal.ZERO);
            result.add(new RelatoriosMes(d.getYear(), d.getMonthValue(), rotulo,
                receita, despesas, receita.subtract(despesas), minutos, totalPed, finalizados));
        }
        return result;
    }

    private List<RelatoriosTopCliente> getTopClientes(int limit) {
        return pedidoRepository.topClientes(limit).stream()
            .map(r -> new RelatoriosTopCliente((String) r[0], num(r[1]), dec(r[2])))
            .collect(Collectors.toList());
    }

    private List<RelatoriosDiaSemana> getDiasSemana() {
        Map<Integer, Long> m = new HashMap<>();
        for (Object[] r : pedidoRepository.pedidosPorDiaSemana()) m.put((int) num(r[0]), num(r[1]));
        List<RelatoriosDiaSemana> result = new ArrayList<>();
        for (int i = 0; i < 7; i++) result.add(new RelatoriosDiaSemana(DIAS[i], m.getOrDefault(i, 0L)));
        return result;
    }

    private List<RelatoriosStatus> getStatus() {
        return pedidoRepository.statusDistribuicao().stream()
            .map(r -> new RelatoriosStatus((String) r[0],
                STATUS_LABEL.getOrDefault((String) r[0], (String) r[0]), num(r[1])))
            .collect(Collectors.toList());
    }

    private long num(Object o) { return o == null ? 0L : ((Number) o).longValue(); }
    private BigDecimal dec(Object o) { return o == null ? BigDecimal.ZERO : new BigDecimal(o.toString()); }
}
