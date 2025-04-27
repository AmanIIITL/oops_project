package com.smartvms.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateInventoryRequest {
    
    @NotNull(message = "Item ID is required")
    private Long itemId;
    
    private Integer quantity;
    
    private BigDecimal price;
} 