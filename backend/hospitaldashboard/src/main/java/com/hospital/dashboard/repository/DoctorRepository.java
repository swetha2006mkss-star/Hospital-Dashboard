package com.hospital.dashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hospital.dashboard.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {

}
