# Website audit and independent update

Baseline: `560e6bc5fed819eb66a11cb2fc2242550041b72a` in `joshmas90/njbugninja`.

Evidence: current HTML/CSS/JavaScript, existing brand assets, configured service rules, SEO checks, and simulated DOM interaction tests. The browser could not access the local preview; desktop/mobile visual and print checks remain required.

| Section / feature | Stronger starting point | Decision |
| --- | --- | --- |
| Brand introduction and service storytelling | Website | Preserve the web hero and editorial sections; adapt its clearer service explanation to native app cards. |
| Quick customer actions | App | Preserve native tabs/actions; provide Call and Quote together in the website's mobile action bar. |
| Quote handling | App | Preserve one in-app MessageUI sheet; bring required contact validation and contextual service selection to the website, with truthful browser handoff/copy states. |
| Coverage checking | App | Keep its optional location check; add a manual county/ZIP check on the website using the existing configured territory. |
| Before/after-service guidance | App | Make its guide easier to find in the app and create a separate printable/checkable web guide. |
| Public discovery, link sharing and service depth | Website | Retain crawlable HTML, metadata and internal links; give app customers that depth through native detail screens. |
| Local appointments and reminders | App | Retain on-device appointments/notifications as native features. A browser appointment system would require a separate product/backend decision. |

## What was strongest on the website

Its illustrated brand introduction, alternating dark/paper sections, property-specific service explanations, three-step process and crawlable service pages give a first-time customer more context than the app's former service-link list. That editorial structure and artwork are preserved.

## What this website update improves

1. New service-prep.html provides an independently authored before/after-service guide. Customers can check items temporarily and print the guide. It is linked from the process section, service pages, FAQs and footer.
2. The service-area page now checks the customer's selected New Jersey county and optional ZIP against this site's existing rules. It handles loading, covered/confirm/outside outcomes, ZIP exceptions, failures and stale responses. Results do not guarantee an appointment. Changing the input clears the previous result.
3. The quote form now validates name, complete phone and town/ZIP, supports autofill, and carries service choices from service-page CTAs. A ZIP from the coverage check can prefill the location; a county alone still asks for a town/ZIP.
4. An explicit Copy request option supports computers, with selectable-text recovery when clipboard access fails. Browser feedback says a request is prepared/copied; it never claims a message was sent or delivered.
5. The mobile contact bar offers Call and Quote together.
6. Removed a JavaScript request for the deleted V22 stylesheet. Added metadata and sitemap entry for the new guide; updated privacy copy to match actual browser behavior.

## Identity and separation

The website remains a static HTML/CSS/JavaScript project in its own repository and Hostinger deployment. Its hero, visual assets, editorial sections and service pages remain. It imports no Swift, app source or shared UI/build package. No backend, SMS provider, lead database, location permission, tracking pixel or website appointment system was added. The website's existing county/ZIP configuration contents were preserved.

## Checks and release limits

- All 9 HTML pages and 8 indexable sitemap URLs passed metadata, JSON-LD, internal link and asset checks.
- JavaScript syntax and whitespace checks passed.
- Five Node test groups cover actual county outcomes, ZIP override precedence, malformed rules and quote text encoding/service labels.
- Simulated DOM flows cover invalid/valid quotes, preselection, clipboard fallback, covered/confirm/outside results, network failure, stale-response suppression, checklist updates, print action and script initialization on every page.
- No customer messages were sent during testing.
- Real desktop/mobile browser rendering, mobile SMS handoff and print output still need checking. The public deployment was not changed during this audit.

## Upload from an extracted folder

Run `SHIP-TO-GITHUB.cmd` inside a fresh extraction. It establishes this package's baseline, commits the update, rebases onto current GitHub main and pushes to the WEBSITE repository. It stops on errors and does not force-push. If the folder already has Git metadata, it stops so an existing checkout cannot be reset accidentally. The existing Hostinger Git deployment then handles publication when enabled.
