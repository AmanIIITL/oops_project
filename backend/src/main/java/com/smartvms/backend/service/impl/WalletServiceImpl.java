package com.smartvms.backend.service.impl;

import com.smartvms.backend.dto.TopUpRequest;
import com.smartvms.backend.dto.WalletDto;
import com.smartvms.backend.model.Wallet;
import com.smartvms.backend.repository.WalletRepository;
import com.smartvms.backend.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class WalletServiceImpl implements WalletService {
    
    @Autowired
    private WalletRepository walletRepository;
    
    @Override
    public WalletDto getWalletByCustomerId(Long customerId) {
        Wallet wallet = walletRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for customer ID: " + customerId));
        
        return mapToDto(wallet);
    }
    
    @Override
    @Transactional
    public WalletDto topUpWallet(Long customerId, TopUpRequest topUpRequest) {
        Wallet wallet = walletRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for customer ID: " + customerId));
        
        // Simulate payment processing
        // In a real application, you would integrate with a payment gateway here
        
        // Update wallet balance
        wallet.setBalance(wallet.getBalance().add(topUpRequest.getAmount()));
        Wallet updatedWallet = walletRepository.save(wallet);
        
        return mapToDto(updatedWallet);
    }
    
    @Override
    public boolean hasSufficientBalance(Long customerId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for customer ID: " + customerId));
        
        return wallet.getBalance().compareTo(amount) >= 0;
    }
    
    @Override
    @Transactional
    public void deductFromWallet(Long customerId, BigDecimal amount) {
        Wallet wallet = walletRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for customer ID: " + customerId));
        
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);
    }
    
    @Override
    @Transactional
    public void returnChange(Long customerId) {
        Wallet wallet = walletRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Wallet not found for customer ID: " + customerId));
        
        // Simulate returning the change to the customer
        // In a real application, you would integrate with a payment gateway here
        
        wallet.setBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);
    }
    
    private WalletDto mapToDto(Wallet wallet) {
        WalletDto dto = new WalletDto();
        dto.setCustomerId(wallet.getCustomerId());
        dto.setBalance(wallet.getBalance());
        return dto;
    }
} 