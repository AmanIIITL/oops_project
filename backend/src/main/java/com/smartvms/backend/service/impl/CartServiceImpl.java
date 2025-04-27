package com.smartvms.backend.service.impl;

import com.smartvms.backend.dto.AddToCartRequest;
import com.smartvms.backend.dto.CartDto;
import com.smartvms.backend.dto.CartItemDto;
import com.smartvms.backend.model.Item;
import com.smartvms.backend.repository.ItemRepository;
import com.smartvms.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CartServiceImpl implements CartService {
    
    @Autowired
    private ItemRepository itemRepository;
    
    // In a real application, this would be stored in a database or Redis
    // For simplicity, we'll use an in-memory map (not suitable for production)
    private final Map<Long, CartDto> customerCarts = new ConcurrentHashMap<>();
    
    @Override
    public CartDto getCart(Long customerId) {
        return customerCarts.getOrDefault(customerId, new CartDto());
    }
    
    @Override
    public CartDto addToCart(Long customerId, AddToCartRequest request) {
        CartDto cart = customerCarts.getOrDefault(customerId, new CartDto());
        
        // Find item in database
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + request.getItemId()));
        
        // Check stock availability
        if (item.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock available");
        }
        
        // Check if item already exists in cart
        boolean itemExists = false;
        for (CartItemDto cartItem : cart.getItems()) {
            if (cartItem.getItemId().equals(request.getItemId())) {
                // Update quantity
                int newQuantity = cartItem.getQuantity() + request.getQuantity();
                
                // Check if new quantity is available
                if (item.getQuantity() < newQuantity) {
                    throw new RuntimeException("Not enough stock available");
                }
                
                cartItem.setQuantity(newQuantity);
                cartItem.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
                itemExists = true;
                break;
            }
        }
        
        // If item doesn't exist in cart, add it
        if (!itemExists) {
            CartItemDto cartItem = new CartItemDto();
            cartItem.setItemId(item.getId());
            cartItem.setName(item.getName());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(item.getPrice());
            cartItem.setTotalPrice(item.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cart.getItems().add(cartItem);
        }
        
        // Recalculate total amount
        calculateTotal(cart);
        
        // Save cart
        customerCarts.put(customerId, cart);
        
        return cart;
    }
    
    @Override
    public CartDto removeFromCart(Long customerId, Long itemId) {
        CartDto cart = customerCarts.getOrDefault(customerId, new CartDto());
        
        // Remove item from cart
        cart.getItems().removeIf(item -> item.getItemId().equals(itemId));
        
        // Recalculate total amount
        calculateTotal(cart);
        
        // Save cart
        customerCarts.put(customerId, cart);
        
        return cart;
    }
    
    @Override
    public void clearCart(Long customerId) {
        customerCarts.remove(customerId);
    }
    
    private void calculateTotal(CartDto cart) {
        BigDecimal total = BigDecimal.ZERO;
        for (CartItemDto item : cart.getItems()) {
            total = total.add(item.getTotalPrice());
        }
        cart.setTotalAmount(total);
    }
} 