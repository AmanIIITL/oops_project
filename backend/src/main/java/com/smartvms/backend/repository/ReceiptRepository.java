package com.smartvms.backend.repository;

import com.smartvms.backend.model.Receipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    
    List<Receipt> findByCustomerId(Long customerId);
    
    Page<Receipt> findAll(Pageable pageable);
} 