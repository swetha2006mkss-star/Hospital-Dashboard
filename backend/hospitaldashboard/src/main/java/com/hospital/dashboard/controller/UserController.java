package com.hospital.dashboard.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dashboard.dto.SignupRequest;
import com.hospital.dashboard.entity.Patient;
import com.hospital.dashboard.entity.User;
import com.hospital.dashboard.service.PatientService;
import com.hospital.dashboard.service.UserService;

@RestController
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final PatientService patientService;

    public UserController(
            UserService userService,
            PatientService patientService) {

        this.userService = userService;
        this.patientService = patientService;
    }

    // ==================================================
    // GET ALL USERS
    // ==================================================

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // ==================================================
    // CREATE USER
    // ==================================================

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestBody User user) {

        try {

            User savedUser = userService.saveUser(user);

            // Automatically create patient record
            // when role is Patient
            if ("Patient".equalsIgnoreCase(savedUser.getRole())) {

                Patient patient = new Patient();

                patient.setUserId(savedUser.getUserId());
                patient.setPatientName(savedUser.getUsername());
                patient.setAge(0);

                patientService.savePatient(patient);
            }

            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ==================================================
    // LOGIN
    // Email + Password
    // ==================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User existingUser = userService.login(
                user.getEmail(),
                user.getPassword()
        );

        if (existingUser == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid Email or Password");
        }

        return ResponseEntity.ok(existingUser);
    }

    // ==================================================
    // SIGNUP
    // Username + Email + Password + Role
    // ==================================================

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody SignupRequest signupRequest) {

        try {

            User user = new User();

            user.setUsername(
                    signupRequest.getUsername()
            );

            user.setEmail(
                    signupRequest.getEmail()
            );

            user.setPassword(
                    signupRequest.getPassword()
            );

            user.setRole(
                    signupRequest.getRole()
            );

            User savedUser =
                    userService.saveUser(user);

            // Automatically create patient record
            if ("Patient".equalsIgnoreCase(
                    savedUser.getRole())) {

                Patient patient = new Patient();

                patient.setUserId(
                        savedUser.getUserId()
                );

                patient.setPatientName(
                        savedUser.getUsername()
                );

                patient.setAge(0);

                patientService.savePatient(patient);
            }

            return ResponseEntity.ok(savedUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}

