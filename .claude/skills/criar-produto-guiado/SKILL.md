---
name: criar-produto-guiado
description: Guiar alunos da ideia ao PRD e à construção de site ou SaaS, com sete entregas de produto, mapa visual interativo, documentos vivos, testes e checklist de lançamento. Usar ao começar, continuar, instalar, demonstrar ou revisar um projeto; adaptar a explicação a iniciante, intermediário ou avançado.
---

# Criar Produto Guiado

Conduzir o aluno do primeiro problema até uma decisão de publicação verificável. Trabalhar no repositório do projeto atual. Usar a linguagem do aluno e preservar decisões já aprovadas.

## Primeira interação e retomada

1. Se existir `guia-produto/estado.json`, ler o estado com `python3 <esta-skill>/scripts/guia.py status --project .`, consultar as entregas e retomar a etapa atual. Não reiniciar a entrevista.
2. Se não existir, executar `python3 <esta-skill>/scripts/guia.py init --project .`. Isso cria `guia-produto/diagrama.html`, que abre no navegador sem servidor, cadastro ou integração. Apresentar o mapa visual, mostrar como abrir o arquivo e informar a etapa atual. No chat, explicar que as sete entregas da primeira fase produzem `PRD.md`, `APP_FLOW.md`, `TRD.md`, `IMPLEMENTATION_PLAN.md` e `TESTING.md`. Se o aluno quiser ver o resultado antes de começar, gerar uma amostra isolada com `python3 <esta-skill>/scripts/demo.py --output CAMINHO-NOVO` e abrir o `guia-produto/diagrama.html` da amostra; dizer claramente que é um exemplo fictício.
3. Perguntar primeiro se o projeto é **site** ou **SaaS**; se ainda não souber, registrar `indefinido` e decidir após a visão. Registrar com `python3 <esta-skill>/scripts/guia.py config --project . --type site|saas|indefinido`.
4. Perguntar o nível preferido: **iniciante**, **intermediário** ou **avançado**. Começar em iniciante até que o aluno escolha. Registrar com `config --level ...`. O nível muda a explicação, nunca a qualidade dos critérios.
5. Fazer a pergunta útil seguinte da etapa atual. Uma pergunta por vez nas entrevistas. Se o aluno já forneceu a resposta, aproveitá-la sem perguntar de novo.

Substituir `<esta-skill>` pelo diretório que contém este `SKILL.md`; descobrir o caminho real no ambiente. Se Python não estiver disponível, criar o mesmo estado e diagrama com as ferramentas do ambiente e registrar a limitação. Não afirmar que o diagrama foi criado sem verificar o arquivo.

Se o aluno usar o mesmo projeto em várias ferramentas, instalar com `python3 <esta-skill>/scripts/instalar.py --project CAMINHO --platform all`: a cópia em `.agents/skills` atende Antigravity, Codex e Cursor; a cópia em `.claude/skills` atende Claude Code. Para apenas uma ferramenta, usar `--platform codex|cursor|antigravity|claude`; no Antigravity isolado, o padrão é um plugin local do projeto. O script `scripts/instalar.ps1` faz a instalação no Windows sem exigir Python para copiar os arquivos; usar `-Platform all` para as quatro ferramentas. O mapa e as validações exigem Python 3 (`py -3`, `python3` ou `python`, conforme o sistema). Verificar com `instalar.py --verify` quando possível. Atualizar apenas com `--update`, que preserva cópia anterior. A instalação em repositório Git acrescenta exclusão local para reduzir a chance de publicar a skill junto com o projeto; isso não impede redistribuição manual. Não afirmar que plugin ou skill local aparecerá em marketplace público. O acesso ao projeto de outro computador precisa estar disponível no ambiente; não fingir instalação em um caminho Windows que não está montado aqui.

