// export.js — génère et télécharge un fichier HTML autonome
import { config } from './state.js';
import { generateSiteHtml } from './template.js';
import { showToast } from './utils.js';

function slugify(name) {
  return (name || 'mon-serveur')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'mon-serveur';
}

export function exportHTML() {
  try {
    const html = generateSiteHtml(config);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slugify(config.server?.name)}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Export terminé', 'success');
  } catch (e) {
    console.error("Erreur lors de l'export", e);
    showToast("Erreur lors de l'export", 'error');
  }
}

