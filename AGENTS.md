# Contexto e Instruções para Agentes (AGENTS.md)

> Diretrizes de continuidade para qualquer agente de IA operando no repositório Essence Pharma.

## 📌 1. Visão Geral do Projeto
A **Essence Pharma** é uma plataforma farmacêutica premium com verificação pública de autenticidade anti-falsificação e painel administrativo para controle de lotes, apoiada em banco de dados **Neon PostgreSQL 18**.

---

## 🛑 2. Regras Inegociáveis (Cliente)

1. **Política Estrita de Idiomas (Zero Português na Interface):**
   - A interface do usuário deve estar **obrigatoriamente em Inglês (padrão) ou Espanhol**.
   - O cliente proibiu explicitamente textos visíveis em português na UI.
   - Qualquer novo texto deve ser inserido nas coleções `en` e `es` em `src/i18n.ts` e consumido via `useTranslation()`.

2. **Formato do Código de Segurança de 6 Caracteres Alfanuméricos:**
   - O código possui exatamente **6 caracteres alfanuméricos maiúsculos** (exemplo: `2H7MBT`).
   - Não utilizar traços, hífens ou formatos como `XXX-XXX-XXX`.
   - O alfabeto permitido exclui caracteres ambíguos: `23456789ABCDEFGHJKLMNPQRSTUVWXYZ` (sem 0, O, 1, I).

3. **Preservação do Design System "Veltrix Light Luxury":**
   - Não inverter o tema do site para modo escuro genérico.
   - O tema oficial é composto por fundo creme (`#f8f5ee`), dourado farmacêutico (`#b58a34`), dark navy (`#171820`) e superfícies translúcidas.
   - O emblema oficial é o "E" cromado com fitas dobradas presente em `src/assets/essence-emblem.png`.

---

## 🚀 3. Comandos Úteis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia servidor de desenvolvimento Vite (porta 5173). |
| `npm run server` | Inicia backend Express local (porta 3001). |
| `npm run build` | Compila TypeScript (`tsc -b`) e gera bundle de produção com Vite. |
| `npx tsx server/src/seed.ts` | Popula o banco Neon PostgreSQL com dados oficiais em inglês e códigos de 6 caracteres. |

---

## 🗃️ 4. Banco de Dados & Procedimento Atômico

- Banco de Dados: **Neon PostgreSQL 18** (região AWS São Paulo `sa-east-1`).
- Tabela principal de códigos: `product_codes` (`code VARCHAR(6) UNIQUE`).
- Verificação atômica: Stored procedure `verify_product_code(...)` com bloqueio concorrente `FOR UPDATE`.
