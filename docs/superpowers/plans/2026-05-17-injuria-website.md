# Injúria Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Site estático profissional para a banda Injúria em injuriametal.com — 5 páginas HTML com design system compartilhado, i18n PT-BR/EN-US, embeds YouTube e área de media kit para imprensa e booking.

**Architecture:** Vanilla HTML/CSS/JS puro sem bundler. Nav e footer são injetados por `nav.js` em todas as páginas via `insertAdjacentHTML`. `i18n.js` aplica strings de `translations.json` em elementos `[data-i18n]` com preferência em `localStorage`. Clique em `.video-cell` substitui thumbnail por `<iframe>` YouTube inline.

**Tech Stack:** HTML5, CSS custom properties, ES6 vanilla JS, Inter via Google Fonts CDN, Netlify (deploy + Forms) ou Vercel + Formspree.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `css/style.css` | Design system completo — variáveis, tipografia, botões, nav, footer, todos os componentes |
| `js/nav.js` | Injeta `<nav>` e `<footer>` em cada página; detecta link ativo pelo pathname |
| `js/i18n.js` | Carrega translations.json, aplica `[data-i18n]`, gerencia toggle PT/EN e localStorage |
| `js/main.js` | Swap de vídeo: clique em `.video-cell` injeta `<iframe>` YouTube autoplay |
| `assets/translations.json` | Todas as strings da UI em `pt` e `en` |
| `index.html` | Home — hero, release, vídeos, merch, shows, streaming |
| `sobre.html` | Sobre — bio, membros, timeline |
| `discografia.html` | Discografia — todos os lançamentos |
| `imprensa.html` | Imprensa — bios PT+EN, downloads, booking |
| `contato.html` | Contato — formulário, redes sociais |
| `netlify.toml` | Config de deploy, headers de segurança, redirect /loja |

---

## Task 1: Scaffolding

**Files:**
- Create: `.gitignore`
- Create: `assets/translations.json` (skeleton)

- [ ] **Step 1: Inicializar git e criar estrutura de pastas**

```bash
cd /Users/leonardopais/Documents/injuria/website
git init
mkdir -p css js assets/images assets/downloads
```

- [ ] **Step 2: Criar .gitignore**

`.gitignore`:
```
.DS_Store
.superpowers/
```

- [ ] **Step 3: Criar skeleton do translations.json**

`assets/translations.json`:
```json
{
  "pt": {
    "nav.home":        "Início",
    "nav.about":       "Sobre",
    "nav.discography": "Discografia",
    "nav.press":       "Imprensa",
    "nav.contact":     "Contato",
    "nav.store":       "Loja ↗",
    "footer.copy":     "© 2026 Injúria"
  },
  "en": {
    "nav.home":        "Home",
    "nav.about":       "About",
    "nav.discography": "Discography",
    "nav.press":       "Press",
    "nav.contact":     "Contact",
    "nav.store":       "Store ↗",
    "footer.copy":     "© 2026 Injúria"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore assets/translations.json
git commit -m "chore: project scaffolding and translations skeleton"
```

---

## Task 2: CSS Design System

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Escrever style.css completo**

