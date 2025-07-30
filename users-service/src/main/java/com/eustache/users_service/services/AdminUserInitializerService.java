package com.eustache.users_service.services;

import com.eustache.users_service.UserDAO;
import com.eustache.users_service.model.Role;
import com.eustache.users_service.model.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializerService {

    @Bean
    public CommandLineRunner commandLineRunner(UserDAO userDAO, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userDAO.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin1234"));
                admin.setRole(Role.ADMIN);

                userDAO.save(admin);
                System.out.println("Default admin user has been created");
            }
        };
    }
}
