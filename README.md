# Aman Shah — Portfolio

Personal portfolio website for Aman Shah, a software developer focused on
AI-powered applications, full-stack products, and useful digital experiences.

The site presents selected projects, technical skills, professional experience,
certifications, contact links, and an interactive resume preview in a bold,
editorial-inspired interface.

## Highlights

- Responsive design for desktop, tablet, and mobile
- Scroll-triggered animations powered by GSAP and ScrollTrigger
- Reduced-motion support for accessible browsing
- Interactive navigation with scroll progress
- Custom cursor interactions on pointer devices
- Project showcase with GitHub and live demo links
- Certification verification links
- Styled resume preview with PDF download
- Framework-free HTML, CSS, and vanilla JavaScript

## Tech

- HTML5
- CSS3
- Vanilla JavaScript
- GSAP
- ScrollTrigger
- Google Fonts-compatible local font assets
- Vercel

## Project structure

```text
.
├── index.html          # Portfolio page and resume preview markup
├── css/
│   └── styles.css      # Design system, layout, responsive styles, animations
├── js/
│   └── main.js         # Interactions, navigation, project rendering, animations
├── public/
│   ├── fonts/          # Local font files
│   ├── resume/         # Resume PDF
│   └── *.png, *.jpg    # Logos, certificates, and other visual assets
└── vercel.json         # Deployment and security configuration
```

## Run locally

This is a static website and does not require a build step or runtime
dependency installation.

Open `index.html` directly in a browser, or serve the project with any static
file server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Deploy

The project is configured for Vercel. Import the repository into Vercel with:

- Framework preset: **Other**
- Build command: leave blank
- Output directory: leave blank

The checked-in [`vercel.json`](./vercel.json) configures clean URLs, cache
headers, and basic browser security headers.

To deploy with the Vercel CLI:

```bash
npx vercel
npx vercel --prod
```

## Resume updates

The resume is served from `public/resume/`. When replacing the PDF, update the
version query parameter on the resume links in `index.html` so browsers fetch
the latest file.

## Connect

- Website: [aman-shah.com.np](https://aman-shah.com.np)
- GitHub: [@amanshahdev](https://github.com/amanshahdev)
- LinkedIn: [aman-shah-dev](https://www.linkedin.com/in/amanshah-dev)
- Email: [amanshah.dev@gmail.com](mailto:amanshah.dev@gmail.com)