`css/style.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* ── Variables ── */
:root {
  --text:    #D9D6D0;
  --bg:      #080808;
  --surface: #111111;
  --border:  #1E1E1E;
  --muted:   #555555;
  --label:   #444444;
  --font:    'Inter', system-ui, sans-serif;
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  font-size: 15px;
  line-height: 1.7;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: var(--font); }

/* ── Typography ── */
.t-heading { font-size: clamp(40px, 7vw, 64px); font-weight: 700; letter-spacing: -2px; line-height: 1; }
.t-title   { font-size: clamp(22px, 4vw, 36px); font-weight: 600; letter-spacing: -0.5px; }
.t-label   { font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--label); }
.t-muted   { color: var(--muted); }

/* ── Layout ── */
.section    { padding: 56px 40px; border-top: 1px solid var(--border); }
.section-sm { padding: 28px 40px; border-top: 1px solid var(--border); }
main { padding-top: 56px; }

/* ── Buttons ── */
.btn { display: inline-block; padding: 11px 28px; font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; border: none; transition: opacity 0.15s; }
.btn:hover { opacity: 0.75; }
.btn-primary { background: var(--text); color: var(--bg); }
.btn-outline  { background: transparent; color: var(--text); border: 1px solid var(--text); }
.btn-ghost    { background: transparent; color: var(--muted); border: 1px solid #252525; }
.btn-row { display: flex; gap: 10px; flex-wrap: wrap; }

/* ── Nav ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 56px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px;
  background: rgba(8,8,8,0.96);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px);
}
.nav-logo { font-size: 13px; font-weight: 700; letter-spacing: 5px; text-transform: uppercase; }
.nav-links { display: flex; gap: 32px; }
.nav-links a { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); transition: color 0.15s; }
.nav-links a:hover, .nav-links a.active { color: var(--text); }
.nav-right { display: flex; align-items: center; gap: 24px; }
.lang-toggle {
  background: none; border: 1px solid var(--border);
  color: var(--muted); font-size: 9px; font-weight: 600;
  letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px;
  transition: all 0.15s;
}
.lang-toggle:hover { border-color: var(--muted); color: var(--text); }
.nav-store { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; }

/* ── Footer ── */
.footer {
  border-top: 1px solid var(--border);
  padding: 20px 40px;
  display: flex; align-items: center; justify-content: space-between;
  background: #050505;
}
.footer-socials { display: flex; gap: 24px; }
.footer-socials a { font-size: 9px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--label); transition: color 0.15s; }
.footer-socials a:hover { color: var(--text); }

/* ── Hero ── */
.hero { position: relative; height: 100vh; min-height: 520px; overflow: hidden; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.1) 55%, transparent 100%); }
.hero-content { position: absolute; bottom: 40px; left: 40px; right: 40px; display: flex; align-items: flex-end; justify-content: space-between; }

/* ── Release ── */
.release { display: flex; gap: 32px; align-items: flex-start; margin-top: 20px; }
.release-cover { width: 100px; height: 100px; flex-shrink: 0; object-fit: cover; background: var(--surface); }
.release-title { font-size: clamp(22px, 4vw, 32px); font-weight: 600; letter-spacing: -0.8px; margin: 6px 0 10px; }
.release-desc { font-size: 14px; color: var(--muted); margin-bottom: 20px; }

/* ── Video grid ── */
.video-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); }
.video-cell { background: var(--bg); cursor: pointer; }
.video-thumb-wrap { position: relative; aspect-ratio: 16/9; overflow: hidden; background: var(--surface); }
.video-thumb-wrap img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.2s; }
.video-cell:hover .video-thumb-wrap img { opacity: 0.7; }
.video-play-icon {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: var(--text); pointer-events: none;
  opacity: 0; transition: opacity 0.2s;
}
.video-cell:hover .video-play-icon { opacity: 1; }
.video-cell iframe { width: 100%; aspect-ratio: 16/9; border: none; display: block; }
.video-meta { padding: 16px 20px; }
.video-meta p { font-size: 13px; font-weight: 500; margin-top: 4px; }

/* ── Merch strip ── */
.merch-strip { display: flex; align-items: center; justify-content: space-between; }
.merch-title { font-size: 17px; font-weight: 500; margin-top: 6px; }

/* ── Shows ── */
.shows-contact { display: flex; gap: 20px; margin-top: 12px; flex-wrap: wrap; }
.shows-contact a { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 2px; transition: border-color 0.15s; }
.shows-contact a:hover { border-color: var(--text); }

/* ── Streaming bar ── */
.streaming-bar { display: flex; align-items: center; gap: 32px; background: #050505; padding: 14px 40px; border-top: 1px solid var(--border); flex-wrap: wrap; }
.streaming-bar a { font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--label); transition: color 0.15s; }
.streaming-bar a:hover { color: var(--text); }

/* ── Page header ── */
.page-header { padding: 60px 40px 40px; }
.page-header .t-title { margin-top: 8px; }

/* ── Members ── */
.members-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); }
.member-cell { background: var(--bg); }
.member-photo { width: 100%; aspect-ratio: 3/4; object-fit: cover; background: var(--surface); }
.member-info { padding: 16px 20px; }
.member-name { font-size: 16px; font-weight: 600; letter-spacing: -0.3px; margin-bottom: 4px; }

/* ── Timeline ── */
.timeline { display: flex; flex-direction: column; }
.timeline-item { display: flex; gap: 32px; padding: 20px 0; border-top: 1px solid var(--border); }
.timeline-year { font-size: 11px; font-weight: 600; letter-spacing: 2px; flex-shrink: 0; width: 52px; color: var(--label); padding-top: 2px; }
.timeline-text { font-size: 14px; color: var(--muted); }

/* ── Discography ── */
.disco-list { display: flex; flex-direction: column; }
.disco-item { display: flex; gap: 24px; align-items: center; padding: 20px 40px; border-top: 1px solid var(--border); transition: background 0.15s; }
.disco-item:hover { background: var(--surface); }
.disco-cover { width: 64px; height: 64px; flex-shrink: 0; object-fit: cover; background: var(--surface); }
.disco-info { flex: 1; }
.disco-title { font-size: 17px; font-weight: 600; letter-spacing: -0.3px; }
.disco-meta { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--label); margin-top: 4px; }
.disco-links { display: flex; gap: 10px; flex-shrink: 0; }

/* ── Press / Imprensa ── */
.bio-block { max-width: 680px; }
.bio-text { font-size: 15px; line-height: 1.85; color: var(--muted); white-space: pre-line; }
.downloads-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1px; background: var(--border); }
.download-card { background: var(--surface); padding: 28px 24px; display: flex; flex-direction: column; gap: 12px; }
.download-card p { font-size: 13px; font-weight: 500; }
.booking-contacts { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 12px; }
.booking-contacts a { font-size: 13px; color: var(--text); border-bottom: 1px solid var(--border); padding-bottom: 2px; transition: border-color 0.15s; }
.booking-contacts a:hover { border-color: var(--text); }

/* ── Contact form ── */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
.contact-form { display: flex; flex-direction: column; gap: 16px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--label); }
.form-input, .form-textarea {
  background: var(--surface); border: 1px solid var(--border);
  color: var(--text); font-family: var(--font); font-size: 14px;
  font-weight: 300; padding: 12px 16px; width: 100%; outline: none;
  transition: border-color 0.15s;
}
.form-input:focus, .form-textarea:focus { border-color: var(--muted); }
.form-textarea { resize: vertical; min-height: 140px; }
.socials-column { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
.socials-column a { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); transition: color 0.15s; }
.socials-column a:hover { color: var(--text); }
```

- [ ] **Step 2: Verificar no browser**

```bash
cd /Users/leonardopais/Documents/injuria/website
python3 -m http.server 8000
```

Criar `test.html` temporário na raiz:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Test</title>
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<div style="padding:80px 40px;">
  <p class="t-label">Label text</p>
  <h1 class="t-heading" style="margin:12px 0;">INJÚRIA</h1>
  <p class="t-muted" style="max-width:400px;">Banda de metal de Leme, interior de São Paulo. Vazio existencial.</p>
  <div class="btn-row" style="margin-top:24px;">
    <a class="btn btn-primary">Ouvir agora</a>
    <a class="btn btn-outline">Media Kit</a>
    <a class="btn btn-ghost">Ver mais</a>
  </div>
