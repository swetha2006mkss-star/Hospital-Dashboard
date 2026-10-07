package com.hospital.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.dashboard.entity.Appointment;
import com.hospital.dashboard.entity.Doctor;
import com.hospital.dashboard.entity.Patient;
import com.hospital.dashboard.repository.AppointmentRepository;
import com.hospital.dashboard.repository.DoctorRepository;
import com.hospital.dashboard.repository.PatientRepository;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByDoctor(Integer doctorId) {
        return appointmentRepository.findByDoctorDoctorId(doctorId);
    }

    public Appointment saveAppointment(
            Appointment appointment) {

        Integer patientId =
                appointment.getPatientId();

        Integer doctorId =
                appointment.getDoctorId();

        if (patientId == null) {
            throw new RuntimeException(
                    "Patient ID is missing"
            );
        }

        if (doctorId == null) {
            throw new RuntimeException(
                    "Doctor ID is missing"
            );
        }

        Patient patient =
                patientRepository.findById(patientId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found: "
                                                + patientId
                                )
                        );

        Doctor doctor =
                doctorRepository.findById(doctorId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found: "
                                                + doctorId
                                )
                        );

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);

        return appointmentRepository.save(
                appointment
        );
    }
}