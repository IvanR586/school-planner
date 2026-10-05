'use strict';
(() => {
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('portfolio-school-planner-theme'); } catch {}
  let explicit = saved === 'dark' || saved === 'light';
  document.documentElement.dataset.theme = explicit ? saved : preference.matches ? 'dark' : 'light';
  function updateButton() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    button.textContent = dark ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-pressed', String(dark));
  }
  document.addEventListener('DOMContentLoaded', () => {
    updateButton();
    document.getElementById('theme-toggle').addEventListener('click', () => {
      const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = theme;
      explicit = true;
      try { localStorage.setItem('portfolio-school-planner-theme', theme); } catch {}
      updateButton();
    });
  });
  preference.addEventListener('change', event => {
    if (!explicit) {
      document.documentElement.dataset.theme = event.matches ? 'dark' : 'light';
      updateButton();
    }
  });
})();
