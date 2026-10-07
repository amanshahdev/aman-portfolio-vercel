# Aman Shah Portfolio

A framework-free portfolio site built with HTML, CSS, and vanilla JavaScript. It
does not require a build step or server-side runtime.

## Deploy to Vercel

### From the Vercel dashboard

1. Import this repository from GitHub.
2. Leave the framework preset as **Other**.
3. Leave the build command blank.
4. Leave the output directory blank.
5. Click **Deploy**.

The checked-in [`vercel.json`](./vercel.json) configures clean URLs, cache
headers, and basic browser security headers. All assets are served directly
from the repository.

### With the Vercel CLI

```bash
npx vercel
```

The CLI will detect the static site automatically. To publish a production
deployment:

```bash
npx vercel --prod
```

No environment variables are required.

## Responsive scaling (Oct 2026)

- All lengths in `css/styles.css` are in `rem`. Up to 1500px wide, 1rem = 16px.
- From 1500px up, the root font size grows with the window (`1.0667vw`, capped at 28px), so large monitors show the same layout as laptops, just larger — identical in Firefox, Brave and Chrome, whatever the browser zoom.
- Tablet rules cover 761–1100px (projects/about stack at ≤900px); phone rules cover ≤760px.
- Resume PDF: `/public/resume/*` is served with `max-age=0, must-revalidate`, and the links carry `?v=` — bump that value in `index.html` whenever you replace the PDF.
