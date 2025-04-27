package com.smartvms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {
    private Long itemId;
    private String name;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
} 