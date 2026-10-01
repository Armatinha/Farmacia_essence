# Application Flow & User Journeys (APP_FLOW)

> Status: Approved • Version 1.0.0

## 🧭 1. System Entry Points

| Entry Point | Target Destination | Context |
|---|---|---|
| **Root URL (`/`)** | Home Landing Page | Public entrance showcasing scientific philosophy, hero presentation, and quick links. |
| **Direct Verification (`/autenticacao`)** | Authenticity Validator | Direct destination for consumers who scanned QR code on packaging or clicked "Verify". |
| **Catalog (`/produtos`)** | Products Catalog | Complete compound list with purity levels, formulas, and presentations. |
| **Corporate Info (`/sobre`)** | About Us | Company scientific vision, research pillars, and quality standards. |
| **Contact Form (`/contato`)** | Contact & Inquiries | Corporate inquiries, authenticity support, and commercial partnerships. |
| **Admin Portal (`/admin/dashboard`)** | Operations Center | Authorized management of batches, codes, catalog, and fraud telemetry. |

---

## 👥 2. Primary Journey: End-Consumer Product Verification

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Consumer
    participant UI as Verification Page
    participant API as Express API (/api/verify)
    participant DB as Neon PostgreSQL (Procedure)

    Customer->>UI: Scratches seal & enters 6-character code (e.g. 2H7MBT)
    Customer->>UI: Clicks "Verify Code"
    UI->>UI: Sets status to loading, clears prior errors
    UI->>API: POST /api/verify { code: "2H7MBT" }
    API->>DB: SELECT verify_product_code('2H7MBT', ip, ua, loc)
    Note over DB: Locks row FOR UPDATE, increments check count, logs audit trail
    DB-->>API: Returns JSON (status, count, product, batch)
    API-->>UI: 200 OK + Payload
    alt First Time Verified (status = VALID_FIRST_TIME)
        UI-->>Customer: Display Green Success Card with Product & Batch Details
    else Re-queried Code (status = WARNING_MULTIPLE_USE)
        UI-->>Customer: Display Amber Warning Card with Count & Tamper Notice
    else Code Not Found (status = NOT_FOUND)
        UI-->>Customer: Display Red Error Card advising user of unrecognized key
    end
```

---

## 🌐 3. Language Switching Flow (English / Spanish)

1. **Default State:** Application renders in English (`en`).
2. **User Action:** User clicks language toggle in the navigation bar (`EN` or `ES`).
3. **Internal State Update:** `i18n.changeLanguage(lng)` triggers re-render of all bound components.
4. **Zero-Portuguese Guarantee:**
   - Nav bar, footer, and buttons switch immediately.
   - Compound catalog displays scientific specifications.
   - Verification responses automatically render in the selected language.

---

## ⚙️ 4. Secondary Journey: Administrator Batch Generation

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Chief Administrator
    participant Dash as Admin Dashboard
    participant API as /api/batches/generate
    participant DB as Neon PostgreSQL

    Admin->>Dash: Opens "Batches & Codes" tab
    Admin->>Dash: Clicks "Generate New Batch"
    Admin->>Dash: Selects Product, enters Batch ID (e.g. LOT-RET-2026B), enters Quantity (e.g. 100)
    Dash->>API: POST /api/batches/generate
    API->>API: Generates 100 unique 6-character alphanumeric keys
    API->>DB: Inserts batch record + bulk inserts product_codes inside transaction
    DB-->>API: Transaction committed
    API-->>Dash: 201 Created (batch summary + sample codes)
    Dash-->>Admin: Updates active batches count & table in real time
    Admin->>Dash: Clicks "View Codes" to view and copy generated 6-character keys
```

---

## 🛑 5. Edge Cases & Fallback States

- **Network Offline / Disconnection:** If the Neon database or API is unreachable, the client falls back to client-side verification presets (`2H7MBT` and `USED02`) with an alert notification.
- **Ambiguous Characters:** Characters `0`, `O`, `1`, `I` are excluded from code generation to eliminate typographical user errors on scratch labels.
- **Empty / Malformed Inputs:** Client prevents submission if trimmed code is empty; input field is automatically transformed to uppercase in real time.