</div>
</body>
</html>
```

Abrir `http://localhost:8000/test.html`. Esperado: fundo `#080808`, texto em `#D9D6D0`, três variantes de botão distintas e visíveis.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat: CSS design system — variables, typography, buttons and all component styles"
```

---

## Task 3: Nav & Footer Injection

**Files:**
- Create: `js/nav.js`

- [ ] **Step 1: Escrever nav.js**

`js/nav.js`:
```js
(function () {
  const LINKS = [
    { key: 'nav.home',        href: '/',                 label: 'Início'      },
    { key: 'nav.about',       href: '/sobre.html',       label: 'Sobre'       },
    { key: 'nav.discography', href: '/discografia.html', label: 'Discografia' },
    { key: 'nav.press',       href: '/imprensa.html',    label: 'Imprensa'    },
    { key: 'nav.contact',     href: '/contato.html',     label: 'Contato'     },
  ];

  const SOCIALS = [
    { label: 'Instagram', href: 'https://instagram.com/injuriaofficial'                  },
    { label: 'Facebook',  href: 'https://facebook.com/injuriaofficial'                   },
    { label: 'YouTube',   href: 'https://youtube.com/@injuriaofc'                   },
    { label: 'Spotify',   href: 'https://open.spotify.com/artist/6p0bP6LfWhWiQvW5s7W14O'  },
  ];

  function activePath() {
    const p = window.location.pathname;
    if (p === '/' || p.endsWith('/index.html')) return '/';
    const file = '/' + p.split('/').filter(Boolean).pop();
    return file;
  }

  function buildNav() {
    const active = activePath();
    const linksHTML = LINKS.map(l => {
      const isActive = l.href === active;
      return `<a href="${l.href}"${isActive ? ' class="active"' : ''} data-i18n="${l.key}">${l.label}</a>`;
    }).join('');

    return `<nav class="nav">
  <a class="nav-logo" href="/">INJÚRIA</a>
  <div class="nav-links">${linksHTML}</div>
  <div class="nav-right">
    <button class="lang-toggle" onclick="window.i18n && window.i18n.toggle()" aria-label="Trocar idioma">PT | EN</button>
    <a class="nav-store" href="https://loja.injuriametal.com" target="_blank" rel="noopener" data-i18n="nav.store">Loja ↗</a>
  </div>
</nav>`;
  }

  function buildFooter() {
    const socialsHTML = SOCIALS.map(s =>
      `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`
    ).join('');
    return `<footer class="footer">
  <span class="t-label" data-i18n="footer.copy">© 2026 Injúria</span>
  <div class="footer-socials">${socialsHTML}</div>
</footer>`;
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('afterbegin', buildNav());
    document.body.insertAdjacentHTML('beforeend', buildFooter());
  });
})();
```

- [ ] **Step 2: Adicionar script ao test.html e verificar**

Adicionar antes de `</body>` no `test.html`:
```html
<script src="/js/nav.js"></script>
```

Abrir `http://localhost:8000/test.html`. Esperado: nav fixa no topo com logo, 5 links, botão `PT | EN` e `Loja ↗`. Footer no rodapé com copyright e 4 links sociais.

- [ ] **Step 3: Commit**

```bash
git add js/nav.js
git commit -m "feat: nav and footer injection via nav.js with active link detection"
```

---

## Task 4: i18n System

**Files:**
- Create: `js/i18n.js`

> **Atenção:** `fetch()` não funciona com `file://`. Para desenvolvimento local, use sempre `python3 -m http.server 8000`.

- [ ] **Step 1: Escrever i18n.js**

`js/i18n.js`:
```js
(function () {
  let strings = {};
  let lang = localStorage.getItem('injuria-lang') || 'pt';

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = strings[lang]?.[el.dataset.i18n];
      if (val !== undefined) el.textContent = val;
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en-US';
    const btn = document.querySelector('.lang-toggle');
    if (btn) btn.textContent = lang === 'pt' ? 'PT | EN' : 'EN | PT';
  }

  function toggle() {
    lang = lang === 'pt' ? 'en' : 'pt';
    localStorage.setItem('injuria-lang', lang);
    apply();
  }

  async function init() {
    try {
      const res = await fetch('/assets/translations.json');
      strings = await res.json();
      apply();
    } catch (e) {
      console.warn('[i18n] Falha ao carregar translations.json', e);
    }
  }

  window.i18n = { toggle };
  document.addEventListener('DOMContentLoaded', init);
})();
```

- [ ] **Step 2: Adicionar ao test.html e verificar toggle**

No `test.html`, adicionar após `nav.js`:
```html
<script src="/js/i18n.js"></script>
```

Adicionar um elemento com `data-i18n` para testar:
```html
<p class="t-label" data-i18n="nav.home" style="margin-top:32px;">Início</p>
```

Abrir `http://localhost:8000/test.html`. Clicar em `PT | EN`. Esperado: texto muda para "Home", botão muda para `EN | PT`. Recarregar: idioma persiste.

- [ ] **Step 3: Commit**

```bash
git add js/i18n.js
git commit -m "feat: i18n system with data-i18n binding, toggle and localStorage persistence"
```

---

## Task 5: Video Embed

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: Escrever main.js**

`js/main.js`:
```js
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.video-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const id = cell.dataset.videoId;
      if (!id) return;
      const wrap = cell.querySelector('.video-thumb-wrap');
      if (!wrap) return;
      wrap.outerHTML = `<iframe
        src="https://www.youtube.com/embed/${id}?autoplay=1"
        allow="autoplay; encrypted-media"
        allowfullscreen>
      </iframe>`;
      cell.style.cursor = 'default';
      cell.replaceWith(cell); // remove o event listener após o swap
    }, { once: true });
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add js/main.js
git commit -m "feat: video embed swap — click thumbnail inlines YouTube iframe"
```

---

## Task 6: Home Page

**Files:**
- Create: `index.html`
- Modify: `assets/translations.json`

> Substitua os placeholders de ID antes de publicar:
> - `6p0bP6LfWhWiQvW5s7W14O`: ID do artista no Spotify (na URL do perfil após `/artist/`)
> - `7xzG1VkanSUMJDL5G7sl78`: ID do álbum The Moral Stain no Spotify
> - `OPn_NxQ34-Q`, `nshjpaS_bSw`, `2BATPHrT7bQ`: IDs dos vídeos no YouTube (11 caracteres após `v=` na URL)

- [ ] **Step 1: Escrever index.html**

