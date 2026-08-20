// ui.js — relie le DOM aux modules métier
import { config, saveConfig, onConfigChange, newCardId } from './state.js';
import { fetchDiscordData } from './api-discord.js';
import { fetchMinecraftData } from './api-minecraft.js';
import { addOrUpdateCard, removeCard, startEditCard, cancelEditCard, getEditingId, renderCardsList } from './cards.js';
import { renderPreview, setPreviewSize } from './preview.js';
import { exportHTML } from './export.js';
import { populatePurposeSelect, renderSuggestions } from './suggestions-ui.js';
import { debounce } from './utils.js';

const $ = (id) => document.getElementById(id);

function fillFormFromConfig() {
  $('server-name').value = config.server.name;
  $('server-tagline').value = config.server.tagline;
  $('enable-discord').checked = config.discord.enabled;
  $('discord-invite').value = config.discord.invite;
  $('enable-minecraft').checked = config.minecraft.enabled;
  $('minecraft-ip').value = config.minecraft.ip;
  $('color-bg').value = config.colors.bg;
  $('color-text').value = config.colors.text;
  $('color-discord').value = config.colors.discord;
  $('color-mc').value = config.colors.mc;
  toggleSections();
}

function toggleSections() {
  $('discord-settings').style.display = config.discord.enabled ? 'block' : 'none';
  $('minecraft-settings').style.display = config.minecraft.enabled ? 'block' : 'none';
}

function refreshCards() {
  renderCardsList($('cards-list'), {
    onEdit: (id) => {
      const card = startEditCard(id);
      if (!card) return;
      $('card-title').value = card.title;
      $('card-desc').value = card.desc;
      $('card-submit').textContent = 'Enregistrer la modification';
      $('card-cancel').style.display = 'block';
    },
    onRemove: (id) => {
      removeCard(id);
      refreshCards();
      renderPreview();
    }
  });
}

function bindGeneralInputs() {
  const onGeneralChange = () => {
    config.server.name = $('server-name').value;
    config.server.tagline = $('server-tagline').value;
    config.colors.bg = $('color-bg').value;
    config.colors.text = $('color-text').value;
    config.colors.discord = $('color-discord').value;
    config.colors.mc = $('color-mc').value;
    saveConfig();
    renderPreview();
  };
  ['server-name', 'server-tagline', 'color-bg', 'color-text', 'color-discord', 'color-mc']
    .forEach(id => $(id).addEventListener('input', debounce(onGeneralChange, 200)));
}

function bindToggles() {
  $('enable-discord').addEventListener('change', () => {
    config.discord.enabled = $('enable-discord').checked;
    toggleSections();
    saveConfig();
    renderPreview();
  });
  $('enable-minecraft').addEventListener('change', () => {
    config.minecraft.enabled = $('enable-minecraft').checked;
    toggleSections();
    saveConfig();
    renderPreview();
  });
}

function bindApiInputs() {
  $('discord-invite').addEventListener('change', () => {
    config.discord.invite = $('discord-invite').value;
    fetchDiscordData($('discord-status')).then(renderPreview);
  });
  $('minecraft-ip').addEventListener('change', () => {
    config.minecraft.ip = $('minecraft-ip').value;
    fetchMinecraftData($('minecraft-status')).then(renderPreview);
  });
}

function bindCardForm() {
  $('card-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = addOrUpdateCard($('card-title').value, $('card-desc').value);
    if (!ok) return;
    $('card-title').value = '';
    $('card-desc').value = '';
    $('card-submit').textContent = 'Ajouter la carte';
    $('card-cancel').style.display = 'none';
    refreshCards();
    renderPreview();
  });

  $('card-cancel').addEventListener('click', () => {
    cancelEditCard();
    $('card-title').value = '';
    $('card-desc').value = '';
    $('card-submit').textContent = 'Ajouter la carte';
    $('card-cancel').style.display = 'none';
  });
}

function bindPreviewControls() {
  document.querySelectorAll('.preview-controls button').forEach(btn => {
    btn.addEventListener('click', () => setPreviewSize(btn.dataset.mode));
  });
}

function bindExport() {
  $('export-btn').addEventListener('click', exportHTML);
}

function refreshSuggestions() {
  renderSuggestions($('suggestions-panel'), config.purpose, config, {
    onApplyTagline: (tagline) => {
      config.server.tagline = tagline;
      $('server-tagline').value = tagline;
      saveConfig();
      renderPreview();
    },
    onApplyColors: (colors) => {
      config.colors.discord = colors.discord;
      config.colors.mc = colors.mc;
      $('color-discord').value = colors.discord;
      $('color-mc').value = colors.mc;
      saveConfig();
      renderPreview();
    },
    onAddCard: (card) => {
      const exists = config.cards.some(c => c.title.trim().toLowerCase() === card.title.trim().toLowerCase());
      if (exists) return;
      config.cards.push({ id: newCardId(), title: card.title, desc: card.desc });
      saveConfig();
      refreshCards();
      renderPreview();
    }
  });
}

function bindPurposeSelect() {
  const select = $('server-purpose');
  populatePurposeSelect(select, config.purpose);
  refreshSuggestions();

  select.addEventListener('change', () => {
    config.purpose = select.value;
    saveConfig();
    refreshSuggestions();
  });
}

export async function initUI() {
  fillFormFromConfig();
  refreshCards();
  bindGeneralInputs();
  bindToggles();
  bindApiInputs();
  bindCardForm();
  bindPreviewControls();
  bindExport();
  bindPurposeSelect();
  setPreviewSize('desktop');

  await Promise.all([
    fetchDiscordData($('discord-status')),
    fetchMinecraftData($('minecraft-status'))
  ]);
  renderPreview();

  onConfigChange(() => renderPreview());
}

