package com.hospital.dashboard.controller;

import com.hospital.dashboard.entity.Appointment;
import com.hospital.dashboard.service.AppointmentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(
            AppointmentService appointmentService) {

        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(
            @PathVariable Integer doctorId) {

        return appointmentService.getAppointmentsByDoctor(
                doctorId
        );
    }

    @PostMapping
    public Appointment saveAppointment(
            @RequestBody Appointment appointment) {

        return appointmentService.saveAppointment(
                appointment
        );
    }
}