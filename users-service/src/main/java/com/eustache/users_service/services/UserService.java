package com.eustache.users_service.services;

import com.eustache.users_service.DTO.UserDTO;
import com.eustache.users_service.DTO.UserResponseDTO;
import com.eustache.users_service.DTO.products.ProductDTO;
import com.eustache.users_service.DTO.products.ProductResponseDTO;
import com.eustache.users_service.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public interface UserService {
    ResponseEntity<List<UserResponseDTO>> getAllUsers();
    ResponseEntity<UserResponseDTO> getUserById(Integer id);
    ResponseEntity<UserResponseDTO> getUserByUsername(String username);
    ResponseEntity<String> updateUser(Integer id, UserDTO userDTO, MultipartFile profilePicture);
    ResponseEntity<String> deleteUser(Integer id);
}
