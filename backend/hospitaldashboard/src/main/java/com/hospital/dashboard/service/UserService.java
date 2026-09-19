package com.hospital.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.dashboard.entity.User;
import com.hospital.dashboard.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ==================================================
    // GET ALL USERS
    // ==================================================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    // ==================================================
    // SAVE USER / SIGNUP
    // ==================================================

    public User saveUser(User user) {

        if (user.getUsername() == null ||
            user.getUsername().trim().isEmpty()) {

            throw new RuntimeException("Username is required");
        }

        if (user.getEmail() == null ||
            user.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }

        if (user.getPassword() == null ||
            user.getPassword().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }

        if (user.getRole() == null ||
            user.getRole().trim().isEmpty()) {

            throw new RuntimeException("Role is required");
        }

        // Check duplicate username
        if (userRepository.existsByUsername(
                user.getUsername())) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }

        // Check duplicate email
        if (userRepository.existsByEmail(
                user.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        return userRepository.save(user);
    }


    // ==================================================
    // LOGIN
    // Email + Password
    // ==================================================

    public User login(String email, String password) {

        return userRepository.findByEmailAndPassword(
                email,
                password
        );
    }
}
