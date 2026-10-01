# Arquitetura e Stack • Essence Pharma & Oxygen KW

## 1. Frontend (Site Público + Admin)
- **Framework:** `Vite` com `React 19` e `TypeScript`.
- **Estilização:** `Tailwind CSS v4` com classes utilitárias personalizadas e estética médica minimalista / Dark Glassmorphism.
- **Roteamento:** `React Router DOM v7`.
- **Ícones:** `Lucide React`.
- **Animações:** `Framer Motion`.

## 2. Backend & Banco de Dados (Neon Serverless PostgreSQL 18)
- **Database Engine:** **Neon PostgreSQL 18** (região AWS São Paulo `sa-east-1`, endpoint com autoscaling).
- **Gerenciamento MCP:** Integração nativa com ferramentas do MCP Neon (`run_sql`, `run_sql_transaction`, `describe_table_schema`, `get_connection_string`).
- **Servidor API:** Node.js + Express com `pg` (Pool de alta performance e suporte a SSL seguro).
- **Proxy Vite:** Chamadas `/api/*` em ambiente de desenvolvimento são roteadas diretamente para o servidor backend (`http://localhost:3001`).

## 3. Modelo de Dados Relacional no Neon
1. **`products`**: Cadastro de compostos farmacêuticos (nome, slug, concentração, fórmula molecular, pureza HPLC, categoria, descrição técnica).
2. **`batches`**: Lotes de fabricação associados a produtos (número do lote, data de fabricação, validade, total de códigos, status ativo).
3. **`product_codes`**: Códigos alfanuméricos criptograficamente seguros (ex: `XY9-8L4-ZQX`), contadores de verificação (`times_checked`), data da 1ª e última verificação.
4. **`verification_logs`**: Telemetria em tempo real das consultas realizadas (código, IP de origem, geolocalização estimada, User-Agent, status resultante e contador no momento da checagem).
5. **`admin_users`**: Credenciais de administradores com permissões de gestão do catálogo e geração de lotes.

## 4. Segurança e RPC Atômica (`verify_product_code`)
A verificação de autenticidade é executada diretamente no PostgreSQL via Stored Procedure atômica:
- **Prevenção de Race Conditions:** Executa bloqueio de linha `FOR UPDATE` durante o incremento de `times_checked`.
- **Blindagem Anti-Scraping:** Clientes públicos consultam apenas via `POST /api/verify`, sem acesso direto de leitura às tabelas de códigos.
- **Detecção de Fraude:**
  - `VALID_FIRST_TIME`: Código original consultado pela 1ª vez.
  - `WARNING_MULTIPLE_USE`: Código autêntico já consultado 2 ou mais vezes (potencial clonagem de embalagem).
  - `NOT_FOUND`: Tentativa com código inexistente (gravado no log de telemetria para auditoria de ataques).
  - `REVOKED`: Código ou lote revogado pela fábrica.

## 5. Endpoints da API REST
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Healthcheck do servidor e latência do Neon PostgreSQL |
| `POST` | `/api/verify` | Validação atômica de código farmacêutico (Público) |
| `GET` | `/api/products` | Catálogo de produtos ativos (Público / Admin) |
| `POST` | `/api/products` | Cadastro de novo produto no Neon (Admin) |
| `GET` | `/api/batches` | Listagem de lotes com estatísticas e alertas de fraude |
| `POST` | `/api/batches/generate` | Criação de lote com geração em massa de códigos únicos |
| `GET` | `/api/batches/:id/codes` | Códigos de segurança gerados para um lote |
| `GET` | `/api/telemetry/metrics` | Métricas resumidas do painel administrativo |
| `GET` | `/api/telemetry/logs` | Feed de consultas em tempo real com filtros |
| `POST` | `/api/auth/login` | Autenticação do administrador |
