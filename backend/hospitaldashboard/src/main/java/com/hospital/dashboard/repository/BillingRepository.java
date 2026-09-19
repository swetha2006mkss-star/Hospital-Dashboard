package com.hospital.dashboard.repository;

import com.hospital.dashboard.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillingRepository extends JpaRepository<Billing, Integer> {
}
