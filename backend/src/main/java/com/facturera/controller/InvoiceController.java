package com.facturera.controller;

import com.facturera.model.Invoice;
import com.facturera.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public List<Invoice> getAll() {
        return invoiceService.findAll();
    }

    @PostMapping
    public Invoice create(@RequestBody Invoice invoice) {
        return invoiceService.create(invoice);
    }
}
