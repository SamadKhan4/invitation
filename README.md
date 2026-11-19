# React Wedding Invitation Website

A complete mobile-first wedding invitation experience inspired by the user-supplied Instagram reel.

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

- `src/config.js`: names, wedding date, location, Google Maps URL, event program, images, contact email.
- `src/styles.css`: colors, fonts, envelope styling, responsive layout, and transitions.
- `src/App.jsx`: sections and component interactions.

### Functional features

- Clickable wax-seal envelope with opening animation
- Royal blue invitation reveal
- Illustrated palace cover and scroll-triggered section animations (GSAP)
- Canvas scratch-to-reveal heart (touch + mouse)
- Live wedding countdown using the wedding date and timezone
- Program timeline, venue with working Google Maps link, dress code, accommodation contact
- Guest message form, with `localStorage` persistence on the current device
- Responsive styling for mobile and desktop

### Important production notes

- Wedding details and photos in `src/config.js` are examples; replace with real content and licensed assets.
- The palace and ceremony-flower artwork are bundled in `public/`. Google Fonts load separately and the site includes fallback fonts.
- **Guest messages are stored ONLY in the current visitor's browser**. To receive guest wishes centrally, connect the form to Supabase, Firebase, your own backend API, or a form service before going live. The current code does not send submissions to the couple.
- The reel doesn't provide the site's original source, fonts, or artwork; this is a close functional recreation, **not an exact asset-for-asset clone**.
- No music is included because the source reel does not grant playback rights.
