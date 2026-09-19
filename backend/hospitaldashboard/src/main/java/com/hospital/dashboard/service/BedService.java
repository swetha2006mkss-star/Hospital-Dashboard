package com.hospital.dashboard.service;

import com.hospital.dashboard.entity.Bed;
import com.hospital.dashboard.repository.BedRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
