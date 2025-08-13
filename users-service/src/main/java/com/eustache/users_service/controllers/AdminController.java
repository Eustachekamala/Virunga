package com.eustache.users_service.controllers;

import com.eustache.users_service.DTO.UserDTO;
import com.eustache.users_service.DTO.UserResponseDTO;
import com.eustache.users_service.DTO.products.ProductDTO;
import com.eustache.users_service.DTO.products.ProductResponseDTO;
import com.eustache.users_service.feign.ProductClient;
import com.eustache.users_service.services.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("users")
public class AdminController {
    private final UserServiceImpl userService;

    @GetMapping("/allUsers")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("get/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Integer id
    ) {
        return userService.getUserById(id);
    }

    @GetMapping("get/{username}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponseDTO> getUserByUsername(
            @PathVariable String username
    ){
        return userService.getUserByUsername(username);
    }

    @PatchMapping("update/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateUser(
            @PathVariable Integer id,
            @ModelAttribute UserDTO userDTO,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        return userService.updateUser(id, userDTO, imageFile);
    }

    @DeleteMapping("{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer id
    ) {
       try {
           return userService.deleteUser(id);
       }catch (Exception ex){
           return new ResponseEntity<>("Error deleting user", HttpStatus.NOT_FOUND);
       }
    }

}
