// api-discord.js — récupère les infos publiques d'un serveur Discord depuis un lien d'invitation
import { config, saveConfig } from './state.js';
import { setFieldStatus } from './utils.js';

/** Extrait le code d'invitation depuis "discord.gg/xxx", "https://discord.gg/xxx" ou juste "xxx". */
export function extractInviteCode(raw) {
  if (!raw) return '';
  const trimmed = raw.trim();
  const match = trimmed.match(/(?:discord\.gg\/|discordapp\.com\/invite\/|discord\.com\/invite\/)?([a-zA-Z0-9-]+)\/?$/);
  return match ? match[1] : trimmed.replace(/\/$/, '');
}

export async function fetchDiscordData(statusEl) {
  const code = extractInviteCode(config.discord.invite);
  config.discord.invite = code;

  if (!code) {
    config.discord.data = null;
    config.discord.status = 'idle';
    setFieldStatus(statusEl, 'idle', '');
    return;
  }

  config.discord.status = 'loading';
  setFieldStatus(statusEl, 'loading', 'Recherche du serveur…');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(
      `https://discord.com/api/v9/invites/${encodeURIComponent(code)}?with_counts=true`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (res.status === 404) {
      config.discord.data = null;
      config.discord.status = 'error';
      setFieldStatus(statusEl, 'error', 'Invitation invalide ou expirée.');
      return;
    }
    if (!res.ok) {
      config.discord.data = null;
      config.discord.status = 'error';
      setFieldStatus(statusEl, 'error', 'API Discord indisponible pour le moment.');
      return;
    }

    const data = await res.json();
    config.discord.data = data;
    config.discord.status = 'ok';
    setFieldStatus(statusEl, 'ok', `${data.guild?.name || 'Serveur trouvé'} · ${data.approximate_member_count ?? '?'} membres`);
  } catch (e) {
    // Ne jamais faire planter l'app : on retombe sur un état "pas de données"
    config.discord.data = null;
    config.discord.status = 'error';
    const message = e.name === 'AbortError'
      ? "Délai dépassé, l'API Discord n'a pas répondu."
      : "Impossible de contacter l'API Discord (réseau ou serveur introuvable).";
    setFieldStatus(statusEl, 'error', message);
    console.error('Erreur API Discord', e);
  } finally {
    saveConfig();
  }
}


