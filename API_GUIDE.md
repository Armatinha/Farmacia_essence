# Essence Pharma API Documentation & Specification

> Status: Approved • Version 1.0.0
> Base URL: `/api` (local: `http://localhost:3001/api` • production: `https://.../api`)

## 🔌 1. Architecture Overview

The Essence Pharma API exposes RESTful endpoints supporting both the public customer-facing web application and the authenticated administrative dashboard. All requests and responses use JSON. Sensitive endpoints and verification actions are executed with no-cache headers.

---

## 🔑 2. Authentication & Authorization

| Role | Access Level | Mechanism |
|---|---|---|
| **Public** | Product catalog & Authenticity verification | Open access with IP-based rate limiting |
| **Admin** | Dashboard, telemetry logs, batch generator, catalog CRUD | Bearer JWT or Session Header (`Authorization: Bearer <token>`) |

---

## 🛡️ 3. Verification Endpoints

### 3.1 Verify Product Authenticity (Public)
Executes an atomic check on a 6-character alphanumeric security code found on the product packaging.

- **Endpoint:** `POST /api/verify`
- **Rate Limit:** 30 requests / minute per IP
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "code": "2H7MBT"
}
```

#### Response 200: Authentic Product (1st check)
```json
{
  "success": true,
  "status": "VALID_FIRST_TIME",
  "code": "2H7MBT",
  "message": "Authentic: First verification completed successfully.",
  "times_checked": 1,
  "first_checked_at": "2026-10-01T02:40:00.000Z",
  "last_checked_at": "2026-10-01T02:40:00.000Z",
  "product": {
    "id": 1,
    "name": "RETATRUTIDE",
    "slug": "retatrutide",
    "concentration": "40 mg",
    "formula": "ESS-R40",
    "category": "Peptides",
    "purity": "≥ 99.4% HPLC",
    "description": "Retatrutide - Triple receptor agonist (GLP-1, GIP, Glucagon). Research-grade lyophilized powder.",
    "presentations": "Lyophilized powder · Dosing pen",
    "image_url": "/src/assets/essence-vials.png"
  },
  "batch": {
    "id": 1,
    "batch_number": "LOT-RET-2026A",
    "manufacturing_date": "2026-03-01",
    "expiry_date": "2028-03-01",
    "active": true
  }
}
```

#### Response 200: Warning - Duplicate / Repeated Verification
```json
{
  "success": true,
  "status": "WARNING_MULTIPLE_USE",
  "code": "USED02",
  "message": "Warning: This security code has already been verified 3 times previously.",
  "times_checked": 3,
  "first_checked_at": "2026-09-28T14:20:00.000Z",
  "last_checked_at": "2026-10-01T02:40:00.000Z",
  "product": {
    "id": 3,
    "name": "SEMAGLUTIDE"
  },
  "batch": {
    "id": 3,
    "batch_number": "LOT-SEM-2026C"
  }
}
```

#### Response 200: Not Found (Invalid Code)
```json
{
  "success": false,
  "status": "NOT_FOUND",
  "code": "INVA99",
  "message": "Security code not found in our official registry."
}
```

---

## 📦 4. Product Catalog Endpoints

### 4.1 List Products
- **Endpoint:** `GET /api/products`
- **Query Parameters:**
  - `all` (boolean, optional): If `true`, returns both active and inactive products (Admin view).
- **Response 200:** Array of product objects.

### 4.2 Get Product Details
- **Endpoint:** `GET /api/products/:id` (Accepts numeric ID or text `slug`)
- **Response 200:** Single product object or 404 if not found.

### 4.3 Create Product (Admin)
- **Endpoint:** `POST /api/products`
- **Request Body:**
```json
{
  "name": "EPITHALON",
  "slug": "epithalon",
  "concentration": "50 mg",
  "formula": "C14H22N4O9",
  "category": "Peptides",
  "purity": "≥ 99.0% HPLC",
  "description": "Telomerase activator peptide."
}
```

---

## 🏷️ 5. Production Batches & Code Generation

### 5.1 List Batches
- **Endpoint:** `GET /api/batches`
- **Response 200:** Array of batches with aggregated statistics (`generated_codes_count`, `checked_codes_count`, `fraud_alerts_count`).

### 5.2 Generate New Batch with Unique 6-Character Codes
- **Endpoint:** `POST /api/batches/generate`
- **Request Body:**
```json
{
  "batch_number": "LOT-RET-2026B",
  "product_id": 1,
  "quantity": 100,
  "notes": "Second clinical research run"
}
```
- **Response 201:**
```json
{
  "message": "Batch LOT-RET-2026B created successfully with 100 security codes.",
  "batch": { "id": 6, "batch_number": "LOT-RET-2026B", "total_codes": 100 },
  "sample_codes": ["2H7MBT", "9K4WXP", "7NV3QR", "4MT8LS", "5JY2KP"]
}
```

### 5.3 View Batch Codes (Admin)
- **Endpoint:** `GET /api/batches/:id/codes?limit=100&offset=0`
- **Response 200:** Paginated list of generated 6-character codes with their respective check counts.

---

## 📊 6. Telemetry & Fraud Monitoring Endpoints

### 6.1 Telemetry Summary Metrics
- **Endpoint:** `GET /api/telemetry/metrics`
- **Response 200:**
```json
{
  "total_verifications": 1284,
  "weekly_growth": "+12% THIS WEEK",
  "fraud_alerts": 14,
  "active_batches": 5,
  "total_codes": 15000,
  "status_breakdown": [
    { "status_result": "VALID_FIRST_TIME", "count": 1150 },
    { "status_result": "WARNING_MULTIPLE_USE", "count": 84 },
    { "status_result": "NOT_FOUND", "count": 50 }
  ]
}
```

### 6.2 Real-Time Verification Audit Logs
- **Endpoint:** `GET /api/telemetry/logs?limit=25&search=2H7MBT`
- **Response 200:** Real-time query logs with IP, location, timestamp, and status.

---

## 🔐 7. Admin Authentication Endpoints

### 7.1 Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
```json
{
  "email": "admin@essencepharma.com",
  "password": "your-secure-password"
}
```
- **Response 200:**
```json
{
  "token": "7a8b9c0d1e2f3a4b...",
  "user": {
    "id": 1,
    "email": "admin@essencepharma.com",
    "name": "Chief Security Administrator",
    "role": "admin"
  }
}
```
