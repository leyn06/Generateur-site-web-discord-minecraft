// cards.js — CRUD des cartes "pourquoi nous rejoindre"
import { config, saveConfig, newCardId } from './state.js';
import { escapeHtml } from './utils.js';

let editingId = null;

export function addOrUpdateCard(title, desc) {
  title = title.trim();
  desc = desc.trim();
  if (!title || !desc) return false;

  if (editingId) {
    const card = config.cards.find(c => c.id === editingId);
    if (card) { card.title = title; card.desc = desc; }
    editingId = null;
  } else {
    config.cards.push({ id: newCardId(), title, desc });
  }
  saveConfig();
  return true;
}

export function startEditCard(id) {
  editingId = id;
  return config.cards.find(c => c.id === id) || null;
}

export function cancelEditCard() { editingId = null; }
export function getEditingId() { return editingId; }

export function removeCard(id) {
  config.cards = config.cards.filter(c => c.id !== id);
  if (editingId === id) editingId = null;
  saveConfig();
}

export function renderCardsList(container, { onEdit, onRemove }) {
  container.innerHTML = config.cards.map(c => `
    <div class="card-item" data-id="${c.id}">
      <div class="card-actions">
        <button class="icon-btn edit-card" title="Modifier">✎</button>
        <button class="icon-btn danger remove-card" title="Supprimer">✕</button>
      </div>
      <h4>${escapeHtml(c.title)}</h4>
      <p>${escapeHtml(c.desc)}</p>
    </div>
  `).join('') || `<p style="color:var(--text-secondary); font-size:0.82rem;">Aucune carte pour le moment.</p>`;

  container.querySelectorAll('.edit-card').forEach(btn => {
    btn.addEventListener('click', (e) => onEdit(e.target.closest('.card-item').dataset.id));
  });
  container.querySelectorAll('.remove-card').forEach(btn => {
    btn.addEventListener('click', (e) => onRemove(e.target.closest('.card-item').dataset.id));
  });
}