Quando a pessoa responsável pedir uma nova versão para a turma, atualizar `assets/versao.json` com SemVer, data e mudanças; gerar o pacote com `python3 <esta-skill>/scripts/publicar.py --output PASTA`. Entregar o ZIP e o texto `mensagem-grupo-vX.Y.Z.txt`. Para turma privada, orientar a anexar o ZIP diretamente no grupo; não inventar link público. Se ela fornecer uma URL privada real, regenerar com `--download-url URL`. O pacote inclui instalador/atualizador para Windows e instruções para macOS/Linux. Orientar os alunos a extrair tudo antes de instalar; a atualização mantém os documentos do projeto e guarda a skill anterior como backup. Conferir a versão com `instalar.py --version` e a instalação com `instalar.py --project CAMINHO --platform all --verify`.

## Experiência por nível

- **Iniciante:** explicar cada decisão com uma frase simples e um exemplo do projeto. Executar tarefas técnicas disponíveis; pedir ao aluno apenas escolhas de produto, acesso indispensável e aprovação em portões. Mostrar onde clicar e como conferir o resultado.
- **Intermediário:** mostrar uma recomendação e até duas alternativas quando a escolha mudar custo, prazo ou arquitetura. Explicar brevemente o motivo e os testes.
- **Avançado:** ser direto; expor contratos, tradeoffs, riscos, diffs e evidência de validação. Não impor uma stack padrão.
- O aluno pode dizer `mais simples`, `mais técnico`, `voltar`, `ver diagrama` ou `continuar`; atualizar a forma de ajudar sem perder o progresso.

## Fluxo e portões

Ler [etapas.md](references/etapas.md) para as sete etapas e seus modelos de entrega. Ler [documentos.md](references/documentos.md) antes de gerar ou atualizar qualquer documento vivo. Ler [frontend.md](references/frontend.md) ao chegar ao design system ou frontend; [backend.md](references/backend.md) ao chegar à arquitetura e backend; [seguranca-publicacao.md](references/seguranca-publicacao.md) ao preparar segurança e publicação.

1. **Produto (7):** visão → jornadas → funcionalidades → MVP → mapa de telas → detalhar telas e `APP_FLOW.md` → definir dados e consolidar `PRD.md`, `TRD.md`, `IMPLEMENTATION_PLAN.md` e `TESTING.md`.
2. **Construção (6):** entrevista visual e `DESIGN_SYSTEM.md` → frontend e `CODE_STYLE.md` → arquitetura, `ARCHITECTURE.md` e `DATABASE.md` → API, regras e `API_GUIDE.md` → integrações e erros → testes, operação e `AGENTS.md`. Construir o frontend uma tela por vez; ler [frontend.md](references/frontend.md) em `b1`/`b2` e [backend.md](references/backend.md) em `b3`–`b6`.
3. **Lançamento — Segurança (4):** iniciar `SECURITY.md` com dados e riscos → identidade e acesso → segredos e privacidade → testes e consolidação do documento.
4. **Publicação (1):** checklist específico para site ou SaaS; emitir decisão `pronto`, `pendente` ou `não aplicável` por item com evidência. Registrar cada teste com `python3 <esta-skill>/scripts/guia.py check --project . --item ID --status pronto --note "resultado do teste" --evidence CAMINHO-RELATIVO`; para `pendente` ou `nao-aplicavel`, descrever a razão em `--note`. IDs e bloqueios aparecem em `status` e no diagrama. Itens críticos impedem concluir a última etapa.

Ao entrar em uma etapa, mostrar objetivo, entrega e teste de aceite. Trabalhar e verificar o resultado. Pedir aprovação sobre a entrega apenas no portão da etapa; corrigir o que o aluno indicar. Só após evidência e aprovação avançar com `python3 <esta-skill>/scripts/guia.py complete --project . --stage ID --note "o que foi confirmado ou testado" --evidence CAMINHO-RELATIVO`. `--evidence` aponta para arquivo existente dentro do projeto (entrega, código ou registro de teste), e o comando confere os documentos obrigatórios da etapa. Para passos condicionais com `--status nao-aplicavel`, registrar a justificativa em `--note`. Não marcar um teste como feito só porque existe um arquivo: executar a verificação e registrar seu resultado. Após o avanço, o diagrama pinta a etapa comprovada de verde e a fase ativa de laranja; entregas antigas sem arquivo/evidência passam a mostrar revisão, sem apagar decisões anteriores. O aluno pode tocar numa fase e em cada etapa para ver arquivos, critério e próxima pergunta. Não marcar concluído por clique no mapa.

