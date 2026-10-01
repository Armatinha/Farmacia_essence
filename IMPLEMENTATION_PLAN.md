# Plano de Implementação (IMPLEMENTATION_PLAN)

> Estado: Aprovado • Construção Concluída

## 🎯 1. Visão Geral

Este documento descreve as fases de engenharia para entrega do portal institucional da Essence Pharma e da plataforma de autenticação de autenticidade farmacêutica com suporte a códigos alfanuméricos de 6 dígitos e banco de dados Neon PostgreSQL 18.

---

## 🧱 2. Fases de Execução

### Fase 1: Fundação Visual & Design System (`b1`)
- **Objetivo:** Estabelecer o design system "Veltrix Light Luxury" inspirado em farmácias científicas europeias e Oxygen KW Pharma.
- **Entregas:** Cores institucionais (creme `#f8f5ee`, dourado `#b58a34`, navy `#171820`), tipografia (`Playfair Display`, `DM Sans`, `Space Mono`), microinterações e componentes de base.
- **Estado:** ✅ Concluído (`DESIGN_SYSTEM.md`).

### Fase 2: Construção Frontend & Internacionalização (`b2`)
- **Objetivo:** Desenvolver todas as páginas públicas (Home, Sobre, Produtos, Contato, Autenticação) e painel administrativo.
- **Entregas:** Eliminação completa de textos em português da interface do usuário; suporte estrito a Inglês (padrão) e Espanhol via `i18next`.
- **Estado:** ✅ Concluído (`CODE_STYLE.md`, `src/pages/*`).

### Fase 3: Arquitetura & Banco de Dados Neon (`b3`)
- **Objetivo:** Configuração de persistência em nuvem de alta confiabilidade com Neon PostgreSQL 18.
- **Entregas:** Schemas relacionais (`products`, `batches`, `product_codes`, `verification_logs`, `admin_users`), procedure atômica `verify_product_code` com bloqueio concorrente `FOR UPDATE`.
- **Estado:** ✅ Concluído (`ARCHITECTURE.md`, `DATABASE.md`, `server/src/db.ts`).

### Fase 4: API REST & Regras de Negócio (`b4`)
- **Objetivo:** Criar endpoints de consulta atômica, telemetria de fraudes e geração segura de lotes.
- **Entregas:** `/api/verify`, `/api/products`, `/api/batches`, `/api/telemetry`, `/api/auth`.
- **Estado:** ✅ Concluído (`API_GUIDE.md`, `server/src/routes/*`).

### Fase 5: Integração, Tratamento de Falhas e Código de 6 Dígitos (`b5`)
- **Objetivo:** Ajustar algoritmo para geração de chaves alfanuméricas de exatamente 6 dígitos (`2H7MBT`) e prover fallback gracioso no frontend se desconectado.
- **Entregas:** Alfabeto unívoco de 32 caracteres (sem 0, O, 1, I), botões de teste rápido com códigos de 6 dígitos no Neon.
- **Estado:** ✅ Concluído.

### Fase 6: Testes, Auditoria e Governança de Agentes (`b6`)
- **Objetivo:** Validação de build TypeScript, auditoria de zero português e checklist de publicação.
- **Entregas:** `TESTING.md`, `AGENTS.md`, `estado.json` atualizado.
- **Estado:** ✅ Concluído.

---

## 🔒 3. Fases de Segurança (`s1` a `s4`)
- `s1` Dados e riscos: Mapeamento de ameaças de contrafação e modelo de isolamento.
- `s2` Identidade e acesso: Sessão de admin via token e restrição de rotas de mutação.
- `s3` Segredos e privacidade: Variáveis de ambiente protegidas (`DATABASE_URL`, `JWT_SECRET`), headers `no-cache`.
- `s4` Verificação e resposta a incidentes: Revogação de lotes comprometidos em tempo real.
- **Estado:** ✅ Concluído (`SECURITY.md`).
