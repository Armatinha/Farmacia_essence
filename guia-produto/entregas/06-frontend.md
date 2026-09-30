# 06 — Detalhamento das Telas

> Estado: aprovado

## Site Institucional

### 1. Home (`/`)
- **Herói (Hero):** Título principal impactante ("Excelência e Ciência"), subtítulo de apresentação e dois botões de CTA ("Explorar Produtos" e "Verificar Autenticidade").
- **Seção de Produtos Destacados:** Carrossel/Grid simples com 3 a 4 produtos principais, fundo minimalista.
- **Diferenciais da Marca:** Três pilares com ícones finos (ex: Qualidade, Segurança, Suporte).
- **Banner de Autenticação:** Chamada forte no final da página redirecionando para `/autenticacao`.

### 2. Sobre Nós (`/sobre`)
- **Texto:** Blocos de texto legíveis e grandes sobre a "Missão", "Valores" e "História".
- **Visual:** Imagens de laboratório ou ambientações clean com efeito parallax suave.

### 3. Produtos (`/produtos`)
- **Catálogo:** Grid de cards. Cada card com foto limpa do produto, Nome, Concentração/Miligramagem, Categoria.
- **Ação:** Um botão "Saber Mais" (que pode expandir um modal com mais dados técnicos) ou apenas ser uma vitrine estática nesta fase MVP.

### 4. Autenticação (`/autenticacao`)
- **Hero:** Fundo com textura ou glassmorphism.
- **Formulário Central:** Input de texto grande e estilizado pedindo "Insira o código do seu produto". Botão "Verificar".
- **Área de Feedback (Dinâmica):**
  - **Vazio:** Instruções simples de onde encontrar o código na caixa ("Raspe o selo...").
  - **Sucesso (Verde):** Ícone de check, "✓ Produto Autêntico. Verificado pela 1ª vez em DD/MM/AAAA HH:MM". Produto nome: X.
  - **Atenção (Amarelo):** Ícone de alerta, "⚠ Este código já foi verificado X vezes. Se você não fez consultas anteriores, cuidado."
  - **Erro (Vermelho):** "✕ Código não encontrado em nossa base de dados. Por favor verifique a digitação."

### 5. Contato (`/contato`)
- **Formulário:** Nome, E-mail, Assunto, Mensagem.
- **Informações:** Botão flutuante ou fixo para contato direto no WhatsApp. Informação de e-mail institucional.

## Painel Admin Privado

### 6. Login (`/admin/login`)
- Campos de email e senha, logo da empresa.

### 7. Produtos e Códigos (`/admin/produtos` e `/admin/codigos`)
- **Tabela:** Listagem de dados com campos de pesquisa.
- **Gerador:** Modal/Painel para "Gerar Códigos". O admin escolhe um Produto, define a "Quantidade (ex: 1000)" e clica em Gerar. O banco cria os hashes. Botão de "Exportar CSV" ou "Baixar".
