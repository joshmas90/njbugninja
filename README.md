# Mosquito Ninja — NJ Bug Ninja

Static website for https://njbugninja.com, deployed from the `main` branch to Hostinger. No build step is required.

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

Verification: `python3 scripts/check-seo.py`, `node --check website-tools.js`, `node --check mosquito-ninja-v12.js`, `node --test scripts/test-website-tools.cjs`, and `git diff --check`. Automated interaction checks were performed in a simulated DOM; real browser/mobile/print layout checks are still required because the connected browser could not open the local preview.
