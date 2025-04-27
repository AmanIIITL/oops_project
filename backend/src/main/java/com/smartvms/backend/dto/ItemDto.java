package com.smartvms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDto {
    private Long id;
    private String name;
    private String category;
    private BigDecimal price;
    private Integer quantity;
    private boolean available;
    
    public boolean isAvailable() {
        return quantity > 0;
    }
} 