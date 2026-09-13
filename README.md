# Mosquito Ninja — njbugninja.com

Static site. Hostinger deploys the `main` branch root to `public_html`.
Replace the repository contents with this folder and push.

## Files
- `index.html` — homepage
- `mosquito-control.html`, `tick-control.html`, `commercial.html`
- `service-area.html`, `faq.html`, `privacy.html`, `404.html`
- `styles.css`, `script.js`
- `robots.txt`, `sitemap.xml`, `site.webmanifest`
- `assets/` — `mark.svg` (brand seal), `favicon.svg`, `og-card.png`

## Design
- Type: Newsreader (display) and Figtree (text), loaded from Google Fonts.
- Palette: evening-garden ink `#0C1410`, pale sage paper `#EDEFEA`, brand red `#C4261D`,
  moss `#5E7A5A`, dusk amber `#D9A066` (horizon glow only).
- All artwork is inline SVG, so there is nothing to license or replace.
  If you later add photography, the two service panels on the homepage
  (`.service figure`) and the page heroes are the natural places for it.

## Content rules
Do not publish unverified licensing, insurance, product-safety, efficacy,
guarantee or service-area claims. Add exact licensing/disclosure language
only after it is confirmed. Add towns to `service-area.html` only when they
are actually on the route. When you have a NJ DEP pesticide applicator
business registration number to show, the footer and `privacy.html` are
the places for it.

## Quote form and ZIP check
Both run entirely in the browser. The quote form builds an `sms:` link to
609-313-6317 and opens the visitor's messaging app; the ZIP check pre-fills
the form. Nothing is posted to a server. If you add a server-side or
third-party form later, update `privacy.html` first.

## Editing
Header and footer are duplicated in every page between
`<!--#header-->…<!--/header-->` and `<!--#footer-->…<!--/footer-->`.
Change them in `index.html`, then copy to the other pages.
