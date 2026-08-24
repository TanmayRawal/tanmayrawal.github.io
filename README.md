# Tanmay Rawal — Research Portfolio

A research-focused portfolio for ML/AI research teams, AI labs, and startups. Built with React, Vite, TypeScript, Anime.js, and Three.js.

## Run locally

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL shown in the terminal.

## Production checks

```bash
pnpm lint
pnpm build
pnpm preview
```

The optimized static site is generated in `dist/`.

## Deploy to tanmayrawal.github.io

1. Create or open the GitHub repository named `TanmayRawal.github.io`.
2. Copy this project's contents to the repository root and push to `main`.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Push any commit to `main`, or run the **Deploy portfolio to GitHub Pages** workflow manually.

The included workflow builds the Vite site and publishes it to `https://tanmayrawal.github.io/`.

## Content updates

- Portfolio data and page structure: `src/App.tsx`
- Interactive 3D research core: `src/HeroScene.tsx`
- Visual system and responsive layout: `src/styles.css`
- SEO and social metadata: `index.html`
- Social card: `public/og.png`
- Downloadable resume: `public/Tanmay-Rawal-Resume.pdf`
