package com.hospital.dashboard.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer appointmentId;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnore
    private Doctor doctor;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private Status status = Status.Scheduled;

    public enum Status {
        Scheduled,
        Completed,
        Pending,
        Cancelled
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    @JsonProperty("patientId")
    public Integer getPatientId() {
        return patient != null ? patient.getPatientId() : null;
    }

    @JsonProperty("patientId")
    public void setPatientId(Integer patientId) {
        if (patientId != null) {
            Patient p = new Patient();
            p.setPatientId(patientId);
            this.patient = p;
        }
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    @JsonProperty("doctorId")
    public Integer getDoctorId() {
        return doctor != null ? doctor.getDoctorId() : null;
    }

    @JsonProperty("doctorId")
    public void setDoctorId(Integer doctorId) {
        if (doctorId != null) {
            Doctor d = new Doctor();
            d.setDoctorId(doctorId);
            this.doctor = d;
        }
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}