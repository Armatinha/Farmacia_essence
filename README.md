# Essence Pharma & Oxygen KW - Sistema de Autenticação & Dashboard

Sistema completo institucional e antifraude para autenticação de produtos farmacêuticos e peptídeos, com painel administrativo e backend integrado ao **Neon Serverless PostgreSQL 18** via MCP.

---

## 🚀 Como Executar

### 1. Executar Frontend + Backend juntos
```bash
npm run dev:all
```
- **Frontend Vite:** `http://localhost:5173`
- **Backend API:** `http://localhost:3001`
- **Painel Administrativo:** `http://localhost:5173/admin`
- **Autenticação Pública:** `http://localhost:5173/autenticacao`

### 2. Executar Apenas o Backend
```bash
npm run server
# ou com auto-reload em desenvolvimento:
npm run server:dev
```

### 3. Re-popular o Banco de Dados Neon (Seed)
```bash
npm run db:seed
```

---

## 🗄️ Integração com Neon PostgreSQL (MCP)

O banco de dados foi provisionado e gerenciado via **MCP Neon**:
- **Projeto Neon:** `Farmacia_essence` (`square-unit-25518658`)
- **Região:** AWS São Paulo (`aws-sa-east-1`)
- **Versão:** PostgreSQL 18
- **Procedure Atômica:** `verify_product_code(...)` com bloqueio `FOR UPDATE` para contadores de checagem concorrentes e telemetria de fraudes.

---

## 📡 Endpoints da API REST

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status do servidor e conectividade com o Neon DB |
| `POST` | `/api/verify` | Validação de autenticidade (`{ "code": "VALIDO1" }`) |
| `GET` | `/api/products` | Catálogo de compostos ativos |
| `POST` | `/api/products` | Cadastro de novo produto (Admin) |
| `GET` | `/api/batches` | Listagem de lotes com estatísticas |
| `POST` | `/api/batches/generate` | Geração em massa de lotes e códigos de segurança |
| `GET` | `/api/batches/:id/codes` | Visualização de códigos gerados para um lote |
| `GET` | `/api/telemetry/metrics` | Métricas de telemetria em tempo real |
| `GET` | `/api/telemetry/logs` | Log completo de consultas realizadas |
| `POST` | `/api/auth/login` | Login de administradores |

---

## 🔑 Códigos de Demonstração Pré-Cadastrados
- `VALIDO1`: Produto autêntico para 1ª verificação.
- `USADO2`: Código autêntico com alerta de reutilização anterior.
- `XY9-8L4-ZQX`: Lote clínico de RETAGEN.
- `A72-9B1-XXX`: Lote de TIRZEGEN.
