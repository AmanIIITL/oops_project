package com.smartvms.backend.service;

import com.smartvms.backend.dto.AuthResponse;
import com.smartvms.backend.dto.CustomerSignupRequest;
import com.smartvms.backend.dto.LoginRequest;
import com.smartvms.backend.model.Customer;

public interface AuthService {
    
    AuthResponse registerCustomer(CustomerSignupRequest signupRequest);
    
    AuthResponse authenticateCustomer(LoginRequest loginRequest);
    
    AuthResponse authenticateAdmin(LoginRequest loginRequest);
    
    Customer getCustomerFromMobile(String mobile);
} 