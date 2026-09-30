#!/usr/bin/env python3
"""Instala a skill privada em uma ou em todas as ferramentas suportadas."""

import argparse
from datetime import datetime
import json
from pathlib import Path
import shutil
import subprocess

NAME = "criar-produto-guiado"
MANIFEST = {
    "$schema": "https://antigravity.google/schemas/v1/plugin.json",
    "name": NAME,
    "description": "Jornada privada da ideia ao PRD, construção e lançamento para alunos.",
}


def version_at(root):
    try:
        return json.loads((root / "assets" / "versao.json").read_text(encoding="utf-8"))["version"]
    except (OSError, ValueError, KeyError):
        return "anterior"


def destinations(project, platform, mode):
    if platform == "all":
        return [
            (project / ".agents" / "skills" / NAME, False, "Antigravity · Codex · Cursor"),
            (project / ".claude" / "skills" / NAME, False, "Claude Code"),
        ]
    if platform == "antigravity" and mode == "plugin":
        return [(project / ".agents" / "plugins" / NAME, True, "Antigravity")]
    base = {"codex": ".agents", "cursor": ".cursor", "antigravity": ".agents", "claude": ".claude"}[platform]
    return [(project / base / "skills" / NAME, False, platform.title())]


def skill_path(target, plugin):
    return target / "skills" / NAME if plugin else target


def valid(target, plugin):
    if not (skill_path(target, plugin) / "SKILL.md").is_file():
        return False
    if not plugin:
        return True
    try:
        return json.loads((target / "plugin.json").read_text(encoding="utf-8")).get("name") == NAME
    except (OSError, ValueError):
        return False


def main():
    parser = argparse.ArgumentParser(description="Instalar no projeto sem publicar no marketplace.")
    parser.add_argument("--project", help="Pasta existente do projeto")
    parser.add_argument("--platform", choices=("all", "codex", "cursor", "antigravity", "claude"))
    parser.add_argument("--mode", choices=("plugin", "skill"), help="Somente Antigravity: plugin ou skill")
    parser.add_argument("--verify", action="store_true", help="Somente verificar a instalação")
    parser.add_argument("--version", action="store_true", help="Mostrar a versão deste pacote")
    parser.add_argument("--update", action="store_true", help="Guardar a versão anterior e atualizar")
    args = parser.parse_args()
    source = Path(__file__).resolve().parent.parent
    source_version = version_at(source)
    if args.version:
        print(source_version)
        return
    if not args.project or not args.platform:
        parser.error("Informe --project e --platform para instalar ou verificar.")
    project = Path(args.project).expanduser().resolve()
    if not project.is_dir():
        parser.error("A pasta do projeto não existe.")
    mode = args.mode or ("plugin" if args.platform == "antigravity" else "skill")
    if mode == "plugin" and args.platform not in ("antigravity",):
        parser.error("Use --mode plugin apenas com --platform antigravity.")
    targets = destinations(project, args.platform, mode)
    if args.verify:
        failed = False
        for target, plugin, label in targets:
            okay = valid(target, plugin)
            installed_version = version_at(skill_path(target, plugin)) if okay else "não encontrada"
            current = okay and installed_version == source_version
            state = "Atual" if current else ("Desatualizada" if okay else "Incompleta")
            print(f"{state} · {label} · instalada: {installed_version} · pacote: {source_version} · {target}")
            failed = failed or not current
        if failed:
            parser.exit(1)
        return
    if project == source or project.is_relative_to(source):
        parser.error("Escolha um projeto fora da própria skill.")
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backups = []
    for target, _, _ in targets:
        if target.exists():
            if not args.update:
                parser.error(f"Já existe em {target}. Use --update para guardar a versão anterior.")
            backup = target.with_name(target.name + ".backup-" + stamp)
            if backup.exists():
                parser.error(f"Já existe uma cópia de segurança: {backup}")
            backups.append((target, backup))
    for target, backup in backups:
        target.rename(backup)
        print(f"Versão anterior guardada: {backup}")
    created = []
    try:
        for target, plugin, label in targets:
            destination = skill_path(target, plugin)
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copytree(source, destination, ignore=shutil.ignore_patterns("__pycache__", "*.pyc", ".git"))
            if plugin:
                (target / "plugin.json").write_text(json.dumps(MANIFEST, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            if not valid(target, plugin):
                raise OSError(f"A instalação de {label} não passou na verificação.")
            created.append(target)
    except OSError:
        for target in created:
            shutil.rmtree(target, ignore_errors=True)
        for target, backup in backups:
            if target.exists():
                shutil.rmtree(target, ignore_errors=True)
            backup.rename(target)
        raise
    git_dir = project / ".git"
    if git_dir.is_dir():
        exclude = git_dir / "info" / "exclude"
        try:
            previous = exclude.read_text(encoding="utf-8") if exclude.exists() else ""
            patterns = [target.relative_to(project).as_posix() + "*/" for target, _, _ in targets]
            additions = [pattern for pattern in patterns if pattern not in previous.splitlines()]
            if additions:
                exclude.parent.mkdir(parents=True, exist_ok=True)
                exclude.write_text(previous.rstrip("\n") + "\n" + "\n".join(additions) + "\n", encoding="utf-8")
            for target, _, _ in targets:
                tracked = subprocess.run(["git", "-C", str(project), "ls-files", "--", target.relative_to(project).as_posix()], capture_output=True, text=True, check=False)
                if tracked.stdout.strip():
                    print(f"Atenção: {target} já está versionado; revise antes de publicar o projeto.")
        except OSError:
            print("Atenção: revise a exclusão local da skill antes de publicar o projeto.")
    for target, _, label in targets:
        print(f"Instalado · v{source_version} · {label}: {target}")
    print("Abra o projeto e peça: 'Use criar-produto-guiado para começar meu projeto'.")
    if args.platform == "all":
        print("No Antigravity, procure em Skills das personalizações do projeto.")
    elif args.platform == "antigravity" and mode == "plugin":
        print("Plugin local do projeto; ele não entra no Marketplace público.")


if __name__ == "__main__":
    main()
