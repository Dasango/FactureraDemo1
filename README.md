# Walkthrough - E-Invoicing System (SRI Ecuador - Mock)

## Overview

This system allows issuing electronic invoices (SRI Ecuador compliant -
mocked) using a Spring Boot backend and a Vanilla JavaScript frontend.

## Prerequisites

-   Java 17+
-   Maven
-   Web Browser

## How to Run

### 1. Start the Backend

    cd backend
    mvn spring-boot:run

The server will start at:

    http://localhost:8080

### 2. Open the Frontend

Open:

    frontend/index.html

Or serve it with:

    cd frontend
    python -m http.server

### 3. Login

#### Email and Password

Register using the "Regístrate" link. Endpoint: `/api/auth/register`.

#### Google Login

Requires valid Client ID and Secret in `application.properties`.

## Features

### Dashboard

-   View recent invoices.

### Products

-   Create products.
-   List products.

### Invoices

-   Issue invoices.
-   Mock Access Key and signature generated.

### Settings

-   Upload `.p12` digital signature (mocked storage).

## Verification Steps

### 1. Register User

    curl -X POST http://localhost:8080/api/auth/register   -H "Content-Type: application/json"   -d "{"email":"test@test.com","password":"123456","name":"Test User"}"

### 2. Create a Product

Productos → Nuevo Producto

### 3. Issue an Invoice

Facturas → Nueva Factura 1. Fill details. 2. Add a product. 3. Emit
invoice.

Expected status:

    AUTHORIZED
