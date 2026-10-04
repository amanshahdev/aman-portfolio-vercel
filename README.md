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
