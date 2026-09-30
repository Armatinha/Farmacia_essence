#!/usr/bin/env python3
"""Estado e diagrama offline do Criar Produto Guiado; apenas biblioteca padrão."""

import argparse
import json
from pathlib import Path
import subprocess
import sys
import re


STAGES = [
    ("p1", "Produto", "Visão", "Definir problema, pessoa e resultado", "01-visao.md", "Quatro campos específicos aprovados"),
    ("p2", "Produto", "Jornadas", "Mapear quem faz o quê e por quê", "02-jornadas.md", "Jornadas completas aprovadas"),
    ("p3", "Produto", "Funcionalidades", "Explorar ideias por tema", "03-funcionalidades.md", "Somente ideias escolhidas pelo aluno"),
    ("p4", "Produto", "MVP", "Separar Agora, Depois e Nunca", "04-mvp.md", "Cada item de Agora é indispensável"),
    ("p5", "Produto", "Mapa de telas", "Ligar jornadas às páginas", "05-telas.md", "Páginas cobrem o MVP"),
    ("p6", "Produto", "Telas e fluxo", "Especificar telas, ações, estados e caminhos de recuperação", "06-frontend.md + APP_FLOW.md", "Fluxo principal, exceções e critérios Consigo… aprovados"),
    ("p7", "Produto", "Documentos do projeto", "Definir dados e consolidar produto, técnica, plano e testes", "07-dados.md + PRD.md + TRD.md + IMPLEMENTATION_PLAN.md + TESTING.md", "Cinco documentos coerentes e aprovados; decisões abertas marcadas como TBD"),
    ("b1", "Construção", "Design system", "Entrevistar, criar direção visual e componentes", "DESIGN_SYSTEM.md", "Identidade visual aprovada"),
    ("b2", "Construção", "Frontend", "Construir e verificar uma tela por vez; registrar convenções", "Telas implementadas + CODE_STYLE.md", "Fluxo principal testado no navegador"),
    ("b3", "Construção", "Arquitetura e banco", "Desenhar arquitetura, dados e migrações", "ARCHITECTURE.md + DATABASE.md", "Modelo e acesso por usuário explicados e testados"),
    ("b4", "Construção", "API e regras", "Implementar e documentar operações com permissões", "API_GUIDE.md + implementação", "Operações críticas testadas"),
    ("b5", "Construção", "Integrações e erros", "Conectar o MVP e tratar falhas sem expor segredos", "Integrações e erros", "Sucesso, falha e repetição testados"),
    ("b6", "Construção", "Testes e operação", "Consolidar testes, monitoramento, recuperação e continuidade", "TESTING.md + IMPLEMENTATION_PLAN.md + CODE_STYLE.md + AGENTS.md + evidências", "Fluxos críticos, regressão e recuperação verificados"),
    ("s1", "Segurança", "Dados e riscos", "Listar dados e iniciar o guia de proteção", "SECURITY.md", "Riscos priorizados"),
    ("s2", "Segurança", "Identidade e acesso", "Conferir sessões, permissões e isolamento", "SECURITY.md atualizado", "Acesso indevido negado"),
    ("s3", "Segurança", "Segredos e privacidade", "Conferir chaves, logs e dados sensíveis", "SECURITY.md atualizado", "Nenhum segredo exposto"),
    ("s4", "Segurança", "Verificação", "Testar abuso, corrigir riscos e consolidar o guia", "SECURITY.md + evidências", "Achados críticos resolvidos"),
    ("l1", "Publicação", "Checklist final", "Conferir o ambiente real de lançamento", "18-publicacao.md", "Bloqueios corrigidos; decisão do aluno"),
]

