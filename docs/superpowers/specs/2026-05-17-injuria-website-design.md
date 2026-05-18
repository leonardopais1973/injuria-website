# Injúria Website — Design Spec

**Data:** 2026-05-17  
**Domínio:** injuriametal.com  
**Substituindo:** Google Sites atual (desatualizado, sem e-commerce, sem media kit)

---

## Objetivo

Site profissional estático para a banda Injúria, atendendo três públicos:

1. **Fãs** — ouvir, assistir vídeos, comprar merch
2. **Produtores / booking** — acessar media kit, entrar em contato
3. **Imprensa** — bio, fotos, logotipo, release

---

## Stack e Arquitetura

- **HTML/CSS/JS puro** — sem bundler, sem framework, sem dependências de runtime
- **Hospedagem:** Vercel ou Netlify (deploy via git push ou drag-and-drop)
- **Vídeos:** embed YouTube via `<iframe>` — sem upload de arquivos de vídeo
- **Imagens:** pasta local `/assets/images/`, servidas pelo CDN da hospedagem — sem Cloudflare R2
- **Loja:** Shopify separado em `loja.injuriametal.com` (integração Spotify inclusa)
- **Formulário de contato:** Netlify Forms (se hospedado no Netlify) ou Formspree (se Vercel) — sem backend
- **Futuro:** shows listados dinamicamente via Supabase quando necessário (sem mudança de stack)

### Estrutura de arquivos

```
injuria-website/
├── index.html
├── sobre.html
├── discografia.html
├── imprensa.html
├── contato.html
├── css/
│   └── style.css
├── js/
│   ├── main.js        # comportamentos globais
│   ├── nav.js         # injeta nav e footer em todas as páginas
│   └── i18n.js        # troca de idioma PT-BR / EN-US via translations.json
├── assets/
│   ├── images/        # fotos da banda, capas de álbuns (WebP/JPEG, <500KB cada)
│   ├── downloads/     # logotipo PNG, rider técnico PDF, release PDF
│   └── translations.json  # strings PT-BR e EN-US de todas as páginas
└── .gitignore
```

Nav e footer são componentes JS injetados — definidos uma vez em `nav.js`, aplicados em todas as páginas sem duplicação.

### Internacionalização (PT-BR / EN-US)

Abordagem: arquivo único de HTML por página com troca de conteúdo via JS a partir de um arquivo de traduções JSON. Um toggle `PT | EN` na nav grava a preferência em `localStorage` e reaplica ao navegar entre páginas.

```
js/
├── main.js
├── nav.js
└── i18n.js          # carrega translations.json e troca textos no DOM

assets/
└── translations.json  # todas as strings do site em pt-BR e en-US
```

Textos no HTML ficam em PT-BR como padrão (`data-i18n="chave"`). O `i18n.js` substitui o conteúdo dos elementos marcados com `data-i18n` ao detectar preferência EN-US. Bios completas (imprensa) são campos separados em `translations.json`, não truncados.

---

## Design System

### Tipografia

**Família:** Inter (Google Fonts CDN)

| Uso | Peso | Tamanho | Outros |
|---|---|---|---|
| Heading principal / nome da banda | 700 | 48–64px | `letter-spacing: -2px` |
| Section titles | 600 | 24–36px | `letter-spacing: -0.5px` |
| Labels / meta | 600 | 9–11px | `letter-spacing: 3px`, `text-transform: uppercase` |
| Body | 300 | 14–15px | `line-height: 1.7` |

### Paleta de cores

```css
--text:     #D9D6D0;   /* texto principal — cinza claro sujo */
--bg:       #080808;   /* fundo de página */
--surface:  #111111;   /* cards, seções alternadas */
--border:   #1E1E1E;   /* divisórias */
--muted:    #555555;   /* texto secundário */
--label:    #444444;   /* labels uppercase */
```

### Botões (sem border-radius)

