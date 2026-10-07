package com.hospital.dashboard.repository;

import com.hospital.dashboard.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicineRepository extends JpaRepository<Medicine, Integer> {
}