# D&D Combat Tracker - Deployment Guide

This application is ready to deploy to any static hosting service.

## Quick Deployment Options

### 1. **Vercel** (Recommended - Free tier available)
```bash
npm install -g vercel
vercel
```
- Sign in with GitHub/GitLab/Bitbucket
- Vercel will auto-detect it's a Vite project
- Your app will be live at a Vercel URL in seconds

### 2. **Netlify** (Free tier available)
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```
- Build first: `npm run build`
- Deploy the `dist` folder

### 3. **GitHub Pages** (Free)
1. Add to `vite.config.js`:
```javascript
export default {
  base: '/dnd-combat-tracker/',
}
```
2. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install && npm run build
      - uses: JamesIves/github-pages-deploy-action@4.3.3
        with:
          branch: gh-pages
          folder: dist
```

### 4. **Docker** (For running on any server)
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t dnd-tracker .
docker run -p 80:80 dnd-tracker
```

## Building for Production

```bash
# Build optimized version
npm run build

# Preview production build locally
npm run preview
```

The optimized app is in the `dist/` folder and ready to deploy.

## Features

✅ Fully responsive (mobile, tablet, desktop)
✅ No backend required (runs in browser)
✅ Works offline (cached in browser)
✅ Lightning fast load times
✅ All combatant data stored locally

## Technology

- **React 18** - UI framework
- **Vite 5** - Build tool & dev server
- **CSS3** - Responsive design with Grid & Flexbox

## Sharing with Your Party

Once deployed, share the URL with your party members. Each person will have their own local copy of the data (not synced). If you need real-time sync for multiple users, consider these options:

- **Firebase** - Add real-time database for multiplayer
- **Supabase** - Open-source Firebase alternative
- **Socket.io** + Node.js backend - Custom multiplayer support
