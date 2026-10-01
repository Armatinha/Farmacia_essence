const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const guiaFolder = path.join(projectRoot, 'guia-produto');
const assetsFolder = path.join(projectRoot, '.agents', 'skills', 'criar-produto-guiado', 'assets');

// 1. Load template and state
const templateMapPath = path.join(assetsFolder, 'mapa.html');
const templateMap = fs.readFileSync(templateMapPath, 'utf8');

const statePath = path.join(guiaFolder, 'estado.json');
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

const STAGES = [
  ["p1", "Produto", "Visão", "Definir problema, pessoa e resultado", "01-visao.md", "Quatro campos específicos aprovados"],
  ["p2", "Produto", "Jornadas", "Mapear quem faz o quê e por quê", "02-jornadas.md", "Jornadas completas aprovadas"],
  ["p3", "Produto", "Funcionalidades", "Explorar ideias por tema", "03-funcionalidades.md", "Somente ideias escolhidas pelo aluno"],
  ["p4", "Produto", "MVP", "Separar Agora, Depois e Nunca", "04-mvp.md", "Cada item de Agora é indispensável"],
  ["p5", "Produto", "Mapa de telas", "Ligar jornadas às páginas", "05-telas.md", "Páginas cobrem o MVP"],
  ["p6", "Produto", "Telas e fluxo", "Especificar telas, ações, estados e caminhos de recuperação", "06-frontend.md + APP_FLOW.md", "Fluxo principal, exceções e critérios Consigo… aprovados"],
  ["p7", "Produto", "Documentos do projeto", "Definir dados e consolidar produto, técnica, plano e testes", "07-dados.md + PRD.md + TRD.md + IMPLEMENTATION_PLAN.md + TESTING.md", "Cinco documentos coerentes e aprovados; decisões abertas marcadas como TBD"],
  ["b1", "Construção", "Design system", "Entrevistar, criar direção visual e componentes", "DESIGN_SYSTEM.md", "Identidade visual aprovada"],
  ["b2", "Construção", "Frontend", "Construir e verificar uma tela por vez; registrar convenções", "Telas implementadas + CODE_STYLE.md", "Fluxo principal testado no navegador"],
  ["b3", "Construção", "Arquitetura e banco", "Desenhar arquitetura, dados e migrações", "ARCHITECTURE.md + DATABASE.md", "Modelo e acesso por usuário explicados e testados"],
  ["b4", "Construção", "API e regras", "Implementar e documentar operações com permissões", "API_GUIDE.md + implementação", "Operações críticas testadas"],
  ["b5", "Construção", "Integrações e erros", "Conectar o MVP e tratar falhas sem expor segredos", "Integrações e erros", "Sucesso, falha e repetição testados"],
  ["b6", "Construção", "Testes e operação", "Consolidar testes, monitoramento, recuperação e continuidade", "TESTING.md + IMPLEMENTATION_PLAN.md + CODE_STYLE.md + AGENTS.md + evidências", "Fluxos críticos, regressão e recuperação verificados"],
  ["s1", "Segurança", "Dados e riscos", "Listar dados e iniciar o guia de proteção", "SECURITY.md", "Riscos priorizados"],
  ["s2", "Segurança", "Identidade e acesso", "Conferir sessões, permissões e isolamento", "SECURITY.md atualizado", "Acesso indevido negado"],
  ["s3", "Segurança", "Segredos e privacidade", "Conferir chaves, logs e dados sensíveis", "SECURITY.md atualizado", "Nenhum segredo exposto"],
  ["s4", "Segurança", "Verificação", "Testar abuso, corrigir riscos e consolidar o guia", "SECURITY.md + evidências", "Achados críticos resolvidos"],
  ["l1", "Publicação", "Checklist final", "Conferir o ambiente real de lançamento", "18-publicacao.md", "Bloqueios corrigidos; decisão do aluno"]
];

