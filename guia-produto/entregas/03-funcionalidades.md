# 03 — Funcionalidades

> Estado: aprovado

## Temas Épicos

1. **Vitrine Institucional Pública:**
   - Apresentação da marca, valores corporativos e filosofia de trabalho (Home, Sobre).
   - Catálogo simplificado de produtos (Nome, Imagem, Descrição curta/Informações básicas).
   - Contato integrado via WhatsApp, redes sociais e formulário simples.
   - Design System Premium: vidro jateado (glassmorphism), fontes sofisticadas (sans-serif clean), paleta de cores neutra, micro-animações, foco em alta performance (mobile-first).

2. **Motor de Autenticação (Frontend Público):**
   - Formulário de consulta rápida por código (alfanumérico).
   - Lógica de três estados: 
     1. Autêntico (primeira consulta, sucesso).
     2. Previamente verificado (alerta, com contagem de consultas).
     3. Código não encontrado (falha).
   - Registrador anônimo (grava no banco de dados que aquele código acabou de ser consultado, incrementando contador).

3. **Painel Administrativo (Backend/SaaS Privado):**
   - **Autenticação Admin:** Login seguro para gestores do site.
   - **Gestão de Produtos:** CRUD (Criar, Ler, Atualizar, Deletar) de produtos (Foto, Título, Info).
   - **Gestão de Códigos:** 
     - Geração de lotes de códigos aleatórios seguros atrelados a um produto.
     - Importação de códigos em lote via CSV.
   - **Histórico / Telemetria:** Relatório simples mostrando histórico de verificações de códigos (quais códigos, status, timestamps, total de consultas válidas x inválidas).
