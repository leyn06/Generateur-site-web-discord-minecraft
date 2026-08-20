// suggestions-ui.js — construit le sélecteur "but du serveur" et le panneau
// de suggestions associé (slogan, couleurs, cartes) avec application au clic.
import { PURPOSES, getPurpose } from './suggestions.js';
import { escapeHtml } from './utils.js';

export function populatePurposeSelect(selectEl, currentValue) {
  PURPOSES.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.label;
    selectEl.appendChild(opt);
  });
  selectEl.value = currentValue || '';
}

export function renderSuggestions(container, purposeId, config, handlers) {
  const purpose = getPurpose(purposeId);
  if (!purpose) {
    container.innerHTML = '';
    return;
  }

  const existingTitles = new Set(config.cards.map(c => c.title.trim().toLowerCase()));

  container.innerHTML = `
    <div class="suggestion-block">
      <span class="suggestion-label">Slogan suggéré</span>
      <div class="suggestion-tagline">
        <span>${escapeHtml(purpose.tagline)}</span>
        <button type="button" class="mini-btn" data-action="apply-tagline">Utiliser</button>
      </div>
    </div>

    <div class="suggestion-block">
      <span class="suggestion-label">Couleurs suggérées</span>
      <div class="suggestion-tagline">
        <div class="suggestion-swatches">
          <div class="swatch" style="background:${purpose.colors.discord}"></div>
          <div class="swatch" style="background:${purpose.colors.mc}"></div>
        </div>
        <button type="button" class="mini-btn" data-action="apply-colors">Appliquer</button>
      </div>
    </div>

    <div class="suggestion-block">
      <span class="suggestion-label">Cartes suggérées</span>
      ${purpose.cards.map((c, i) => {
        const already = existingTitles.has(c.title.trim().toLowerCase());
        return `
          <div class="suggestion-card ${already ? 'added' : ''}" data-index="${i}">
            <div class="txt">
              <h5>${escapeHtml(c.title)}</h5>
              <p>${escapeHtml(c.desc)}</p>
            </div>
            <button type="button" class="mini-btn ${already ? 'applied' : ''}" data-action="add-card" data-index="${i}" ${already ? 'disabled' : ''}>
              ${already ? 'Ajoutée' : '+ Ajouter'}
            </button>
          </div>`;
      }).join('')}
      <button type="button" class="mini-btn" data-action="add-all-cards" style="width:100%; margin-top:4px;">Tout ajouter</button>
    </div>
  `;

  container.querySelector('[data-action="apply-tagline"]').addEventListener('click', () => {
    handlers.onApplyTagline(purpose.tagline);
  });
  container.querySelector('[data-action="apply-colors"]').addEventListener('click', () => {
    handlers.onApplyColors(purpose.colors);
  });
  container.querySelectorAll('[data-action="add-card"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.index);
      handlers.onAddCard(purpose.cards[idx]);
      renderSuggestions(container, purposeId, config, handlers);
    });
  });
  const addAllBtn = container.querySelector('[data-action="add-all-cards"]');
  if (addAllBtn) {
    addAllBtn.addEventListener('click', () => {
      purpose.cards.forEach(c => handlers.onAddCard(c));
      renderSuggestions(container, purposeId, config, handlers);
    });
  }
}

