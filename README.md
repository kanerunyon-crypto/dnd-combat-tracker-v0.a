# D&D Combat Tracker

A mobile-responsive React application built with Vite for tracking D&D combat encounters. Use it on any device—phone, tablet, or desktop.

## Features

- ✅ **Initiative Tracking** - Sort combatants by initiative and manage turn order
- ✅ **HP Management** - Track current and max HP for each combatant
- ✅ **Player vs Monster** - Visual distinction (blue for players, red for monsters)
- ✅ **Mobile Responsive** - Works perfectly on phones, tablets, and desktops
- ✅ **No Backend Required** - All data stored locally in your browser
- ✅ **Lightning Fast** - Instant load times and smooth interactions

## Quick Start

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

### Production Build

```bash
npm run build
npm run preview
```

## Deploy to Web

The app can be deployed to any static hosting service in seconds. See [DEPLOYMENT.md](DEPLOYMENT.md) for options:

- **Vercel** - One-click deployment (recommended)
- **Netlify** - Easy setup with drag-and-drop
- **GitHub Pages** - Free hosting with GitHub
- **Docker** - Run anywhere with containerization

## How to Use

1. **Add Combatants** - Enter name, initiative, max HP, and select if it's a player
2. **Sort by Initiative** - Automatically organize turn order
3. **Manage HP** - Click the HP input to update during combat
4. **Next Turn** - Move to the next combatant
5. **Remove** - Delete combatants as needed

## Technology

- React 18 - UI framework
- Vite 5 - Fast build tool
- CSS Grid & Flexbox - Responsive design

## Browser Support

Works on all modern browsers:
- Chrome/Edge (90+)
- Firefox (88+)
- Safari (14+)
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)