ARTIFACTS = {
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
    "l1": ["guia-produto/entregas/18-publicacao.md"],
}
NEXT_QUESTION = {
    "p1": "Qual problema específico você quer resolver?",
    "p2": "Quem realiza a ação principal e por quê?",
    "p3": "Quais ideias você quer manter na lista?",
    "p4": "Qual dessas ideias é indispensável para a primeira versão?",
    "p5": "Quais páginas são necessárias para completar a jornada?",
    "p6": "Qual é o caminho principal e como a pessoa se recupera quando algo falha?",
    "p7": "Quais dados, limites técnicos, fases e testes precisam estar definidos antes do código?",
    "b1": "Que sensação e identidade visual o produto deve transmitir?",
    "b2": "Qual é a primeira tela do fluxo principal?",
    "b3": "Que dados precisam ser persistidos e por quem?",
    "b4": "Que operação precisa ser autorizada no servidor?",
    "b5": "O que acontece quando uma integração falha ou repete?",
    "b6": "Quais fluxos e procedimentos de recuperação foram testados?",
    "s1": "Quais dados e riscos o projeto tem?",
    "s2": "Como o sistema impede acesso a dados de outra pessoa?",
    "s3": "Onde estão as chaves e quais dados entram nos registros?",
    "s4": "Que teste de abuso foi executado e o que foi corrigido?",
    "l1": "Qual é a evidência de cada item crítico do lançamento?",
}

CHECKS = [
    ("fluxo", "Todos", "Fluxo principal testado ponta a ponta", "all", True, False),
    ("mobile", "Todos", "Celular, desktop e interações essenciais testados", "all", True, False),
    ("acessibilidade", "Todos", "Teclado, foco, rótulos e contraste verificados", "all", True, False),
    ("https", "Todos", "Domínio de publicação responde com HTTPS", "all", True, False),
    ("segredos", "Todos", "Credenciais fora do código, navegador e logs", "all", True, False),
    ("falhas", "Todos", "Erros e links essenciais testados", "all", True, False),
    ("acesso", "Todos", "Permissões e isolamento de dados testados", "all", True, True),
    ("backup", "Todos", "Backup e restauração testados", "all", True, True),
    ("formulario", "Site", "Formulário enviado e recebido", "site", True, True),
    ("whatsapp", "Site", "Link do WhatsApp abre conversa correta", "site", True, True),
    ("pagina-404", "Site", "Página 404 ajuda a voltar", "site", False, False),
    ("dominio", "Site", "Domínio próprio conforme plano de lançamento", "site", False, False),
    ("velocidade", "Site", "Velocidade medida e problemas relevantes corrigidos", "site", False, False),
    ("imagens", "Site", "Imagens otimizadas", "site", False, False),
    ("favicon", "Site", "Favicon correto", "site", False, False),
    ("og", "Site", "Prévia de compartilhamento correta", "site", False, False),
    ("seo", "Site", "Indexação, títulos e sitemap conferidos", "site", False, True),
    ("cadastro", "SaaS", "Cadastro, login e recuperação testados", "saas", True, False),
    ("clientes", "SaaS", "Cliente A não acessa dados de B", "saas", True, False),
    ("dados", "SaaS", "Criar, editar, excluir e recarregar testados", "saas", True, False),
    ("pagamento", "SaaS", "Pagamento e cancelamento testados", "saas", True, True),
    ("webhook", "SaaS", "Webhook validado e repetição segura", "saas", True, True),
    ("suporte", "SaaS", "Suporte e privacidade claros para o cliente", "saas", True, False),
]


def relevant_checks(state):
    return [row for row in CHECKS if row[3] in ("all", state["type"])]


def pending_critical(state, folder=None):
    return [row[0] for row in relevant_checks(state) if row[4] and (
        state.get("checks", {}).get(row[0], {}).get("status") not in ("pronto", "nao-aplicavel") or
        (folder and state.get("checks", {}).get(row[0], {}).get("status") == "pronto" and
         not file_ready(folder, state["checks"][row[0]].get("evidence") or "")))]


def paths(project):
    root = Path(project).expanduser().resolve()
    if not root.is_dir():
        raise ValueError(f"Projeto não encontrado: {root}")
    return root / "guia-produto"


def project_file(folder, path):
    """Only accept files inside this project, including through symlinks."""
    root = folder.parent.resolve()
    candidate = (root / path).resolve()
    if candidate == root or not candidate.is_relative_to(root):
        raise ValueError(f"Evidência fora do projeto: {path}")
    return candidate


