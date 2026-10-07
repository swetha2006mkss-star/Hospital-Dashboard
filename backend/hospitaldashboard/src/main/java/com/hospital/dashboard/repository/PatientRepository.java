package com.hospital.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.dashboard.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Integer> {

}