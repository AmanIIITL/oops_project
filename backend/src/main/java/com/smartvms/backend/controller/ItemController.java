package com.smartvms.backend.controller;

import com.smartvms.backend.dto.ApiResponse;
import com.smartvms.backend.dto.ItemDto;
import com.smartvms.backend.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    
    @Autowired
    private ItemService itemService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<ItemDto>>> getAllItems() {
        List<ItemDto> items = itemService.getAllItems();
        return ResponseEntity.ok(ApiResponse.success(items));
    }
    
    @GetMapping("/categories/{category}")
    public ResponseEntity<ApiResponse<List<ItemDto>>> getItemsByCategory(@PathVariable String category) {
        List<ItemDto> items = itemService.getItemsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success(items));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ItemDto>> getItemById(@PathVariable Long id) {
        ItemDto item = itemService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }
} 