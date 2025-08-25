package com.eustache.users_service;

import com.eustache.users_service.DTO.UserDTO;
import com.eustache.users_service.DTO.UserResponseDTO;
import com.eustache.users_service.model.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        return new UserResponseDTO(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getRole(),
            user.getProfilePicture(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    public User toEntity(UserDTO userDTO, String profilePicture) {
        if (userDTO == null) return null;
        //Here we Bcrypt the password before save it in the database
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        //Create a new instance of the user
        User user = new User();
        user.setEmail(userDTO.email());
        user.setUsername(userDTO.username());
        user.setRole(userDTO.role());
        user.setPassword(passwordEncoder.encode(userDTO.password()));
        user.setProfilePicture(profilePicture);
        return user;
    }
}
