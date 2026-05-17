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
    <button class="nav-menu-btn" aria-label="Menu" aria-expanded="false">☰</button>
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

    const nav = document.querySelector('.nav');
    const menuBtn = document.querySelector('.nav-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const open = nav.classList.toggle('nav-open');
        menuBtn.textContent = open ? '✕' : '☰';
        menuBtn.setAttribute('aria-expanded', open);
      });
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => {
          nav.classList.remove('nav-open');
          menuBtn.textContent = '☰';
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });
})();
