package com.mauriti3d.backend.pedido;

import java.math.BigDecimal;

public record DataComemorativaStats(
    Long id,
    String nome,
    int mes,
    int dia,
    String cor,
    int diasRestantes,
    long totalPedidos,
    BigDecimal valorArrecadado
) {}
