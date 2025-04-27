package com.smartvms.backend.repository;

import com.smartvms.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByMobile(String mobile);
    
    boolean existsByMobile(String mobile);
} 