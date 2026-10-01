# Security Architecture & Anti-Counterfeit Model

> Status: Approved • Cryptographic Integrity & Anti-Tamper System

## 🔐 1. Threat Model & Design Philosophy

In the pharmaceutical and life-sciences research sector, parallel market counterfeits represent both an existential brand risk and an urgent user safety threat. Essence Pharma implements an **irreversible digital authenticity verification pipeline** designed to provide instant, cryptographically sound proof of origin.

---

## 🔑 2. The 6-Character Alphanumeric Code System

### 2.1 Character Space & Permutations
The verification keys are 6-character strings constructed strictly from an unambiguous 32-character alphabet:
```
Alphabet: 2 3 4 5 6 7 8 9 A B C D E F G H J K L M N P Q R S T U V W X Y Z
Excluded: 0, O (visual confusion), 1, I (visual confusion)
```

- Total Permutations: **32^6 = 1,073,741,824** unique possible keys per batch namespace.
- Format: Clean uppercase alphanumeric string without hyphens (e.g., `2H7MBT`).
- Packaging: Printed on high-security tamper-evident holographic scratch-off labels. The key cannot be read without destroying the scratch-off layer.

### 2.2 Brute-Force Resistance
With over 1 billion possible combinations and an IP rate-limit of 30 queries/minute, an automated brute-force scanner attempting to guess valid codes has a probability of less than 0.0001% of hitting an active code, while immediately triggering fraud detection alarms and IP blacklisting in the telemetry system.

---

## ⚡ 3. Atomic Concurrency & Row Locking

To prevent "double-spend" style attacks (where a counterfeiter creates multiple identical counterfeit boxes bearing a single stolen code and verifies them simultaneously from different locations), verification is executed through an atomic Neon PostgreSQL stored procedure:

1. **Transaction Isolation:** `BEGIN ... COMMIT` with `FOR UPDATE` row lock on `product_codes`.
2. **First Arrival Wins:** The first query increments `times_checked` to `1` and sets `first_checked_at = NOW()`.
3. **Subsequent Queries Flagged:** Any subsequent arrival (even if milliseconds later) reads `times_checked > 1` and immediately triggers:
   - Status change to `WARNING_MULTIPLE_USE`
   - Real-time fraud alert logged to `verification_logs`
   - Visual alert on the customer's screen advising them that the seal was compromised.

---

## 🛡️ 4. Application Defense Layers

### 4.1 SQL Injection & ORM Safety
All database queries use parameterized SQL (`$1, $2, ...`) via `node-postgres` (`pg`). Zero string concatenation is permitted in query construction.

### 4.2 Rate Limiting & DoS Protection
- `POST /api/verify` is rate-limited per IP.
- Input validation truncates input codes to maximum 20 characters and sanitizes against non-alphanumeric characters.
- Query timeouts configured at 5,000ms to prevent resource starvation.

### 4.3 Caching Policy for Security Endpoints
Verification endpoints explicitly send:
```http
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate
Pragma: no-cache
Expires: 0
```
This ensures intermediate CDNs or browser caches never cache an `ACTIVE` response and replay it for a revoked or duplicate code.

### 4.4 Admin Authentication
- Admin passwords hashed with salt using cryptographic hashing.
- Token-based sessions for administrative routes (`/api/batches/generate`, `/api/products`).
- Admin endpoints protected from cross-site scripting (XSS) via React's contextual escaping.

---

## 📋 5. Incident Response & Code Revocation

If a batch is reported compromised during transit or storage:
1. Administrator navigates to **Admin Dashboard -> Batches & Codes**.
2. Clicks **Toggle Active** or sets batch status to `REVOKED`.
3. Neon DB cascades status update to all associated codes.
4. Any consumer querying a revoked code receives an immediate high-priority warning: *"Warning: This batch or security code has been revoked for security reasons."*
