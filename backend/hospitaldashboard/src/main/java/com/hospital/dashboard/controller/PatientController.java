package com.hospital.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dashboard.entity.Patient;
import com.hospital.dashboard.service.PatientService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // View all patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    // Add patient
    @PostMapping
    public Patient savePatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    // Edit patient
    @PutMapping("/{id}")
    public Patient updatePatient(
            @PathVariable int id,
            @RequestBody Patient patient) {

        return patientService.updatePatient(id, patient);
    }

    // Delete patient
    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable int id) {

        patientService.deletePatient(id);

        return "Patient deleted successfully";
    }
}