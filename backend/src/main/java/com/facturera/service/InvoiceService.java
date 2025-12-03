package com.facturera.service;

import com.facturera.model.Invoice;
import com.facturera.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InvoiceService {
    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private SriService sriService;

    public List<Invoice> findAll() {
        return invoiceRepository.findAll();
    }

    @Transactional
    public Invoice create(Invoice invoice) {
        invoice.setIssueDate(LocalDateTime.now());
        invoice.setSriStatus("PENDING");

        // Calculate totals
        // (Assuming frontend sends calculated totals, or we recalculate here)
        // For simplicity, we trust frontend or recalculate if needed.

        // Process with SRI
        sriService.processInvoice(invoice);

        return invoiceRepository.save(invoice);
    }
}
