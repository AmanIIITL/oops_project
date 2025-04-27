package com.smartvms.backend.controller;

import com.smartvms.backend.dto.*;
import com.smartvms.backend.security.JwtTokenProvider;
import com.smartvms.backend.service.CartService;
import com.smartvms.backend.service.ReceiptService;
import com.smartvms.backend.service.WalletService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    
    @Autowired
    private WalletService walletService;
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private ReceiptService receiptService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @GetMapping("/wallet")
    public ResponseEntity<ApiResponse<WalletDto>> getWallet() {
        Long customerId = getCurrentCustomerId();
        WalletDto wallet = walletService.getWalletByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }
    
    @PostMapping("/wallet/topup")
    public ResponseEntity<ApiResponse<WalletDto>> topUpWallet(@Valid @RequestBody TopUpRequest topUpRequest) {
        Long customerId = getCurrentCustomerId();
        WalletDto wallet = walletService.topUpWallet(customerId, topUpRequest);
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }
    
    @PostMapping("/wallet/return-change")
    public ResponseEntity<ApiResponse<WalletDto>> returnChange() {
        Long customerId = getCurrentCustomerId();
        walletService.returnChange(customerId);
        WalletDto wallet = walletService.getWalletByCustomerId(customerId);
        return ResponseEntity.ok(ApiResponse.success(wallet));
    }
    
    @GetMapping("/cart")
    public ResponseEntity<ApiResponse<CartDto>> getCart() {
        Long customerId = getCurrentCustomerId();
        CartDto cart = cartService.getCart(customerId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }
    
    @PostMapping("/cart/add")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        Long customerId = getCurrentCustomerId();
        CartDto cart = cartService.addToCart(customerId, request);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }
    
    @DeleteMapping("/cart/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeFromCart(@PathVariable Long itemId) {
        Long customerId = getCurrentCustomerId();
        CartDto cart = cartService.removeFromCart(customerId, itemId);
        return ResponseEntity.ok(ApiResponse.success(cart));
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<ReceiptDto>> checkout() {
        Long customerId = getCurrentCustomerId();
        ReceiptDto receipt = receiptService.checkout(customerId);
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<ReceiptDto>>> getTransactions() {
        Long customerId = getCurrentCustomerId();
        List<ReceiptDto> receipts = receiptService.getCustomerReceipts(customerId);
        return ResponseEntity.ok(ApiResponse.success(receipts));
    }
    
    @GetMapping("/receipts/{id}")
    public ResponseEntity<ApiResponse<ReceiptDto>> getReceipt(@PathVariable Long id) {
        ReceiptDto receipt = receiptService.getReceipt(id);
        
        // Check if receipt belongs to current customer
        Long customerId = getCurrentCustomerId();
        if (!receipt.getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("You don't have permission to view this receipt"));
        }
        
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }
    
    @GetMapping("/receipts/{id}/pdf")
    public ResponseEntity<byte[]> getReceiptPdf(@PathVariable Long id) {
        ReceiptDto receipt = receiptService.getReceipt(id);
        
        // Check if receipt belongs to current customer
        Long customerId = getCurrentCustomerId();
        if (!receipt.getCustomerId().equals(customerId)) {
            return ResponseEntity.status(403).body(null);
        }
        
        byte[] pdfBytes = receiptService.generateReceiptPdf(id);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "receipt-" + id + ".pdf");
        
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
    
    private Long getCurrentCustomerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String mobile = authentication.getName();
        
        try {
            // In a real app, we'd use a service to get the customer ID from mobile
            // For simplicity, we'll just parse it from the token subject
            return Long.parseLong(mobile);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid customer ID: " + mobile);
        }
    }
} 