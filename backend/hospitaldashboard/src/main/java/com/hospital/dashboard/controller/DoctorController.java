package com.hospital.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dashboard.entity.Doctor;
import com.hospital.dashboard.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @PostMapping
    public Doctor saveDoctor(@RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }

    // Update doctor availability
    @PutMapping("/{doctorId}/availability")
    public Doctor updateAvailability(
            @PathVariable int doctorId,
            @RequestBody String availabilityStatus) {

        availabilityStatus = availabilityStatus.replace("\"", "");

        return doctorService.updateAvailability(
                doctorId,
                availabilityStatus
        );
    }
}