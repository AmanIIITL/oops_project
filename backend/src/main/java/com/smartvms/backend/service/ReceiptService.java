package com.smartvms.backend.service;

import com.smartvms.backend.dto.ReceiptDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReceiptService {
    
    ReceiptDto checkout(Long customerId);
    
    ReceiptDto getReceipt(Long receiptId);
    
    List<ReceiptDto> getCustomerReceipts(Long customerId);
    
    Page<ReceiptDto> getAllReceipts(Pageable pageable);
    
    byte[] generateReceiptPdf(Long receiptId);
} 