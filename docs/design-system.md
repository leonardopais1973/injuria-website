# Design System — Injúria Website

## Princípios

Visual austero e direto, inspirado em Gojira e Turnstile. Sem ornamentos — divisórias finas, tipografia compacta com tracking apertado, paleta monocromática escura. Tudo que está na tela existe por necessidade.

---

## Cores

Definidas como CSS custom properties em `:root`.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#080808` | Fundo de página |
| `--surface` | `#111111` | Cards, seções alternadas, inputs |
| `--border` | `#1E1E1E` | Divisórias, bordas de componentes |
| `--text` | `#D9D6D0` | Texto principal, botão primário (fundo) |
| `--muted` | `#555555` | Texto secundário, links de nav inativos |
| `--label` | `#444444` | Labels uppercase, metadados |

Regra geral: qualquer nova cor deve partir desses tokens. Não usar hex direto no HTML ou CSS fora de `:root`.

---

## Tipografia

**Família:** Inter (Google Fonts CDN) — pesos 300, 400, 500, 600, 700.

**Base do body:** 15px, weight 300, line-height 1.7, antialiased.

### Classes utilitárias

| Classe | Tamanho | Peso | Detalhe |
|---|---|---|---|
| `.t-heading` | `clamp(40px, 7vw, 64px)` | 700 | `letter-spacing: -2px`, `line-height: 1` — nome da banda, títulos de hero |
| `.t-title` | `clamp(22px, 4vw, 36px)` | 600 | `letter-spacing: -0.5px` — títulos de página |
| `.t-label` | `10px` | 600 | `letter-spacing: 3px`, `text-transform: uppercase`, cor `--label` — metadados, seções |
| `.t-muted` | herda | herda | Cor `--muted` — texto secundário, bios, descrições |

---

## Botões

Sem `border-radius`. Hover sempre via `opacity: 0.75`.

| Classe | Fundo | Texto | Borda |
|---|---|---|---|
| `.btn-primary` | `--text` (`#D9D6D0`) | `--bg` (`#080808`) | — |
| `.btn-outline` | transparente | `--text` | `1px solid --text` |
| `.btn-ghost` | transparente | `--muted` | `1px solid #252525` |

Para agrupar botões lado a lado: envolva em `.btn-row` (flex, gap 10px, flex-wrap).

---

## Layout

### Seções

| Classe | Padding | Comportamento |
|---|---|---|
| `.section` | `56px 40px` | Inclui `border-top: 1px solid var(--border)` |
| `.section-sm` | `28px 40px` | Inclui `border-top: 1px solid var(--border)` |

`<main>` tem `padding-top: 56px` para compensar a nav fixa.

### Breakpoint mobile

`@media (max-width: 768px)` — padding de seções reduz para `40px 20px` / `20px`.

---

## Componentes

### Nav

Fixa no topo, `height: 56px`, `z-index: 100`. Fundo `rgba(8,8,8,0.96)` com `backdrop-filter: blur(8px)`.

- Logo à esquerda: `.nav-logo` — 13px, weight 700, letter-spacing 5px, uppercase
- Links no centro: `.nav-links` — 10px, weight 600, letter-spacing 2px, uppercase, cor `--muted`; estado ativo e hover: cor `--text`
- Direita: toggle de idioma (`.lang-toggle`) + link loja (`.nav-store`)
- Mobile (≤768px): links colapsam em menu hamburger (`.nav-menu-btn`). Estado aberto via classe `.nav-open` no `<nav>`.

Injetada via `js/nav.js` — não duplicar no HTML.

### Footer

Linha única com `border-top`, fundo `#050505`.

- Esquerda: copyright em `.t-label`
- Direita: `.footer-socials` — links 9px, weight 600, letter-spacing 2px, uppercase, cor `--label`

Injetado via `js/nav.js`.

### Hero

`height: 100vh`, `min-height: 520px`. Imagem `position: absolute; inset: 0; object-fit: cover; object-position: center top`.

Overlay: gradiente `to top` de `rgba(8,8,8,0.92)` a transparente (55% do caminho).

Conteúdo posicionado `bottom: 40px; left: 40px; right: 40px` — nome da banda à esquerda (`.t-heading`), CTA à direita.

**Imagem responsiva:** usa `<picture>` com `<source media="(max-width: 768px)">` para trocar a foto no mobile.

### Grid de vídeos

3 colunas no desktop (`grid-template-columns: repeat(3, 1fr)`), 1 coluna no mobile. Gap de `1px` com fundo `--border` para efeito de divisória entre células.

Cada `.video-cell` tem `data-video-id`. Ao clicar, `js/main.js` substitui o `.video-thumb-wrap` por um `<iframe>` YouTube com autoplay.

### Grid de membros

Mesmo padrão do grid de vídeos — 3 colunas desktop, 1 coluna mobile, gap `1px`.

Foto com `aspect-ratio: 3/4`, `object-fit: cover`.

### Lista de discografia

`.disco-list` em coluna. Cada `.disco-item` tem `padding: 20px 40px` e hover `background: var(--surface)`.

### Cards de download

`.downloads-grid` com `auto-fill, minmax(220px, 1fr)` e gap `1px`. Cards com `background: var(--surface)` e padding `28px 24px`.

### Formulário de contato

Inputs e textareas com `background: var(--surface)`, borda `--border`, sem `border-radius`. Foco muda borda para `--muted`.

---

## Internacionalização

Textos traduzíveis recebem `data-i18n="chave"`. O arquivo `assets/translations.json` contém todas as strings em `pt` e `en`. `js/i18n.js` aplica as traduções ao carregar a página e ao alternar o toggle `PT | EN` na nav (preferência salva em `localStorage`).

---

## Divisórias

Nunca usar sombras ou separadores visuais pesados. A única divisória é `border-top: 1px solid var(--border)` — aplicada via `.section`, `.section-sm`, ou diretamente no elemento.
