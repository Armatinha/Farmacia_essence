# Sete etapas do produto

Adaptadas dos sete arquivos fornecidos pela autora. Cada etapa consome a entrega aprovada da anterior; não pedir ao aluno que recoloque textos já existentes em `guia-produto/entregas/`. Em site, trocar “app/tela” por “site/página” quando fizer sentido.

| Nº | Origem | Entrega | Portão verificável |
| --- | --- | --- | --- |
| 1 | Visão | `01-visao.md` | Problema real, público, frase única e 1–2 sinais de sucesso específicos; aluno confirma. |
| 2 | Jornadas | `02-jornadas.md` | Pessoa, ação e motivo em “Como…, quero…, para…”; aluno confirma cobertura. |
| 3 | Brainstorm | `03-funcionalidades.md` | Possibilidades agrupadas por tema; incluir somente ideias escolhidas pelo aluno. |
| 4 | MVP | `04-mvp.md` | Agora/Depois/Nunca a partir da lista anterior; justificar e confirmar cada item de Agora. |
| 5 | Mapa de telas | `05-telas.md` | Páginas necessárias para cumprir as jornadas do MVP, com uma frase de finalidade; aluno pode juntar ou excluir. |
| 6 | Detalhar telas e fluxo | `06-frontend.md` e `APP_FLOW.md` | Cada tela tem conteúdo, ações, estados, caminhos de recuperação e critérios “Consigo…” aprovados; construir depois do design system. |
| 7 | Documentos do projeto | `07-dados.md`, `PRD.md`, `TRD.md`, `IMPLEMENTATION_PLAN.md` e `TESTING.md` | Dados e acesso definidos; produto, técnica, ordem de construção e verificações são coerentes; decisões abertas permanecem `TBD`. |

## Entrevistas e formatos

**1. Visão:** perguntar uma coisa por vez nesta ordem: situação dolorosa específica; pessoa principal e motivo; frase “Ajuda [pessoa] a [resultado]”; 1–2 sinais observáveis em três meses. Mostrar rascunho e esperar correção/confirmação. Escrever quatro campos: Problema, Quem usa, Em uma frase, Sinais de sucesso.

**2. Jornadas:** identificar atores (incluindo administrador quando houver), ações ordenadas e motivo de cada ação. Uma ação por frase. Perguntar se faltou algo importante; só então registrar.

**3. Funcionalidades:** propor um tema por vez, 3–6 possibilidades simples, pedir seleção e acréscimos. Não classificar por prioridade aqui. Registrar apenas seleções aprovadas.

**4. MVP:** classificar as ideias aprovadas em Agora, Depois e Nunca. Evitar a fase de expansão repetida do arquivo 4 original. Para cada “Agora”, perguntar se é indispensável para a frase única da visão. Distinguir requisito de lançamento de ideia que pode esperar. O aluno decide alterações.

**5. Telas:** partir do MVP e jornadas; sugerir página principal, configurações/perfil apenas se úteis e telas específicas. Identificar onde cadastro/login entram, se necessários; não supor que ferramentas os criam corretamente nem dispensar testes. Aprovar mapa completo.

**6. Telas e fluxo:** para cada tela, especificar cinco campos: (a) objetivo e público, (b) conteúdo e ordem, (c) ações ao tocar/clicar, (d) estados de carregamento, vazio, sucesso e erro, (e) critérios “Consigo…”. Ligar as telas em `APP_FLOW.md`, registrando entradas, jornada principal, decisões, voltar/cancelar/tentar novamente e fluxos secundários necessários. Perguntar pelo material existente. Adiar a direção visual detalhada e o código para Construção.

**7. Documentos do projeto:** mapear telas para entidades, campos, relacionamentos e quem pode acessar cada dado. Se não houver persistência, documentar por quê. Consolidar `PRD.md` a partir das sete entregas e gerar `TRD.md`, `IMPLEMENTATION_PLAN.md` e `TESTING.md` seguindo [documentos.md](documentos.md). Perguntar por stack e restrições que mudam custo ou arquitetura; manter `TBD` quando não houver decisão. Conferir as relações: jornada → tela → requisito → fase → teste. Mostrar os cinco documentos ao aluno e corrigir contradições antes de avançar. Deixar implementação e evidências de teste para Construção; nunca usar dados reais sem acesso e isolamento testados.

## Regra de perguntas

Não perguntar de novo quando a resposta já está no repositório ou na conversa. Ao detectar vagueza, oferecer dois exemplos ligados ao projeto. Ao perceber que uma decisão muda muito o custo ou escopo, tornar a escolha explícita. Fechar cada documento com decisão e aceitação do aluno.
