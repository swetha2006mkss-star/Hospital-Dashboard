package com.hospital.dashboard.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hospital.dashboard.entity.User;
import com.hospital.dashboard.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

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

        if (userRepository.existsByUsername(
                user.getUsername())) {

            throw new RuntimeException(
                    "Username already exists"
            );
        }

        if (userRepository.existsByEmail(
                user.getEmail())) {

            throw new RuntimeException(
                    "Email already exists"
            );
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public User login(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return null;
        }

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            return null;
        }

        return user;
    }

    // Temporary method:
    // Convert all 10 existing Doctor passwords to BCrypt

    public void updateDoctorPasswords() {

        updatePassword("drjohn@gmail.com", "john");

        updatePassword("drpriya@gmail.com", "priya");

        updatePassword("drarun@gmail.com", "arun");

        updatePassword("drmeena@gmail.com", "meena");

        updatePassword("drkarthik@gmail.com", "karthik");

        updatePassword("drdivya@gmail.com", "divya");

        updatePassword("drravi@gmail.com", "ravi");

        updatePassword("drsneha@gmail.com", "sneha");

        updatePassword("drkumar@gmail.com", "kumar");

        updatePassword("drnisha@gmail.com", "nisha");
    }
    public void updatePatientPasswords() {

    updatePassword("patient1@gmail.com", "recep123");
    updatePassword("kalai@gmail.com", "123");
    updatePassword("yoga@gmail.com", "123");
    updatePassword("abi@gmail.com", "098");
    updatePassword("rathi@gmail.com", "123");
    updatePassword("anitha@gmail.com", "anitha");
    updatePassword("rithika@gmail.com", "rithu");
    updatePassword("sharu@gmail.com", "sharu");
}
public void updateAdminPassword() {
    updatePassword("admin@gmail.com", "admin");
}
    private void updatePassword(
            String email,
            String plainPassword) {

        User user = userRepository.findByEmail(email);

        if (user != null) {

            user.setPassword(
                    passwordEncoder.encode(plainPassword)
            );

            userRepository.save(user);
        }
    }
}