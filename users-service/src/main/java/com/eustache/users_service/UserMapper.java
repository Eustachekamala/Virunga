package com.eustache.users_service;

import com.eustache.users_service.DTO.UserDTO;
import com.eustache.users_service.DTO.UserResponseDTO;
import com.eustache.users_service.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserResponseDTO toDTO(User user) {
        if (user == null) return null;
        return new UserResponseDTO(
            user.getId(),
            user.getEmail(),
            user.getUsername(),
            user.getProfilePicture()
        );
    }

    public User toEntity(UserDTO userDTO, String profilePicture) {
        if (userDTO == null) return null;
        User user = new User();
        user.setEmail(userDTO.email());
        user.setUsername(userDTO.username());
        user.setPassword(userDTO.password());
        user.setProfilePicture(profilePicture);
        return user;
    }
}