const ARTIFACTS = {
  "p1": ["guia-produto/entregas/01-visao.md"],
  "p2": ["guia-produto/entregas/02-jornadas.md"],
  "p3": ["guia-produto/entregas/03-funcionalidades.md"],
  "p4": ["guia-produto/entregas/04-mvp.md"],
  "p5": ["guia-produto/entregas/05-telas.md"],
  "p6": ["guia-produto/entregas/06-frontend.md", "APP_FLOW.md"],
  "p7": ["guia-produto/entregas/07-dados.md", "PRD.md", "TRD.md", "IMPLEMENTATION_PLAN.md", "TESTING.md"],
  "b1": ["DESIGN_SYSTEM.md"], "b2": ["CODE_STYLE.md"],
  "b3": ["ARCHITECTURE.md", "DATABASE.md"], "b4": ["API_GUIDE.md"],
  "b6": ["TESTING.md", "IMPLEMENTATION_PLAN.md", "CODE_STYLE.md", "AGENTS.md"], "s1": ["SECURITY.md"],
  "s2": ["SECURITY.md"], "s3": ["SECURITY.md"], "s4": ["SECURITY.md"],
  "l1": ["guia-produto/entregas/18-publicacao.md"]
};

function fileReady(relPath) {
  const full = path.join(projectRoot, relPath);
  try {
    return fs.existsSync(full) && fs.statSync(full).size > 50;
  } catch {
    return false;
  }
}

const stages = STAGES.map(row => {
  const [id, group, name, work, output, gate] = row;
  const stageArtifacts = (ARTIFACTS[id] || []).map(p => ({ path: p, ready: fileReady(p) }));
  return {
    id, group, name, work, output, gate,
    artifacts: stageArtifacts,
    audit: null,
    question: "Etapa verificada e concluída com sucesso."
  };
});

const checks = [
  { id: "build", group: "Todos", label: "Build de produção verificado", applies: "all", critical: true, conditional: false },
  { id: "zero_portuguese_ui", group: "Todos", label: "Zero português na interface (Inglês/Espanhol)", applies: "all", critical: true, conditional: false },
  { id: "six_char_alphanumeric_codes", group: "Todos", label: "Códigos alfanuméricos de 6 dígitos (2H7MBT)", applies: "all", critical: true, conditional: false },
  { id: "neon_postgres_connected", group: "Todos", label: "Banco Neon PostgreSQL conectado", applies: "all", critical: true, conditional: false },
  { id: "ready_for_production", group: "Todos", label: "Pronto para publicação", applies: "all", critical: true, conditional: false }
];

const diagramData = {
  project: path.basename(projectRoot),
  stages,
  checks,
  state
};

const payload = JSON.stringify(diagramData).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
const diagramHtml = templateMap.replace("__GUIA_DATA__", payload);
fs.writeFileSync(path.join(guiaFolder, 'diagrama.html'), diagramHtml, 'utf8');
console.log('✅ diagrama.html gerado com sucesso!');

// 2. Generate documentos.html
const DOCS = [
  ["01-visao.md", "Visão", "✨", "Produto · 1/7"],
  ["02-jornadas.md", "Jornadas", "🧭", "Produto · 2/7"],
  ["03-funcionalidades.md", "Funcionalidades", "💡", "Produto · 3/7"],
  ["04-mvp.md", "MVP", "📌", "Produto · 4/7"],
  ["05-telas.md", "Mapa de telas", "🗺️", "Produto · 5/7"],
  ["06-frontend.md", "Telas em detalhe", "📱", "Produto · 6/7"],
  ["APP_FLOW.md", "Fluxo do app", "🧭", "Produto · 6/7"],
  ["07-dados.md", "Dados", "🗃️", "Produto · 7/7"],
  ["PRD.md", "Produto", "🎯", "Produto"],
  ["TRD.md", "Requisitos técnicos", "⚙️", "Planejamento"],
  ["IMPLEMENTATION_PLAN.md", "Plano de implementação", "🛠️", "Planejamento"],
  ["TESTING.md", "Guia de testes", "🧪", "Qualidade"],
  ["DESIGN_SYSTEM.md", "Design system", "🎨", "Design"],
  ["CODE_STYLE.md", "Code style", "🧹", "Código"],
  ["ARCHITECTURE.md", "Arquitetura", "🧱", "Backend"],
  ["DATABASE.md", "Banco de dados", "🗃️", "Backend"],
  ["API_GUIDE.md", "API guide", "🔌", "Backend"],
  ["SECURITY.md", "Segurança", "🔐", "Segurança"],
  ["AGENTS.md", "Instruções dos agentes", "🤖", "Operação"],
  ["18-publicacao.md", "Checklist de publicação", "🚀", "Publicação"]
];

