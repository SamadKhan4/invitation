# React Wedding Invitation Website

A mobile-first wedding invitation for Upasana and Rutvik, with an animated palace entrance and an ivory-and-gold invitation.

## Run locally

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Open the URL displayed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` directory to Vercel, Netlify, Cloudflare Pages, or static hosting.

## Customize

- `src/config.js`: names, wedding date, location, Google Maps URL, and event program.
- `src/styles.css`: colors, typography, gate placement, responsive layout, and transitions.
- `src/App.jsx`: sections and component interactions.

## Palace entrance

The gate uses one centered image, `public/wedding-gate.webp`. The `PalaceGate` component shows each half in a separate panel. Tapping the **U&R monogram** opens the gate and reveals the invitation over a loop of `hero-silent.mp4`. The **Wedding details** link scrolls to the celebrations. To use new gate artwork, align the door seam at the center and adjust the `.gate-mask` outline and hinge positions in `src/styles.css`.

### Functional features

- Palace gate opening animation and illustrated invitation reveal
- Scroll-triggered section animations (GSAP)
- Canvas scratch-to-reveal heart (touch + mouse)
- Live wedding countdown using the wedding date and timezone
- Ceremony and dinner timeline, venue directions, and an Add to Calendar download
- Guest message form, with `localStorage` persistence on the current device
- Responsive styling for mobile and desktop

### Important production notes

- Gate and stationery artwork are bundled in `public/`. Google Fonts load separately and the site includes fallback fonts.
- **Guest messages are stored ONLY in the current visitor's browser**. To receive guest wishes centrally, connect the form to Supabase, Firebase, your own backend API, or a form service before going live. The current code does not send submissions to the couple.
- The reel doesn't provide the site's original source, fonts, or artwork; this is a close functional recreation, **not an exact asset-for-asset clone**.
- No music is included because the source reel does not grant playback rights.
