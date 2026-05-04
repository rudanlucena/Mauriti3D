package com.mauriti3d.backend.pedido;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DataComemorativaRepository extends JpaRepository<DataComemorativa, Long> {
    List<DataComemorativa> findAllByOrderByMesAscDiaAsc();
}
