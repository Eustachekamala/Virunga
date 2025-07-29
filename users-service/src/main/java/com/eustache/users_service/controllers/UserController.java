package com.eustache.users_service.controllers;

import com.eustache.users_service.DTO.UserDTO;
import com.eustache.users_service.DTO.UserResponseDTO;
import com.eustache.users_service.services.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("users")
public class UserController {
    private final UserServiceImpl userService;

    @GetMapping("/allUsers")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("get/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable Integer id
    ) {
        return userService.getUserById(id);
    }

    @GetMapping("get/{username}")
    public ResponseEntity<UserResponseDTO> getUserByUsername(
            @PathVariable String username
    ){
        return userService.getUserByUsername(username);
    }

    @PostMapping("insert")
    public ResponseEntity<String> createUser(
            @ModelAttribute UserDTO userDAO,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        return userService.createUser(userDAO, imageFile);
    }

    @PatchMapping("update/{id}")
    public ResponseEntity<String> updateUser(
            @PathVariable Integer id,
            @ModelAttribute UserDTO userDTO,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        return userService.updateUser(id, userDTO, imageFile);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Integer id
    ) {
        return userService.deleteUser(id);
    }
}
