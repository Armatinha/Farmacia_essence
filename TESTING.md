# Testing Matrix & Verification Guide (TESTING)

> Status: Approved • Active Testing Protocols

## 🧪 1. Testing Strategy

Essence Pharma employs a three-tier quality assurance model:
1. **Static & Build Analysis:** TypeScript strict compile (`tsc -b`) and Vite production bundling.
2. **Database & API Integration:** Verification against live Neon PostgreSQL 18 instance.
3. **End-to-End User Verification:** Functional testing of user journeys across multiple languages.

---

## 📋 2. Automated Build & Type Verification

| Test Scenario | Command | Expected Output | Status |
|---|---|---|---|
| **TypeScript Compilation** | `npm run build` (`tsc -b`) | Zero compile errors, clean typing | ✅ PASS |
| **Vite Production Bundler** | `npm run build` | Distribution files output in `dist/` | ✅ PASS |
| **Database Seed** | `npx tsx server/src/seed.ts` | 5 products, 5 batches, and sample codes inserted | ✅ PASS |

---

## 🔍 3. Functional Verification Matrix (6-Character Codes)

| Test Code | Scenario | Expected Status | UI Feedback | Expected Details |
|---|---|---|---|---|
| `2H7MBT` | First-time valid check | `VALID_FIRST_TIME` | Green Card | RETATRUTIDE 40mg, Purity ≥ 99.4%, LOT-RET-2026A |
| `USED02` | Previously verified check | `WARNING_MULTIPLE_USE` | Amber Card | SEMAGLUTIDE 10mg, Check count ≥ 2, duplicate alert |
| `RET40M` | Active valid check | `VALID_FIRST_TIME` / `WARNING` | Green / Amber | RETATRUTIDE 40mg |
| `INVA99` | Unregistered / Fake code | `NOT_FOUND` | Red Card | Unregistered code alert, advice to check scratch seal |
| `TRZ75P` | High-frequency test check | `WARNING_MULTIPLE_USE` | Amber Card | TIRZEPATIDE 15mg / 75mg, multiple queries logged |

---

## 🌐 4. Multilingual & Zero-Portuguese Audit Matrix

| Component | English (`EN`) Check | Spanish (`ES`) Check | Portuguese Found? |
|---|---|---|---|
| **Navbar** | Home, About Us, Products, Contact, Verify Product | Inicio, Nosotros, Productos, Contacto, Verificar Producto | ❌ NONE |
| **Hero Section** | "Science for a Better You.", "Explore the collection" | "Ciencia para tu Mejor Versión.", "Explorar la colección" | ❌ NONE |
| **Feature Strip** | Premium Quality, Lab Tested, Research Grade | Calidad Premium, Probado en Laboratorio, Grado de Investigación | ❌ NONE |
| **Catalog (`/produtos`)** | Compound Catalog, Peptides, Metabolic, Regenerative | Catálogo de Compuestos, Peptídeos, Metabólico, Regenerativo | ❌ NONE |
| **Auth Page (`/autenticacao`)** | "Verify your Product", "EX: 2H7MBT", "Verify Code" | "Verifique su Producto", "EJ: 2H7MBT", "Verificar Código" | ❌ NONE |
| **Footer** | "Product Catalog", "Authenticity Verification", "Copyright" | "Catálogo de Productos", "Verificación de Autenticidad" | ❌ NONE |
| **Admin Dashboard** | "Telemetry", "Products", "Batches & Codes", "Total Verifications" | - (English standard for global operations) | ❌ NONE |

---

## 📱 5. Responsive Viewport Testing

- **Mobile (375px - 430px):** Responsive header with slide-out menu, stacked product cards, full-width verification input.
- **Tablet (768px - 1024px):** 2-column compound grid, fluid typography.
- **Desktop (1280px+):** 4-column compound catalog, side-by-side hero layout, split admin dashboard layout.
