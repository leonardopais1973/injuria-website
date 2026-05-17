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