`index.html`:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Injúria — Banda de metal de Leme, São Paulo.">
  <title>Injúria</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>

  <section class="hero">
    <img class="hero-img" src="/assets/images/hero-band.jpg" alt="Injúria" loading="eager">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div>
        <p class="t-label" data-i18n="home.hero.label">Metal · Leme, SP</p>
        <h1 class="t-heading">INJÚRIA</h1>
      </div>
      <a class="btn btn-primary"
         href="https://open.spotify.com/artist/6p0bP6LfWhWiQvW5s7W14O"
         target="_blank" rel="noopener"
         data-i18n="home.hero.cta">Ouvir agora</a>
    </div>
  </section>

  <section class="section">
    <p class="t-label" data-i18n="home.release.label">Último lançamento</p>
    <div class="release">
      <img class="release-cover" src="/assets/images/cover-the-moral-stain.jpg" alt="The Moral Stain" loading="lazy">
      <div>
        <p class="t-label">2025 · Álbum · 10 faixas</p>
        <h2 class="release-title">The Moral Stain</h2>
        <p class="release-desc" data-i18n="home.release.desc">Segundo álbum do Injúria. Dez faixas sobre o vazio existencial.</p>
        <div class="btn-row">
          <a class="btn btn-primary"
             href="https://open.spotify.com/album/7xzG1VkanSUMJDL5G7sl78"
             target="_blank" rel="noopener"
             data-i18n="home.release.spotify">Spotify</a>
          <a class="btn btn-ghost"
             href="https://www.youtube.com/playlist?list=OLAK5uy_k0IyuEHRWnUzbN8qVCVYbFkHZyaKqDQwQ"
             target="_blank" rel="noopener"
             data-i18n="home.release.youtube">YouTube</a>
        </div>
      </div>
    </div>
  </section>

  <section style="border-top:1px solid var(--border);">
    <div class="section-sm" style="border-top:none;">
      <p class="t-label" data-i18n="home.videos.label">Vídeos</p>
    </div>
    <div class="video-grid">

      <div class="video-cell" data-video-id="OPn_NxQ34-Q">
        <div class="video-thumb-wrap">
          <img src="https://img.youtube.com/vi/OPn_NxQ34-Q/maxresdefault.jpg" alt="Live Session 2025" loading="lazy">
          <span class="video-play-icon">▶</span>
        </div>
        <div class="video-meta">
          <p class="t-label" data-i18n="home.videos.live.label">Live Session · 2025</p>
          <p data-i18n="home.videos.live.title">3 músicas ao vivo</p>
        </div>
      </div>

      <div class="video-cell" data-video-id="nshjpaS_bSw">
        <div class="video-thumb-wrap">
          <img src="https://img.youtube.com/vi/nshjpaS_bSw/maxresdefault.jpg" alt="Contempt" loading="lazy">
          <span class="video-play-icon">▶</span>
        </div>
        <div class="video-meta">
          <p class="t-label" data-i18n="home.videos.mv.label">Videoclipe</p>
          <p>Contempt</p>
        </div>
      </div>

      <div class="video-cell" data-video-id="2BATPHrT7bQ">
        <div class="video-thumb-wrap">
          <img src="https://img.youtube.com/vi/2BATPHrT7bQ/maxresdefault.jpg" alt="Asoka" loading="lazy">
          <span class="video-play-icon">▶</span>
        </div>
        <div class="video-meta">
          <p class="t-label" data-i18n="home.videos.mv.label">Videoclipe</p>
          <p>Asoka</p>
        </div>
      </div>

    </div>
  </section>

  <section class="section-sm merch-strip">
    <div>
      <p class="t-label" data-i18n="home.merch.label">Merch</p>
      <p class="merch-title" data-i18n="home.merch.items">Camisetas · Moletom · Bermuda e mais</p>
    </div>
    <a class="btn btn-outline"
       href="https://loja.injuriametal.com"
       target="_blank" rel="noopener"
       data-i18n="home.merch.cta">Ver loja ↗</a>
  </section>

  <section class="section-sm" id="shows">
    <p class="t-label" data-i18n="home.shows.label">Shows</p>
    <p class="t-muted" style="margin-top:8px;font-size:14px;" data-i18n="home.shows.empty">Agenda em breve — entre em contato para booking</p>
    <div class="shows-contact">
      <a href="mailto:contato@injuriametal.com">contato@injuriametal.com</a>
      <a href="https://wa.me/5519994517235" target="_blank" rel="noopener" data-i18n="home.shows.whatsapp">WhatsApp</a>
    </div>
  </section>

  <div class="streaming-bar">
    <p class="t-label" data-i18n="home.streaming.label">Ouça em</p>
    <a href="https://open.spotify.com/artist/6p0bP6LfWhWiQvW5s7W14O" target="_blank" rel="noopener">Spotify</a>
    <a href="https://music.youtube.com" target="_blank" rel="noopener">YouTube Music</a>
    <a href="https://music.apple.com" target="_blank" rel="noopener">Apple Music</a>
    <a href="https://www.deezer.com" target="_blank" rel="noopener">Deezer</a>
  </div>

  <script src="/js/nav.js"></script>
  <script src="/js/i18n.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Adicionar strings da home ao translations.json**

Mesclar no `assets/translations.json` sob `"pt"` e `"en"`:
```json
"pt": {
  "home.hero.label":       "Metal · Leme, SP",
  "home.hero.cta":         "Ouvir agora",
  "home.release.label":    "Último lançamento",
  "home.release.desc":     "Segundo álbum do Injúria. Dez faixas sobre o vazio existencial.",
  "home.release.spotify":  "Spotify",
  "home.release.youtube":  "YouTube",
  "home.videos.label":     "Vídeos",
  "home.videos.live.label":"Live Session · 2025",
  "home.videos.live.title":"3 músicas ao vivo",
  "home.videos.mv.label":  "Videoclipe",
  "home.merch.label":      "Merch",
  "home.merch.items":      "Camisetas · Moletom · Bermuda e mais",
  "home.merch.cta":        "Ver loja ↗",
  "home.shows.label":      "Shows",
  "home.shows.empty":      "Agenda em breve — entre em contato para booking",
  "home.shows.whatsapp":   "WhatsApp",
  "home.streaming.label":  "Ouça em"
},
"en": {
  "home.hero.label":       "Metal · Leme, SP",
  "home.hero.cta":         "Listen now",
  "home.release.label":    "Latest release",
  "home.release.desc":     "Injúria's second album. Ten tracks on existential emptiness.",
  "home.release.spotify":  "Spotify",
  "home.release.youtube":  "YouTube",
  "home.videos.label":     "Videos",
  "home.videos.live.label":"Live Session · 2025",
  "home.videos.live.title":"3 live songs",
  "home.videos.mv.label":  "Music video",
  "home.merch.label":      "Merch",
  "home.merch.items":      "T-shirts · Hoodie · Shorts and more",
  "home.merch.cta":        "Visit store ↗",
  "home.shows.label":      "Shows",
  "home.shows.empty":      "Dates coming soon — contact us for booking",
  "home.shows.whatsapp":   "WhatsApp",
  "home.streaming.label":  "Listen on"
}
```

- [ ] **Step 3: Verificar em http://localhost:8000**

Esperado:
- Hero ocupa 100vh, fundo escuro com sobreposição (placeholder image = fundo `#111`)
- Seção de release com capa placeholder, título, descrição, dois botões
- Grid 3 colunas de vídeo; clicar qualquer célula substitui thumbnail por iframe YouTube autoplay
- Merch strip, shows, streaming bar, footer visíveis
- Toggle PT|EN muda textos em toda a página

