package com.smartvms.backend.service.impl;

import com.smartvms.backend.dto.ItemDto;
import com.smartvms.backend.dto.UpdateInventoryRequest;
import com.smartvms.backend.model.InventoryLog;
import com.smartvms.backend.model.Item;
import com.smartvms.backend.repository.InventoryLogRepository;
import com.smartvms.backend.repository.ItemRepository;
import com.smartvms.backend.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemServiceImpl implements ItemService {
    
    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private InventoryLogRepository inventoryLogRepository;
    
    @Override
    public List<ItemDto> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<ItemDto> getItemsByCategory(String category) {
        return itemRepository.findAllByCategory(category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public ItemDto getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));
        
        return mapToDto(item);
    }
    
    @Override
    @Transactional
    public void updateItemQuantity(Long id, int quantity) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));
        
        if (item.getQuantity() < quantity) {
            throw new RuntimeException("Not enough stock available");
        }
        
        item.setQuantity(item.getQuantity() - quantity);
        itemRepository.save(item);
    }
    
    @Override
    @Transactional
    public void updateInventory(String adminId, UpdateInventoryRequest request) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + request.getItemId()));
        
        // Create log entry
        InventoryLog log = new InventoryLog();
        log.setAdminId(adminId);
        log.setItem(item);
        log.setOldQty(item.getQuantity());
        log.setOldPrice(item.getPrice());
        
        // Update quantity if provided
        if (request.getQuantity() != null) {
            item.setQuantity(request.getQuantity());
        }
        
        // Update price if provided
        if (request.getPrice() != null) {
            item.setPrice(request.getPrice());
        }
        
        // Save item and log
        Item updatedItem = itemRepository.save(item);
        
        log.setNewQty(updatedItem.getQuantity());
        log.setNewPrice(updatedItem.getPrice());
        inventoryLogRepository.save(log);
    }
    
    private ItemDto mapToDto(Item item) {
        ItemDto dto = new ItemDto();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setCategory(item.getCategory());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setAvailable(item.getQuantity() > 0);
        return dto;
    }
} 