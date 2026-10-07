package com.hospital.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.dashboard.entity.Patient;
import com.hospital.dashboard.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // View all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Add patient
    public Patient savePatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // Edit patient
    public Patient updatePatient(int id, Patient updatedPatient) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        patient.setPatientName(updatedPatient.getPatientName());
        patient.setGender(updatedPatient.getGender());
        patient.setAge(updatedPatient.getAge());
        patient.setPhone(updatedPatient.getPhone());
        patient.setAddress(updatedPatient.getAddress());
        patient.setBloodGroup(updatedPatient.getBloodGroup());
        patient.setAdmissionDate(updatedPatient.getAdmissionDate());

        return patientRepository.save(patient);
    }

    // Delete patient
    public void deletePatient(int id) {
        patientRepository.deleteById(id);
    }
}