package com.smartvms.backend.service;

import com.smartvms.backend.dto.TopUpRequest;
import com.smartvms.backend.dto.WalletDto;

import java.math.BigDecimal;

public interface WalletService {
    
    WalletDto getWalletByCustomerId(Long customerId);
    
    WalletDto topUpWallet(Long customerId, TopUpRequest topUpRequest);
    
    boolean hasSufficientBalance(Long customerId, BigDecimal amount);
    
    void deductFromWallet(Long customerId, BigDecimal amount);
    
    void returnChange(Long customerId);
} 