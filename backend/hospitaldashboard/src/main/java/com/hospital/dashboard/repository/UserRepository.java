package com.hospital.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.dashboard.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    // Email + Password login
    User findByEmailAndPassword(String email, String password);

    // Existing username support
    User findByUsernameAndPassword(String username, String password);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}