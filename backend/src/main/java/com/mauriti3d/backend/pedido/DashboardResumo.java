package com.mauriti3d.backend.pedido;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResumo(
    int mes,
    int ano,
    BigDecimal totalDespesas,
    BigDecimal valorArrecadado,
    BigDecimal saldoEsperado,
    List<Despesa> despesasMes
) {}
