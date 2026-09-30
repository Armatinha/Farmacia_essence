#!/usr/bin/env python3
"""Cria uma amostra fictícia isolada para mostrar a primeira virada de fase."""

import argparse
import html
from pathlib import Path
import guia

DOCS = {
    "01-visao.md": """# Visão · Agenda Viva
Ajuda pequenos estúdios a apresentar oficinas e receber inscrições.

> Estado: exemplo fictício aprovado para demonstração

## 🎯 Problema
Pessoas interessadas em oficinas precisam perguntar por mensagem sobre data, vagas e local antes de decidir.

## 👥 Quem usa
Alunos do bairro que procuram aulas curtas; a equipe do estúdio publica as informações.

## Em uma frase
Ajuda alunos a encontrar uma oficina adequada e solicitar a inscrição em poucos passos.

## Sinais de sucesso
- Pelo menos 20 solicitações de inscrição em três meses.
- Menos perguntas repetidas sobre horário e endereço.
""",
    "02-jornadas.md": """# Jornadas · Agenda Viva
> Estado: exemplo fictício aprovado para demonstração

| Pessoa | Como… quero… para… | Resultado |
| --- | --- | --- |
| Aluno | Como aluno, quero ver oficinas por data, para escolher uma que caiba na agenda. | Encontro uma oficina. |
| Aluno | Como aluno, quero pedir uma vaga, para receber confirmação da equipe. | Pedido enviado. |
| Equipe | Como equipe, quero atualizar horários, para evitar informações antigas. | Grade atualizada. |
""",
    "03-funcionalidades.md": """# Funcionalidades escolhidas
> Estado: exemplo fictício aprovado para demonstração

## Descoberta
- Lista de oficinas com data e preço.
- Detalhe com local, duração e vagas indicativas.

## Inscrição
- Formulário simples de interesse.
- Confirmação visual do envio.

## Equipe
- Atualização da agenda por arquivo de conteúdo do projeto na primeira versão.
""",
    "04-mvp.md": """# MVP · Agenda Viva
> Estado: exemplo fictício aprovado para demonstração

| Agora | Depois | Nunca nesta versão |
| --- | --- | --- |
| Lista e detalhe de oficinas | Conta do aluno | Feed social |
| Formulário de interesse | Pagamento online | Chat entre alunos |
| Contato e localização | Lembretes automáticos | Marketplace de professores |

O pedido de vaga é confirmado manualmente pela equipe; o site não promete reserva instantânea.
""",
    "05-telas.md": """# Mapa de telas
> Estado: exemplo fictício aprovado para demonstração

| Página | Para quê | Próximo passo |
| --- | --- | --- |
| Início | Explicar o estúdio e destacar oficinas. | Abrir a agenda. |
| Agenda | Comparar datas, temas e preços. | Abrir o detalhe. |
| Oficina | Entender local, vagas e duração. | Solicitar inscrição. |
| Confirmação | Informar que o pedido foi recebido. | Voltar à agenda. |
""",
    "06-frontend.md": """# Telas em detalhe
> Estado: exemplo fictício aprovado para demonstração

## Agenda
- Público e objetivo: aluno escolhendo uma oficina.
- Conteúdo: título, filtro de data, cartões com tema, data, preço e localização.
- Ação: abrir o detalhe; o filtro altera a lista.
- Estados: carregando, nenhuma oficina, erro e lista pronta.
- Aceite: consigo escolher uma data e abrir uma oficina.

## Oficina e confirmação
- Conteúdo: descrição, horário, endereço, vagas indicativas e formulário.
- Ação: enviar interesse; a equipe confirma a vaga depois.
- Estados: campos inválidos, enviando, sucesso e erro sem perda dos dados digitados.
- Aceite: consigo enviar um pedido e entender que ainda aguardo confirmação.
""",
    "07-dados.md": """# Dados e acesso
> Estado: exemplo fictício aprovado para demonstração

| Dado | Dono | Acesso previsto |
| --- | --- | --- |
| Oficina, data e preço | Equipe | Leitura pública; edição restrita à equipe. |
| Nome, e-mail e oficina desejada | Pessoa inscrita | Envio pela pessoa; leitura restrita à equipe. |

Na primeira versão a equipe atualiza a agenda no conteúdo do projeto. O destino seguro do formulário será definido na construção. Usar apenas dados fictícios no protótipo.
""",
}

