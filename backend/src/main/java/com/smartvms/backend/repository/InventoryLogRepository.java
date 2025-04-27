package com.smartvms.backend.repository;

import com.smartvms.backend.model.InventoryLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
    
    List<InventoryLog> findByItemId(Long itemId);
    
    Page<InventoryLog> findAll(Pageable pageable);
} 