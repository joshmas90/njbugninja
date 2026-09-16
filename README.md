# Mosquito Ninja — NJ Bug Ninja

Static website for https://njbugninja.com, deployed from the `main` branch to Hostinger. No build step is required.

## V33.3 premium contact and spring invitation

- Refines the header phone link into a dark, icon-led contact control with restrained red detailing while preserving the direct telephone link on every page.
- Integrates the Spring 2027 invitation into the homepage copy column so the seasonal message no longer interrupts the hero artwork.
- Keeps the language tied to the existing quote request flow and includes desktop, tablet, narrow-phone, reduced-motion and print treatments.

## V33 premium video-audit pass

- Makes the homepage service-area promise fully legible against the dark green section.
- Keeps content visible throughout subtle scroll effects; reading columns and form controls remain stationary.
- Replaces the illustrated footer treatment with the cleaner throwing-star and `MOSQUITO NINJA / BITE BACK!` lockup already used by the launch experience.
- Restores single-column interior and coverage layouts through 980px, shortens interior heroes and section spacing, and establishes the missing product-heading scale.
- Uses native FAQ disclosures with preserved answers and deep links; printing temporarily opens every answer and restores the prior state afterward.
- Closes the mobile menu on outside clicks and breakpoint changes, preserves Escape-to-close, and bounds its height on short screens.
- Loads the V33.1 stylesheet and runtime cache keys on all nine HTML pages. Footer branding uses real images with intrinsic dimensions.

Verification: existing SEO/link checks and eleven quote/coverage/download tests pass. A loaded-stylesheet cascade audit passed at 320, 375, 390, 430, 640, 768, 980, 981, 1280 and 1440px. CSS and JavaScript syntax checks pass, and FAQ answer text is preserved. These are source-level checks; browser rendering is still required because the connected browser could not open the local preview. Before release, check phone/tablet/desktop scrolling, menu dismissal, FAQ keyboard/deep-link/print behavior and the existing quote success/error flow in a preview environment.

## Coverage download recovery

- The live Camden / 08004 check returned the correct core-coverage result during diagnosis. The deployed rules and JavaScript matched this repository; the earlier reported failure was not reproduced in that live test.
- Rules downloads now retry once after a network, HTTP, timeout or JSON-response failure. Each attempt gets its own eight-second timeout; changing county or ZIP cancels the active request and prevents another attempt.
- A persistent failure keeps the selected county and ZIP in the quote link and explains that the rules could not be loaded. Loading clears any previous result color. Coverage still requires a valid response; there is no guessed or cached coverage fallback.
- All pages reference `website-tools.js?v=25.1.0`. Six download-recovery tests supplement the existing five quote/coverage tests. The recovery changes require deployment before they affect the live checker.

## September 2026 SEO update

- Unique titles, descriptions and self-referencing canonical URLs for all seven public content pages.
- South Jersey service content for mosquito control, tick control, commercial properties, coverage and FAQs, with contextual internal links.
- Organization, WebSite and WebPage JSON-LD, plus Service and BreadcrumbList entities where applicable. The business name is Mosquito Ninja, with NJ Bug Ninja as its alternate name. The public phone is 609-313-6317.
- Service coverage remains South Jersey, New Jersey, subject to confirmation of the individual route. Do not add unconfirmed towns, hours, addresses, reviews, credentials or service guarantees.
- Organization and Service markup describe the business without inventing a physical address. No eligibility for address-dependent LocalBusiness rich results or Google FAQ rich results is claimed.
- Sitemap contains the seven canonical content URLs and actual modification dates. The branded error page is noindex and excluded.
- Hostinger `.htaccess` rules permanently redirect `www` and explicitly requested `/index.html` to the canonical origin. Existing hosting settings continue to handle HTTP-to-HTTPS. Missing URLs retain HTTP 404 and use the branded error document.
- Font discovery moved from a CSS import into the HTML head. The existing full-resolution hero is preloaded; the backyard and V15 map images have explicit dimensions and lazy loading. Image files and the homepage hero design are preserved.

## Validate and deploy

Run `python3 scripts/check-seo.py` and `git diff --check`. Deploy the repository root, including `.htaccess`, after pushing `main`. If automatic deployment is disabled, deploy the latest commit through the existing Hostinger Git deployment.

After deployment, check the homepage and all sitemap pages, the stylesheet, `/robots.txt` and `/sitemap.xml`. Confirm that `https://www.njbugninja.com/` and `/index.html` redirect to `https://njbugninja.com/`, service paths retain their paths and query strings, and a nonexistent URL returns HTTP 404 with the branded error page. A plain Python preview server does not process `.htaccess`.

