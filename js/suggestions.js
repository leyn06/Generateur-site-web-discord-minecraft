// suggestions.js — préréglages par type de serveur : slogan, couleurs et cartes suggérées.
// L'utilisateur choisit un "but" et peut appliquer chaque suggestion en un clic,
// sans que rien ne soit imposé automatiquement.

export const PURPOSES = [
  {
    id: 'gaming',
    label: '🎮 Communauté Gaming',
    tagline: 'Rejoins une communauté de joueurs passionnés, entre bonne ambiance et compétition.',
    colors: { discord: '#5865F2', mc: '#2EA043' },
    cards: [
      { title: 'Communauté active', desc: 'Des membres connectés tous les jours pour jouer ensemble.' },
      { title: 'Tournois réguliers', desc: 'Des compétitions organisées chaque mois avec des lots à gagner.' },
      { title: 'Salons vocaux dédiés', desc: 'Un salon par jeu pour trouver facilement des coéquipiers.' },
      { title: 'Ambiance bienveillante', desc: 'Une modération active pour un espace sain et respectueux.' }
    ]
  },
  {
    id: 'rp',
    label: '🎭 Serveur Roleplay / RP',
    tagline: 'Plonge dans un univers immersif et incarne ton propre personnage.',
    colors: { discord: '#8B5CF6', mc: '#B45309' },
    cards: [
      { title: 'Univers immersif', desc: "Un lore riche construit et enrichi par toute la communauté." },
      { title: 'Système de métiers', desc: 'Choisis une profession et évolue dans une économie vivante.' },
      { title: 'Événements scénarisés', desc: 'Des arcs narratifs et des événements en direct chaque semaine.' },
      { title: 'Staff à l\u2019écoute', desc: 'Une équipe de modérateurs présente pour arbitrer et animer le RP.' }
    ]
  },
  {
    id: 'survie',
    label: '⛏️ Minecraft Survie / SMP',
    tagline: 'Construis, explore et survis avec une communauté de joueurs passionnés.',
    colors: { discord: '#5865F2', mc: '#2EA043' },
    cards: [
      { title: 'Survie sans triche', desc: 'Un serveur anti-cheat pour une expérience équitable pour tous.' },
      { title: 'Économie de joueurs', desc: 'Un système de commerce et de métiers entièrement piloté par la communauté.' },
      { title: 'Terrains protégés', desc: 'Protège tes constructions grâce à un système de claim simple.' },
      { title: 'Événements PvP/PvE', desc: 'Des mini-jeux et des événements réguliers en plus de la survie.' }
    ]
  },
  {
    id: 'creatif',
    label: '🎨 Communauté créative / artistique',
    tagline: 'Un espace pour partager, apprendre et progresser entre créateurs.',
    colors: { discord: '#EC4899', mc: '#0EA5E9' },
    cards: [
      { title: 'Partage de créations', desc: 'Un salon dédié pour montrer tes réalisations et recevoir des retours.' },
      { title: 'Défis créatifs', desc: 'Des thèmes proposés chaque semaine pour te challenger.' },
      { title: 'Entraide bienveillante', desc: 'Des membres prêts à donner des conseils constructifs.' },
      { title: 'Collaborations', desc: 'Trouve des partenaires pour tes projets communs.' }
    ]
  },
  {
    id: 'business',
    label: '💼 Entreprise / Freelance',
    tagline: 'Rejoignez notre espace professionnel pour échanger, apprendre et grandir ensemble.',
    colors: { discord: '#2563EB', mc: '#059669' },
    cards: [
      { title: 'Réseau professionnel', desc: 'Échangez avec des pairs de votre secteur d\u2019activité.' },
      { title: 'Support réactif', desc: 'Une équipe disponible pour répondre à vos questions rapidement.' },
      { title: 'Ressources exclusives', desc: 'Guides, modèles et outils réservés aux membres.' },
      { title: 'Ateliers et webinaires', desc: 'Des sessions régulières animées par des experts.' }
    ]
  },
  {
    id: 'stream',
    label: '📺 Streamer / Créateur de contenu',
    tagline: 'La communauté officielle — retrouve-moi en live et échange avec les autres viewers.',
    colors: { discord: '#9146FF', mc: '#2EA043' },
    cards: [
      { title: 'Notifications de live', desc: 'Sois prévenu dès que je passe en direct.' },
      { title: 'Communauté de viewers', desc: 'Échange avec les autres membres entre deux streams.' },
      { title: 'Jeux communautaires', desc: 'Participe à des soirées jeux organisées avec la communauté.' },
      { title: 'Contenu exclusif', desc: 'Accède à du contenu réservé aux membres du serveur.' }
    ]
  },
  {
    id: 'etudes',
    label: '📚 Groupe d\u2019études / Formation',
    tagline: 'Apprenons et progressons ensemble, quel que soit ton niveau.',
    colors: { discord: '#0891B2', mc: '#65A30D' },
    cards: [
      { title: 'Entraide entre membres', desc: 'Pose tes questions et aide les autres à progresser.' },
      { title: 'Ressources partagées', desc: 'Fiches, cours et exercices centralisés au même endroit.' },
      { title: 'Sessions de révision', desc: 'Des sessions de travail en groupe organisées régulièrement.' },
      { title: 'Suivi de progression', desc: 'Fixe-toi des objectifs et suis tes progrès avec la communauté.' }
    ]
  },
  {
    id: 'general',
    label: '👋 Communauté générale / entre amis',
    tagline: 'Un espace convivial pour discuter, rigoler et passer du bon temps ensemble.',
    colors: { discord: '#5865F2', mc: '#2EA043' },
    cards: [
      { title: 'Ambiance conviviale', desc: 'Un endroit détendu pour discuter de tout et de rien.' },
      { title: 'Événements réguliers', desc: 'Soirées jeux, quiz et activités organisées par la communauté.' },
      { title: 'Salons variés', desc: 'Un salon pour chaque centre d\u2019intérêt.' },
      { title: 'Membres accueillants', desc: 'Une communauté ouverte, parfaite pour se faire de nouveaux amis.' }
    ]
  }
];

export function getPurpose(id) {
  return PURPOSES.find(p => p.id === id) || null;
}

