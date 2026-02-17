# MixGame — Neon Tic Tac Toe (Impossible AI)

A polished browser Tic Tac Toe game where the player (`X`) faces an unbeatable computer (`O`) powered by the minimax algorithm.

## Features
- Impossible AI mode (perfect play via minimax)
- Responsive neon UI (desktop + mobile)
- Smooth hover/turn/result animations
- Animated winning-line highlight
- Subtle click/win/draw sound effects (Web Audio API)
- Restart button and clear game status messaging

## Run locally
Because this is a static site, you can open `index.html` directly or run a tiny local server:

```bash
python3 -m http.server 4173
```

Then open <http://127.0.0.1:4173>.

## GitHub Pages setup
This repository includes `.github/workflows/deploy-pages.yml` which auto-deploys to GitHub Pages when code is pushed to the `main` branch.

### Steps to publish
1. Push this repository to GitHub.
2. Ensure your default branch is `main` (or update the workflow trigger branch).
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. Push a commit to `main`.
5. After the workflow completes, the game will be available at:

`https://<your-github-username>.github.io/<repository-name>/`

For this repository name, the URL format is typically:

`https://<your-github-username>.github.io/MixGame/`

## Project structure
- `index.html` — app markup
- `styles.css` — neon theme, responsive styles, animations
- `script.js` — game state, minimax AI, rendering, interactions, sounds
