# NEXUS MUSIC — Déploiement Vercel

## Structure
```
nexus-music/
├── index.html        ← Frontend
├── api/
│   ├── music.js      ← Route /api/music (génère la musique)
│   └── poll.js       ← Route /api/poll (vérifie le statut)
├── vercel.json       ← Config Vercel
└── README.md
```

## Déploiement

### 1. Installer Vercel CLI
```bash
npm install -g vercel
```

### 2. Se connecter
```bash
vercel login
```

### 3. Déployer
```bash
cd nexus-music
vercel
```

### 4. Ajouter la clé Replicate sur Vercel
- Va sur vercel.com → ton projet → **Settings → Environment Variables**
- Ajoute : `REPLICATE_API_TOKEN` = `r8_ta_clé_ici`
- Clique **Save**
- Redéploie : `vercel --prod`

## Alternative sans CLI : Vercel via GitHub
1. Push ce dossier sur GitHub
2. Va sur vercel.com → **New Project** → importe ton repo
3. Ajoute la variable d'environnement `REPLICATE_API_TOKEN`
4. Clique Deploy