Guardar entregas curtas em `guia-produto/entregas/` com os nomes indicados nas referências. Em uma nova conversa, ler o estado e as entregas relevantes antes de perguntar. Se já existe projeto, inspecionar o código e os arquivos antes de propor mudanças. Não descartar trabalho do aluno para seguir uma receita.

Manter no projeto os documentos vivos `PRD.md`, `APP_FLOW.md`, `TRD.md`, `IMPLEMENTATION_PLAN.md`, `TESTING.md`, `DESIGN_SYSTEM.md`, `CODE_STYLE.md`, `ARCHITECTURE.md`, `DATABASE.md`, `API_GUIDE.md`, `SECURITY.md` e `AGENTS.md`. Depois de qualquer alteração em arquivos da jornada, executar `python3 <esta-skill>/scripts/guia.py render --project .` para atualizar o mapa e a leitura estilizada em `guia-produto/documentos.html`. O Markdown é a fonte; o HTML é a apresentação colorida. Nunca duplicar decisões só para preencher os documentos. Verificar coerência entre visão, jornadas, MVP, telas, dados, requisitos, fases e testes antes de avançar.

Em projetos iniciados com uma versão anterior da skill, `p6` e `p7` podiam ter incluído implementação. Antes de prosseguir, conferir as entregas antigas, reaproveitar o código existente e completar os cinco documentos da fase Produto e `DESIGN_SYSTEM.md` quando ausentes. O mapa pode indicar revisão para etapas antigas que ainda não têm os novos arquivos; preservar as decisões e gerar apenas o que falta.

## Regras de execução

- A construção começa após os cinco documentos da fase Produto estarem coerentes e aprovados: primeiro direção visual, depois executar uma fase do `IMPLEMENTATION_PLAN.md` por vez e registrar resultados em `TESTING.md`.
- No passo 7, modelar os dados, seus donos e acessos; prototipar apenas com dados fictícios na Construção. Não expor dados reais de usuários ou clientes enquanto login, autorização e isolamento no servidor/banco não estiverem implementados e testados. Para site sem persistência, registrar por que o passo é não aplicável.
- Na arquitetura e API, implementar controle de acesso cedo se houver dados pessoais ou várias contas; a fase de segurança o revisa. Nunca confiar apenas em esconder botões na interface.
- Para site estático, marcar fases de backend realmente desnecessárias como não aplicáveis com explicação. Segurança básica e checklist de publicação continuam.
- Usar Stitch somente se já houver acesso e configuração; caso contrário, desenhar e implementar com as ferramentas existentes. Tratar ideias de design externas como inspiração de princípios, sem copiar skills de terceiros. Não presumir que a skill do vídeo “Sites Incríveis” foi publicada.
- Verificar funcionalidade real, responsividade, acessibilidade e erros. Não tratar mock visual, checklist marcado ou teste de sintaxe como prova de aplicação pronta.
- Não publicar nem migrar produção sem instrução do aluno. Se a publicação for pedida, mostrar o que será publicado e executar após a revisão final conforme permissões do ambiente.
- Esta edição é para uma turma privada: entregar acesso apenas aos alunos autorizados pela pessoa responsável. Não publicar em marketplace, site público ou repositório público por iniciativa própria. Um plugin local no projeto não oferece controle de licença ou bloqueio de redistribuição; explicar esse limite se perguntarem.
- Antes de ampliar a turma, usar [piloto.md](references/piloto.md) para testar instalação, primeira entrega, retomada e coerência do PRD com alunos reais. Corrigir os bloqueios observados; não afirmar que o piloto foi validado sem esses testes.

## Mensagem de andamento

Usar sempre quatro linhas concisas, ajustando ao contexto:

`Etapa: [nome] · [número] de 18`  
`Já temos: [entrega confirmada]`  
`Agora: [ação que está fazendo]`  
`Para avançar: [única decisão ou verificação pendente]`

No fim da etapa, mostrar o resultado concreto, onde foi salvo, o teste realizado e a pergunta de aprovação. Nunca dizer que uma etapa está concluída enquanto houver pendência crítica.
