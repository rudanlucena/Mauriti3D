package com.mauriti3d.backend.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface DespesaRepository extends JpaRepository<Despesa, Long> {

    @Query("SELECT d FROM Despesa d WHERE YEAR(d.data) = :ano AND MONTH(d.data) = :mes ORDER BY d.data DESC")
    List<Despesa> findByMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query("SELECT SUM(d.valor) FROM Despesa d WHERE YEAR(d.data) = :ano AND MONTH(d.data) = :mes")
    BigDecimal sumByMes(@Param("ano") int ano, @Param("mes") int mes);

    @Query(value = """
        SELECT EXTRACT(YEAR FROM data)::int, EXTRACT(MONTH FROM data)::int, COALESCE(SUM(valor), 0)
        FROM despesas
        WHERE data >= NOW() - CAST(:meses || ' months' AS INTERVAL)
        GROUP BY EXTRACT(YEAR FROM data), EXTRACT(MONTH FROM data)
    """, nativeQuery = true)
    List<Object[]> statsMensais(@Param("meses") int meses);
}
