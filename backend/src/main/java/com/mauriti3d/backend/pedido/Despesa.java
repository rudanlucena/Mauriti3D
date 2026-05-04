package com.mauriti3d.backend.pedido;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "despesas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoDespesa tipo;

    @NotNull
    private LocalDate data;

    @NotNull
    @DecimalMin("0.01")
    @Column(precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @CreationTimestamp
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime criadoEm;
}
