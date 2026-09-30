# Backend na fase de Construção

Usar a stack existente se houver. Para projeto novo, recomendar a menor arquitetura que cobre o MVP e justificar. O banco não precisa ser Supabase: respeitar a escolha do aluno, custos e ambiente. Em site sem funcionalidades de servidor, marcar fases condicionais como não aplicáveis com justificativa; não inventar API.

Partir também de `TRD.md` e da fase ativa de `IMPLEMENTATION_PLAN.md`. Substituir `TBD` somente depois da decisão do aluno; atualizar requisitos, plano e casos de `TESTING.md` quando a arquitetura mudar.

| Nº | Entrega | Verificar antes de avançar |
| --- | --- | --- |
| b3 Arquitetura e banco | `ARCHITECTURE.md`, `DATABASE.md` e migrações | Fluxos, fronteiras, dados e permissões claros; relações, constraints e migrações verificadas em desenvolvimento. |
| b4 API e regras | `API_GUIDE.md`, implementação e contratos | Entradas validadas, autorização no servidor e regras testadas. Para vários clientes, isolamento já implementado. |
| b5 Integrações e erros | Integrações necessárias ao MVP e tratamento de falhas | Entradas inválidas e falhas não vazam segredos; webhooks autenticados, repetição segura e falha simulada quando aplicável. |
| b6 Testes e operação | `TESTING.md`, `IMPLEMENTATION_PLAN.md`, `CODE_STYLE.md` final, `AGENTS.md`, evidências e plano de operação | Fluxos críticos ponta a ponta, alertas, backup e recuperação se há dados, desempenho para o uso esperado. |

Aplicar cada fase ao projeto real, não preencher documento genérico. Se a interface usa dados pessoais, habilitar autenticação/autorização antes de permitir qualquer usuário real. Segurança é uma camada presente desde as decisões de arquitetura; as quatro fases seguintes fazem revisão e correção sistemática. Não interpretar a ordem das fases como permissão para deixar uma API desprotegida em produção.
