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

    @Query("SELECT SUM(p.valor) FROM Pedido p WHERE p.statusPagamento = 'PAGO' AND YEAR(p.criadoEm) = :ano AND MONTH(p.criadoEm) = :mes")
    BigDecimal sumArrecadadoByMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT SUM(p.valor) FROM Pedido p WHERE p.statusPedido <> 'CANCELADO' AND YEAR(p.criadoEm) = :ano AND MONTH(p.criadoEm) = :mes")
    BigDecimal sumSaldoByMes(@Param("ano") int ano, @Param("mes") int mes);
}
