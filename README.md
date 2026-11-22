# reqsery.github.io

Documentation site for [MC Mod Porter](https://github.com/reqsery/mc-mod-porter) and Voice Parties, built with
[Astro](https://astro.build) + [Starlight](https://starlight.astro.build) (with Pagefind search).
Live at **https://reqsery.github.io**.

## Develop

```powershell
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs ./dist
npm run preview    # serve ./dist
```

Pages live in `src/content/docs/`. The sidebar is defined in `astro.config.mjs`.

`src/content/docs/learned-faq.md` (Community FAQ & Known Issues) is maintained by DevHub Bot: staff-approved answers
are committed here automatically. Edit it by hand only with care and keep each entry's `<!-- kb-entry ... -->` marker.

## Deploy

`.github/workflows/deploy.yml` builds and deploys `./dist` to GitHub Pages on every push to `main`.
In the repository settings, set **Pages → Source** to **GitHub Actions**.
