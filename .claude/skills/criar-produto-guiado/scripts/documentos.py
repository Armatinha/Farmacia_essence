#!/usr/bin/env python3
"""Gera uma leitura visual offline dos documentos vivos do projeto."""

import argparse
import html
import re
from pathlib import Path


DOCS = [
    ("01-visao.md", "Visão", "✨", "Produto · 1/7"),
    ("02-jornadas.md", "Jornadas", "🧭", "Produto · 2/7"),
    ("03-funcionalidades.md", "Funcionalidades", "💡", "Produto · 3/7"),
    ("04-mvp.md", "MVP", "📌", "Produto · 4/7"),
    ("05-telas.md", "Mapa de telas", "🗺️", "Produto · 5/7"),
    ("06-frontend.md", "Telas em detalhe", "📱", "Produto · 6/7"),
    ("APP_FLOW.md", "Fluxo do app", "🧭", "Produto · 6/7"),
    ("07-dados.md", "Dados", "🗃️", "Produto · 7/7"),
    ("PRD.md", "Produto", "🎯", "Produto"),
    ("TRD.md", "Requisitos técnicos", "⚙️", "Planejamento"),
    ("IMPLEMENTATION_PLAN.md", "Plano de implementação", "🛠️", "Planejamento"),
    ("TESTING.md", "Guia de testes", "🧪", "Qualidade"),
    ("DESIGN_SYSTEM.md", "Design system", "🎨", "Design"),
    ("CODE_STYLE.md", "Code style", "🧹", "Código"),
    ("ARCHITECTURE.md", "Arquitetura", "🧱", "Backend"),
    ("DATABASE.md", "Banco de dados", "🗃️", "Backend"),
    ("API_GUIDE.md", "API guide", "🔌", "Backend"),
    ("SECURITY.md", "Segurança", "🔐", "Segurança"),
    ("AGENTS.md", "Instruções dos agentes", "🤖", "Operação"),
]


def inline(value):
    value = html.escape(value, quote=False)
    def link(match):
        label, target = match.groups()
        if not (target.startswith("https://") or re.fullmatch(r"[\w./-]+\.md(?:#[\w-]+)?", target)):
            return match.group(0)
        if not target.startswith("https://"):
            target = "../" + target.lstrip("./")
        return f'<a href="{html.escape(target, quote=True)}">{label}</a>'
    value = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, value)
    value = re.sub(r"`([^`]+)`", r"<code>\1</code>", value)
    value = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", value)
    return value


def markdown(value):
    out, paragraph, items, table = [], [], [], []
    in_code = False
    code = []

    def flush_paragraph():
        if paragraph:
            out.append("<p>" + inline(" ".join(paragraph)) + "</p>")
            paragraph.clear()

    def flush_items():
        if items:
            out.append("<ul>" + "".join(f"<li>{inline(item)}</li>" for item in items) + "</ul>")
            items.clear()

    def flush_table():
        if not table:
            return
        rows = [[cell.strip() for cell in row.strip().strip("|").split("|")] for row in table]
        if len(rows) > 1 and all(re.fullmatch(r":?-{3,}:?", cell) for cell in rows[1]):
            header, body = rows[0], rows[2:]
            out.append('<div class="table-wrap"><table><thead><tr>' + "".join(f"<th>{inline(c)}</th>" for c in header) + '</tr></thead><tbody>' + "".join('<tr>' + "".join(f"<td>{inline(c)}</td>" for c in row) + '</tr>' for row in body) + '</tbody></table></div>')
        else:
            out.extend(f"<p>{inline(row)}</p>" for row in table)
        table.clear()

    for raw in value.splitlines():
        line = raw.rstrip()
        if line.startswith("```"):
            flush_paragraph(); flush_items(); flush_table()
            if in_code:
                out.append("<pre><code>" + html.escape("\n".join(code)) + "</code></pre>")
                code.clear()
            in_code = not in_code
            continue
        if in_code:
            code.append(line)
            continue
        if not line:
            flush_paragraph(); flush_items(); flush_table(); continue
        heading = re.match(r"^(#{1,3})\s+(.+)$", line)
        if heading:
            flush_paragraph(); flush_items(); flush_table()
            level = len(heading.group(1)) + 1
            out.append(f"<h{level}>{inline(heading.group(2))}</h{level}>")
        elif line.startswith("> "):
            flush_paragraph(); flush_items(); flush_table(); out.append(f"<blockquote>{inline(line[2:])}</blockquote>")
        elif re.match(r"^- \[[ xX]\]\s+", line):
            flush_paragraph(); flush_table(); checked=line[3].lower()=="x"; items.append(("☑ " if checked else "☐ ")+line[6:])
        elif re.match(r"^[-*]\s+", line):
            flush_paragraph(); flush_table(); items.append(re.sub(r"^[-*]\s+", "", line))
        elif line.startswith("---"):
            flush_paragraph(); flush_items(); flush_table(); out.append("<hr>")
        elif line.startswith("|"):
            flush_paragraph(); flush_items(); table.append(line)
        else:
            flush_table()
            paragraph.append(line)
    flush_paragraph(); flush_items(); flush_table()
    if code:
        out.append("<pre><code>" + html.escape("\n".join(code)) + "</code></pre>")
    return "\n".join(out)


def find_doc(project, name):
    for candidate in (project / name, project / "guia-produto" / "entregas" / name):
        if candidate.is_file():
            return candidate
    return None


