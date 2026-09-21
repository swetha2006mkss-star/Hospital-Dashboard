package com.hospital.dashboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hospital.dashboard.entity.Billing;
import com.hospital.dashboard.repository.BillingRepository;

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

    public Billing updatePaymentStatus(
            int billId,
            String paymentStatus) {

        Billing bill = billingRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        bill.setPaymentStatus(
                Billing.PaymentStatus.valueOf(paymentStatus)
        );

        return billingRepository.save(bill);
    }
}