def file_ready(folder, path):
    try:
        file = project_file(folder, path)
        if not file.is_file() or file.stat().st_size == 0:
            return False
        if file.suffix == ".md":
            body = file.read_text(encoding="utf-8").strip()
            if not body or re.search(r"(?i)\b(TODO|preencher aqui|lorem ipsum)\b", body):
                return False
            markers = {
                "PRD.md": (("problema",), ("mvp",), ("tela", "página"), ("aceite",)),
                "APP_FLOW.md": (("entrada", "início"), ("jornada", "fluxo"), ("ação",), ("erro", "falha"), ("recuper", "tentar novamente")),
                "TRD.md": (("objetivo técnico", "objetivos técnicos", "metas técnicas"), ("stack", "tecnologia"), ("requisito funcional", "requisitos funcionais"), ("não funcional", "não funcionais"), ("restri",), ("definição de pronto", "definition of done")),
                "IMPLEMENTATION_PLAN.md": (("fase",), ("tarefa",), ("depend",), ("entrega",), ("verifica",), ("fora do escopo",)),
                "TESTING.md": (("jornada crítica", "fluxo crítico"), ("valida",), ("erro", "falha"), ("permiss", "acesso"), ("responsiv", "dispositivo"), ("acessibilidade",), ("bloqueio",)),
            }
            required = markers.get(Path(path).name)
            lowered = body.lower()
            if required and (len(body) < 400 or any(not any(term in lowered for term in group) for group in required)):
                return False
        return True
    except (OSError, UnicodeError, ValueError):
        return False


def stage_audit(folder, stage_id, entry):
    if not entry or entry["status"] == "nao-aplicavel":
        return None
    missing = [p for p in ARTIFACTS.get(stage_id, []) if not file_ready(folder, p)]
    evidence = entry.get("evidence")
    if not evidence or not file_ready(folder, evidence):
        missing.append("evidência vinculada")
    return missing


def load(folder):
    file = folder / "estado.json"
    if not file.exists():
        raise ValueError("Guia não iniciado. Execute init neste projeto.")
    state = json.loads(file.read_text(encoding="utf-8"))
    if state.get("version") != 1 or not 0 <= state.get("current", -1) <= len(STAGES):
        raise ValueError("Estado do guia incompatível; preserve uma cópia antes de corrigir.")
    return state


def save(folder, state):
    folder.mkdir(parents=True, exist_ok=True)
    target = folder / "estado.json"
    temp = folder / "estado.json.tmp"
    temp.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(target)
    render(folder, state)
    render_documents(folder)


def render(folder, state):
    template = (Path(__file__).resolve().parent.parent / "assets" / "mapa.html").read_text(encoding="utf-8")
    stages = []
    for row in STAGES:
        stage = dict(zip(("id", "group", "name", "work", "output", "gate"), row))
        stage["artifacts"] = [{"path": p, "ready": file_ready(folder, p)} for p in ARTIFACTS.get(row[0], [])]
        stage["audit"] = stage_audit(folder, row[0], state["completed"].get(row[0]))
        stage["question"] = NEXT_QUESTION[row[0]]
        stages.append(stage)
    data = {"project": folder.parent.name,
            "stages": stages,
            "checks": [dict(zip(("id", "group", "label", "applies", "critical", "conditional"), row)) for row in relevant_checks(state)],
            "state": state}
    payload = json.dumps(data, ensure_ascii=False).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
    if template.count("__GUIA_DATA__") != 1:
        raise ValueError("Modelo do diagrama inválido.")
    (folder / "diagrama.html").write_text(template.replace("__GUIA_DATA__", payload), encoding="utf-8")


def render_documents(folder):
    docs_script = Path(__file__).resolve().parent / "documentos.py"
    subprocess.run([sys.executable, str(docs_script), "--project", str(folder.parent)], check=True)


def report(folder, state):
    index = state["current"]
    current = STAGES[index] if index < len(STAGES) else None
    print(f"Projeto: {folder.parent}\nTipo: {state['type']} | Nível: {state['level']}")
    print(f"Progresso: {index}/{len(STAGES)} | Etapa: {current[0] + ' ' + current[2] if current else 'Fluxo concluído'}")
    print(f"Entregas: {folder / 'entregas'}\nDiagrama: {folder / 'diagrama.html'}\nDocumentos: {folder / 'documentos.html'}")
    reviews = [row[0] for row in STAGES if stage_audit(folder, row[0], state["completed"].get(row[0]))]
    if reviews:
        print("Concluídas que precisam de revisão de arquivo/evidência: " + ", ".join(reviews))
    if index >= len(STAGES) - 1:
        print("Bloqueios críticos: " + (", ".join(pending_critical(state, folder)) or "nenhum"))


