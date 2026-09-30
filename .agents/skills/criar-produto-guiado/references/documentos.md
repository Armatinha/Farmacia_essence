# Documentos vivos do projeto

Gerar cada documento com respostas e evidências do projeto. Não preencher com frases genéricas nem repetir a mesma informação em vários arquivos; usar links relativos entre documentos quando necessário.

## Padrão visual do Markdown

- Abrir com título, resumo de uma frase e uma linha `> Estado: rascunho | aprovado | precisa revisar`.
- Usar ícones discretos nos títulos de nível 2 para facilitar leitura: 🎯 objetivo, 👥 pessoas, 🧭 fluxo, 🎨 visual, 🧱 estrutura, 🔐 segurança, 🗃️ dados, 🔌 API, 🧹 código e ✅ verificação.
- Preferir tabelas para regras e comparações, checklists para validações e blocos de código apenas para exemplos reais.
- Manter seções curtas, com linguagem simples. Incluir “Decisões tomadas”, “Pendências” e “Como verificar” ao final.
- Atualizar o documento existente em vez de criar versões como `final-v2`.

## Arquivos e momento de criação

| Arquivo | Criar/atualizar | Conteúdo mínimo |
| --- | --- | --- |
| `PRD.md` | Ao concluir `p7`; atualizar quando o escopo mudar | Problema, público, jornadas, MVP, telas, dados, fora do escopo e critérios de aceite. |
| `APP_FLOW.md` | Criar em `p6`; atualizar quando telas ou jornadas mudarem | Entradas, jornada principal, telas, ações, respostas do sistema, decisões, estados vazios, erros, recuperação e fluxos secundários. |
| `TRD.md` | Criar em `p7`; atualizar quando uma decisão técnica mudar | Visão técnica, objetivos, stack decidida ou `TBD`, requisitos funcionais e não funcionais, integrações, dados, restrições e definição de pronto. |
| `IMPLEMENTATION_PLAN.md` | Criar em `p7`; atualizar conforme a construção avançar | Fases pequenas, tarefas, dependências, entrega, verificação, estado e itens fora do escopo. Somente uma fase ativa por vez. |
| `TESTING.md` | Criar em `p7`; preencher durante toda a construção | Jornada crítica, uso normal, validações, falhas, permissões, responsividade, acessibilidade, segurança, regressão, bloqueios e formato de evidência. |
| `DESIGN_SYSTEM.md` | `b1` | Direção visual, tipografia, cores, grid, espaçamento, componentes, estados, movimento, acessibilidade e referências preservadas. |
| `CODE_STYLE.md` | Começar em `b2`; concluir em `b6` | Stack detectada, organização, nomes, componentes/funções, tratamento de erros, testes, comentários, formatação e comandos reais. |
| `ARCHITECTURE.md` | `b3` | Contexto, componentes, fluxos, limites, decisões, serviços externos, implantação e diagrama Mermaid quando ajudar. |
| `DATABASE.md` | `b3`; marcar não aplicável em site sem persistência | Entidades, campos, relações, donos, isolamento, índices, migrações, retenção, backup e comandos seguros. Nunca incluir credenciais. |
| `API_GUIDE.md` | `b4`; marcar não aplicável quando não há API | Autenticação, autorização, convenções, endpoints, entradas, respostas, erros, paginação, limites, idempotência e exemplos sem segredos. |
| `SECURITY.md` | Iniciar em `s1`; consolidar em `s4` | Dados e riscos, autenticação, autorização, segredos, validação, proteção de dados, dependências, logs, incidentes e evidências dos testes. |
| `AGENTS.md` | `b6`, depois de existirem comandos e arquitetura reais | Contexto curto, arquivos fonte, comandos, limites, convenções e verificações obrigatórias para agentes que continuarem o projeto. Se já existir, preservar suas regras e acrescentar apenas o que faltar. |

## Coerência antes do PRD

Conferir se cada item de Agora vem da lista escolhida e resolve uma jornada; cada jornada do MVP deve ter tela e critério de aceite; cada dado da tela deve ter dono e acesso definido. Apontar dúvidas ao aluno antes de escrever requisitos novos. O PRD deve referenciar as sete entregas em vez de substituí-las.

## Quatro guias para construir

Adaptar os quatro modelos do guia fornecido pelo aluno ao projeto real. Usá-los como documentos vivos, sem copiar conteúdo de exemplo nem escolher silenciosamente uma tecnologia.

### `APP_FLOW.md`

Descrever o percurso com nomes de telas e ações observáveis. Incluir:

1. Pontos de entrada: página pública, convite, login, link direto ou outro início real.
2. Jornada principal em sequência, seguida do detalhamento de cada tela.
3. Ação da pessoa e resposta do sistema em cada passo.
4. Decisões e ramificações, inclusive ausência de dados.
5. Carregamento, sucesso, validação, falha e tentativa novamente.
6. Voltar, cancelar, sair e recuperar senha quando aplicável.
7. Fluxos secundários relevantes, sem inventar funcionalidades fora do MVP.

### `TRD.md`

Traduzir o produto em limites técnicos. Incluir:

1. Visão técnica curta e objetivos mensuráveis.
2. Stack por camada; escrever `TBD — decisão pendente` quando o aluno ainda não decidiu.
3. Requisitos funcionais como comportamentos observáveis.
4. Requisitos não funcionais: desempenho, segurança, acessibilidade, confiabilidade e tamanhos de tela conforme o projeto.
5. Integrações, dados armazenados, donos e local de processamento.
6. Restrições reais de orçamento, prazo, dispositivo, privacidade ou fornecedor.
7. Definição de pronto ligada ao `TESTING.md`.

Antes de aprovar, listar contradições, riscos e decisões abertas. Perguntar antes de transformar `TBD` em decisão.

### `IMPLEMENTATION_PLAN.md`

Transformar o PRD, fluxo e TRD em fases pequenas. Cada fase deve conter objetivo, tarefas, dependências, arquivos esperados quando já conhecidos, entrega, como verificar, estado e itens adiados. Trabalhar somente na fase ativa; registrar falhas e corrigir antes de avançar. Atualizar o plano quando o escopo mudar.

### `TESTING.md`

Definir o que significa funcionar. Separar verificações automatizadas das manuais e nunca marcar como aprovado algo que não foi executado. Cobrir:

- jornada crítica ponta a ponta;
- entradas válidas, inválidas, vazias, longas e repetidas;
- rede, API e serviço indisponíveis sem perda indevida de dados;
- autenticação, autorização e isolamento entre duas contas quando houver dados privados;
- celular, tablet e desktop aplicáveis;
- teclado, foco, rótulos, contraste, textos alternativos e ordem de títulos;
- regressão das funções já aprovadas;
- bloqueios de lançamento;
- resultado com teste, esperado, obtido, ambiente, reprodução, evidência, gravidade e estado.

## Visualização estilizada

Após criar ou atualizar qualquer documento da tabela, executar:

`python3 <esta-skill>/scripts/guia.py render --project .`

Isso atualiza `guia-produto/diagrama.html` e `guia-produto/documentos.html`, com as sete entregas e os doze documentos vivos em navegação lateral, tabelas legíveis e links entre eles. O HTML é uma visualização; os arquivos Markdown continuam sendo a fonte editável. Conferir que os arquivos existem antes de mostrá-los ao aluno.
