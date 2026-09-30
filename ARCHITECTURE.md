# Arquitetura e Stack

## Frontend (Site Público + Admin)
- **Framework:** `Vite` com `React` (Single Page Application para alta velocidade ou SSR/SSG se usar Next.js). Optamos pelo React puro com Vite pelo desenvolvimento rápido e controle direto das micro-animações.
- **Estilização:** `Tailwind CSS` para garantir a velocidade e consistência do design system, mas com customizações de utilities para o efeito Glassmorphism.
- **Roteamento:** `React Router DOM` para as abas estáticas e a rota do admin.
- **Ícones:** `Lucide React` (ícones thin e clean, compatíveis com a estética médica/premium).

## Backend (SaaS Privado)
- **BaaS (Backend as a Service):** `Supabase` (PostgreSQL + Auth + Storage).
  - PostgreSQL fornece segurança relacional.
  - Supabase Auth resolve a gestão de logins dos administradores de forma segura.
  - Supabase Edge Functions (opcional) para processamento ultra-rápido da checagem e incremento do contador via RPC (Remote Procedure Call) atômico, garantindo que requisições simultâneas atualizem corretamente as visualizações sem race conditions.

## Modelagem de Acesso Seguro à Autenticação (RPC)
A checagem do código por parte de um usuário anônimo deve ser blindada. O frontend fará um POST ou chamará uma RPC do Supabase (`verify_code(codigo)`). A função internamente:
1. Verifica a existência de `code_hash`.
2. Se existir, lê `times_checked`.
3. Incrementa `times_checked` e insere log.
4. Retorna para o frontend as informações do produto e status ("válido", "já_checado").
Isso impede leitura arbitrária de todos os lotes do banco (ex: scraping de códigos).
