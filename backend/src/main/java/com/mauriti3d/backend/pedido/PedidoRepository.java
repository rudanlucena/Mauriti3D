package com.mauriti3d.backend.pedido;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.math.BigDecimal;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("""
        SELECT p FROM Pedido p
        WHERE p.statusPedido IN ('FILA','INICIADO')
        AND (:nome = '' OR LOWER(p.nomeCliente) LIKE LOWER(CONCAT('%',:nome,'%')))
        ORDER BY p.criadoEm ASC
    """)
    List<Pedido> findAtivos(@Param("nome") String nome);

    @Query(value = """
        SELECT p FROM Pedido p
        WHERE p.statusPedido = 'FINALIZADO'
        AND (:nome = '' OR LOWER(p.nomeCliente) LIKE LOWER(CONCAT('%',:nome,'%')))
        ORDER BY p.criadoEm DESC
    """, countQuery = """
        SELECT COUNT(p) FROM Pedido p
        WHERE p.statusPedido = 'FINALIZADO'
        AND (:nome = '' OR LOWER(p.nomeCliente) LIKE LOWER(CONCAT('%',:nome,'%')))
    """)
    Page<Pedido> findFinalizados(@Param("nome") String nome, Pageable pageable);

    @Query("SELECT COUNT(p), SUM(p.valor) FROM Pedido p WHERE p.dataComemorativaId = :id")
    List<Object[]> getStatsByDataComemorativa(@Param("id") Long id);

    @Query(value = """
        SELECT SUM(valor) FROM pedidos
        WHERE status_pagamento = 'PAGO' AND status_pedido = 'FINALIZADO'
        AND EXTRACT(YEAR FROM data_finalizacao) = :ano
        AND EXTRACT(MONTH FROM data_finalizacao) = :mes
    """, nativeQuery = true)
    BigDecimal sumArrecadadoByMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query(value = """
        SELECT SUM(valor) FROM pedidos
        WHERE status_pedido <> 'CANCELADO'
        AND (
            (status_pedido = 'FINALIZADO'
             AND EXTRACT(YEAR FROM data_finalizacao) = :ano
             AND EXTRACT(MONTH FROM data_finalizacao) = :mes)
            OR
            (status_pedido <> 'FINALIZADO'
             AND EXTRACT(YEAR FROM data_entrega) = :ano
             AND EXTRACT(MONTH FROM data_entrega) = :mes)
        )
    """, nativeQuery = true)
    BigDecimal sumSaldoByMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query(value = """
        SELECT SUM(duracao_horas * 60 + duracao_minutos), SUM(valor), COUNT(*)
        FROM pedidos
        WHERE status_pedido = 'FINALIZADO'
        AND EXTRACT(DAY   FROM data_finalizacao) = :dia
        AND EXTRACT(MONTH FROM data_finalizacao) = :mes
        AND EXTRACT(YEAR  FROM data_finalizacao) = :ano
    """, nativeQuery = true)
    List<Object[]> statsByDia(@Param("dia") int dia, @Param("mes") int mes, @Param("ano") int ano);

    @Query(value = """
        SELECT
          COALESCE(SUM(duracao_horas * 60 + duracao_minutos), 0),
          COALESCE(SUM(CASE WHEN status_pagamento = 'PAGO' THEN valor ELSE 0 END), 0)
        FROM pedidos
        WHERE status_pedido = 'FINALIZADO'
        AND EXTRACT(YEAR  FROM data_finalizacao) = :ano
        AND EXTRACT(MONTH FROM data_finalizacao) = :mes
    """, nativeQuery = true)
    List<Object[]> statsMensaisParaMedia(@Param("ano") int ano, @Param("mes") int mes);

    @Query(value = """
        SELECT
          COUNT(CASE WHEN status_pedido = 'FINALIZADO' THEN 1 END),
          COUNT(CASE WHEN status_pedido IN ('FILA','INICIADO') THEN 1 END),
          COUNT(CASE WHEN status_pedido = 'CANCELADO' THEN 1 END),
          COUNT(*),
          COALESCE(SUM(CASE WHEN status_pedido='FINALIZADO' AND status_pagamento='PAGO' THEN valor END), 0),
          COALESCE(SUM(CASE WHEN status_pedido='FINALIZADO' THEN duracao_horas*60+duracao_minutos END), 0)
        FROM pedidos
    """, nativeQuery = true)
    List<Object[]> kpisGerais();

    @Query(value = """
        SELECT
          EXTRACT(YEAR  FROM data_finalizacao)::int,
          EXTRACT(MONTH FROM data_finalizacao)::int,
          COALESCE(SUM(CASE WHEN status_pagamento='PAGO' THEN valor ELSE 0 END), 0),
          COALESCE(SUM(duracao_horas*60+duracao_minutos), 0),
          COUNT(*),
          COUNT(*)
        FROM pedidos
        WHERE status_pedido = 'FINALIZADO'
        AND data_finalizacao >= NOW() - CAST(:meses || ' months' AS INTERVAL)
        GROUP BY EXTRACT(YEAR FROM data_finalizacao), EXTRACT(MONTH FROM data_finalizacao)
        ORDER BY EXTRACT(YEAR FROM data_finalizacao), EXTRACT(MONTH FROM data_finalizacao)
    """, nativeQuery = true)
    List<Object[]> statsMensais(@Param("meses") int meses);

    @Query(value = """
        SELECT nome_cliente, COUNT(*), COALESCE(SUM(valor), 0)
        FROM pedidos
        WHERE status_pedido = 'FINALIZADO' AND status_pagamento = 'PAGO'
        GROUP BY nome_cliente
        ORDER BY SUM(valor) DESC
        LIMIT :lim
    """, nativeQuery = true)
    List<Object[]> topClientes(@Param("lim") int lim);

    @Query(value = """
        SELECT EXTRACT(DOW FROM data_finalizacao)::int, COUNT(*)
        FROM pedidos
        WHERE status_pedido = 'FINALIZADO'
        GROUP BY EXTRACT(DOW FROM data_finalizacao)
        ORDER BY EXTRACT(DOW FROM data_finalizacao)
    """, nativeQuery = true)
    List<Object[]> pedidosPorDiaSemana();

    @Query(value = """
        SELECT data_entrega::text, COUNT(*), COALESCE(SUM(duracao_horas * 60 + duracao_minutos), 0)
        FROM pedidos
        WHERE status_pedido NOT IN ('CANCELADO', 'FINALIZADO')
        AND EXTRACT(YEAR  FROM data_entrega) = :ano
        AND EXTRACT(MONTH FROM data_entrega) = :mes
        GROUP BY data_entrega
        ORDER BY data_entrega
    """, nativeQuery = true)
    List<Object[]> cargaPorDia(@Param("ano") int ano, @Param("mes") int mes);

    @Query(value = "SELECT status_pedido, COUNT(*) FROM pedidos GROUP BY status_pedido", nativeQuery = true)
    List<Object[]> statusDistribuicao();
}