PRD = """# PRD · Agenda Viva
Site fictício para demonstração da jornada guiada.

> Estado: exemplo fictício aprovado para demonstração

## 🎯 Problema e público
Alunos do bairro não encontram rapidamente data, preço e local das oficinas do estúdio. A equipe perde tempo respondendo repetidamente às mesmas perguntas. O site deve permitir que uma pessoa encontre uma oficina e solicite uma vaga com clareza.

## 🧭 Jornadas
O aluno vê a agenda, escolhe a oficina, lê os detalhes e envia interesse. A equipe recebe a solicitação, atualiza a agenda e confirma disponibilidade separadamente. Ver [jornadas](guia-produto/entregas/02-jornadas.md).

## ✅ MVP
Lista de oficinas, detalhe completo, formulário de interesse e confirmação de envio. Cadastro, pagamento e reserva instantânea ficam fora do escopo. Ver [decisões de MVP](guia-produto/entregas/04-mvp.md).

## 🎨 Telas
Início, agenda, detalhe da oficina e confirmação. As interações e os estados vazio, sucesso e erro constam em [telas em detalhe](guia-produto/entregas/06-frontend.md).

## 🗃️ Dados e acesso
Oficinas são públicas; inscrições contêm nome, e-mail e oficina desejada, visíveis apenas à equipe. Não usar dados reais até escolher e testar o destino seguro do formulário.

## Critérios de aceite
- Consigo encontrar uma oficina por data e abrir seus detalhes no celular.
- Consigo enviar interesse e entender que a equipe ainda precisa confirmar a vaga.
- Uma falha no envio mostra erro e permite repetir sem perder o conteúdo digitado.

## Decisões tomadas
O primeiro lançamento é um site simples, sem contas de aluno nem pagamento.

## Pendências
Escolher visual, implementação e serviço de recebimento das solicitações na fase de construção.

## Como verificar
Abrir os arquivos da jornada, conferir a coerência do MVP e testar os critérios de aceite após implementar o site.
"""

APP_FLOW = """# Fluxo do app · Agenda Viva
Percurso fictício para encontrar uma oficina e solicitar uma vaga.

> Estado: exemplo fictício aprovado para demonstração

## Pontos de entrada
- Página inicial do site.
- Link direto compartilhado para uma oficina.

## Jornada principal
Início → Agenda → Detalhe da oficina → Formulário de interesse → Confirmação.

## Telas, ações e respostas
### Agenda
A pessoa escolhe uma data e abre uma oficina. O sistema mostra carregamento, lista disponível ou estado vazio com outras datas.

### Detalhe
A pessoa confere horário, preço e localização, depois inicia o formulário. Se a oficina estiver indisponível, o sistema explica a situação e oferece voltar à agenda.

### Interesse
A pessoa informa nome e e-mail e envia. O sistema valida os campos, bloqueia envios repetidos enquanto processa e confirma o recebimento.

## Erros e recuperação
Se o envio falhar, preservar os dados, mostrar uma mensagem clara e permitir tentar novamente. Voltar não apaga campos já preenchidos. A confirmação explica que a vaga ainda depende da equipe.

## Fluxos secundários
Contato e localização ficam acessíveis na navegação. Não há cadastro, recuperação de senha ou pagamento nesta versão.
"""

TRD = """# Requisitos técnicos · Agenda Viva
Limites técnicos fictícios para a primeira versão do site.

> Estado: exemplo fictício com decisões abertas

## Visão e objetivos técnicos
Entregar um site rápido e responsivo que apresente oficinas e envie solicitações sem expor dados pessoais. O fluxo principal deve funcionar em celular e desktop.

## Stack
- Frontend: TBD — decidir após aprovar o design.
- Backend ou serviço de formulário: TBD — comparar opções antes de usar dados reais.
- Hospedagem: TBD — precisa oferecer HTTPS.

## Requisitos funcionais
- A pessoa consegue filtrar oficinas por data e abrir detalhes.
- O formulário valida nome e e-mail e informa sucesso ou falha.
- A equipe consegue atualizar a agenda pelo conteúdo do projeto na primeira versão.

## Requisitos não funcionais
- Layout utilizável a partir de 320 px, teclado e foco visível.
- Nenhuma credencial no navegador, código publicado ou mensagens de erro.
- Falhas preservam os dados digitados e permitem repetição segura.

## Integrações e dados
O destino do formulário é uma decisão pendente. Nome, e-mail e oficina interessada só podem ser lidos pela equipe autorizada.

## Restrições
Sem contas, pagamento ou reserva instantânea no MVP. Usar apenas dados fictícios até testar acesso e privacidade.

## Definição de pronto
Jornada principal, validação, falha, responsividade, acessibilidade e acesso aos dados passam pelos critérios de `TESTING.md`.
"""

