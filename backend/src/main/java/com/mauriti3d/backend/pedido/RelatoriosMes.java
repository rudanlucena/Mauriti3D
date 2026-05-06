package com.mauriti3d.backend.pedido;

import java.math.BigDecimal;

public record RelatoriosMes(
    int ano,
    int mes,
    String rotulo,
    BigDecimal receita,
    BigDecimal despesas,
    BigDecimal lucro,
    int minutosImpressos,
    long totalPedidos,
    long pedidosFinalizados
) {}
