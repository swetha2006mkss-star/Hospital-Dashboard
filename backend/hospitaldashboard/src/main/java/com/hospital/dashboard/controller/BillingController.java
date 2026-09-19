package com.hospital.dashboard.controller;

import com.hospital.dashboard.entity.Billing;
import com.hospital.dashboard.service.BillingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping
    public List<Billing> getAllBills() {
        return billingService.getAllBills();
    }

    @PostMapping
    public Billing saveBill(@RequestBody Billing billing) {
        return billingService.saveBill(billing);
    }
}