def main():
    parser = argparse.ArgumentParser(description="Gerar visualização dos documentos do produto.")
    parser.add_argument("--project", default=".")
    args = parser.parse_args()
    project = Path(args.project).expanduser().resolve()
    if not project.is_dir():
        parser.error("A pasta do projeto não existe.")
    cards, nav = [], []
    for index, (name, title, icon, group) in enumerate(DOCS):
        path = find_doc(project, name)
        ready = path is not None
        status = "Criado" if ready else "Aguardando etapa"
        body = markdown(path.read_text(encoding="utf-8")) if ready else "<p>Este documento será gerado quando o projeto chegar à etapa correspondente.</p>"
        active = " active" if index == 0 else ""
        nav.append(f'<button type="button" class="doc-tab{active}" data-doc="doc-{index}" data-filename="{html.escape(name, quote=True)}" aria-selected="{str(index == 0).lower()}"><span>{icon}</span><span><strong>{html.escape(title)}</strong><small>{group} · {status}</small></span></button>')
        cards.append(f'<article id="doc-{index}" class="doc-page" data-group="{html.escape(group)}" {"" if index == 0 else "hidden"}><header><span class="eyebrow">{html.escape(group)} · {status}</span><h2>{icon} {html.escape(title)}</h2><code>{html.escape(name)}</code></header><div class="document">{body}</div></article>')
    output = project / "guia-produto" / "documentos.html"
    output.parent.mkdir(parents=True, exist_ok=True)
    template = '''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Documentos do produto</title><style>
:root{color-scheme:light dark;font:15px/1.55 system-ui,sans-serif;--bg:light-dark(#f5f6fa,#0f1420);--surface:light-dark(#fff,#182131);--ink:light-dark(#172033,#eef3fb);--muted:light-dark(#637087,#aab7ca);--line:light-dark(#dde2eb,#344258);--accent:light-dark(#7c3aed,#b99aff);--soft:light-dark(#f2ecff,#2d2445);--green:light-dark(#087e60,#5edbb5)}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink)}main{max-width:1120px;margin:auto;padding:24px}.title{margin-bottom:20px}.title h1{margin:0;font-size:clamp(1.6rem,4vw,2.35rem)}.title p{margin:5px 0;color:var(--muted)}.layout{display:grid;grid-template-columns:250px minmax(0,1fr);gap:22px}.sidebar{display:flex;flex-direction:column;gap:7px}.doc-tab{display:flex;gap:10px;align-items:center;text-align:left;font:inherit;color:var(--ink);background:transparent;border:1px solid transparent;border-radius:12px;padding:10px;cursor:pointer}.doc-tab:hover,.doc-tab.active{background:var(--soft);border-color:var(--accent)}.doc-tab>span:first-child{font-size:1.25rem}.doc-tab span:last-child{display:flex;flex-direction:column}.doc-tab small{color:var(--muted)}.doc-page{background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden}.doc-page>header{padding:22px;border-bottom:1px solid var(--line);background:var(--soft)}.doc-page h2{margin:5px 0;font-size:1.55rem}.eyebrow{color:var(--accent);font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em}.document{padding:24px}.document h2{font-size:1.25rem;margin:1.5em 0 .45em}.document h3,.document h4{font-size:1rem;margin:1.25em 0 .35em}.document p{margin:.4em 0 1em}.document blockquote{margin:1em 0;padding:10px 14px;border-left:3px solid var(--accent);background:var(--soft);color:var(--muted)}.document code{background:var(--soft);border-radius:5px;padding:2px 5px}.document pre{overflow:auto;background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:12px}.document pre code{background:none;padding:0}.document ul{padding-left:20px}.document hr{border:0;border-top:1px solid var(--line);margin:20px 0}.table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;margin:14px 0}.document table{width:100%;border-collapse:collapse;min-width:420px}.document th,.document td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}.document th{background:var(--soft);color:var(--accent)}.document tr:last-child td{border-bottom:0}.document a{color:var(--accent);text-underline-offset:3px}@media(max-width:720px){main{padding:14px}.layout{grid-template-columns:1fr}.sidebar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.doc-tab{min-width:0}.doc-tab strong,.doc-tab small{overflow:hidden;text-overflow:ellipsis}.document{padding:18px}}@media(max-width:390px){.sidebar{grid-template-columns:1fr}}
</style></head><body><main><header class="title"><h1>Documentos do produto</h1><p>Arquivos vivos gerados durante a jornada. <a href="diagrama.html">Voltar ao mapa</a></p></header><div class="layout"><nav class="sidebar" aria-label="Documentos">__NAV__</nav><section>__CARDS__</section></div></main><script>const tabs=[...document.querySelectorAll('.doc-tab')],pages=[...document.querySelectorAll('.doc-page')];function show(tab){tabs.forEach(item=>{const on=item===tab;item.classList.toggle('active',on);item.setAttribute('aria-selected',String(on))});pages.forEach(page=>page.hidden=page.id!==tab.dataset.doc)}tabs.forEach(tab=>tab.addEventListener('click',()=>show(tab)));const selected=new URLSearchParams(location.search).get('doc');show(tabs.find(tab=>tab.dataset.filename===selected)||tabs[0]);</script></body></html>'''
    output.write_text(template.replace("__NAV__", "".join(nav)).replace("__CARDS__", "".join(cards)), encoding="utf-8")
    print(f"Documentos: {output}")


if __name__ == "__main__":
    main()
