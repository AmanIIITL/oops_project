package com.smartvms.backend.service.impl;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.smartvms.backend.dto.CartDto;
import com.smartvms.backend.dto.CartItemDto;
import com.smartvms.backend.dto.ReceiptDto;
import com.smartvms.backend.model.Customer;
import com.smartvms.backend.model.Item;
import com.smartvms.backend.model.Receipt;
import com.smartvms.backend.model.ReceiptItem;
import com.smartvms.backend.model.ReceiptItemId;
import com.smartvms.backend.repository.CustomerRepository;
import com.smartvms.backend.repository.ItemRepository;
import com.smartvms.backend.repository.ReceiptRepository;
import com.smartvms.backend.service.CartService;
import com.smartvms.backend.service.ItemService;
import com.smartvms.backend.service.ReceiptService;
import com.smartvms.backend.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReceiptServiceImpl implements ReceiptService {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private WalletService walletService;
    
    @Autowired
    private ItemService itemService;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private ReceiptRepository receiptRepository;
    
    @Override
    @Transactional
    public ReceiptDto checkout(Long customerId) {
        // Get customer cart
        CartDto cart = cartService.getCart(customerId);
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }
        
        // Check if customer has sufficient balance
        if (!walletService.hasSufficientBalance(customerId, cart.getTotalAmount())) {
            throw new RuntimeException("Insufficient balance in wallet");
        }
        
        // Get customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + customerId));
        
        // Create receipt
        Receipt receipt = new Receipt();
        receipt.setCustomer(customer);
        receipt.setTotalPaid(cart.getTotalAmount());
        
        // Save receipt to get ID
        Receipt savedReceipt = receiptRepository.save(receipt);
        
        // Process cart items
        for (CartItemDto cartItem : cart.getItems()) {
            // Reduce item quantity in inventory
            itemService.updateItemQuantity(cartItem.getItemId(), cartItem.getQuantity());
            
            // Get the item
            Item item = itemRepository.findById(cartItem.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + cartItem.getItemId()));
            
            // Create receipt item
            ReceiptItem receiptItem = new ReceiptItem();
            ReceiptItemId id = new ReceiptItemId(savedReceipt.getId(), item.getId());
            receiptItem.setId(id);
            receiptItem.setReceipt(savedReceipt);
            receiptItem.setItem(item);
            receiptItem.setQuantity(cartItem.getQuantity());
            receiptItem.setPrice(cartItem.getPrice());
            
            // Add to receipt items
            savedReceipt.getItems().add(receiptItem);
        }
        
        // Update saved receipt
        savedReceipt = receiptRepository.save(savedReceipt);
        
        // Deduct amount from wallet
        walletService.deductFromWallet(customerId, cart.getTotalAmount());
        
        // Clear cart
        cartService.clearCart(customerId);
        
        return mapToDto(savedReceipt);
    }
    
    @Override
    public ReceiptDto getReceipt(Long receiptId) {
        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new RuntimeException("Receipt not found with ID: " + receiptId));
        
        return mapToDto(receipt);
    }
    
    @Override
    public List<ReceiptDto> getCustomerReceipts(Long customerId) {
        return receiptRepository.findByCustomerId(customerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public Page<ReceiptDto> getAllReceipts(Pageable pageable) {
        return receiptRepository.findAll(pageable)
                .map(this::mapToDto);
    }
    
    @Override
    public byte[] generateReceiptPdf(Long receiptId) {
        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new RuntimeException("Receipt not found with ID: " + receiptId));
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            
            // Add title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Smart Vending Machine Receipt", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);
            
            // Add receipt details
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Receipt #: " + receipt.getId(), normalFont));
            document.add(new Paragraph("Customer: " + receipt.getCustomer().getMobile(), normalFont));
            document.add(new Paragraph("Date: " + receipt.getTimestamp().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), normalFont));
            document.add(Chunk.NEWLINE);
            
            // Add items table
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{4, 2, 2, 2});
            
            // Add table header
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            
            PdfPCell cell;
            cell = new PdfPCell(new Phrase("Item", headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
            
            cell = new PdfPCell(new Phrase("Quantity", headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
            
            cell = new PdfPCell(new Phrase("Price", headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
            
            cell = new PdfPCell(new Phrase("Total", headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
            
            // Add table data
            for (ReceiptItem item : receipt.getItems()) {
                table.addCell(new Phrase(item.getItem().getName(), normalFont));
                table.addCell(new Phrase(item.getQuantity().toString(), normalFont));
                table.addCell(new Phrase("$" + item.getPrice(), normalFont));
                table.addCell(new Phrase("$" + item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())), normalFont));
            }
            
            document.add(table);
            document.add(Chunk.NEWLINE);
            
            // Add total
            Paragraph total = new Paragraph("Total Amount: $" + receipt.getTotalPaid(), headerFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            document.add(total);
            
            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }
        
        return baos.toByteArray();
    }
    
    private ReceiptDto mapToDto(Receipt receipt) {
        ReceiptDto dto = new ReceiptDto();
        dto.setId(receipt.getId());
        dto.setCustomerId(receipt.getCustomer().getId());
        dto.setCustomerMobile(receipt.getCustomer().getMobile());
        dto.setTotalPaid(receipt.getTotalPaid());
        dto.setTimestamp(receipt.getTimestamp());
        
        List<CartItemDto> items = new ArrayList<>();
        for (ReceiptItem receiptItem : receipt.getItems()) {
            CartItemDto itemDto = new CartItemDto();
            itemDto.setItemId(receiptItem.getItem().getId());
            itemDto.setName(receiptItem.getItem().getName());
            itemDto.setQuantity(receiptItem.getQuantity());
            itemDto.setPrice(receiptItem.getPrice());
            itemDto.setTotalPrice(receiptItem.getPrice().multiply(BigDecimal.valueOf(receiptItem.getQuantity())));
            items.add(itemDto);
        }
        
        dto.setItems(items);
        return dto;
    }
} 