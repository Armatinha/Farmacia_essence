# Construção e acabamento das telas

## Antes do código

Para cada página ou tela, obter: público e objetivo, clima visual, percurso do visitante, percepção desejada após usar a tela, onde o ritmo deve ser calmo/intenso, interação marcante que faz sentido, textos/logo/imagens e conteúdo a preservar. Tratar essa entrevista como reconstrução de ideias observadas no vídeo “Sites Incríveis”, não como cópia de uma skill publicada.

Na primeira etapa da Construção (`b1`), escrever `DESIGN_SYSTEM.md` com direção visual: tipografia, paleta, grid, densidade, componentes, estados, movimento e tom. Dar identidade ao projeto conforme o público; evitar repetir o mesmo cabeçalho, cartões e gradientes em qualquer produto. Pedir aprovação dessa direção antes de construir a primeira tela. Se Stitch estiver configurado, explorar e revisar opções nele; usar sua saída como referência e conferir no navegador a implementação real. O fluxo funciona sem Stitch.

## Uma tela por vez

1. Retomar os cinco campos de `06-frontend.md`, o caminho correspondente em `APP_FLOW.md`, a fase ativa de `IMPLEMENTATION_PLAN.md` e a direção aprovada no `DESIGN_SYSTEM.md`.
2. Construir visual e interações da tela atual com dados de exemplo identificáveis; evitar telas adicionais não aprovadas.
3. Inspecionar no navegador em larguras de celular e desktop. Verificar toque, teclado, foco, rótulos, contraste, estados vazios/erro/sucesso, carga e comportamento responsivo.
4. Usar movimento para orientar atenção ou explicar mudança de estado. Definir duração/curva intencional, controlar excesso e respeitar preferência por movimento reduzido.
5. Fazer uma revisão de hierarquia, legibilidade, espaçamento, alinhamento, consistência, originalidade e detalhes. Corrigir o que observou e testar novamente.
6. Executar os casos relevantes de `TESTING.md`, registrar evidência e mostrar checklist de aceite com frases únicas iniciadas por “Consigo…” antes da próxima tela.

Princípios adaptados das fontes citadas pela autora: Emil Kowalski (animação com função), Impeccable (crítica e acabamento) e Taste (variação consciente de composição, densidade e movimento). Usar conceitos próprios; não embutir textos, comandos ou arquivos das skills deles.

## Integração

Quando as telas estiverem aprovadas, conectar a navegação conforme `APP_FLOW.md`, revisar o percurso ponta a ponta e conferir que nenhum botão promete uma ação inexistente. Substituir dados de exemplo apenas na etapa de backend, quando houver armazenamento adequado. Atualizar `06-frontend.md`, `IMPLEMENTATION_PLAN.md` e `TESTING.md` com telas aprovadas, verificações executadas, evidências e pendências.
