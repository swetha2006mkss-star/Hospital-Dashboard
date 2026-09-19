package com.hospital.dashboard.service;

import com.hospital.dashboard.entity.Billing;
import com.hospital.dashboard.repository.BillingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public List<Billing> getAllBills() {
        return billingRepository.findAll();
    }

    public Billing saveBill(Billing billing) {
        return billingRepository.save(billing);
    }
}