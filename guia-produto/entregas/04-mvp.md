# 04 — Escopo do MVP

> Estado: aprovado

## O que faremos AGORA (MVP)

1. **Site Institucional Público (Páginas estáticas + dinâmicas):**
   - Home (Header com navegação, Hero premium, Destaques, Atalho de Verificação).
   - Sobre Nós (Texto corporativo e diferenciais, imagens clean).
   - Produtos (Grid de catálogo conectada ao banco de dados ou CMS).
   - Autenticação (Interface de validação com formulário centralizado e motor de feedback de três estados).
   - Contato (Links e form simples).
2. **Sistema de Autenticação (Motor):**
   - Lógica de incremento do contador ao consultar.
   - Respostas de API instantâneas.
3. **Painel Admin Básico:**
   - Tela de Login Privada.
   - Tela de Produtos (listar, adicionar, editar, apagar).
   - Tela de Códigos (gerar, listar, status: "não consultado", "consultado X vezes").
4. **Infraestrutura:**
   - Stack frontend (Ex: React/Vite/Next.js).
   - Stack backend/banco de dados rápido (Ex: Supabase) para gerenciar produtos, códigos e log de consultas em tempo real.

## O que faremos DEPOIS
- E-commerce e checkout (carrinho de compras, pagamentos, gateway).
- Área logada para clientes finais.
- Blog ou artigos de pesquisa aprofundados.
- Integração de leitura de QR Code nativa usando a câmera do celular no próprio site. (Por ora, o QR code na caixa pode apenas direcionar o usuário com um parâmetro GET `?codigo=XYZ` para preencher o input automaticamente).

## O que NÃO faremos (Nunca)
- Marketplace de múltiplos lojistas vendendo produtos.
- Plataforma de afiliados integrada a esse produto institucional.
