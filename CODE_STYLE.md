# Code Style & Engineering Standards (CODE_STYLE)

> Status: Approved • Active Development Standard

## 🧹 1. Architectural Philosophy

1. **Strict Type Safety:** Always define TypeScript interfaces for all payloads, database entities, and component props. Never use untyped `any` when a known structure exists.
2. **Language Exclusivity:** All user-facing text must be rendered through `useTranslation()` (`t(...)`), strictly restricted to English (`en`) and Spanish (`es`). No hardcoded Portuguese text in UI components.
3. **Design System Adherence:** Use predefined Tailwind classes and custom tokens (`bg-veltrix-light-1`, `text-veltrix-gold-1`, `font-display`, etc.) rather than ad-hoc inline styles.
4. **Security Code Standard:** All security codes must conform to the 6-character alphanumeric uppercase format (`/^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$/`). Hyphenated formats are strictly forbidden.

---

## 🧱 2. Project Directory Structure

```
├── src/
│   ├── assets/              # WebP/PNG brand emblems and packaging visuals
│   ├── components/          # Reusable UI components (Navbar, Footer, etc.)
│   ├── pages/               # Route views (Home, About, Products, Contact, Authenticate, AdminDashboard)
│   ├── i18n.ts              # i18next configuration (EN & ES dictionaries)
│   ├── index.css            # Veltrix design tokens and custom CSS utilities
│   ├── main.tsx             # Application bootstrap
│   └── App.tsx              # React router configuration
├── server/
│   ├── src/
│   │   ├── routes/          # Express REST routers (verify, products, batches, telemetry, auth)
│   │   ├── db.ts            # Neon PostgreSQL connection pool
│   │   ├── seed.ts          # Official database seeder
│   │   └── index.ts         # Server entry point
│   └── tsconfig.json
├── guia-produto/            # Living documentation and project state tracker
└── package.json
```

---

## ⚡ 3. Formatting & Linting Rules

- **Indentation:** 2 spaces.
- **Semicolons:** Required.
- **Quotes:** Single quotes for TypeScript/JavaScript, double quotes for JSX attributes.
- **Trailing Commas:** ES5 style.
- **Component Style:** Functional components using React 19 hooks.