IMPLEMENTATION_PLAN = """# Plano de implementação · Agenda Viva
Construção fictícia em fases pequenas e verificáveis.

> Estado: exemplo fictício; fase 0 aguardando início

## Regra do projeto
Executar apenas uma fase por vez. Corrigir falhas da verificação antes de avançar e atualizar este plano quando o escopo mudar.

## Fase 0 — Fundação
**Tarefas:** decidir stack, preparar projeto, comandos locais e variáveis de ambiente de exemplo.
**Dependências:** PRD, fluxo e TRD aprovados.
**Entrega:** projeto abre localmente sem erro.
**Verificação:** instalação limpa e comandos documentados funcionam.

## Fase 1 — Agenda e detalhe
**Tarefas:** construir início, lista, filtro, detalhe e estados vazio/erro.
**Dependências:** design system aprovado.
**Entrega:** pessoa navega da entrada ao detalhe com dados fictícios.
**Verificação:** critérios de tela no celular, desktop e teclado.

## Fase 2 — Solicitação
**Tarefas:** construir formulário, validação, envio, repetição segura e confirmação.
**Dependências:** destino de dados decidido e acesso protegido.
**Entrega:** solicitação chega à equipe sem expor credenciais.
**Verificação:** sucesso, entrada inválida, falha de rede e duplo clique.

## Fase 3 — Preparação de lançamento
**Tarefas:** acessibilidade, segurança, desempenho, textos finais e publicação.
**Dependências:** fases anteriores aprovadas.
**Entrega:** versão candidata ao lançamento.
**Verificação:** executar `TESTING.md` e resolver bloqueios.

## Fora do escopo
Cadastro, pagamento, reserva automática, painel administrativo e notificações.
"""

TESTING = """# Guia de testes · Agenda Viva
Verificar que a jornada crítica funciona, falha com clareza e protege os dados enviados.

> Estado: exemplo fictício; testes ainda não executados

## Jornada crítica
Início → Agenda → Oficina → Enviar interesse → Confirmação. O lançamento fica bloqueado se esse fluxo crítico não terminar.

## Uso normal e validação
- [ ] Filtro mostra a data escolhida.
- [ ] Oficina abre com horário, preço e local corretos.
- [ ] Nome e e-mail válidos enviam a solicitação.
- [ ] Campo vazio e e-mail inválido mostram orientação útil.
- [ ] Texto longo não quebra o layout.

## Erros e recuperação
- [ ] Falha de rede preserva os campos e permite tentar novamente.
- [ ] Duplo clique não cria solicitações repetidas.
- [ ] Erro interno não mostra detalhes sensíveis.

## Permissões e segurança
- [ ] Credenciais não aparecem no navegador nem no código público.
- [ ] Somente a equipe autorizada acessa os contatos.
- [ ] Entradas são validadas no servidor ou serviço escolhido.

## Responsividade e acessibilidade
- [ ] Celular pequeno, celular grande e desktop sem rolagem horizontal.
- [ ] Botões são tocáveis; formulário continua legível.
- [ ] Teclado alcança controles, foco é visível e campos têm rótulos.
- [ ] Contraste, textos alternativos e ordem de títulos foram revisados.

## Regressão
- [ ] Agenda e links continuam funcionando após alterações no formulário.

## Bloqueios de lançamento
Não publicar com jornada quebrada, perda de dados digitados, contato exposto, fluxo móvel inutilizável ou erro crítico aberto.

## Registro de resultado
Anotar teste, resultado esperado, resultado obtido, dispositivo ou navegador, passos de reprodução, evidência, gravidade e estado.
"""


