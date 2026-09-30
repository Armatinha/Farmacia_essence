#!/usr/bin/env python3
"""Gera um pacote privado versionado e uma mensagem pronta para a turma."""

import argparse
import json
from pathlib import Path
import zipfile


ROOT = Path(__file__).resolve().parent.parent
VERSION_FILE = ROOT / "assets" / "versao.json"
SKIP_PARTS = {"__pycache__", ".git"}


def release_data():
    data = json.loads(VERSION_FILE.read_text(encoding="utf-8"))
    version = data.get("version", "").strip()
    if not version:
        raise ValueError("assets/versao.json não contém uma versão válida.")
    return data


def distributable_files():
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file() or any(part in SKIP_PARTS for part in path.parts):
            continue
        if path.suffix == ".pyc":
            continue
        yield path


def windows_launcher(skill_folder):
    return rf'''@echo off
chcp 65001 >nul
title Criar Produto Guiado - instalar ou atualizar
echo.
echo CRIAR PRODUTO GUIADO
echo Instalador e atualizador da turma privada
echo.
set /p "PROJECT=Cole o caminho completo da pasta do seu projeto: "
if "%PROJECT%"=="" (
  echo O caminho não foi informado.
  pause
  exit /b 1
)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0{skill_folder}\scripts\instalar.ps1" -Project "%PROJECT%" -Platform all -Update
echo.
echo Se aparecer "Instalado", abra novamente o projeto na sua ferramenta de IA.
pause
'''


def instructions(version, skill_folder):
    return f"""CRIAR PRODUTO GUIADO · versão {version}

WINDOWS — forma mais simples
1. Extraia todo o conteúdo do ZIP.
2. Abra INSTALAR_OU_ATUALIZAR.bat.
3. Cole o caminho completo da pasta do projeto.
4. Aguarde a mensagem "Instalado".
5. Reabra o projeto no Antigravity, Codex, Cursor ou Claude Code.
6. No chat, escreva: Use criar-produto-guiado para continuar meu projeto.

MAC OU LINUX
Abra o terminal nesta pasta e execute:
python3 {skill_folder}/scripts/instalar.py --project "/caminho/do/projeto" --platform all --update

IMPORTANTE
- A atualização guarda a versão anterior como backup.
- Seus documentos e o progresso do projeto não são apagados.
- O pacote é privado e destinado somente aos alunos autorizados.
"""


def announcement(data, zip_name, download_url):
    changes = "\n".join(f"✅ {item}" for item in data.get("changes", []))
    access = f"🔗 Download: {download_url}" if download_url else f"📎 Baixe o arquivo anexado: {zip_name}"
    return f"""🚀 NOVA VERSÃO — CRIAR PRODUTO GUIADO v{data['version']}

{changes}

{access}

Depois de baixar:
1️⃣ Extraia o ZIP
2️⃣ Abra INSTALAR_OU_ATUALIZAR.bat
3️⃣ Cole o caminho da pasta do seu projeto
4️⃣ Reabra o projeto e peça: “Use criar-produto-guiado para continuar meu projeto”

🔒 Material exclusivo da turma. Não compartilhe fora do grupo.
"""


def main():
    parser = argparse.ArgumentParser(description="Criar um lançamento privado da skill.")
    parser.add_argument("--output", required=True, help="Pasta onde salvar o ZIP e a mensagem")
    parser.add_argument("--download-url", help="Link privado opcional para incluir na mensagem")
    args = parser.parse_args()

    data = release_data()
    version = data["version"]
    output = Path(args.output).expanduser().resolve()
    output.mkdir(parents=True, exist_ok=True)
    release_folder = f"criar-produto-guiado-v{version}"
    skill_folder = "criar-produto-guiado"
    zip_path = output / f"{release_folder}.zip"

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        prefix = Path(release_folder)
        for path in distributable_files():
            archive.write(path, prefix / skill_folder / path.relative_to(ROOT))
        archive.writestr(str(prefix / "INSTALAR_OU_ATUALIZAR.bat"), windows_launcher(skill_folder))
        archive.writestr(str(prefix / "INSTRUCOES.txt"), instructions(version, skill_folder))

    message_path = output / f"mensagem-grupo-v{version}.txt"
    message_path.write_text(
        announcement(data, zip_path.name, args.download_url), encoding="utf-8"
    )
    print(f"Pacote: {zip_path}")
    print(f"Mensagem: {message_path}")


if __name__ == "__main__":
    main()
