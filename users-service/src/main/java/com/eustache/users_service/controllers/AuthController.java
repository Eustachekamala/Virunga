package com.eustache.users_service.controllers;

import com.eustache.users_service.DTO.UserDTO;
import com.eustache.users_service.DTO.requests.LoginRequest;
import com.eustache.users_service.services.UserServiceImpl;
import com.eustache.users_service.utils.JWTUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("users")
@Slf4j
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JWTUtil jwtUtil;
    private final UserServiceImpl userService;

    public AuthController(UserServiceImpl userService) {
        this.userService = userService;
    }


    @PostMapping("login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest loginRequest
            ) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.username(),
                            loginRequest.password()
                    ));
            String token = jwtUtil.generateToken(loginRequest.username());
            return new ResponseEntity<>("Logged in successfully: " + token , HttpStatus.OK);
        }catch (Exception e) {
            log.error("Login failed for {}: {}", loginRequest.username(), e.getMessage());
            System.out.println("Login failed for " + loginRequest.username());
            return new ResponseEntity<>("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("register")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> createUser(
            @ModelAttribute UserDTO userDAO,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        return userService.registerUser(userDAO, imageFile);
    }
}
