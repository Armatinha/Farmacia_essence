# Piloto privado com alunos

Usar quando a pessoa responsável quiser avaliar a turma antes de abrir acesso público. Não coletar credenciais, dados reais de clientes nem conteúdo privado dos projetos nos registros do piloto.

## Cinco tarefas observáveis

1. Instalar num projeto de teste no sistema do aluno. Anotar se o agente encontra a skill e quanto tempo levou até a primeira pergunta.
2. Responder à visão de uma ideia própria; conferir se `01-visao.md` traz as quatro decisões e se o mapa abre.
3. Retomar em uma conversa nova; conferir se a próxima pergunta respeita o estado e não repete respostas.
4. Concluir as sete entregas com ajuda do agente; abrir `PRD.md` e conferir se as decisões aparecem sem requisitos inventados.
5. Abrir documentos e tocar em uma etapa do mapa; conferir navegação, arquivo e critério no celular ou desktop que o aluno usa.

## Registro resumido

Por participante, registrar apenas: ferramenta e sistema, tempo de instalação, tempo até primeira entrega, se retomada funcionou, onde travou, arquivos ausentes, qualidade do PRD avaliada pelo aluno e correção necessária. Testar primeiro com um grupo pequeno; priorizar os bloqueios repetidos antes de convidar mais alunos.

## Casos de regressão sem dados reais

- Projeto novo e projeto existente com `AGENTS.md`.
- Site estático sem banco e SaaS com autenticação.
- Etapa com arquivo faltando, nota vazia e evidência apontando para fora do projeto: não avançar.
- Arquivo de etapa aprovado depois apagado: exibir revisão no mapa.
- Conversa reiniciada: retomar o estado; versão anterior: preservar entregas.
- Antigravity em modo plugin local, Codex em `.codex/skills`, Cursor em `.agents/skills` e Claude em `.claude/skills`.
