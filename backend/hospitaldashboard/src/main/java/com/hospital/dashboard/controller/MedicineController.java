package com.hospital.dashboard.controller;

import com.hospital.dashboard.entity.Medicine;
import com.hospital.dashboard.service.MedicineService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @PostMapping
    public Medicine saveMedicine(@RequestBody Medicine medicine) {
        return medicineService.saveMedicine(medicine);
    }
}