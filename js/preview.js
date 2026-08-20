// preview.js — met à jour l'iframe d'aperçu et gère les modes desktop/tablette/mobile
import { config } from './state.js';
import { generateSiteHtml } from './template.js';

const SIZES = { desktop: '100%', tablet: '768px', mobile: '375px' };

export function renderPreview() {
  const iframe = document.getElementById('preview-frame');
  if (!iframe) return;
  iframe.srcdoc = generateSiteHtml(config);
}

export function setPreviewSize(mode) {
  const container = document.getElementById('preview-container');
  container.style.maxWidth = SIZES[mode] || SIZES.desktop;
  document.querySelectorAll('.preview-controls button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
}

