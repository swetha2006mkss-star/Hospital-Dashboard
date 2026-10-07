package com.hospital.dashboard.repository;

import com.hospital.dashboard.entity.Bed;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BedRepository extends JpaRepository<Bed, Integer> {
}