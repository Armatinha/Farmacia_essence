# Segurança e decisão de publicação

## Quatro fases de segurança

1. **Dados e riscos:** iniciar `SECURITY.md`; identificar tipos de dados, quem acessa, fluxos de terceiros, riscos prováveis e prioridade.
2. **Identidade e acesso:** atualizar `SECURITY.md`; verificar login/sessões se necessários, autorização em cada operação e isolamento entre clientes; testar acesso negado com dois usuários distintos.
3. **Segredos e privacidade:** atualizar `SECURITY.md`; conferir segredos em variáveis protegidas, HTTPS, logs e respostas, coleta mínima, retenção e configurações de armazenamento.
4. **Verificação:** testar entradas maliciosas plausíveis, abuso, dependências, configurações e correções; repetir os testes afetados. Consolidar em `SECURITY.md` as evidências, riscos restantes e resposta a incidentes.

Para site público sem contas, 2 pode ser não aplicável após verificar que não há operação protegida; 1, 3 e 4 ainda se aplicam na medida da arquitetura. Revisão automática não substitui inspeção de resultados.

## Checklist final (`18-publicacao.md`)

Marcar cada linha `pronto`, `pendente` ou `não aplicável`; incluir evidência ou motivo, responsável e prazo de pendências. Checklist muda por projeto. Uma pendência crítica impede o status “pronto para publicar”. Não marcar algo só porque o agente acredita que foi implementado: testar no ambiente de publicação.

**Todos:** fluxo principal ponta a ponta; links e formulários; celular e desktop; teclado e contraste; estados de erro; domínio/HTTPS; configuração de produção; segredos; erros e alertas; backup/restauração quando há dados; acesso e isolamento quando há contas; textos reais, contato e política de privacidade adequada ao que é coletado.

**Site:** abrir no celular, testar formulário, clicar no WhatsApp (se existir), página 404, domínio próprio conforme lançamento, HTTPS, desempenho em PageSpeed ou medição equivalente, imagens comprimidas, favicon, imagem de compartilhamento Open Graph. Os dez itens foram identificados no vídeo fornecido pela autora; demais ideias são complementos nossos. Conferir indexação, sitemap, títulos e descrições quando descoberta por busca for objetivo do site.

**SaaS:** cadastro/login/recuperação, permissões e isolamento de contas, criar/editar/excluir, dados persistirem após recarga, ciclo de assinatura/pagamento e webhooks se existirem, e-mail transacional se existir, suporte, privacidade, limites de uso, restauração e monitoramento. Testar cliente A tentando acessar dados do cliente B.

Saída: `Pronto para publicação` apenas se todas as verificações críticas aplicáveis foram comprovadas e o aluno aprovou; caso contrário, `Pendente`, com uma lista curta de bloqueios reais. Itens opcionais podem ir ao pós-lançamento com responsável e prazo. Se o aluno pediu ajuda para publicar, informar claramente a URL/ambiente pretendidos antes da ação externa.
