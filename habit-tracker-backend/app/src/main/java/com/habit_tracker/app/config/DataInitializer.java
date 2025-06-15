package com.habit_tracker.app.config;

import com.habit_tracker.app.models.User;
import com.habit_tracker.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Create default admin user if it doesn't exist
            if (!userRepository.existsByUsername("admin")) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@habittracker.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setRole(User.Role.ADMIN);
                adminUser.setIsEnabled(true);
                
                userRepository.save(adminUser);
                System.out.println("✅ Default admin user created: admin/admin123");
            } else {
                System.out.println("✅ Admin user already exists");
            }
        } catch (Exception e) {
            System.err.println("❌ Error creating default user: " + e.getMessage());
            // Don't throw exception to prevent app startup failure
        }
    }
}