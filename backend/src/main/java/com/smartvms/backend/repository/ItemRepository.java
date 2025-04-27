package com.smartvms.backend.repository;

import com.smartvms.backend.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    List<Item> findAllByCategory(String category);
    
    List<Item> findAllByOrderByCategory();
} 