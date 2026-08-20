// utils.js — fonctions utilitaires partagées

/**
 * Échappe les caractères HTML dangereux pour éviter toute injection
 * lorsque des données utilisateur (nom de serveur, cartes, MOTD...) sont
 * insérées dans le HTML généré ou exporté.
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Échappe une valeur pour une utilisation sûre dans un attribut d'URL (href, src). */
export function safeUrl(value, fallback = '#') {
  if (!value) return fallback;
  try {
    const url = new URL(value, window.location.origin);
    if (['http:', 'https:'].includes(url.protocol)) return url.href;
  } catch (e) {
    // valeur invalide
  }
  return fallback;
}

/** Empêche d'appeler une fonction trop souvent (utile pour les champs texte). */
export function debounce(fn, delay = 400) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

let toastTimer = null;
export function showToast(message, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

export function setFieldStatus(el, state, text) {
  if (!el) return;
  el.className = `field-status ${state}`;
  const iconMap = {
    loading: '<span class="dot spin">⟳</span>',
    ok: '<span class="dot">●</span>',
    error: '<span class="dot">●</span>',
    idle: ''
  };
  el.innerHTML = `${iconMap[state] || ''} ${escapeHtml(text || '')}`;
}

