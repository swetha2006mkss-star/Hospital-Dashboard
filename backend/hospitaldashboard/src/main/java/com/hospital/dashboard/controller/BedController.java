package com.hospital.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.dashboard.entity.Bed;
import com.hospital.dashboard.service.BedService;

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

    @PutMapping("/{bedId}/status")
    public Bed updateStatus(
            @PathVariable int bedId,
            @RequestBody String status) {

        status = status.replace("\"", "");

        return bedService.updateStatus(bedId, status);
    }
}