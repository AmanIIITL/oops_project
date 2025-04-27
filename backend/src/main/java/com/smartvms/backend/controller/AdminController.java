package com.smartvms.backend.controller;

import com.smartvms.backend.dto.ApiResponse;
import com.smartvms.backend.dto.ItemDto;
import com.smartvms.backend.dto.ReceiptDto;
import com.smartvms.backend.dto.UpdateInventoryRequest;
import com.smartvms.backend.service.ItemService;
import com.smartvms.backend.service.ReceiptService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    
    @Autowired
    private ItemService itemService;
    
    @Autowired
    private ReceiptService receiptService;
    
    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<List<ItemDto>>> getInventory() {
        List<ItemDto> items = itemService.getAllItems();
        return ResponseEntity.ok(ApiResponse.success(items));
    }
    
    @PutMapping("/inventory")
    public ResponseEntity<ApiResponse<Void>> updateInventory(@Valid @RequestBody UpdateInventoryRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId = authentication.getName();
        
        itemService.updateInventory(adminId, request);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<Page<ReceiptDto>>> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<ReceiptDto> receipts = receiptService.getAllReceipts(pageRequest);
        
        return ResponseEntity.ok(ApiResponse.success(receipts));
    }
} 