// api-minecraft.js — récupère le statut public d'un serveur Minecraft (via mcsrvstat.us)
import { config, saveConfig } from './state.js';
import { setFieldStatus } from './utils.js';

export async function fetchMinecraftData(statusEl) {
  const ip = (config.minecraft.ip || '').trim();
  config.minecraft.ip = ip;

  if (!ip) {
    config.minecraft.data = null;
    config.minecraft.status = 'idle';
    setFieldStatus(statusEl, 'idle', '');
    return;
  }

  config.minecraft.status = 'loading';
  setFieldStatus(statusEl, 'loading', 'Ping du serveur…');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) {
      config.minecraft.data = null;
      config.minecraft.status = 'error';
      setFieldStatus(statusEl, 'error', 'API de statut Minecraft indisponible.');
      return;
    }

    const data = await res.json();
    config.minecraft.data = data;

    if (!data.online) {
      config.minecraft.status = 'ok';
      setFieldStatus(statusEl, 'error', 'Serveur hors ligne.');
      return;
    }

    config.minecraft.status = 'ok';
    setFieldStatus(
      statusEl,
      'ok',
      `En ligne · ${data.players?.online ?? 0}/${data.players?.max ?? '?'} joueurs${data.version ? ' · ' + data.version : ''}`
    );
  } catch (e) {
    config.minecraft.data = null;
    config.minecraft.status = 'error';
    const message = e.name === 'AbortError'
      ? "Délai dépassé, l'API Minecraft n'a pas répondu."
      : "Impossible de contacter l'API de statut Minecraft.";
    setFieldStatus(statusEl, 'error', message);
    console.error('Erreur API Minecraft', e);
  } finally {
    saveConfig();
  }
}