- [ ] **Step 4: Commit**

```bash
git add index.html assets/translations.json
git commit -m "feat: home page — hero, release, videos, merch, shows and streaming sections"
```

---

## Task 7: Sobre Page

**Files:**
- Create: `sobre.html`
- Modify: `assets/translations.json`

- [ ] **Step 1: Escrever sobre.html**

`sobre.html`:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Sobre o Injúria — Banda de metal de Leme, São Paulo.">
  <title>Injúria — Sobre</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main>
    <div class="page-header">
      <p class="t-label" data-i18n="about.label">A banda</p>
      <h1 class="t-title" data-i18n="about.title">Sobre o Injúria</h1>
    </div>

    <section class="section">
      <div class="bio-block">
        <p class="bio-text t-muted" data-i18n="about.bio">Injúria é uma banda de metal originária de Leme, interior de São Paulo, formada em 2018. A sonoridade parte das raízes do heavy metal dos anos 80 — Slayer, Obituary — e as atravessa com novos elementos, resultando em composições densas e diretas sobre o vazio existencial.

O primeiro álbum, End Of Times (2018), figurou entre os 150 melhores álbuns da América Latina naquele ano. Em 2019, a End Of Times Tour percorreu 12 cidades paulistas em 15 apresentações, dividindo palco com Claustrofobia e Hellish War. Em 2025, o Injúria lançou The Moral Stain, segundo álbum com dez faixas.</p>
      </div>
    </section>

    <section style="border-top:1px solid var(--border);">
      <div class="section-sm" style="border-top:none;">
        <p class="t-label" data-i18n="about.members.label">Formação</p>
      </div>
      <div class="members-grid">
        <div class="member-cell">
          <img class="member-photo" src="/assets/images/member-leonardo.jpg" alt="Leonardo Pais" loading="lazy">
          <div class="member-info">
            <p class="member-name">Leonardo Pais</p>
            <p class="t-label" data-i18n="about.role.guitar">Guitarra & Vocal</p>
          </div>
        </div>
        <div class="member-cell">
          <img class="member-photo" src="/assets/images/member-diego.jpg" alt="Diego Henrique" loading="lazy">
          <div class="member-info">
            <p class="member-name">Diego Henrique</p>
            <p class="t-label" data-i18n="about.role.bass">Baixo</p>
          </div>
        </div>
        <div class="member-cell">
          <img class="member-photo" src="/assets/images/member-heraldo.jpg" alt="Heraldo Habermann" loading="lazy">
          <div class="member-info">
            <p class="member-name">Heraldo Habermann</p>
            <p class="t-label" data-i18n="about.role.drums">Bateria</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <p class="t-label" style="margin-bottom:20px;" data-i18n="about.timeline.label">Trajetória</p>
      <div class="timeline">
        <div class="timeline-item">
          <span class="timeline-year">2025</span>
          <p class="timeline-text" data-i18n="about.tl.2025">Lançamento de The Moral Stain, segundo álbum — 10 faixas.</p>
        </div>
        <div class="timeline-item">
          <span class="timeline-year">2022</span>
          <p class="timeline-text" data-i18n="about.tl.2022">Singles Asoka e Contempt.</p>
        </div>
        <div class="timeline-item">
          <span class="timeline-year">2020</span>
          <p class="timeline-text" data-i18n="about.tl.2020">Single Filthy World.</p>
        </div>
        <div class="timeline-item">
          <span class="timeline-year">2019</span>
          <p class="timeline-text" data-i18n="about.tl.2019">End Of Times Tour — 15 shows em 12 cidades paulistas, com Claustrofobia e Hellish War.</p>
        </div>
        <div class="timeline-item">
          <span class="timeline-year">2018</span>
          <p class="timeline-text" data-i18n="about.tl.2018">End Of Times lançado. Figura entre os 150 melhores álbuns da América Latina do ano.</p>
        </div>
      </div>
    </section>
  </main>

  <script src="/js/nav.js"></script>
  <script src="/js/i18n.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Adicionar strings ao translations.json**

```json
"pt": {
  "about.label":          "A banda",
  "about.title":          "Sobre o Injúria",
  "about.bio":            "Injúria é uma banda de metal originária de Leme, interior de São Paulo, formada em 2018. A sonoridade parte das raízes do heavy metal dos anos 80 — Slayer, Obituary — e as atravessa com novos elementos, resultando em composições densas e diretas sobre o vazio existencial.\n\nO primeiro álbum, End Of Times (2018), figurou entre os 150 melhores álbuns da América Latina naquele ano. Em 2019, a End Of Times Tour percorreu 12 cidades paulistas em 15 apresentações, dividindo palco com Claustrofobia e Hellish War. Em 2025, o Injúria lançou The Moral Stain, segundo álbum com dez faixas.",
  "about.members.label":  "Formação",
  "about.role.guitar":    "Guitarra & Vocal",
  "about.role.bass":      "Baixo",
  "about.role.drums":     "Bateria",
  "about.timeline.label": "Trajetória",
  "about.tl.2025":        "Lançamento de The Moral Stain, segundo álbum — 10 faixas.",
  "about.tl.2022":        "Singles Asoka e Contempt.",
  "about.tl.2020":        "Single Filthy World.",
  "about.tl.2019":        "End Of Times Tour — 15 shows em 12 cidades paulistas, com Claustrofobia e Hellish War.",
  "about.tl.2018":        "End Of Times lançado. Figura entre os 150 melhores álbuns da América Latina do ano."
},
"en": {
  "about.label":          "The band",
  "about.title":          "About Injúria",
  "about.bio":            "Injúria is a metal band from Leme, São Paulo, Brazil, formed in 2018. Rooted in 80s heavy metal — Slayer, Obituary — they deliver dense, direct compositions about existential emptiness and the inner darkness we carry alone.\n\nDebut album End Of Times (2018) was listed among the 150 best Latin American albums of the year. In 2019, the End Of Times Tour covered 15 shows across 12 cities. In 2025, Injúria released The Moral Stain, a ten-track second album.",
  "about.members.label":  "Members",
  "about.role.guitar":    "Guitar & Vocals",
  "about.role.bass":      "Bass",
  "about.role.drums":     "Drums",
  "about.timeline.label": "History",
  "about.tl.2025":        "The Moral Stain released — second album, 10 tracks.",
  "about.tl.2022":        "Singles Asoka and Contempt.",
  "about.tl.2020":        "Single Filthy World.",
  "about.tl.2019":        "End Of Times Tour — 15 shows across 12 cities in São Paulo state.",
  "about.tl.2018":        "End Of Times released. Listed among the 150 best Latin American albums of the year."
}
```

