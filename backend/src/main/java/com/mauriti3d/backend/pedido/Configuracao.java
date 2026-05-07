package com.mauriti3d.backend.pedido;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "configuracoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Configuracao {

    @Id
    private Long id;

    @Column(name = "meta_horas_dia")
    private Integer metaHorasDia;

    @Column(name = "meta_minutos_dia")
    private Integer metaMinutosDia;

    @Column(name = "meta_valor_dia", precision = 10, scale = 2)
    private BigDecimal metaValorDia;
}
