package com.smartvms.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ReceiptItemId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "receipt_id")
    private Long receiptId;

    @Column(name = "item_id")
    private Long itemId;
} 