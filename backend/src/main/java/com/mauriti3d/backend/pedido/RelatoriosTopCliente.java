package com.mauriti3d.backend.pedido;

import java.math.BigDecimal;

public record RelatoriosTopCliente(
    String nome,
    long totalPedidos,
    BigDecimal totalReceita
) {}
