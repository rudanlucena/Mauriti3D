package com.mauriti3d.backend.pedido;

import java.math.BigDecimal;

public record DashboardDiario(
    String data,
    int totalMinutos,
    BigDecimal totalValor,
    int totalPedidos,
    int mediaMinutosPorDia,
    BigDecimal mediaValorPorDia
) {}
