package com.mauriti3d.backend.pedido;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "datas_comemorativas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataComemorativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    @NotBlank
    private String nome;

    @NotNull @Min(1) @Max(12)
    private Integer mes;

    @NotNull @Min(1) @Max(31)
    private Integer dia;

    @Builder.Default
    private String cor = "#3b82f6";
}