- [ ] **Step 3: Verificar e commitar**

Abrir `http://localhost:8000/sobre.html`. Esperado: nav com "Sobre" ativo, bio em texto, 3 células de membros com foto placeholder (`var(--surface)`), timeline com 5 marcos. Toggle EN troca bio e labels.

```bash
git add sobre.html assets/translations.json
git commit -m "feat: sobre page — bio, members grid and career timeline"
```

---

## Task 8: Discografia Page

**Files:**
- Create: `discografia.html`
- Modify: `assets/translations.json`

> Substitua os IDs de Spotify e YouTube antes de publicar. Para cada release, o ID do Spotify está na URL após `/album/` ou `/track/`.

- [ ] **Step 1: Escrever discografia.html**

`discografia.html`:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Discografia do Injúria — todos os lançamentos.">
  <title>Injúria — Discografia</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main>
    <div class="page-header">
      <p class="t-label" data-i18n="disco.label">Lançamentos</p>
      <h1 class="t-title" data-i18n="disco.title">Discografia</h1>
    </div>

    <div class="disco-list">

      <div class="disco-item">
        <img class="disco-cover" src="/assets/images/cover-the-moral-stain.jpg" alt="The Moral Stain" loading="lazy">
        <div class="disco-info">
          <p class="disco-title">The Moral Stain</p>
          <p class="disco-meta" data-i18n="disco.tms.meta">2025 · Álbum · 10 faixas</p>
        </div>
        <div class="disco-links">
          <a class="btn btn-primary" href="https://open.spotify.com/album/7xzG1VkanSUMJDL5G7sl78" target="_blank" rel="noopener">Spotify</a>
          <a class="btn btn-ghost" href="https://www.youtube.com/playlist?list=OLAK5uy_k0IyuEHRWnUzbN8qVCVYbFkHZyaKqDQwQ" target="_blank" rel="noopener">YouTube</a>
        </div>
      </div>

      <div class="disco-item">
        <img class="disco-cover" src="/assets/images/cover-contempt.jpg" alt="Contempt" loading="lazy">
        <div class="disco-info">
          <p class="disco-title">Contempt</p>
          <p class="disco-meta" data-i18n="disco.single.2022">2022 · Single</p>
        </div>
        <div class="disco-links">
          <a class="btn btn-primary" href="https://open.spotify.com/track/3TqiWpifK8QWYrI9nhct6K?si=1c7024bbd90749ed" target="_blank" rel="noopener">Spotify</a>
          <a class="btn btn-ghost" href="https://www.youtube.com/watch?v=nshjpaS_bSw" target="_blank" rel="noopener">YouTube</a>
        </div>
      </div>

      <div class="disco-item">
        <img class="disco-cover" src="/assets/images/cover-asoka.jpg" alt="Asoka" loading="lazy">
        <div class="disco-info">
          <p class="disco-title">Asoka</p>
          <p class="disco-meta" data-i18n="disco.single.2022">2022 · Single</p>
        </div>
        <div class="disco-links">
          <a class="btn btn-primary" href="https://open.spotify.com/track/2bnsofqHrAuV5uSkhdJKwe?si=b57cd05043b14435" target="_blank" rel="noopener">Spotify</a>
          <a class="btn btn-ghost" href="https://www.youtube.com/watch?v=2BATPHrT7bQ" target="_blank" rel="noopener">YouTube</a>
        </div>
      </div>

      <div class="disco-item">
        <img class="disco-cover" src="/assets/images/cover-filthy-world.jpg" alt="Filthy World" loading="lazy">
        <div class="disco-info">
          <p class="disco-title">Filthy World</p>
          <p class="disco-meta" data-i18n="disco.single.2020">2020 · Single</p>
        </div>
        <div class="disco-links">
          <a class="btn btn-primary" href="https://open.spotify.com/track/3HkPQA5n6KL4ULTeGt6XP7?si=2a7e7ae950ba486d" target="_blank" rel="noopener">Spotify</a>
          <a class="btn btn-ghost" href="https://www.youtube.com/watch?v=WFp5o2i1xZg" target="_blank" rel="noopener">YouTube</a>
        </div>
      </div>

      <div class="disco-item">
        <img class="disco-cover" src="/assets/images/cover-end-of-times.jpg" alt="End Of Times" loading="lazy">
        <div class="disco-info">
          <p class="disco-title">End Of Times</p>
          <p class="disco-meta" data-i18n="disco.eot.meta">2018 · Álbum · 7 faixas</p>
        </div>
        <div class="disco-links">
          <a class="btn btn-primary" href="https://open.spotify.com/album/7nWmk6J2bEy3ld6A22cIgS" target="_blank" rel="noopener">Spotify</a>
          <a class="btn btn-ghost" href="https://www.youtube.com/playlist?list=OLAK5uy_nNRbARNIVJz75O6BWz_sSDSuM2AfzUt9I" target="_blank" rel="noopener">YouTube</a>
        </div>
      </div>

    </div>
  </main>

  <script src="/js/nav.js"></script>
  <script src="/js/i18n.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Adicionar strings ao translations.json**

```json
"pt": {
  "disco.label":       "Lançamentos",
  "disco.title":       "Discografia",
  "disco.tms.meta":    "2025 · Álbum · 10 faixas",
  "disco.single.2022": "2022 · Single",
  "disco.single.2020": "2020 · Single",
  "disco.eot.meta":    "2018 · Álbum · 7 faixas"
},
"en": {
  "disco.label":       "Releases",
  "disco.title":       "Discography",
  "disco.tms.meta":    "2025 · Album · 10 tracks",
  "disco.single.2022": "2022 · Single",
  "disco.single.2020": "2020 · Single",
  "disco.eot.meta":    "2018 · Album · 7 tracks"
}
```

- [ ] **Step 3: Verificar e commitar**

Abrir `http://localhost:8000/discografia.html`. Esperado: 5 releases em lista, cada um com capa placeholder, título, meta e botões Spotify/YouTube. Hover em qualquer item muda fundo para `var(--surface)`.

