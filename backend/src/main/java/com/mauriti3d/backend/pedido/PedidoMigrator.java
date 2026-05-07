package com.mauriti3d.backend.pedido;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PedidoMigrator implements ApplicationRunner {

    private final JdbcTemplate jdbc;

    @Override
    public void run(ApplicationArguments args) {
        // Backfills data_finalizacao for existing FINALIZADO orders that predate this field
        jdbc.update("""
            UPDATE pedidos
            SET data_finalizacao = criado_em::date
            WHERE status_pedido = 'FINALIZADO' AND data_finalizacao IS NULL
        """);
    }
}
