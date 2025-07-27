package com.eustache.users_service;

import com.eustache.users_service.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface UserService {
    ResponseEntity<List<User>> getAllUsers();
    ResponseEntity<String> createUser(User user);
    ResponseEntity<User> getUserById(Integer id);
    ResponseEntity<User> getUserByUsername(String username);
    ResponseEntity<String> updateUser(Integer id, User user);
    ResponseEntity<String> deleteUser(Integer id);
}