```bash
git add discografia.html assets/translations.json
git commit -m "feat: discografia page with all 5 releases"
```

---

## Task 9: Imprensa Page

**Files:**
- Create: `imprensa.html`
- Modify: `assets/translations.json`

> Antes desta task, adicionar os arquivos reais em `assets/downloads/`:
> - `logotipo-injuria.png`
> - `rider-tecnico.pdf`
> - `release-the-moral-stain.pdf`

- [ ] **Step 1: Escrever imprensa.html**

`imprensa.html`:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Injúria — Imprensa e Media Kit.">
  <title>Injúria — Imprensa</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main>
    <div class="page-header">
      <p class="t-label" data-i18n="press.label">Para produtores e imprensa</p>
      <h1 class="t-title" data-i18n="press.title">Imprensa</h1>
    </div>

    <!-- Bio PT-BR — sempre exibida em português independente do toggle -->
    <section class="section">
      <p class="t-label" style="margin-bottom:16px;" data-i18n="press.bio.pt.heading">Bio — Português</p>
      <div class="bio-block">
        <p class="bio-text t-muted">Injúria é uma banda de metal originária de Leme, interior de São Paulo, formada em 2018. A sonoridade parte das raízes do heavy metal dos anos 80 — Slayer, Obituary — e as atravessa com novos elementos, resultando em composições densas e diretas sobre o vazio existencial, a escuridão interior que cada um carrega consigo.

O primeiro álbum, End Of Times (2018), figurou entre os 150 melhores álbuns da América Latina naquele ano. Em 2019, a End Of Times Tour percorreu 12 cidades paulistas em 15 apresentações, dividindo palco com Claustrofobia e Hellish War. Em 2025, o Injúria lançou The Moral Stain, segundo álbum com dez faixas.

Formação: Leonardo Pais (guitarra e vocal), Diego Henrique (baixo), Heraldo Habermann (bateria).</p>
      </div>
    </section>

    <!-- Bio EN-US — sempre exibida em inglês independente do toggle -->
    <section class="section">
      <p class="t-label" style="margin-bottom:16px;" data-i18n="press.bio.en.heading">Bio — English</p>
      <div class="bio-block">
        <p class="bio-text t-muted">Injúria is a metal band from Leme, São Paulo, Brazil, formed in 2018. Rooted in 80s heavy metal — Slayer, Obituary — they deliver dense, direct compositions about existential emptiness and the inner darkness we carry alone.

Debut album End Of Times (2018) was listed among the 150 best Latin American albums of the year. In 2019, the End Of Times Tour covered 15 shows across 12 cities in São Paulo state. In 2025, Injúria released The Moral Stain, a ten-track second album.

Line-up: Leonardo Pais (guitar & vocals), Diego Henrique (bass), Heraldo Habermann (drums).</p>
      </div>
    </section>

    <!-- Downloads -->
    <section class="section">
      <p class="t-label" style="margin-bottom:20px;" data-i18n="press.downloads.label">Downloads</p>
      <div class="downloads-grid">
        <div class="download-card">
          <p data-i18n="press.dl.logo">Logotipo PNG</p>
          <p class="t-label t-muted" data-i18n="press.dl.logo.desc">Alta resolução, fundo transparente</p>
          <a class="btn btn-outline" href="/assets/downloads/logotipo-injuria.png" download data-i18n="press.dl.cta">Baixar</a>
        </div>
        <div class="download-card">
          <p data-i18n="press.dl.rider">Rider Técnico</p>
          <p class="t-label t-muted" data-i18n="press.dl.rider.desc">PDF — backline e requisitos de palco</p>
          <a class="btn btn-outline" href="/assets/downloads/rider-tecnico.pdf" download data-i18n="press.dl.cta">Baixar</a>
        </div>
        <div class="download-card">
          <p data-i18n="press.dl.release">Release — The Moral Stain</p>
          <p class="t-label t-muted" data-i18n="press.dl.release.desc">PDF — release do álbum de 2025</p>
          <a class="btn btn-outline" href="/assets/downloads/release-the-moral-stain.pdf" download data-i18n="press.dl.cta">Baixar</a>
        </div>
      </div>
    </section>

    <!-- Booking -->
    <section class="section-sm">
      <p class="t-label" style="margin-bottom:10px;" data-i18n="press.booking.label">Booking</p>
      <div class="booking-contacts">
        <a href="mailto:contato@injuriametal.com">contato@injuriametal.com</a>
        <a href="https://wa.me/5519994517235" target="_blank" rel="noopener">WhatsApp +55 19 99451-7235</a>
      </div>
    </section>
  </main>

  <script src="/js/nav.js"></script>
  <script src="/js/i18n.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Adicionar strings ao translations.json**

```json
"pt": {
  "press.label":           "Para produtores e imprensa",
  "press.title":           "Imprensa",
  "press.bio.pt.heading":  "Bio — Português",
  "press.bio.en.heading":  "Bio — English",
  "press.downloads.label": "Downloads",
  "press.dl.logo":         "Logotipo PNG",
  "press.dl.logo.desc":    "Alta resolução, fundo transparente",
  "press.dl.rider":        "Rider Técnico",
  "press.dl.rider.desc":   "PDF — backline e requisitos de palco",
  "press.dl.release":      "Release — The Moral Stain",
  "press.dl.release.desc": "PDF — release do álbum de 2025",
  "press.dl.cta":          "Baixar",
  "press.booking.label":   "Booking"
},
"en": {
  "press.label":           "For bookers and press",
  "press.title":           "Press",
  "press.bio.pt.heading":  "Bio — Portuguese",
  "press.bio.en.heading":  "Bio — English",
  "press.downloads.label": "Downloads",
  "press.dl.logo":         "Logo PNG",
  "press.dl.logo.desc":    "High resolution, transparent background",
  "press.dl.rider":        "Technical Rider",
  "press.dl.rider.desc":   "PDF — backline and stage requirements",
  "press.dl.release":      "Release — The Moral Stain",
  "press.dl.release.desc": "PDF — 2025 album press release",
  "press.dl.cta":          "Download",
  "press.booking.label":   "Booking"
}
```

- [ ] **Step 3: Verificar e commitar**

Abrir `http://localhost:8000/imprensa.html`. Esperado: duas seções de bio sempre visíveis em seus respectivos idiomas (independente do toggle), 3 cards de download com botões `.btn-outline`, e-mail e WhatsApp de booking.

