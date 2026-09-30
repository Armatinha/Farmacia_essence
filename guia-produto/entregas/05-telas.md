# 05 — Mapa de Telas

> Estado: aprovado

## Site Público
1. **Home:** `/`
2. **Sobre Nós:** `/sobre`
3. **Produtos:** `/produtos`
4. **Autenticação:** `/autenticacao`
5. **Contato:** `/contato`

## Painel Admin Privado
6. **Admin Login:** `/admin/login`
7. **Dashboard / Telemetria:** `/admin` (Visão geral de códigos validados).
8. **Gestão de Produtos:** `/admin/produtos` (Adicionar/Editar imagens e detalhes).
9. **Gestão de Códigos:** `/admin/codigos` (Gerar/Importar códigos e visualizar status individual).

## Componentes Compartilhados (Site Público)
- **Header:** Logo, Navegação (5 links), Botão CTAs transparentes/frosted glass.
- **Footer:** Informações da empresa, links rápidos, contato, redes sociais, ano.
- **Botões e Inputs:** Arredondados, limpos, com feedback tátil/micro-animação.

## Estrutura de Navegação Global
```
[Header Público] -> Home | Sobre Nós | Produtos | Autenticação | Contato

[Admin Sidebar] -> Dashboard | Produtos | Códigos | Sair
```
