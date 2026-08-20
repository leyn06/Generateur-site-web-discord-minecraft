// state.js — état central de l'application + sauvegarde automatique localStorage
import { showToast, debounce } from './utils.js';

const STORAGE_KEY = 'site-generator:config:v1';

const defaultConfig = {
  purpose: '',
  discord: { enabled: true, invite: 'discord-developers', data: null, status: 'idle' },
  minecraft: { enabled: true, ip: 'mc.hypixel.net', data: null, status: 'idle' },
  colors: { bg: '#080A0F', text: '#FFFFFF', discord: '#5865F2', mc: '#2EA043' },
  server: { name: 'Notre Serveur', tagline: 'Rejoignez une communauté active et bienveillante.' },
  cards: [
    { id: cryptoId(), title: 'Communauté active', desc: 'Des joueurs connectés tous les jours pour partager de bons moments.' },
    { id: cryptoId(), title: 'Événements', desc: 'Des tournois et des soirées organisés chaque semaine.' }
  ]
};

function cryptoId() {
  return 'c_' + Math.random().toString(36).slice(2, 10);
}

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultConfig);
    const parsed = JSON.parse(raw);
    // fusion défensive avec les valeurs par défaut (nouvelles clés, ancien format...)
    return {
      purpose: typeof parsed.purpose === 'string' ? parsed.purpose : defaultConfig.purpose,
      discord: { ...defaultConfig.discord, ...parsed.discord },
      minecraft: { ...defaultConfig.minecraft, ...parsed.minecraft },
      colors: { ...defaultConfig.colors, ...parsed.colors },
      server: { ...defaultConfig.server, ...parsed.server },
      cards: Array.isArray(parsed.cards) && parsed.cards.length ? parsed.cards : defaultConfig.cards
    };
  } catch (e) {
    console.warn('Config locale invalide, réinitialisation.', e);
    return structuredClone(defaultConfig);
  }
}

export const config = loadConfig();

const persist = debounce(() => {
  try {
    // on ne sauvegarde pas les données d'API brutes (regénérables, potentiellement volumineuses)
    const { discord, minecraft, colors, server, cards, purpose } = config;
    const toSave = {
      purpose,
      discord: { enabled: discord.enabled, invite: discord.invite },
      minecraft: { enabled: minecraft.enabled, ip: minecraft.ip },
      colors,
      server,
      cards
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    showToast('Sauvegardé', 'success');
  } catch (e) {
    console.error('Erreur de sauvegarde locale', e);
    showToast("Impossible de sauvegarder localement", 'error');
  }
}, 500);

const listeners = new Set();
export function onConfigChange(fn) { listeners.add(fn); }
export function saveConfig() {
  persist();
  listeners.forEach(fn => fn(config));
}

export function newCardId() { return cryptoId(); }

