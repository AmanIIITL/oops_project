package com.smartvms.backend.controller;

import com.smartvms.backend.dto.ApiResponse;
import com.smartvms.backend.dto.AuthResponse;
import com.smartvms.backend.dto.CustomerSignupRequest;
import com.smartvms.backend.dto.LoginRequest;
import com.smartvms.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/customer/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCustomer(@Valid @RequestBody CustomerSignupRequest signupRequest) {
        AuthResponse response = authService.registerCustomer(signupRequest);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PostMapping("/customer/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginCustomer(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticateCustomer(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginAdmin(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.authenticateAdmin(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
} 