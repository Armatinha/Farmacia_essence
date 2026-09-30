# 02 — Jornadas de Usuário

> Estado: aprovado

## Atores
1. **Cliente / Consumidor Final:** Acessa o site para conhecer a marca, ver catálogo e, principalmente, verificar o código do produto recém-comprado.
2. **Administrador:** Gerencia o catálogo do site, cadastra lotes de códigos de autenticidade e visualiza métricas de segurança.

## Jornadas

### Jornada 1: O Cliente que verifica a autenticidade (Mobile / Desktop)
- **Gatilho:** Cliente recebe o produto com um código raspável/visível na embalagem e entra no site (possivelmente via QR code que leva à página Home ou Autenticação).
- **Passos:**
  1. Acessa a aba **Autenticação**.
  2. Digita o código alfanumérico único.
  3. Clica em "Verificar Produto".
  4. O sistema processa e exibe um de três estados:
     - **Autêntico (1ª consulta):** Mensagem de sucesso (ex: "✓ Produto autêntico e verificado pela primeira vez").
     - **Já verificado (>1 consulta):** Alerta amarelo (ex: "⚠ Código previamente verificado X vezes. Se não foi você, contate o suporte").
     - **Inválido/Não Encontrado:** Alerta vermelho (ex: "✕ Código não encontrado em nossa base de dados").
- **Fricções e resoluções:** A verificação deve ser extremamente rápida e o botão visível já na página inicial (Home).

### Jornada 2: Exploração Institucional
- **Gatilho:** Um potencial cliente, médico ou parceiro quer saber mais sobre a empresa.
- **Passos:**
  1. Entra na **Home** e é impactado pelo visual premium, científico e clean (inspirado em Oxygen KW Pharma).
  2. Navega para **Sobre Nós** para ler a missão e diferenciais da empresa.
  3. Vai para **Produtos** para visualizar o catálogo (foto, nome, informações básicas).
  4. Vai para **Contato** e utiliza um formulário ou link do WhatsApp para iniciar a conversa.

### Jornada 3: Gestão de Autenticidade (Admin)
- **Gatilho:** Lote novo de produtos será despachado, ou novos produtos foram criados.
- **Passos:**
  1. Admin loga no painel administrativo privado.
  2. Cria um novo "Produto" (nome, foto, informações).
  3. Acessa o gerador de códigos: gera (ou importa via CSV) X códigos atrelados àquele produto/lote.
  4. Visualiza no painel de "Consultas" o log de acessos aos códigos (incluindo tentativas de acesso a códigos inválidos ou já verificados).
