// template.js — construit le site statique final à partir de la config.
// Toute donnée provenant de l'utilisateur ou d'une API externe passe par escapeHtml()
// avant d'être insérée, afin d'éviter toute injection HTML/JS dans le site exporté.
import { escapeHtml, safeUrl } from './utils.js';

export function generateSiteHtml(config) {
  let tabsHtml = '';
  let discordHtml = '';
  let mcHtml = '';

  const both = config.discord.enabled && config.minecraft.enabled;

  if (config.discord.enabled) {
    const d = config.discord.data;
    const name = escapeHtml(d?.guild?.name || 'Notre Serveur Discord');
    const members = escapeHtml(d?.approximate_member_count ?? '?');
    const icon = d?.guild?.icon
      ? safeUrl(`https://cdn.discordapp.com/icons/${d.guild.id}/${d.guild.icon}.png`)
      : 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/discord-white-icon.png';
    const inviteCode = escapeHtml(config.discord.invite);

    tabsHtml += `<button class="tab-btn active" data-tab="discord-tab" type="button">Discord</button>`;
    discordHtml = `
      <div id="discord-tab" class="tab-content active">
        <img src="${icon}" alt="Logo du serveur" class="server-logo" loading="lazy">
        <h2>${name}</h2>
        <p>Rejoignez <strong>${members}</strong> membres !</p>
        <a href="${safeUrl('https://discord.gg/' + config.discord.invite)}" class="btn" style="background-color:${escapeHtml(config.colors.discord)}" target="_blank" rel="noopener noreferrer">Rejoindre le Discord</a>
      </div>`;
  }

  if (config.minecraft.enabled) {
    const m = config.minecraft.data;
    const isOnline = !!m?.online;
    const players = isOnline ? `${escapeHtml(m.players?.online ?? 0)}/${escapeHtml(m.players?.max ?? '?')}` : 'Hors ligne';
    const motd = isOnline && m.motd?.clean?.length
      ? m.motd.clean.map(escapeHtml).join('<br>')
      : 'Statut du serveur indisponible pour le moment.';
    const version = isOnline && m.version ? escapeHtml(m.version) : '';
    const ip = escapeHtml(config.minecraft.ip);

    tabsHtml += `<button class="tab-btn ${!config.discord.enabled ? 'active' : ''}" data-tab="mc-tab" type="button">Minecraft</button>`;
    mcHtml = `
      <div id="mc-tab" class="tab-content ${!config.discord.enabled ? 'active' : ''}">
        <h2>${ip}</h2>
        <div class="status ${isOnline ? 'online' : 'offline'}">${isOnline ? 'En ligne' : 'Hors ligne'} — Joueurs : ${players}${version ? ' — v' + version : ''}</div>
        <div class="motd">${motd}</div>
        <button class="btn copy-ip" style="background-color:${escapeHtml(config.colors.mc)}" type="button" data-ip="${ip}">Copier l'IP</button>
      </div>`;
  }

  const cardsHtml = config.cards.map(c => `
    <div class="card">
      <h3>${escapeHtml(c.title)}</h3>
      <p>${escapeHtml(c.desc)}</p>
    </div>`).join('');

  const bg = escapeHtml(config.colors.bg);
  const text = escapeHtml(config.colors.text);
  const accent = escapeHtml(config.colors.discord);
  const serverName = escapeHtml(config.server?.name || 'Rejoignez-nous !');
  const tagline = escapeHtml(config.server?.tagline || '');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${serverName}</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; font-family: 'Segoe UI', system-ui, sans-serif;
    background-color: ${bg}; color: ${text};
    display: flex; flex-direction: column; align-items: center; min-height: 100vh;
  }
  .container { max-width: 800px; width: 90%; margin: 48px auto; text-align: center; }
  .tagline { color: currentColor; opacity: 0.7; margin-top: -8px; margin-bottom: 24px; }
  .tabs { margin-bottom: 20px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
  .tab-btn {
    background: rgba(255,255,255,0.08); border: none; color: inherit;
    padding: 10px 20px; cursor: pointer; border-radius: 8px; font-size: 1rem;
  }
  .tab-btn.active { background: rgba(255,255,255,0.25); font-weight: bold; }
  .tab-content { display: none; padding: 32px; background: rgba(0,0,0,0.25); border-radius: 14px; margin-bottom: 30px; }
  .tab-content.active { display: block; }
  .server-logo { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; }
  .btn {
    display: inline-block; padding: 12px 26px; color: white; text-decoration: none;
    border-radius: 8px; font-weight: bold; margin-top: 16px; border: none; cursor: pointer; font-size: 0.95rem;
  }
  .status { margin: 15px 0; padding: 10px; border-radius: 8px; font-weight: bold; }
  .status.online { background: rgba(46,160,67,0.2); color: #43b581; }
  .status.offline { background: rgba(237,66,69,0.2); color: #ed4245; }
  .motd { background: #000; color: #aaa; font-family: monospace; padding: 15px; border-radius: 8px; margin-bottom: 15px; word-break: break-word; }
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 40px; }
  .card { background: rgba(0,0,0,0.3); padding: 22px; border-radius: 12px; text-align: left; }
  .card h3 { margin-top: 0; color: ${accent}; }
  @media (max-width: 480px) { .container { width: 94%; margin: 24px auto; } }
</style>
</head>
<body>
  <div class="container">
    <h1>${serverName}</h1>
    ${tagline ? `<p class="tagline">${tagline}</p>` : ''}
    <div class="tabs">${both ? tabsHtml : ''}</div>
    ${discordHtml}
    ${mcHtml}
    <div class="cards-grid">${cardsHtml}</div>
  </div>
  <script>
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-content').forEach(function (el) { el.classList.remove('active'); });
        document.querySelectorAll('.tab-btn').forEach(function (el) { el.classList.remove('active'); });
        document.getElementById(id).classList.add('active');
        btn.classList.add('active');
      });
    });
    document.querySelectorAll('.copy-ip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ip = btn.getAttribute('data-ip');
        navigator.clipboard.writeText(ip).then(function () {
          var original = btn.textContent;
          btn.textContent = 'IP copiée !';
          setTimeout(function () { btn.textContent = original; }, 1500);
        });
      });
    });
  </script>
</body>
</html>`;
}


