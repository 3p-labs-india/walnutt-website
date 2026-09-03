# walnutt.co

Marketing site for [Walnutt](https://walnutt.co) — a Vite + React single-page app
deployed to GitHub Pages.

## Pages

| Route | Content |
| --- | --- |
| `/`, `/companies` | For Companies |
| `/engineers` | For Engineers |
| `/privacy`, `/terms` | Legal |

## Running

```sh
pnpm install
pnpm dev          # dev server
pnpm typecheck    # tsc --noEmit
pnpm build        # production build into dist/
pnpm preview      # serve the built dist/
```

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which typechecks, builds and
publishes `dist/` to GitHub Pages. The custom domain comes from `public/CNAME`.

Because Pages has no SPA rewrite, deep links are handled by `public/404.html`, which
stashes the path in `sessionStorage` for the inline restore script in `index.html`.
