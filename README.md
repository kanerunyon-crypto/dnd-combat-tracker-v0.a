# D&D 5e Combat Tracker

A full-featured web-based D&D combat tracking application with initiative management, HP tracking, condition management, and preset persistence.

## Features

### 🎯 Setup Tab
- **Quick Add Presets** - Add saved character/monster presets with one click
- **Manual Add** - Create combatants on-the-fly with name, HP, initiative
- **Player/NPC/Monster** - Distinguish between party members and enemies
- **Auto-sort** - Combatants automatically sorted by initiative

### ⚔️ Tracker Tab
- **Initiative Display** - Shows current turn, round number, elapsed time
- **Damage Types** - 13 different damage types (Acid, Fire, Cold, Necrotic, etc.)
- **Quick Damage Buttons** - 1, 5, 10, 25 damage presets
- **Quick Healing Buttons** - 1, 5, 10, 25 healing presets
- **Temp HP** - Track temporary hit points separately
- **Kill/Full Heal** - One-click actions for instant combat changes
- **12 Condition Toggles** - Apply/remove conditions (Prone, Poisoned, Concentrating, etc.)
- **Next Turn** - Advance initiative order automatically
- **Undo Last** - Revert the last action
- **Combat Summary** - Real-time display of AC, Speed, HP, Temp HP, Status

### 📊 Summary Tab
- **Total Damage Dealt** - Running tally of all damage in combat
- **Action History** - Complete log of all combat actions with round/turn info
- **Condition Tracking** - See all status changes

### 💾 Presets Tab
- **Full Editor** - Create and edit character/monster presets
- **AC/Speed/HP** - Store key stats for quick lookup
- **Stat Blocks** - Store full D&D stat block descriptions
- **Player Flag** - Mark allies vs monsters
- **Auto-Save** - Presets persist in browser storage
- **Import/Export** - JSON format for easy sharing

### 📱 Responsive Design
- Works on phones, tablets, and desktop
- Grid-based layout adapts to screen size
- Mobile-friendly touch controls

### 🌙 Dark Theme
- Professional dark interface throughout
- Easy on the eyes for long sessions
- Color-coded elements for quick parsing

## How to Use

1. **Setup** - Add your party and enemies (use presets or manual)
2. **Adjust Initiative** - Initiative box lets you set default for quick-add
3. **Start Combat** - Click "Start Combat" to begin
4. **Tracker** - Apply damage, healing, conditions as combat progresses
5. **Summary** - Check damage totals and action history anytime

## Technology

- **React 18** - UI framework
- **Vite 5** - Fast build tool
- **LocalStorage** - Preset persistence
- **CSS Grid/Flexbox** - Responsive layout

## Deployment

The app is deployed on **Vercel** and accessible at:
```
https://dnd-combat-tracker-v0-a.vercel.app
```

No installation required - just open the link and start tracking combat!

## Local Development

```bash
npm install
npm run dev
```

## Browser Support

- Chrome/Edge (90+)
- Firefox (88+)
- Safari (14+)
- Mobile browsers (iOS Safari, Chrome Mobile)