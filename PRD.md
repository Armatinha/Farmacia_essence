# Product Requirements Document (PRD)

## 1. Visão Geral
**Nome do Projeto:** Site Institucional & Autenticação de Produtos (Estilo Oxygen KW Pharma)
**Objetivo:** Oferecer um site institucional com design premium (minimalista, científico, mobile-first) que inclua um sistema ágil para os clientes validarem a autenticidade dos seus produtos via código alfanumérico.

## 2. O Problema
Com o mercado de peptídeos e compostos em crescimento, a pirataria é um risco. Clientes finais precisam de garantia imediata de que compraram um produto autêntico. A empresa precisa de um portal oficial, de alta performance e um painel de controle (admin) simplificado para cadastrar as chaves de segurança dos seus lotes e observar tentativas de fraude.

## 3. Usuários Alvo
1. **Consumidores:** Buscam validar o produto e consultar o catálogo oficial com facilidade.
2. **Administradores:** Necessitam importar milhares de códigos de forma rápida e ver estatísticas de consultas.

## 4. Escopo do MVP (Agora)
- **Site Frontend:** Páginas Home, Sobre Nós, Produtos, Contato e Autenticação.
- **Sistema de Validação:** Motor que consulta códigos com estados de "Autêntico", "Já Verificado X vezes" e "Não Encontrado".
- **Painel Administrativo:** CRUD de produtos e gerador/importador de códigos. Visualização básica de histórico.

## 5. Fora do Escopo (MVP)
- E-commerce e transações financeiras.
- Leitura automatizada por câmera nativa (o usuário deverá digitar, ou ler um QR code que apenas carrega a página `?codigo=XXX`).
- Perfis logados para clientes finais.

## 6. Sinais de Sucesso
- **Desempenho:** A verificação retorna o status em milissegundos.
- **Segurança:** Impossível consultar todo o banco de códigos via API pública.
- **Experiência Visual:** A página transmite alta confiança, parecendo limpa, médica e premium.
