# Studio Tiny Tuko — Operating Summary & Architecture

## Default Architecture
- **Type**: Single-Page Interactive "Show Bible & Production Hub" Prototype.
- **Stack**: HTML5, Tailwind CSS (via CDN with custom palette extension), Vanilla JavaScript.
- **Assets**: 18 pre-production Instagram vis-dev artworks in `./Assets/`, upscaled 2x via deterministic Lanczos + unsharp mask into `./Assets/upscaled/`.
- **Key Modules**:
  1. Sticky Minimalist Header with Woven Ribbon Accent
  2. Hero Stage (Logline, Mission, Debut Series Hook)
  3. Interactive Character Lineups & Show Bible Tabs (Tama, Kiko, Lola Rinda, Mister Okrasio, Duwende)
  4. Sketchbook & Worldbuilding Wall (cloudyning & mikkusushi vis-dev)
  5. Studio Ethos & 4-Stage Production Roadmap (100% Human 2D, Zero AI, Casting & Composer calls)
  6. Accessible `<dialog>` Lightbox Modal (Modern Web Guidance compliant: keyboard nav, light dismiss, `overscroll-behavior: contain`)
  7. Footer & Community Hub (The Tuko Tree Discord, Instagram, Carrd)

## First Milestone
- Deliver a production-ready, zero-friction `index.html` that the user and client can double-click and open immediately in any browser with zero broken links, crisp Retina imagery, and responsive layouts.

## Key Guardrails & Negative Constraints
- **NO `//` title headers** (e.g., no `// 01. Characters` or code comments in headings).
- **NO pills and NO blinking dots** (no rounded-full badges with pulsing green dots).
- **NO heavy jargon or wall-of-text** — let design, whitespace, typography, and authentic hand-drawn art speak.
- **100% Human 2D Animation / Zero Generative AI** messaging front and center.
- **Never stretch images beyond crisp bounds** (`object-contain`, `max-w-md`/`max-w-lg`).
- **Signature Filipino Woven Ribbon** implemented as scalable, crisp inline SVG dividers.

## Runtime Constraints
- Windows OS, local static file serving, offline/browser direct execution.


## Deployment & Repository
- GitHub: https://github.com/Nyx-abu/studio-tiny-tuko
- Vercel Production: https://studio-tiny-tuko.vercel.app
