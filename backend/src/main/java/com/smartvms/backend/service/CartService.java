package com.smartvms.backend.service;

import com.smartvms.backend.dto.AddToCartRequest;
import com.smartvms.backend.dto.CartDto;

public interface CartService {
    
    CartDto getCart(Long customerId);
    
    CartDto addToCart(Long customerId, AddToCartRequest request);
    
    CartDto removeFromCart(Long customerId, Long itemId);
    
    void clearCart(Long customerId);
} 