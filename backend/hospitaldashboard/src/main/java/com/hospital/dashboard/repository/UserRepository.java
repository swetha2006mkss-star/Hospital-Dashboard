package com.hospital.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.dashboard.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);

    User findByEmailAndPassword(String email, String password);

    User findByUsernameAndPassword(String username, String password);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