## Search visibility outside the code

After deployment, use the domain's verified Google Search Console property to submit `https://njbugninja.com/sitemap.xml` and inspect the homepage and service URLs. No Search Console verification token or submission is included in this repository. A sitemap helps discovery but does not guarantee indexing or rankings.

Manage an actual Google Business Profile using the confirmed business details and service area. No profile, review, address, opening hours or verification status has been invented by this update.

Google references: [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), and [structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## V24 production repair
- Repaired text encoding corruption on every HTML page.
- Converted smart apostrophes, arrows, and copyright symbols to HTML entities for deployment safety.
- Added an explicit UTF-8 server charset fallback.
- Consolidated the accessibility/premium overrides into `mosquito-ninja-v24-refined.css`.
- Fixed all inline SVG icons so they render as restrained red/green line icons rather than black fills.
- Removed the malformed V22/V23 experimental override files.

## Independent website strengths update

- Preserves the website hero, red/green brand, paper sections, service pages, SEO structure and static Hostinger deployment.
- Adds an independently authored, printable before/after-service checklist at `/service-prep.html`, linked from the homepage process, FAQs, service pages and footer. Checkmarks are temporary.
- Adds a manual county/optional ZIP checker against this site's existing `service-area-config.json`, with current-rule loading, overrides, error/retry and direct quote continuation. No geolocation permission is requested.
- Strengthens required contact fields, phone validation, service preselection and truthful text-handoff feedback. Explicit Copy request works on computers; a selectable-text fallback remains when clipboard access fails.
- Mobile quick actions make Call and Quote available together.
- Removes the runtime request for the deleted V22 stylesheet.

This website does not import any app source, Swift, shared UI package or app build artifacts. Its HTML, CSS and JavaScript remain owned and deployed by this repository. Native iOS message composition and appointment notifications remain app-specific. No form backend, SMS vendor or lead database has been added.

## V28 launch treatment

- Reworked the one-per-tab website launch treatment around the throwing-star mark.
- Removed the oversized duplicate red slash and the visible square image canvas.
- Added a restrained halo, target orbit and animated slash precisely aligned to the diagonal inside the mosquito symbol while reducing the total overlay time.
- Kept the mark at a sharper display size and added phone and landscape safeguards plus reduced-motion behavior.
- Synchronized the JavaScript cache version across every public page and the branded 404 page.

Verification: `python3 scripts/check-seo.py`, `node --check website-tools.js`, `node --check mosquito-ninja-v12.js`, `node --test scripts/test-website-tools.cjs`, and `git diff --check`. Automated interaction checks were performed in a simulated DOM; real browser/mobile/print layout checks are still required because the connected browser could not open the local preview.

## V29 video-audit premium pass

- Enlarges the launch mark from a 218px desktop maximum to 370px (about 70% larger), with phone and landscape constraints that preserve the same impact on smaller screens.
- Rebuilds the one-per-tab opening as a staged mark arrival, orbit, pulse, correctly registered in-logo slash, wordmark and tagline reveal. Reduced-motion visitors receive a short static treatment.
- Carries the homepage hero's visual authority through the rest of the experience with branded interior-page hero atmosphere, stronger editorial chapter hierarchy and more deliberate light/dark transitions.
- Elevates service cards, process steps, benefits, FAQs, the quote form, coverage checker, preparation checklist, calls to action and footer feedback without changing factual service claims or SEO content.
- Adds progressive IntersectionObserver reveals. Content remains visible if JavaScript is unavailable, and motion is disabled when the operating system requests reduced motion.
- Loads the final refinement layer and V29 JavaScript cache key on all public pages and the branded 404 page.

## V30 supplied brand lockup

- Replaces the splash's typed company name and former tagline with the exact metallic `MOSQUITO NINJA` and red `BITE BACK!` artwork supplied for the brand.
- Uses a tightly cropped, 20 KB WebP derivative rather than loading the 2.4 MB square source image during launch.
- Reveals the lockup with a centered cinematic wipe after the throwing-star impact and aligned slash animation.
- Bumps the one-per-tab storage key and JavaScript cache version so the revised treatment is shown after deployment.

## V31 transparent brand assets

- Replaces the dark-canvas throwing-star artwork with a high-resolution alpha-transparent WebP for the splash, header and interior-page watermark.
- Replaces the splash name and `BITE BACK!` treatment with a separate alpha-transparent lockup, eliminating the rectangular background behind the lettering.
- Realigns the animated slash to the transparent mark's measured diagonal and bumps the one-per-tab and page cache versions.