| Classe | Fundo | Texto | Borda |
|---|---|---|---|
| `.btn-primary` | `#D9D6D0` | `#080808` | — |
| `.btn-outline` | transparente | `#D9D6D0` | `1px solid #D9D6D0` |
| `.btn-ghost` | transparente | `#555555` | `1px solid #252525` |

### Componentes globais

- **Nav:** fixa no topo — logo `INJÚRIA` à esquerda, links de página no centro, toggle `PT | EN` + `Loja ↗` à direita
- **Footer:** linha única — copyright à esquerda, ícones de redes sociais à direita
- **Divisórias:** `border-top: 1px solid var(--border)` — sem sombras, sem gradientes

### Imagens

- Formato preferencial: WebP com fallback JPEG
- Tamanho máximo por arquivo: 500KB
- `loading="lazy"` em todas as imagens fora do hero

---

## Páginas

### `index.html` — Home

Seções em ordem:

1. **Nav** (injetada via JS)
2. **Hero** — foto full-bleed da banda. Nome da banda sobreposto no canto inferior esquerdo com label de cidade/estado acima. Botão `Ouvir agora` (`.btn-primary`) no canto inferior direito. Gradiente sutil preto na base para legibilidade do texto.
3. **Último lançamento** — capa do The Moral Stain + ano + título + descrição curta + botões Spotify e YouTube
4. **Vídeos** — grid 3 colunas: Live Session (2025) + Videoclipe Contempt + Videoclipe Asoka. Cada célula: thumbnail como imagem estática; ao clicar, o thumbnail é substituído pelo `<iframe>` do YouTube inline (sem modal, sem nova aba).
5. **Merch** — faixa horizontal com texto "Camisetas · Moletom · Bermuda" e botão `Ver loja ↗` linkando para `loja.injuriametal.com`
6. **Shows** — linha com texto "Agenda em breve — entre em contato para booking" + e-mail e WhatsApp. Estrutura preparada para listagem futura via Supabase.
7. **Streaming bar** — logos/links: Spotify, YouTube Music, Apple Music, Deezer
8. **Footer** (injetado via JS)

### `sobre.html` — Sobre

- Bio da banda em texto corrido
- Fotos dos membros (Leonardo Pais, Diego Henrique, Heraldo Habermann) com nome e instrumento
- Timeline de marcos: End Of Times (2018), End Of Times Tour 2019 (15 shows / 12 cidades), The Moral Stain (2025)

### `discografia.html` — Discografia

Listagem cronológica reversa de todos os lançamentos:

| Ano | Título | Tipo |
|---|---|---|
| 2025 | The Moral Stain | Álbum |
| 2022 | Contempt | Single |
| 2022 | Asoka | Single |
| 2020 | Filthy World | Single |
| 2018 | End Of Times | Álbum |

Cada item: capa, ano, título, tipo, links Spotify + YouTube.

### `imprensa.html` — Imprensa / Media Kit

- **Bio PT-BR** — texto completo, copiável
- **Bio EN-US** — texto completo, copiável
- **Downloads:**
  - Logotipo PNG (alta resolução)
  - Rider técnico (PDF)
  - Release The Moral Stain (PDF)
- **Booking:** e-mail `leonardopais1990@gmail.com` + WhatsApp `+55 19 99451-7235`

Sem formulário nessa página — contato direto por e-mail e WhatsApp.

### `contato.html` — Contato

- Formulário simples: nome, e-mail, mensagem — submetido via Netlify Forms (Netlify) ou Formspree (Vercel)
- Links para redes sociais: Instagram, Facebook, YouTube, Spotify

---

## Fora de escopo

- CMS ou painel de edição
- E-commerce (delegado ao Shopify em `loja.injuriametal.com`)
- Backend / banco de dados (previsto para shows futuros via Supabase, não implementado agora)
- Dark/light mode toggle adicional além do que já existe
- Dark/light mode toggle
