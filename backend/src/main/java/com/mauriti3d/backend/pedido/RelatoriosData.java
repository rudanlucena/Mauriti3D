package com.mauriti3d.backend.pedido;

import java.util.List;

public record RelatoriosData(
    RelatoriosKpi kpis,
    List<RelatoriosMes> mensal,
    List<RelatoriosTopCliente> topClientes,
    List<RelatoriosDiaSemana> diasSemana,
    List<RelatoriosStatus> statusDistribuicao
) {}
