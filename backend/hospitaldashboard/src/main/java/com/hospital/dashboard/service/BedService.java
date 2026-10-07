package com.hospital.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.dashboard.entity.Bed;
import com.hospital.dashboard.repository.BedRepository;

@Service
public class BedService {

    private final BedRepository bedRepository;

    public BedService(BedRepository bedRepository) {
        this.bedRepository = bedRepository;
    }

    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    public Bed saveBed(Bed bed) {
        return bedRepository.save(bed);
    }

    public Bed updateStatus(int bedId, String status) {

        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new RuntimeException("Bed not found"));

        bed.setStatus(Bed.Status.valueOf(status));

        return bedRepository.save(bed);
    }
}