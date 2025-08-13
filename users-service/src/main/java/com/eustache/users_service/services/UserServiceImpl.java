package com.eustache.users_service.services;

import com.eustache.users_service.DTO.UserDTO;
import com.eustache.users_service.DTO.UserResponseDTO;
import com.eustache.users_service.UserDAO;
import com.eustache.users_service.UserMapper;
import com.eustache.users_service.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import static com.eustache.users_service.utils.UpdateUtil.setNotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserDAO userDAO;
    private final UserMapper userMapper;
    private final FileStorageService fileStorageService;

    @Override
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        try {
            return new ResponseEntity<>(
                    userDAO.findAll()
                            .stream()
                            .map(userMapper::toDTO)
                            .collect(Collectors.toList()), HttpStatus.OK
            );
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ResponseEntity<String> registerUser(UserDTO userDTO, MultipartFile profilePicture) {
        try {
            String imagePath = fileStorageService.upload(profilePicture);
            if (userDAO.findByUsername(userDTO.username()).isPresent()) {
                return new ResponseEntity<>("User already exists", HttpStatus.CONFLICT);
            }
            User user = userMapper.toEntity(userDTO, imagePath);
            userDAO.save(user);
            log.info("user has been created");
            return new ResponseEntity<>("User has been created", HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return new ResponseEntity<>("Failed to create user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<UserResponseDTO> getUserById(Integer id) {
        try {
            User user = userDAO.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            UserResponseDTO userResponseDTO = userMapper.toDTO(user);
            return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<UserResponseDTO> getUserByUsername(String username) {
        try {
            User user = userDAO.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("Username not found"));
            UserResponseDTO userResponseDTO = userMapper.toDTO(user);
            return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<String> updateUser(Integer id, UserDTO userDTO, MultipartFile profilePicture) {
        try {
            User existingUser = userDAO.findById(id)
                    .orElseThrow(() -> new IllegalStateException("User not found"));
            setNotNull(userDTO.email(), existingUser::setEmail);
            setNotNull(userDTO.username(), existingUser::setUsername);
            setNotNull(userDTO.password(), existingUser::setPassword);

            if (profilePicture != null && !profilePicture.isEmpty()) {
                String newImage =  fileStorageService.upload(profilePicture);
                existingUser.setProfilePicture(newImage);
            }
            userDAO.save(existingUser);
            log.info("user has been updated");
            return new ResponseEntity<>("User has been updated", HttpStatus.ACCEPTED);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return new ResponseEntity<>("Failed to upload image", HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<String> deleteUser(Integer id) {
        try {
            userDAO.deleteById(id);
            log.info("user has been deleted");
            return new ResponseEntity<>("User has been deleted", HttpStatus.OK);
        }catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }
        return new ResponseEntity<>("Failed to delete user", HttpStatus.NOT_FOUND);
    }
}