def main():
    parser = argparse.ArgumentParser(description="Acompanhar um aluno da ideia ao lançamento.")
    commands = parser.add_subparsers(dest="command", required=True)
    for name in ("init", "status", "config", "complete", "check", "render"):
        cmd = commands.add_parser(name)
        cmd.add_argument("--project", default=".", help="Diretório do projeto do aluno")
        if name == "config":
            cmd.add_argument("--type", choices=("indefinido", "site", "saas"))
            cmd.add_argument("--level", choices=("iniciante", "intermediario", "avancado"))
        if name == "complete":
            cmd.add_argument("--stage", required=True, choices=[row[0] for row in STAGES])
            cmd.add_argument("--status", choices=("feito", "nao-aplicavel"), default="feito")
            cmd.add_argument("--note", required=True, help="Evidência testada ou justificativa de não aplicação")
            cmd.add_argument("--evidence", help="Caminho de um arquivo de evidência dentro do projeto")
        if name == "check":
            cmd.add_argument("--item", required=True, choices=[row[0] for row in CHECKS])
            cmd.add_argument("--status", required=True, choices=("pronto", "pendente", "nao-aplicavel"))
            cmd.add_argument("--note", required=True, help="Evidência, motivo da pendência ou justificativa")
            cmd.add_argument("--evidence", help="Caminho de um arquivo de evidência dentro do projeto")
    args = parser.parse_args()
    try:
        folder = paths(args.project)
        if args.command == "init":
            if (folder / "estado.json").exists():
                state = load(folder)
                render(folder, state)
            else:
                (folder / "entregas").mkdir(parents=True, exist_ok=True)
                state = {"version": 1, "type": "indefinido", "level": "iniciante", "current": 0, "completed": {}, "checks": {}}
                save(folder, state)
        else:
            state = load(folder)
            if args.command == "config":
                if not args.type and not args.level:
                    raise ValueError("Informe --type ou --level.")
                if args.type:
                    state["type"] = args.type
                if args.level:
                    state["level"] = args.level
                save(folder, state)
            elif args.command == "complete":
                if state["current"] >= len(STAGES) or STAGES[state["current"]][0] != args.stage:
                    raise ValueError("Só a etapa atual pode ser concluída.")
                if not args.note.strip():
                    raise ValueError("Informe evidência ou justificativa em --note.")
                if args.status == "nao-aplicavel" and args.stage not in {"b3", "b4", "b5", "b6", "s2"}:
                    raise ValueError("Esta etapa não pode ser marcada como não aplicável.")
                if args.status == "feito":
                    missing = [p for p in ARTIFACTS.get(args.stage, []) if not file_ready(folder, p)]
                    if missing:
                        raise ValueError("Crie e revise os arquivos da etapa antes de concluir: " + ", ".join(missing))
                    if not args.evidence or not file_ready(folder, args.evidence):
                        raise ValueError("Use --evidence CAMINHO para vincular um arquivo real do projeto.")
                critical = pending_critical(state, folder) if args.stage == "l1" else []
                if args.stage == "l1" and (state["type"] == "indefinido" or critical):
                    raise ValueError("Defina o tipo do projeto e resolva os itens críticos antes de concluir a publicação: " + ", ".join(critical))
                state["completed"][args.stage] = {"status": args.status, "note": args.note.strip(), "evidence": args.evidence if args.status == "feito" else None}
                state["current"] += 1
                save(folder, state)
            elif args.command == "check":
                item = next(row for row in CHECKS if row[0] == args.item)
                if item not in relevant_checks(state):
                    raise ValueError("Este item não pertence ao tipo de projeto selecionado.")
                if args.status == "nao-aplicavel" and not item[5]:
                    raise ValueError("Este item não é condicional; verifique-o antes de publicar.")
                if not args.note.strip():
                    raise ValueError("Informe uma evidência ou justificativa em --note.")
                if args.status == "pronto" and (not args.evidence or not file_ready(folder, args.evidence)):
                    raise ValueError("Para marcar pronto, vincule um arquivo real com --evidence CAMINHO.")
                state.setdefault("checks", {})[args.item] = {"status": args.status, "note": args.note.strip(), "evidence": args.evidence if args.status == "pronto" else None}
                save(folder, state)
            elif args.command == "render":
                render(folder, state)
                render_documents(folder)
        report(folder, state)
    except (OSError, ValueError, KeyError, json.JSONDecodeError) as error:
        parser.exit(1, f"Erro: {error}\n")


if __name__ == "__main__":
    main()
