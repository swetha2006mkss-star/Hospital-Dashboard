package com.hospital.dashboard.controller;

import com.hospital.dashboard.entity.Bed;
import com.hospital.dashboard.service.BedService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beds")
public class BedController {

    private final BedService bedService;

    public BedController(BedService bedService) {
        this.bedService = bedService;
    }

    @GetMapping
    public List<Bed> getAllBeds() {
        return bedService.getAllBeds();
    }

    @PostMapping
    public Bed saveBed(@RequestBody Bed bed) {
        return bedService.saveBed(bed);
    }
}