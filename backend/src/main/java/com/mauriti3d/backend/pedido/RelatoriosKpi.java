package com.mauriti3d.backend.pedido;

import java.math.BigDecimal;

public record RelatoriosKpi(
    long pedidosFinalizados,
    long pedidosAtivos,
    long pedidosCancelados,
    BigDecimal receitaTotal,
    int totalMinutosImpressos,
    int minutosMediaPorPedido,
    double taxaConclusao
) {}
