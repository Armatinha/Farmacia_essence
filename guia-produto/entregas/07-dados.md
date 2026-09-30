# 07 — Definição de Dados

> Estado: aprovado

## Modelo Conceitual Básico

### 1. `products`
Informações vitrines dos produtos oferecidos pela marca.
- `id` (UUID, PK)
- `name` (String, ex: "GHK-Cu")
- `concentration` (String, ex: "100 mg")
- `category` (String, ex: "Peptídeos")
- `description` (Text)
- `image_url` (String)

### 2. `codes`
Tabela com os códigos únicos raspáveis colados nas caixas dos produtos.
- `id` (UUID, PK)
- `product_id` (FK para `products.id`)
- `code_hash` (String, UK, o código visível para o cliente: alfanumérico curto e fácil de ler, ex: "XY9-8L4-ZQX")
- `times_checked` (Integer, default: 0) - Conta as vezes que o código foi pesquisado.
- `created_at` (Timestamp)

### 3. `check_logs`
(Opcional, para telemetria de segurança avançada) - Registro individual de cada tentativa de verificação.
- `id` (UUID, PK)
- `code_hash_tried` (String - O que o cliente digitou)
- `is_valid` (Boolean)
- `checked_at` (Timestamp)
- `ip_address` ou metadados de acesso (Opcional, se permitido legalmente).

## Regras de Negócio e Acesso (Supabase / RLS)

- **Acesso Público (Não-Autenticado):**
  - Pode LER `products` (para o catálogo).
  - Pode INSERIR (mas não listar) uma query para o endpoint de checagem.
    - O endpoint de verificação é uma função server-side (`edge function` ou `RPC`) que recebe o `código` como input. 
    - Se encontrar o código: incrementa `times_checked`, insere em `check_logs`, e retorna a resposta de status. Não expõe todos os códigos da base ao público.
    - O público NÃO PODE fazer um `SELECT * FROM codes`.
- **Acesso Privado (Admin):**
  - Tem leitura e escrita total em todas as tabelas (`products`, `codes`, `check_logs`).
  - Protegido via Supabase Auth (Role: autenticado e flag admin ou `user_id` aprovado).

## Conselhos Finais de Segurança
- A geração dos códigos deve usar entropia suficiente para evitar força bruta em códigos curtos (ex: `uuid` limpo ou algoritmos criptograficamente seguros de 8-12 caracteres base58 ou base36 misturando letras maiúsculas e números, evite 0/O, 1/I).
