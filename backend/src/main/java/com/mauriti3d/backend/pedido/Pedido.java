package com.mauriti3d.backend.pedido;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank
    private String nomeCliente;

    @NotBlank
    private String whatsapp;

    @NotNull
    private LocalDate dataEntrega;

    @NotBlank
    private String item;

    @Column(columnDefinition = "TEXT")
    private String nota;

    @NotNull
    @DecimalMin("0.0")
    @Column(precision = 10, scale = 2)
    private BigDecimal valor;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusPagamento statusPagamento;

    @NotNull
    @Enumerated(EnumType.STRING)
    private StatusPedido statusPedido;

    @NotNull
    @Column(name = "duracao_horas")
    private Integer duracaoHoras;

    @NotNull
    @Column(name = "duracao_minutos")
    private Integer duracaoMinutos;

    private String endereco;

    @Column(name = "data_comemorativa_id")
    private Long dataComemorativaId;

    @CreationTimestamp
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime atualizadoEm;
}
