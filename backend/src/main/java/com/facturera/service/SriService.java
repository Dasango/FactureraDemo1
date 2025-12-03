package com.facturera.service;

import com.facturera.model.Invoice;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class SriService {

    public void processInvoice(Invoice invoice) {
        // 1. Generate Access Key
        String accessKey = generateAccessKey(invoice);
        invoice.setAccessKey(accessKey);

        // 2. Simulate Signing (Mock)
        // In real life, we would use the .p12 file to sign the XML

        // 3. Simulate Authorization
        invoice.setSriStatus("AUTHORIZED");
    }

    private String generateAccessKey(Invoice invoice) {
        // Mock Access Key Generation
        // Format: Date(8) + Type(2) + RUC(13) + Env(1) + Est(3) + Pto(3) + Seq(9) +
        // Num(8) + Check(1)
        StringBuilder sb = new StringBuilder();
        sb.append(invoice.getIssueDate().format(DateTimeFormatter.ofPattern("ddMMyyyy")));
        sb.append("01"); // Factura
        sb.append("1799999999001"); // Mock RUC
        sb.append("1"); // Test Environment
        sb.append("001"); // Estab
        sb.append("001"); // PtoEmi
        sb.append("000000001"); // Sequential (Should be dynamic)
        sb.append("12345678"); // Numeric Code
        sb.append("1"); // Check Digit (Mock)
        return sb.toString();
    }
}
