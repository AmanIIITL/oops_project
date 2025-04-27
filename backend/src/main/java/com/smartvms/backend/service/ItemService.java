package com.smartvms.backend.service;

import com.smartvms.backend.dto.ItemDto;
import com.smartvms.backend.dto.UpdateInventoryRequest;

import java.util.List;

public interface ItemService {
    
    List<ItemDto> getAllItems();
    
    List<ItemDto> getItemsByCategory(String category);
    
    ItemDto getItemById(Long id);
    
    void updateItemQuantity(Long id, int quantity);
    
    void updateInventory(String adminId, UpdateInventoryRequest request);
} 