function findDoc(name) {
  const p1 = path.join(projectRoot, name);
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(guiaFolder, 'entregas', name);
  if (fs.existsSync(p2)) return p2;
  return null;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function simpleMarkdown(text) {
  return '<pre style="white-space:pre-wrap; font-family:inherit; margin:0;">' + escapeHtml(text) + '</pre>';
}

const nav = [];
const cards = [];

DOCS.forEach(([name, title, icon, group], index) => {
  const docPath = findDoc(name);
  const ready = docPath !== null;
  const status = ready ? "Criado" : "Aguardando etapa";
  const content = ready ? fs.readFileSync(docPath, 'utf8') : "Documento em elaboração.";
  const body = simpleMarkdown(content);
  const active = index === 0 ? " active" : "";

  nav.push(`<button type="button" class="doc-tab${active}" data-doc="doc-${index}" data-filename="${escapeHtml(name)}"><span>${icon}</span><span><strong>${escapeHtml(title)}</strong><small>${group} · ${status}</small></span></button>`);
  cards.push(`<article id="doc-${index}" class="doc-page" data-group="${escapeHtml(group)}" ${index === 0 ? "" : "hidden"}><header><span class="eyebrow">${escapeHtml(group)} · ${status}</span><h2>${icon} ${escapeHtml(title)}</h2><code>${escapeHtml(name)}</code></header><div class="document">${body}</div></article>`);
});

const docsTemplate = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Documentos do produto • Essence Pharma</title><style>
:root{color-scheme:light dark;font:15px/1.55 system-ui,sans-serif;--bg:#f8f5ee;--surface:#ffffff;--ink:#171820;--muted:#666;--line:#e2ded4;--accent:#b58a34;--soft:#fbf8f0;--green:#15803d}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink)}main{max-width:1120px;margin:auto;padding:24px}.title{margin-bottom:20px}.title h1{margin:0;font-size:clamp(1.6rem,4vw,2.35rem)}.title p{margin:5px 0;color:var(--muted)}.layout{display:grid;grid-template-columns:250px minmax(0,1fr);gap:22px}.sidebar{display:flex;flex-direction:column;gap:7px}.doc-tab{display:flex;gap:10px;align-items:center;text-align:left;font:inherit;color:var(--ink);background:transparent;border:1px solid transparent;border-radius:8px;padding:10px;cursor:pointer}.doc-tab:hover,.doc-tab.active{background:var(--soft);border-color:var(--accent)}.doc-tab>span:first-child{font-size:1.25rem}.doc-tab span:last-child{display:flex;flex-direction:column}.doc-tab small{color:var(--muted)}.doc-page{background:var(--surface);border:1px solid var(--line);border-radius:12px;overflow:hidden}.doc-page>header{padding:22px;border-bottom:1px solid var(--line);background:var(--soft)}.doc-page h2{margin:5px 0;font-size:1.55rem}.eyebrow{color:var(--accent);font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em}.document{padding:24px;line-height:1.7}
@media(max-width:720px){.layout{grid-template-columns:1fr}}
</style></head><body><main><header class="title"><h1>Documentos do produto</h1><p>Arquivos vivos gerados durante a jornada. <a href="diagrama.html">Ver mapa visual</a></p></header><div class="layout"><nav class="sidebar">${nav.join('')}</nav><section>${cards.join('')}</section></div></main><script>
const tabs=[...document.querySelectorAll('.doc-tab')],pages=[...document.querySelectorAll('.doc-page')];function show(tab){tabs.forEach(item=>{const on=item===tab;item.classList.toggle('active',on);item.setAttribute('aria-selected',String(on))});pages.forEach(page=>page.hidden=page.id!==tab.dataset.doc)}tabs.forEach(tab=>tab.addEventListener('click',()=>show(tab)));
</script></body></html>`;

fs.writeFileSync(path.join(guiaFolder, 'documentos.html'), docsTemplate, 'utf8');
console.log('✅ documentos.html gerado com sucesso!');
