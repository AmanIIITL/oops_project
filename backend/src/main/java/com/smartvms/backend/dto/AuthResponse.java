package com.smartvms.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private String role;
    
    public AuthResponse(String accessToken, Long userId, String role) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.role = role;
    }
} 