def build_tour(folder):
    """A single offline HTML preview with the map and all sample documents."""
    map_html = (folder / "diagrama.html").read_text(encoding="utf-8")
    docs_html = (folder / "documentos.html").read_text(encoding="utf-8")
    map_hook = """<script>document.addEventListener('click',event=>{const link=event.target.closest('a[href^="documentos.html"]');if(link){event.preventDefault();parent.postMessage({view:'docs',doc:new URL(link.href).searchParams.get('doc')},'*')}});</script>"""
    docs_hook = """<script>window.addEventListener('message',event=>{const tab=[...document.querySelectorAll('.doc-tab')].find(item=>item.dataset.filename===event.data.doc);if(tab)tab.click()});document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link)return;const href=link.getAttribute('href');if(href==='diagrama.html'){event.preventDefault();parent.postMessage({view:'map'},'*')}else if(href.startsWith('../')&&href.includes('.md')){event.preventDefault();parent.postMessage({view:'docs',doc:href.split('/').pop().split('#')[0]},'*')}});</script>"""
    map_html = map_html.replace("</body>", map_hook + "</body>")
    docs_html = docs_html.replace("</body>", docs_hook + "</body>")
    page = """<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agenda Viva · demonstração da skill</title><style>
body{margin:0;background:#101722;color:#f3f6fc;font:16px/1.45 system-ui,sans-serif}header{max-width:1100px;margin:auto;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}h1{font-size:1.2rem;margin:0}p{margin:3px 0 0;color:#bac8df;font-size:.9rem}nav{display:flex;gap:8px}button{font:inherit;border:1px solid #7899df;color:#f3f6fc;background:#263754;border-radius:10px;padding:8px 14px;cursor:pointer}button[aria-pressed=true]{background:#3159bc;border-color:#b7caff}button:focus-visible{outline:3px solid #f4aa61}iframe{width:100%;height:calc(100vh - 90px);min-height:620px;border:0;background:white}iframe[hidden]{display:none}
</style><header><div><h1>Agenda Viva · exemplo fictício</h1><p>Veja as sete entregas virarem cinco guias e a construção ficar laranja. Este exemplo não altera seu projeto.</p></div><nav aria-label="Visualização"><button id="map-button" aria-pressed="true">Mapa</button><button id="docs-button" aria-pressed="false">Arquivos estilizados</button></nav></header><iframe title="Mapa interativo" id="map" srcdoc="__MAP__"></iframe><iframe title="Arquivos do exemplo" id="docs" srcdoc="__DOCS__" hidden></iframe><script>
const map=document.getElementById('map'),docs=document.getElementById('docs'),mapButton=document.getElementById('map-button'),docsButton=document.getElementById('docs-button');function openView(view,doc){const on=view==='docs';map.hidden=on;docs.hidden=!on;mapButton.setAttribute('aria-pressed',String(!on));docsButton.setAttribute('aria-pressed',String(on));if(on&&doc)docs.contentWindow.postMessage({doc},'*')}mapButton.onclick=()=>openView('map');docsButton.onclick=()=>openView('docs');addEventListener('message',event=>{if(event.source===map.contentWindow||event.source===docs.contentWindow)openView(event.data.view,event.data.doc)});
</script></html>"""
    (folder / "exemplo-interativo.html").write_text(page.replace("__MAP__", html.escape(map_html, quote=True)).replace("__DOCS__", html.escape(docs_html, quote=True)), encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description="Criar demonstração fictícia sem alterar o projeto do aluno.")
    parser.add_argument("--output", required=True, help="Nova pasta para a demonstração")
    args = parser.parse_args()
    root = Path(args.output).expanduser().resolve()
    if root.exists():
        parser.error("A pasta da demonstração já existe; escolha uma pasta nova.")
    deliveries = root / "guia-produto" / "entregas"
    deliveries.mkdir(parents=True)
    for name, contents in DOCS.items():
        (deliveries / name).write_text(contents, encoding="utf-8")
    (root / "PRD.md").write_text(PRD, encoding="utf-8")
    (root / "APP_FLOW.md").write_text(APP_FLOW, encoding="utf-8")
    (root / "TRD.md").write_text(TRD, encoding="utf-8")
    (root / "IMPLEMENTATION_PLAN.md").write_text(IMPLEMENTATION_PLAN, encoding="utf-8")
    (root / "TESTING.md").write_text(TESTING, encoding="utf-8")
    completed = {}
    for stage in guia.STAGES[:7]:
        stage_id = stage[0]
        evidence = guia.ARTIFACTS[stage_id][-1]
        assert guia.file_ready(root / "guia-produto", evidence)
        completed[stage_id] = {"status": "feito", "note": "Exemplo fictício; decisão simulada para visualizar a jornada.", "evidence": evidence}
    state = {"version": 1, "type": "site", "level": "iniciante", "current": 7, "completed": completed, "checks": {}}
    guia.save(root / "guia-produto", state)
    build_tour(root / "guia-produto")
    print("Demonstração criada:", root / "guia-produto" / "diagrama.html")
    print("Visualização em um arquivo:", root / "guia-produto" / "exemplo-interativo.html")
    print("Esta amostra fictícia não altera nem aprova o projeto real do aluno.")


if __name__ == "__main__":
    main()
