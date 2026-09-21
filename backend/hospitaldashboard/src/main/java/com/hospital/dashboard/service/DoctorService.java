package com.hospital.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.dashboard.entity.Doctor;
import com.hospital.dashboard.repository.DoctorRepository;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // Update doctor availability status
    public Doctor updateAvailability(int doctorId, String availabilityStatus) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setAvailabilityStatus(availabilityStatus);

        return doctorRepository.save(doctor);
    }
}