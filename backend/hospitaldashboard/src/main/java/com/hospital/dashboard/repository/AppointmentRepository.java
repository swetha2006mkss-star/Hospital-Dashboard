package com.hospital.dashboard.repository;

import com.hospital.dashboard.entity.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByDoctorDoctorId(Integer doctorId);

}