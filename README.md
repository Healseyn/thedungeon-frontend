# THE DUNGEON — Frontend

[![Live Dev Site](https://img.shields.io/badge/dev--site-online-purple)](https://dev.thedungeon.fun/)
[![Join our Discord](https://img.shields.io/discord/1223509068613672990?logo=discord&logoColor=white)](https://discord.gg/E6RuWBrww3)

A dark, atmospheric **MMO clicker** front-end built with **Next.js + Tailwind CSS**.  
Team up in real time, unleash damage numbers on a colossal boss, and race up the leaderboard—right in your browser.

---

## 🎮 Features

- **Monster click** – Click on the monster to do damage 
- **Real-time Multiplayer** – live Socket.IO updates (attacks, HP, leaderboard)  
- **Damage = Token balance** – Your damage = token balance / 1000  

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure the Socket.IO backend URL
echo "NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com" > .env.local
# 3. (Optional) Set the launch date and time to enable the countdown
# ISO 8601 format example: 2024-07-30T15:00:00Z
echo "NEXT_PUBLIC_LAUNCH_AT=YYYY-MM-DDTHH:MM:SSZ" >> .env.local

# 4. Run in development
npm run dev

# 5. Build for production
npm run build && npm start
```

> **Backend note**  
> The game server (Socket.IO) is private for security reasons.  
> Community members can request access via Discord.


---

## 🎨 Customization

- **Colors** – edit `tailwind.config.js` under the `dungeon` theme  
- **Fonts**  – imported in `styles/globals.css` via Google Fonts  
- **Monsters** – drop 512 × 512 images into `public/images/monsters` and reference them in your game data

---

## 🤝 Contributing

We welcome **issues _and_ direct pull requests**—pick whichever is fastest for you!  
Typical flow:

1. Fork → feature branch → **PR to `main`**  
2. Follow existing ESLint / Prettier rules (auto-run on commit).  
3. Keep commits scoped & descriptive (Conventional Commits appreciated but not mandatory).  

Need help? Ping us on Discord or open a draft PR.

---

## 🌐 Community

- **Discord** for real-time chat, design discussions, and early playtests:  
  <https://discord.gg/E6RuWBrww3>
- **Dev site** 
  <https://dev.thedungeon.fun/>
- **Production** 
  <https://thedungeon.fun/>

---

## 📜 License

Distributed under the **MIT License**.  
See [`LICENSE`](LICENSE) for full text.

> _Built with ❤️ by Healseyn and awesome open-source contributors._
