# Technical Requirements Document (TRD)

> Status: Approved • Version 1.0.0
> Technology Stack: React 19 • Vite 8 • Tailwind CSS v4 • Express 5 • Neon PostgreSQL 18

## 🎯 1. Technical Vision & Measurable Targets

Essence Pharma is an enterprise-grade digital portal and pharmaceutical security platform. The system combines modern front-end aesthetics (Veltrix light luxury scientific theme) with high-integrity distributed data storage.

### Key Performance Indicators
- **Initial Page Load:** < 1.2s on standard 4G connections.
- **Verification Response Time:** < 200ms end-to-end response from `POST /api/verify`.
- **Database Query Latency:** < 50ms average on Neon PostgreSQL 18 in AWS São Paulo (`aws-sa-east-1`).
- **Code Entropy:** 32^6 combinations (> 1 billion unique keys) with collision-free bulk generation.

---

## 🧱 2. System Architecture & Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Strict static typing, high component reusability, optimal reactivity. |
| **Build Tool** | Vite 8 + Rolldown | Sub-second HMR and optimized production bundling. |
| **Styling** | Tailwind CSS v4 + Custom Tokens | Cream/light luxury palette (`#f8f5ee`), gold accents (`#b58a34`), dark navy (`#171820`). |
| **Animations** | Framer Motion 12 | Smooth hardware-accelerated transitions and interactive feedback. |
| **Internationalization** | i18next + react-i18next | Multilingual runtime supporting English (default) and Spanish (ES). Zero-Portuguese policy. |
| **Backend Runtime** | Node.js 22 LTS + Express 5 | High-throughput asynchronous non-blocking event loop. |
| **Database** | Neon Serverless PostgreSQL 18 | Autoscaling, connection pooling, atomic PL/pgSQL stored procedures, instantaneous branching. |
| **Deployment Target** | Vercel Serverless / Node Container | Built-in edge routing, global CDN, and automated SSL termination. |

---

## ⚙️ 3. Functional Requirements

1. **Strict 6-Character Alphanumeric Codes:**
   - Generated using `crypto.randomBytes(6)` mapped across unambiguous alphabet `23456789ABCDEFGHJKLMNPQRSTUVWXYZ`.
   - No hyphens, uppercase only.
2. **Three-State Verification Feedback:**
   - `VALID_FIRST_TIME`: Returns 200, green styling, displays product name, batch ID, HPLC purity, concentration, and timestamp.
   - `WARNING_MULTIPLE_USE`: Returns 200, amber warning styling, displays total check count and warning advising possible duplication.
   - `NOT_FOUND`: Returns 200, red error styling, advises user of unrecognized code.
3. **Multilingual Architecture:**
   - Default language: English (`en`).
   - Secondary language: Spanish (`es`).
   - Language selector in top navigation toggles state dynamically.
4. **Administrative Operations Center:**
   - Live telemetry counters (verifications, fraud alerts, active batches).
   - Real-time verification audit logs.
   - Batch generator with configurable quantity (up to 5,000 codes per batch).
   - Interactive code list with click-to-copy utility.

---

## 🔒 4. Non-Functional Requirements

- **Reliability:** 99.9% uptime powered by Neon cloud infrastructure.
- **Security:** TLS 1.3 encryption in transit, SQL parameterization, rate limiting, and row-level locking (`FOR UPDATE`).
- **Accessibility:** Semantic HTML5, ARIA live regions for verification results, high contrast ratios on typography.
- **Portability:** Container-ready with standard `.env` configuration and Vercel serverless integration.
