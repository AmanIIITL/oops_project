package com.smartvms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReceiptDto {
    private Long id;
    private Long customerId;
    private String customerMobile;
    private BigDecimal totalPaid;
    private LocalDateTime timestamp;
    private List<CartItemDto> items = new ArrayList<>();
} 