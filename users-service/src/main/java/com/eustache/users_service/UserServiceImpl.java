package com.eustache.users_service;

import com.eustache.users_service.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserDAO userDAO;

    @Override
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = new ArrayList<>(userDAO.findAll());
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> createUser(User user) {
        try {
            User savedUser = new User();
            savedUser.setEmail(user.getEmail());
            savedUser.setPassword(user.getPassword());
            savedUser.setUsername(user.getUsername());
            userDAO.save(savedUser);
            return new ResponseEntity<>("User created successfully", HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>("User creation failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<User> getUserById(Integer id) {
        try{
            return new ResponseEntity<>(userDAO.findById(id)
                    .orElseThrow(() -> new IllegalStateException("User not found with id " + id))
                    ,HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<User> getUserByUsername(String username) {
       try{
           return new ResponseEntity<>(userDAO.findByUsername(username)
                   .orElseThrow(() -> new IllegalArgumentException("User with username" + username + "not found"))
                   ,HttpStatus.OK);
       }catch (Exception ex) {
           log.error(ex.getMessage(), ex);
       }
       return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @Override
    public ResponseEntity<String> updateUser(Integer id, User user) {
        try{
            User existingUser  = userDAO.findById(id)
                    .orElseThrow(() -> new IllegalStateException("User not found"));
            existingUser.setEmail(user.getEmail());
            existingUser.setPassword(user.getPassword());
            existingUser.setUsername(user.getUsername());
            userDAO.save(existingUser);
            return new ResponseEntity<>("User updated successfully", HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>("User update failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteUser(Integer id) {
        try {
            userDAO.deleteById(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>("User delete failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
