package com.smartvms.backend.service.impl;

import com.smartvms.backend.dto.AuthResponse;
import com.smartvms.backend.dto.CustomerSignupRequest;
import com.smartvms.backend.dto.LoginRequest;
import com.smartvms.backend.model.Customer;
import com.smartvms.backend.model.Wallet;
import com.smartvms.backend.repository.CustomerRepository;
import com.smartvms.backend.repository.WalletRepository;
import com.smartvms.backend.security.JwtTokenProvider;
import com.smartvms.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Value("${admin.username}")
    private String adminUsername;
    
    @Value("${admin.password}")
    private String adminPassword;
    
    @Override
    @Transactional
    public AuthResponse registerCustomer(CustomerSignupRequest signupRequest) {
        // Check if mobile number already exists
        if (customerRepository.existsByMobile(signupRequest.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }
        
        // Create and save customer
        Customer customer = new Customer();
        customer.setMobile(signupRequest.getMobile());
        customer.setPasswordHash(passwordEncoder.encode(signupRequest.getPassword()));
        
        Customer savedCustomer = customerRepository.save(customer);
        
        // Create wallet for customer with zero balance
        Wallet wallet = new Wallet();
        wallet.setCustomer(savedCustomer);
        wallet.setBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);
        
        // Generate JWT token
        String token = tokenProvider.generateCustomerToken(savedCustomer.getMobile());
        
        return new AuthResponse(token, savedCustomer.getId(), "ROLE_CUSTOMER");
    }
    
    @Override
    public AuthResponse authenticateCustomer(LoginRequest loginRequest) {
        Customer customer = customerRepository.findByMobile(loginRequest.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), customer.getPasswordHash())) {
            throw new BadCredentialsException("Invalid credentials");
        }
        
        String token = tokenProvider.generateCustomerToken(customer.getMobile());
        
        return new AuthResponse(token, customer.getId(), "ROLE_CUSTOMER");
    }
    
    @Override
    public AuthResponse authenticateAdmin(LoginRequest loginRequest) {
        // Admin authentication with hardcoded credentials from application.yml
        if (adminUsername.equals(loginRequest.getUsername()) && 
                adminPassword.equals(loginRequest.getPassword())) {
            
            String token = tokenProvider.generateAdminToken(adminUsername);
            return new AuthResponse(token, 0L, "ROLE_ADMIN");
        }
        
        throw new BadCredentialsException("Invalid admin credentials");
    }
    
    @Override
    public Customer getCustomerFromMobile(String mobile) {
        return customerRepository.findByMobile(mobile)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
} 