```bash
git add imprensa.html assets/translations.json
git commit -m "feat: imprensa page — bios PT+EN, downloads and booking contacts"
```

---

## Task 10: Contato Page

**Files:**
- Create: `contato.html`
- Modify: `assets/translations.json`

> **Netlify:** manter os atributos `netlify` e `data-netlify="true"` no `<form>`. O formulário funciona automaticamente após o deploy.  
> **Vercel:** remover atributos `netlify`/`data-netlify`, trocar `action` para `https://formspree.io/f/SEU_ID_FORMSPREE` (criar conta gratuita em formspree.io).

- [ ] **Step 1: Escrever contato.html**

`contato.html`:
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Entre em contato com o Injúria.">
  <title>Injúria — Contato</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main>
    <div class="page-header">
      <p class="t-label" data-i18n="contact.label">Fale com a gente</p>
      <h1 class="t-title" data-i18n="contact.title">Contato</h1>
    </div>

    <section class="section contact-grid">
      <form class="contact-form"
            name="contato"
            method="POST"
            action="/"
            netlify
            data-netlify="true">
        <input type="hidden" name="form-name" value="contato">

        <div class="form-field">
          <label class="form-label" for="name" data-i18n="contact.name">Nome</label>
          <input class="form-input" type="text" id="name" name="name" required>
        </div>

        <div class="form-field">
          <label class="form-label" for="email" data-i18n="contact.email">E-mail</label>
          <input class="form-input" type="email" id="email" name="email" required>
        </div>

        <div class="form-field">
          <label class="form-label" for="message" data-i18n="contact.message">Mensagem</label>
          <textarea class="form-textarea" id="message" name="message" required></textarea>
        </div>

        <button class="btn btn-primary" type="submit" data-i18n="contact.submit">Enviar</button>
      </form>

      <div>
        <p class="t-label" style="margin-bottom:20px;" data-i18n="contact.socials">Redes sociais</p>
        <div class="socials-column">
          <a href="https://instagram.com/injuriaofficial" target="_blank" rel="noopener">Instagram</a>
          <a href="https://facebook.com/injuriaofficial" target="_blank" rel="noopener">Facebook</a>
          <a href="https://youtube.com/@injuriaofc" target="_blank" rel="noopener">YouTube</a>
          <a href="https://open.spotify.com/artist/6p0bP6LfWhWiQvW5s7W14O" target="_blank" rel="noopener">Spotify</a>
        </div>
      </div>
    </section>
  </main>

  <script src="/js/nav.js"></script>
  <script src="/js/i18n.js"></script>
  <script src="/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Adicionar strings ao translations.json**

```json
"pt": {
  "contact.label":   "Fale com a gente",
  "contact.title":   "Contato",
  "contact.name":    "Nome",
  "contact.email":   "E-mail",
  "contact.message": "Mensagem",
  "contact.submit":  "Enviar",
  "contact.socials": "Redes sociais"
},
"en": {
  "contact.label":   "Get in touch",
  "contact.title":   "Contact",
  "contact.name":    "Name",
  "contact.email":   "Email",
  "contact.message": "Message",
  "contact.submit":  "Send",
  "contact.socials": "Social media"
}
```

- [ ] **Step 3: Verificar e commitar**

Abrir `http://localhost:8000/contato.html`. Esperado: layout de duas colunas, formulário à esquerda com inputs estilizados e foco alterando borda para `var(--muted)`, links sociais à direita. Submissão retorna erro 405 no localhost — normal, funciona após deploy Netlify.

```bash
git add contato.html assets/translations.json
git commit -m "feat: contato page with Netlify form and social links"
```

---

## Task 11: Deploy

**Files:**
- Create: `netlify.toml`

- [ ] **Step 1: Criar netlify.toml**

`netlify.toml`:
```toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/loja"
  to = "https://loja.injuriametal.com"
  status = 301
```

- [ ] **Step 2: Verificação final local**

```bash
python3 -m http.server 8000
```

Percorrer as 5 páginas e verificar:
- Nav presente em todas com link ativo correto
- Toggle PT|EN persiste ao navegar entre páginas
- Vídeos: clicar embed inline sem abrir nova aba
- Downloads na imprensa: botão com atributo `download`
- Sem erros de console (exceto erro 404 esperado nas imagens placeholder)

- [ ] **Step 3: Push e deploy no Netlify**

```bash
git add netlify.toml
git commit -m "chore: Netlify deploy config with security headers and /loja redirect"

# Criar repo no GitHub e conectar:
git remote add origin https://github.com/SEU_USUARIO/injuria-website.git
git push -u origin main
```

No Netlify (app.netlify.com):
1. "Add new site" → "Import an existing project" → selecionar o repo
2. Build command: *(vazio)*
3. Publish directory: `.`
4. "Deploy site"
5. Domain settings → adicionar domínio `injuriametal.com`
6. Configurar DNS no registrar apontando para os name servers do Netlify

---

## Self-Review

**Cobertura do spec:**

| Requisito | Task |
|---|---|
| HTML/CSS/JS puro, sem bundler | Tasks 1–2 |
| Nav/footer injetados via JS | Task 3 |
| i18n PT-BR/EN-US via `data-i18n` + `translations.json` | Task 4 |
| Toggle PT|EN na nav com `localStorage` | Task 4 |
| Embed YouTube inline no clique | Task 5 |
| Home: hero, release, vídeos, merch, shows, streaming | Task 6 |
| Sobre: bio, membros, timeline | Task 7 |
| Discografia: 5 lançamentos | Task 8 |
| Imprensa: bio PT+EN, 3 downloads, booking | Task 9 |
| Contato: formulário Netlify, sociais | Task 10 |
| Deploy Netlify + redirect /loja | Task 11 |
| Shows preparado para Supabase futuro | `id="shows"` em `index.html` como ponto de integração |

**Placeholder scan:** IDs de Spotify/YouTube são marcadores explícitos com instrução de onde substituir — não são lacunas de implementação. Todos os passos têm código completo.

**Consistência de nomes:** `.video-cell` / `.video-thumb-wrap` definidos no CSS (Task 2) e usados em `main.js` (Task 5) e `index.html` (Task 6). `data-i18n` como atributo, `el.dataset.i18n` no JS — consistente. `window.i18n.toggle()` exportado em `i18n.js` e chamado em `nav.js` — consistente.
