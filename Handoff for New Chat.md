# JBDApps Website Handoff

Updated: 2026-07-18

## New Chat Rule

Read this file before making website, domain, GitHub Pages, Cloudflare DNS, support email, privacy policy, or App Store URL changes for the JBDApps website.

## Project State

- Project path: `/Users/briscoe/Documents/MacApps/JBDApps-Website`
- GitHub repo: `https://github.com/wch1zpnk/JBDApps-Website`
- Branch: `main`
- Latest pushed functional site commit before this handoff refresh: `e99c45b Feature Voice Command Atlas App Store listing`
- Current handoff refresh: updated after publishing and live-verifying the Voice Command Atlas App Store links, homepage button alignment, and purple card treatment.
- Website goal: static independent developer/support site for App Store support URLs, privacy policy, contact, and app listings.
- Public domain: `JBDApps.com`
- Hosting target: GitHub Pages from `main` branch root.
- DNS/registrar target: Cloudflare Registrar and Cloudflare DNS.
- Public support address planned for the site: `support@JBDApps.com`

## Current Implementation

- Static pages created:
  - `/`
  - `/apps/`
  - `/apps/everything-clipboard/`
  - `/apps/voice-command-atlas/`
  - `/other-tools/`
  - `/support/`
  - `/contact/`
  - `/privacy/`
  - `/terms/`
- Shared assets:
  - `assets/css/styles.css`
  - `assets/js/main.js`
  - `assets/images/app-icon-placeholder.svg`
  - `assets/images/everything-clipboard-icon.png`
  - `assets/images/voice-command-atlas-icon.png`
  - `assets/images/voice-command-atlas/1.png` through `10.png`
  - `assets/images/favicon.png`
  - website polish additions: `assets/images/apple-touch-icon.png`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, and `404.html`
- `CNAME` contains `JBDApps.com`.
- `README.md` documents local run, deployment, DNS setup, support email routing, privacy updates, and App Store URL checklist.
- The Apps page names `Everything Clipboard` as the first real app with a View Details link to `/apps/everything-clipboard/` and a Mac App Store button pointing to `https://apps.apple.com/us/app/everything-clipboard/id6784394264?mt=12`.
- The Apps page lists `Voice Command Atlas` with a View Details link to `/apps/voice-command-atlas/` and an active Mac App Store button pointing to `https://apps.apple.com/us/app/voice-command-atlas/id6789797051?mt=12`.
- `/apps/voice-command-atlas/` is the dedicated Voice Command Atlas product page. Its public carousel uses screenshots `1` through `6`, then `9` and `10`, in that order. Screenshots `7` and `8` were removed from the public carousel because they visibly described the rejected direct-preference and Voice Control restart workflow. The page uses the same compact, contained carousel and lightbox interaction as Everything Clipboard.
- Carousel slide metadata is now page-local JSON inside each product page. Shared behavior remains in `assets/js/main.js`, allowing each product page to supply its own ordered images, alt text, and captions without changing the JavaScript again.
- `/apps/everything-clipboard/` is the dedicated public product page for Everything Clipboard. It uses the raw screenshot captures from `/Users/briscoe/Documents/Jimz Clipboard Manager/MAS_Version/App Store Assets 2026-06-27 Sequoia Night/Raw Captures/`, the prepared App Store description text, feature bullets, privacy/control notes, and support/privacy links. The screenshot area uses the compact `16 / 5` carousel height, auto-cycles, stops advancing while hovered or focused, supports previous/next and dot navigation, scales screenshots inside the preview frame with `object-fit: contain`, and opens the current screenshot larger in an overlay. During the local-only polish review, the carousel was explicitly restored to this compact scaled-image presentation after the user rejected any change to its visual behavior.
- App-specific FAQs belong on each app's product page, not on the general `/support/` page. The Everything Clipboard FAQ now lives on `/apps/everything-clipboard/` with three FAQ items: privacy information, Mac App Store link availability, and optional Accessibility permission for Direct Paste.
- The homepage is now a general JBDApps front door rather than a plain support entry. It uses a full-bleed screenshot hero with the `JBDApps` H1, immediate links for `Everything Clipboard` and `Voice Command Atlas`, a two-app visual showcase, and concise support/privacy/AppleScript route cards. Keep the bulk of app-specific marketing/detail content on the dedicated app pages.
- The homepage app showcase anchors both action rows to the bottom of equal-height cards so the two View Details and Mac App Store button pairs align. The Voice Command Atlas card uses a purple-tinted background and border while the Everything Clipboard card keeps the existing green-gray surface.
- The primary navigation now includes `Other Tools` between `Apps` and `Support`; its first dropdown item is `AppleScript`, which links to `/other-tools/`.
- `.nojekyll` is present so GitHub Pages serves the static files directly.

## Current Deployment State

- GitHub Pages deployment completed successfully on 2026-07-18 for commit `e99c45b Feature Voice Command Atlas App Store listing`; run `29665066460` (`pages build and deployment`) finished with `success`. The run had the existing non-blocking Node.js 20 deprecation annotation.
- GitHub Pages source is configured as `main` branch root.
- GitHub Pages custom domain is configured as `jbdapps.com` in the GitHub API.
- GitHub Pages deployment completed successfully on 2026-07-16 for commit `6238e2a Correct Voice Command Atlas App Store wording`; run `29543748232` (`pages build and deployment`) finished with `success`. The run had the existing non-blocking Node.js 20 deprecation annotation.
- GitHub Pages deployment completed successfully on 2026-07-13 for commit `c3a9783 Redesign homepage`; run `29246907066` (`pages build and deployment`) finished with `success`. The run had the same non-blocking Node.js 20 deprecation annotation seen on prior Pages runs.
- Use `gh run list --repo wch1zpnk/JBDApps-Website --limit 3` to confirm the latest Pages deployment after any new commit.
- GitHub Pages deployment for commit `902cdca` completed successfully on 2026-07-01 as run `28543467350` (`pages build and deployment`; build 8s, deploy 29s). The run had a non-blocking Node.js 20 deprecation annotation from GitHub Actions, but completed with `success`.
- GitHub Pages API reported status `built`, `html_url=http://jbdapps.com/`, `https_enforced=false` on 2026-06-29 after the latest retry; GitHub still has not issued its own custom-domain certificate.
- `https://wch1zpnk.github.io/JBDApps-Website/` currently redirects to `http://jbdapps.com/` because the custom domain is configured.
- `JBDApps.com` is registered in Cloudflare Registrar. Registrar status was `Active`; expiration date was shown as June 28, 2027; auto-renewal was scheduled for May 29, 2027.
- Cloudflare DNS is authoritative. Public apex A/AAAA records now resolve to Cloudflare edge IPs, while `www.jbdapps.com` remains a CNAME to `wch1zpnk.github.io`.
- Cloudflare SSL/TLS mode is `Full`.
- Cloudflare Universal SSL is active for `jbdapps.com` and `*.jbdapps.com`; the live certificate is issued by Google Trust Services (`CN=jbdapps.com`, SAN `jbdapps.com`, `*.jbdapps.com`, expires 2026-09-26).
- Cloudflare `Always Use HTTPS` is enabled.
- HTTPS is live through Cloudflare:
  - `https://jbdapps.com/` returns `HTTP/2 200`.
  - `https://jbdapps.com/support/` returns `HTTP/2 200`.
  - `https://jbdapps.com/privacy/` returns `HTTP/2 200`.
  - `https://jbdapps.com/apps/` returns `HTTP/2 200`.
  - `https://www.jbdapps.com/` returns `HTTP/2 301` to `https://jbdapps.com/`.
- HTTP now redirects to HTTPS:
  - `http://jbdapps.com/` returns `301 Moved Permanently` to `https://jbdapps.com/`.
  - `http://www.jbdapps.com/` returns `301 Moved Permanently` to `https://www.jbdapps.com/`.
- Everything Clipboard App Store Connect can now use:
  - Support URL: `https://jbdapps.com/support/`
  - Privacy Policy URL: `https://jbdapps.com/privacy/`
  - Preferred Marketing URL: `https://jbdapps.com/apps/everything-clipboard/`
  - General app-listing URL: `https://jbdapps.com/apps/`
- Cloudflare Email Routing is configured:
  - Destination address `wch1zpink@gmail.com` was added and Cloudflare marked it `Verified`.
  - Routing rule `support@jbdapps.com -> wch1zpink@gmail.com` was created and Cloudflare marked it `Active`.
  - Email DNS records are present in Cloudflare DNS and public DNS: MX, SPF TXT, DKIM TXT, and DMARC TXT.

## Verification Completed

- 2026-07-18 Voice Command Atlas App Store and homepage card update completed:
  - In-app browser tab 3 supplied the verified listing URL `https://apps.apple.com/us/app/voice-command-atlas/id6789797051?mt=12`.
  - The homepage Voice Command Atlas Support button became a Mac App Store button, the hero status became `Available on the Mac App Store`, and the Atlas card received a purple-tinted surface.
  - Homepage card layout now pins both action rows to the bottom. Local and public browser measurements showed identical action coordinates for Everything Clipboard and Voice Command Atlas.
  - `/apps/` replaced the Atlas `In development` pill with an active `Mac App Store` button and changed Availability to `Mac App Store`.
  - `/apps/voice-command-atlas/` now includes a Mac App Store download button, a live availability status, and an updated FAQ link. No stale `Preparing for release` or `Not yet` copy remains in public source.
  - `git diff --check`, `node --check assets/js/main.js`, and `xmllint --noout sitemap.xml` passed before publication.
  - GitHub Pages run `29665066460` completed successfully for functional commit `e99c45b`; the only annotation was the existing non-blocking Node.js 20 deprecation note.
  - Live cache-busted in-app-browser verification confirmed the new stylesheet token, exact Apple URL, aligned homepage actions, purple Atlas colors, zero horizontal overflow, zero failed images, and zero console warnings/errors across `/`, `/apps/`, and `/apps/voice-command-atlas/`.

- 2026-07-16 Voice Command Atlas App Store wording correction completed:
  - Commit `6238e2a Correct Voice Command Atlas App Store wording` changed the homepage, Apps listing, Voice Command Atlas product page, and JBDApps privacy policy from direct local-preference wording to the Mac App Store selected-export/re-import workflow.
  - The product FAQ and privacy policy now state that the Mac App Store version reads only the `.voicecontrolcommands` export selected through the standard Open dialog, uses an app-scoped security bookmark, and does not read another app's preferences or restart system processes.
  - Removed screenshots `7` and `8` from the public product carousel because their visible old setup/reload details did not match corrected build `1.0.1`; the live carousel now has eight slides and eight matching controls.
  - `git diff --check`, `node --check assets/js/main.js`, `xmllint --noout sitemap.xml`, the ten-page local HTML reference scan, carousel JSON/control validation, stale-copy scan, and private-string scan passed.
  - GitHub Pages run `29543748232` completed successfully; the only annotation was GitHub's non-blocking Node.js 20 deprecation note.
  - Cache-busted public readback returned HTTP `200` for `/`, `/apps/`, `/apps/voice-command-atlas/`, and `/privacy/`, confirmed the new selected-export wording, and found none of the targeted stale direct-file/reload phrases.
  - Live in-app-browser verification confirmed the product page has H1 `Voice Command Atlas`, eight slides, eight controls, four FAQ items, no horizontal overflow, and no console warnings/errors. The JBDApps privacy page contains the Voice Command Atlas section and selected-export wording with no horizontal overflow or console warnings/errors.

- 2026-07-13 homepage redesign deployment completed:
  - Commit `c3a9783 Redesign homepage` replaced the old `Simple app support from JBDApps.` homepage with a full-bleed visual hero, `JBDApps` H1, real Everything Clipboard and Voice Command Atlas screenshot assets, app-status links, two homepage app showcase cards, and support/privacy/AppleScript route cards.
  - The homepage stylesheet URL was cache-busted to `styles.css?v=20260713-home-redesign`.
  - `git diff --check`, `node --check assets/js/main.js`, and `xmllint --noout sitemap.xml` passed.
  - Local HTML reference scan passed across 10 HTML files; all local `href` and `src` references resolved.
  - Local private-string scan across HTML/CSS/JS/XML/JSON found no `/Users/briscoe`, private forwarding email, GitHub token, or secret markers.
  - Local server verification used `python3 -m http.server 8080`; `curl -I --fail --silent http://127.0.0.1:8080/` returned `200 OK`.
  - Local in-app browser verification at `1280 x 900` confirmed H1 `JBDApps`, stylesheet token `20260713-home-redesign`, two hero app links, two homepage app cards, all images loaded, no horizontal overflow, no console warnings/errors, and the next Apps section visible below the hero.
  - Local in-app browser verification at `390 x 844` confirmed no horizontal overflow, all images loaded, the hero app links and next Apps section fit in the first screen, and the mobile menu toggled open with `aria-expanded=true`.
  - GitHub Pages run `29246907066` completed successfully for commit `c3a9783`; the only annotation was the non-blocking GitHub Actions Node.js 20 deprecation note.
  - Public cache-busted readback confirmed `https://jbdapps.com/?deploy=c3a9783` returns `HTTP/2 200`, contains `home-hero`, `JBDApps`, `Everything Clipboard`, `Voice Command Atlas`, `Focused Mac tools with real working surfaces.`, and `styles.css?v=20260713-home-redesign`.
  - Public CSS readback confirmed `https://jbdapps.com/assets/css/styles.css?v=20260713-home-redesign` returns `HTTP/2 200`.
  - Live public in-app browser verification at desktop width confirmed H1 `JBDApps`, the new stylesheet token, both hero app links, both app cards, all images loaded, no horizontal overflow, and zero console warnings/errors.
  - Live public in-app browser verification at `390 x 844` confirmed the same stylesheet token, two hero links, two app cards, all images loaded, no horizontal overflow, zero console warnings/errors, and the mobile menu opened successfully.

- 2026-07-10 Voice Command Atlas deployment completed:
  - Commit `b15912f Add Voice Command Atlas app page` added the Apps-page card, `/apps/voice-command-atlas/`, the app icon, all ten ordered screenshots, sitemap entry, page metadata, feature and privacy copy, and reusable page-local carousel slide data.
  - `git diff --check`, `node --check assets/js/main.js`, and `xmllint --noout sitemap.xml` passed before commit.
  - Local in-app browser verification confirmed the Voice Command Atlas View Details link reached the dedicated page, all ten screenshots loaded, auto-advance and next controls changed slides, the lightbox opened the current slide, desktop and mobile widths had no horizontal overflow, and the console had no errors.
  - Regression verification confirmed the Everything Clipboard carousel still loaded all seven slides, advanced correctly, had no failed images or horizontal overflow, and produced no console errors.
  - GitHub Pages run `29134659252` completed successfully for commit `b15912f`.
  - Public readback confirmed `/apps/` contains the Voice Command Atlas listing and `/apps/voice-command-atlas/` contains ten slide records and `Preparing for release` status.
  - All ten public screenshot URLs returned `200 image/png`.
  - Live in-app browser verification clicked the Voice Command Atlas View Details button, reached `https://jbdapps.com/apps/voice-command-atlas/`, found title `Voice Command Atlas | JBDApps`, H1 `Voice Command Atlas`, ten slides, no failed images, no horizontal overflow, and no console errors.

- Static link/asset checker passed for all six HTML pages.
- Public HTML scan found no private local paths, personal email addresses, or GitHub token strings.
- `CNAME` readback confirmed `JBDApps.com`.
- Extracted app icon is present as `assets/images/everything-clipboard-icon.png`, resized to `512 x 512`, about `294 KB`; `assets/images/favicon.png` is a generated `64 x 64` favicon from the same artwork.
- Local server verification used `python3 -m http.server 8080`.
- In-app browser verification loaded pages from `http://127.0.0.1:8080/`.
- Browser checks confirmed all six pages load, expected H1/title values are present, the app icon loads, no horizontal overflow appears, and console error logs are empty.
- Responsive check at `1280 x 900` confirmed desktop hero/navigation layout without overflow.
- Responsive check at `390 x 844` confirmed no overflow and the mobile menu toggles open with `aria-expanded=true`.
- `git diff --check --cached` passed before the initial commit.
- GitHub Pages build/deploy run completed successfully.
- 2026-06-28 Pages API retry still showed `status=built`, `cname=jbdapps.com`, `https_enforced=false`.
- 2026-06-28 HTTPS enforcement retry command failed with `The certificate does not exist yet`.
- 2026-06-28 later HTTPS status recheck still showed GitHub Pages API `status=built`, `cname=jbdapps.com`, `https_enforced=false`, and HTTPS enforcement still failed with `The certificate does not exist yet`.
- 2026-06-28 documentation push deployed successfully through GitHub Pages run `28316455006`; latest pushed website commit after this pass is `a2ada75 Refresh handoff after App Store URL check`.
- 2026-06-28 HTTP live checks:
  - `http://jbdapps.com/` returned `200 OK`.
  - `http://www.jbdapps.com/` returned `301 Moved Permanently` to `http://jbdapps.com/`.
  - `http://jbdapps.com/support/`, `http://jbdapps.com/privacy/`, and `http://jbdapps.com/apps/` returned `200 OK`.
- 2026-06-28 HTTPS live checks:
  - `https://jbdapps.com/` failed with `curl: (60) SSL: no alternative certificate subject name matches target hostname 'jbdapps.com'`.
  - `https://www.jbdapps.com/` failed with `curl: (60) SSL: no alternative certificate subject name matches target hostname 'www.jbdapps.com'`.
  - `https://jbdapps.com/support/` and `https://jbdapps.com/privacy/` failed with the same certificate mismatch.
- 2026-06-28 in-app browser live check loaded `http://jbdapps.com/`, confirmed title `JBDApps | Independent App Support`, H1 `Simple app support from JBDApps.`, visible support text, and zero console errors.
- Cloudflare checkout confirmed `jbdapps.com` availability at `$10.46`, renewing at `$10.46/year`, before purchase.
- Domain registration completed in Cloudflare Registrar.
- Public DNS verification after setup:
  - Apex A records returned GitHub Pages IPs `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
  - Apex AAAA included `2606:50c0:8000::153`.
  - `www.jbdapps.com` CNAME returned `wch1zpnk.github.io.`
  - MX returned `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, and `route3.mx.cloudflare.net`.
  - SPF returned `v=spf1 include:_spf.mx.cloudflare.net ~all`.
  - DKIM returned the Cloudflare Email Routing `cf2024-1._domainkey` TXT value.
  - DMARC returned `v=DMARC1; p=none`.
- Cloudflare DNS page showed `All set` and `No recommendations` after adding DMARC.
- 2026-06-29 Cloudflare DNS update completed:
  - Added the remaining GitHub Pages apex AAAA records:
    - `2606:50c0:8001::153`
    - `2606:50c0:8002::153`
    - `2606:50c0:8003::153`
  - Cloudflare table showed 15 records and all four apex AAAA records as `DNS only`.
  - Public DNS returned all four GitHub Pages apex A records and all four apex AAAA records.
  - `www.jbdapps.com` still returned CNAME `wch1zpnk.github.io.`
  - Triggered GitHub Pages rebuild; run `28383159157` completed successfully.
  - `gh api repos/wch1zpnk/JBDApps-Website/pages` still returned `status=built`, `cname=jbdapps.com`, `https_enforced=false`.
  - `gh api repos/wch1zpnk/JBDApps-Website/pages/health` returned `{}`.
  - HTTPS enforcement retry still failed with `The certificate does not exist yet`.
  - `http://jbdapps.com/` returned `200 OK`.
  - `https://jbdapps.com/` still failed certificate validation because GitHub served the `*.github.io` certificate.
- 2026-06-29 Cloudflare proxy/SSL fix completed:
  - Set the four apex A records, four apex AAAA records, and `www` CNAME to `Proxied` in Cloudflare.
  - Left email MX/TXT records as `DNS only`.
  - Confirmed Cloudflare SSL/TLS encryption mode is `Full`.
  - Confirmed Cloudflare Edge Certificates show Universal SSL `Active` for `*.jbdapps.com, jbdapps.com`.
  - Enabled Cloudflare `Always Use HTTPS`.
  - Public DNS returned Cloudflare edge A records `104.21.4.179`, `172.67.132.83` and Cloudflare edge AAAA records `2606:4700:3036::ac43:8453`, `2606:4700:3033::6815:4b3`.
  - `openssl s_client -connect jbdapps.com:443 -servername jbdapps.com` showed `subject=CN=jbdapps.com`, issuer `Google Trust Services WE1`, and SANs `DNS:jbdapps.com, DNS:*.jbdapps.com`.
  - `curl -I https://jbdapps.com/` returned `HTTP/2 200`.
  - `curl -I https://jbdapps.com/support/` returned `HTTP/2 200`.
  - `curl -I https://jbdapps.com/privacy/` returned `HTTP/2 200`.
  - `curl -I https://jbdapps.com/apps/` returned `HTTP/2 200`.
  - `curl -I https://www.jbdapps.com/` returned `HTTP/2 301` to `https://jbdapps.com/`.
  - `curl -I http://jbdapps.com/` returned `301 Moved Permanently` to `https://jbdapps.com/`.
  - `curl -I http://www.jbdapps.com/` returned `301 Moved Permanently` to `https://www.jbdapps.com/`.
  - `gh api repos/wch1zpnk/JBDApps-Website/pages` still returned `https_enforced=false`; this is now a GitHub-origin certificate limitation, not a public HTTPS blocker.
- 2026-06-29 Other Tools navigation deployment completed:
  - `git diff --check` passed before commit.
  - Commit `7b1b767 Add other tools navigation` added the top-nav `Other Tools` dropdown, an `AppleScript` menu item, the new `/other-tools/` page, shared dropdown CSS, and the mobile-menu helper update.
  - GitHub Pages run `28398236228` completed successfully.
  - `curl -L --fail --silent https://jbdapps.com/apps/` confirmed `Other Tools`, `/other-tools/`, and `AppleScript` were present in public HTML.
  - `curl -I https://jbdapps.com/other-tools/` returned `HTTP/2 200`.
  - `curl -L --fail --silent https://jbdapps.com/other-tools/` confirmed `AppleScript tools for JBDApps users.` and `Suggest a Script` were present in public HTML.
  - In-app browser public verification loaded `https://jbdapps.com/apps/`, opened the mobile menu, opened the `Other Tools` dropdown, clicked `AppleScript`, and landed on `https://jbdapps.com/other-tools/`.
- 2026-06-29 Other Tools dropdown alignment fix completed:
  - Commit `591bcf6 Fix tools nav alignment` first tightened the dropdown CSS, and commit `206274e Bust stylesheet cache for nav fix` added versioned stylesheet URLs so browsers would not reuse stale CSS.
  - Commit `ffba1a3 Replace tools dropdown trigger` replaced the nav dropdown's `<details>/<summary>` trigger with a normal button because the browser's built-in summary rendering still shifted the label upward when active.
  - Local browser verification measured the desktop `Other Tools` trigger centerline against the `Support` nav link before and after opening; both deltas were `0`.
  - Local mobile verification measured the trigger top before and after opening the submenu; the shift was `0`.
  - GitHub Pages run `28398931647` deployed the final button-based dropdown fix successfully.
  - Public HTML readback confirmed `nav-dropdown-trigger`, `styles.css?v=20260629-navfix2`, and `main.js?v=20260629-navfix2` were live.
  - In-app browser public verification at `1280 x 900` measured `deltaCenter=0` before and after opening `Other Tools`, with `aria-expanded` changing from `false` to `true`.
- 2026-06-30 Other Tools typography/cache-bust fix completed:
  - Live in-app browser inspection found `Other Tools` was still formatted differently from `Support`, `Privacy`, and `Contact` because the `button.nav-dropdown-trigger` inherited default browser button typography (`13.3333px Arial`) while the nav links used `600 16px / 24.8px` system font.
  - Commit `623acdd Match tools nav typography` added `font: inherit` to `.nav-dropdown-trigger` and bumped page asset URLs to `styles.css?v=20260630-navformat` and `main.js?v=20260630-navformat`.
  - `git diff --check` passed.
  - Local in-app browser verification at `1280 x 900` showed `Other Tools` and `Support` both computed to `600 16px / 24.8px -apple-system, "system-ui", "Segoe UI", sans-serif`, with centerline delta `0` and no console errors.
  - Local mobile verification at `390 x 844` showed the menu and Other Tools submenu opened, both `Other Tools` and `Support` used matching `600 16px / 24.8px` system-font styling, there was no horizontal overflow, and no console errors were logged.
  - GitHub Pages run `28488117532` deployed successfully.
  - Public HTML readback for `https://jbdapps.com/` confirmed `styles.css?v=20260630-navformat`, `main.js?v=20260630-navformat`, and `Other Tools` were live; `curl -I https://jbdapps.com/` returned `HTTP/2 200`.
  - Fresh in-app browser public verification using `https://jbdapps.com/?navcheck=20260630-navformat` confirmed the live stylesheet URL, matching `Other Tools`/`Support` typography, centerline delta `0`, and no console errors. The already-open clean root tab had briefly reused cached old HTML, so use a fresh navigation or reload if a browser still shows `20260629-navfix2`.
- 2026-07-01 Apps page and Everything Clipboard detail page deployment completed:
  - Commit `4e022ea Add Everything Clipboard detail page` made the Apps page heading more compact, so `Current and upcoming JBDApps utilities.` fits on one line at `1280 x 900`, changed the Everything Clipboard card to link to `/apps/everything-clipboard/`, removed stale public `Version 1.1.7, build 7` wording from the card, added the dedicated product page, and copied seven `2880 x 1800` screenshot PNGs into `assets/images/everything-clipboard/`.
  - Asset URLs were bumped to `styles.css?v=20260701-appdetail` and `main.js?v=20260701-appdetail`.
  - `git diff --check` passed.
  - Static HTML reference check passed: all local `href` and `src` references resolved.
  - Local in-app browser desktop verification at `1280 x 900` confirmed the Apps page H1 was one line, the View Details link navigated to `/apps/everything-clipboard/`, the detail page had seven screenshots, sixteen feature-list items, no failed images, no horizontal overflow, and no console errors.
  - Local in-app browser mobile verification at `390 x 844` confirmed no horizontal overflow on the Apps page or detail page, with all seven screenshots present.
  - GitHub Pages run `28488612666` deployed successfully.
  - Public HTML readback confirmed the Apps page links to `/apps/everything-clipboard/`, uses `20260701-appdetail`, and no longer contains the stale `Version 1.1.7` / `build 7` wording.
  - `curl -I https://jbdapps.com/apps/everything-clipboard/` returned `HTTP/2 200`.
  - Direct public screenshot checks for all seven `/assets/images/everything-clipboard/*.png` files returned `200 image/png`.
  - Fresh in-app browser public verification confirmed the Apps page H1 is one line at `1280 x 900`, the View Details click reaches `https://jbdapps.com/apps/everything-clipboard/`, the detail page has seven screenshots, all screenshots complete at `2880 x 1800`, no horizontal overflow, and no console errors.
- 2026-07-01 Everything Clipboard screenshot carousel/lightbox deployment completed:
  - Commit `1db6ae3 Add screenshot carousel lightbox` replaced the static screenshot grid on `/apps/everything-clipboard/` with a lightweight local carousel, added previous/next and dot controls, added automatic cycling, added hover/focus pause guards, and added an enlarged screenshot overlay opened from the current carousel image.
  - Shared asset URLs were bumped to `styles.css?v=20260701-carousel` and `main.js?v=20260701-carousel`.
  - `git diff --check` passed.
  - Static HTML reference check passed: all local `href` and `src` references resolved.
  - Local in-app browser verification confirmed the carousel loaded, the first screenshot loaded at `2880 x 1800`, auto-advance changed slides, next and dot controls selected the expected screenshots, the enlarged image overlay opened and closed, mobile width `390 x 844` had no horizontal overflow, and no console errors were logged. Pointer-hover simulation in the automation bridge did not set browser `:hover`, but the implementation uses mouseover/mouseenter handlers plus a timer guard that refuses to advance while the carousel matches `:hover` or contains focus.
  - GitHub Pages run `28489384060` deployed successfully.
  - Public HTML readback confirmed `screenshot-carousel`, `data-carousel`, `data-lightbox`, and `20260701-carousel` were live; the old `screenshot-grid` markup and `20260701-appdetail` token were absent.
  - `curl -I https://jbdapps.com/apps/everything-clipboard/` returned `HTTP/2 200`.
  - Fresh in-app browser public verification confirmed the live carousel is present, the old grid is absent, the first image loads at `2880 x 1800`, there are seven dot controls, no horizontal overflow, next control changes the slide, clicking the carousel image opens a loaded enlarged screenshot overlay, closing hides it again, and no console errors were logged.
- 2026-07-01 Everything Clipboard compact carousel update completed:
  - Commit `2399d37 Compact screenshot carousel` changed the carousel preview frame from `16 / 10` to `16 / 5`, keeping the same horizontal span while making the preview half as tall.
  - The carousel image rule now uses `object-fit: contain`, so the `2880 x 1800` screenshots scale inside the compact preview instead of being cropped.
  - Shared stylesheet URLs were bumped to `styles.css?v=20260701-carousel-compact`; the JavaScript cache token remains `main.js?v=20260701-carousel` because the carousel behavior did not change.
  - `git diff --check` passed.
  - Static HTML reference check passed: all local `href` and `src` references resolved across eight HTML files.
  - Local in-app browser verification confirmed the compact preview used `aspect-ratio: 16 / 5`, `object-fit: contain`, loaded the first screenshot at `2880 x 1800`, had no horizontal overflow, and logged zero console errors.
  - Local mobile verification at `390 x 844` confirmed the compact preview used `object-fit: contain`, had no horizontal overflow, and the enlarged overlay still opened the full `2880 x 1800` screenshot.
  - GitHub Pages run `28491140586` deployed successfully.
  - Public HTML/CSS readback confirmed `styles.css?v=20260701-carousel-compact`, `aspect-ratio: 16 / 5`, and `object-fit: contain` were live.
  - `curl -I https://jbdapps.com/apps/everything-clipboard/` returned `HTTP/2 200`.
  - Fresh in-app browser public verification confirmed the live carousel uses `aspect-ratio: 16 / 5` and `object-fit: contain`, the old screenshot grid is absent, the first screenshot loads at `2880 x 1800`, clicking the carousel image opens the enlarged screenshot overlay, and no console errors were logged.
- 2026-07-01 Everything Clipboard raw-capture carousel deployment completed:
  - Commit `191b1d7 Use raw Everything Clipboard captures` added the seven user-provided raw captures to `assets/images/everything-clipboard/` as `raw-*.png`, replaced the carousel slide list with those files, updated the initial carousel/lightbox image to `raw-main-window.png`, and bumped shared asset URLs to `styles.css?v=20260701-rawcaptures` and `main.js?v=20260701-rawcaptures`.
  - The carousel preview frame was changed from `16 / 5` to `16 / 9` so the mixed-aspect raw captures remain readable while still using `object-fit: contain`.
  - `git diff --check` passed.
  - Static HTML reference check passed: all local `href` and `src` references resolved across eight HTML files.
  - Local in-app browser verification at desktop width confirmed the carousel used `raw-main-window.png`, loaded at `2360 x 1680`, used `aspect-ratio: 16 / 9` and `object-fit: contain`, had seven dots, had no horizontal overflow, and no longer contained the old `01-find-anything-you-copied.png` image.
  - Local in-app browser control checks confirmed next navigation switched to another raw capture and the enlarged screenshot overlay opened and closed using the raw image.
  - Local mobile browser verification at `390 x 844` confirmed no horizontal overflow, `object-fit: contain`, `aspect-ratio: 16 / 9`, and zero console errors.
  - GitHub Pages run `28538566704` deployed successfully after about 2m49s. GitHub reported a non-blocking Node.js 20 deprecation annotation for the Pages action, but the run completed with `success`.
  - Public HTML readback confirmed `styles.css?v=20260701-rawcaptures`, `main.js?v=20260701-rawcaptures`, and `raw-main-window.png` are live; the previous `20260701-carousel-compact` token and `01-find-anything-you-copied.png` image were absent from the public product-page HTML.
  - Direct public checks for all seven raw capture PNGs returned `200 image/png`: `raw-main-window.png`, `raw-quick-paste.png`, `raw-privacy-settings.png`, `raw-capture-settings.png`, `raw-quick-paste-settings.png`, `raw-paste-stack-workflow.png`, and `raw-help-window.png`.
  - Public JS/CSS readback confirmed the live slide list references the raw capture filenames and the live stylesheet uses `aspect-ratio: 16 / 9` with `object-fit: contain`.
  - Live public in-app browser automation timed out twice after deployment, so the final deployed-state verification for this pass is based on GitHub Pages success plus direct HTTPS HTML/asset/CSS/JS readback rather than a completed live Browser pass.
- 2026-07-01 Everything Clipboard raw-capture compact-height correction completed:
  - Corrected the raw-capture carousel preview back to the previous compact `16 / 5` height while keeping `object-fit: contain`, so the new raw images scale down inside the shorter frame instead of increasing the carousel height.
  - Shared stylesheet URLs were bumped to `styles.css?v=20260701-rawcaptures-compact`; the JavaScript URL remains `main.js?v=20260701-rawcaptures` because slide behavior did not change.
- 2026-07-01 website polish review:
  - Polish changes were first made locally for review, then included in the publish commit after final approval.
  - Added local professional-site basics: `404.html`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, `assets/images/apple-touch-icon.png`, Open Graph/Twitter metadata, normalized lowercase canonical URLs, and refreshed cache tokens using `20260701-polish-local`.
  - The first polish pass made the homepage too focused on Everything Clipboard. The user rejected that direction, so the homepage was restored to the general `Simple app support from JBDApps.` presentation and the product-specific spotlight/proof sections were removed from the homepage.
  - The user also rejected any carousel change. The product-page carousel was verified locally as compact `aspect-ratio: 16 / 5` with `object-fit: contain`, seven dots, and no extra proof/workflow sections inserted around it.
  - The Everything Clipboard product icon was fixed after a local polish pass squished it; CSS now explicitly keeps `.product-icon` square with equal width/height and `object-fit: cover`.
  - Local verification after corrections: `git diff --check` passed; local reference/JSON/XML/private-string scan passed; in-app browser check at desktop confirmed homepage H1 `Simple app support from JBDApps.`, carousel `16 / 5` + `contain`, square product icon `190 x 190`, no horizontal overflow, and zero console warnings/errors.
- 2026-07-01 app-specific FAQ structure update:
  - Moved the Everything Clipboard-specific FAQ items out of `/support/` and into `/apps/everything-clipboard/`.
  - The general Support page now keeps general support instructions, what to include, known-issues status, and a note that app-specific FAQs live on product pages.
  - Local verification after the FAQ move: `git diff --check` passed; local HTML reference/asset scan passed across 9 HTML files; JSON/XML parsing for `site.webmanifest` and `sitemap.xml` passed; public private-string scan passed; local HTTP checks returned `200` for `/support/` and `/apps/everything-clipboard/`; in-app browser checks confirmed `/support/` has zero FAQ items and `/apps/everything-clipboard/` has three FAQ items on desktop and mobile with no horizontal overflow or console warnings/errors.
  - Published commit `902cdca` to `origin/main`; GitHub Pages run `28543467350` completed successfully.
  - Public cache-busted verification confirmed `https://jbdapps.com/support/?deploy=902cdca` returns `HTTP/2 200`, has zero FAQ items, and includes the product-page FAQ note. Public `https://jbdapps.com/apps/everything-clipboard/?deploy=902cdca` returns `HTTP/2 200`, has the `Everything Clipboard FAQ`, has three FAQ items, keeps the carousel at `aspect-ratio: 16 / 5` with `object-fit: contain`, keeps the product icon square at `190 x 190`, has no failed images, no horizontal overflow, and no console warnings/errors.
- 2026-07-03 Everything Clipboard Mac App Store link update:
  - Replaced the disabled "Mac App Store coming soon" buttons on `/apps/` and `/apps/everything-clipboard/` with active buttons labeled `Download from the Mac App Store`.
  - Button URL: `https://apps.apple.com/us/app/everything-clipboard/id6784394264?mt=12`.
  - Updated Apps page status/availability text and the Everything Clipboard product-page status/FAQ text to say the app is available on the Mac App Store.
  - `curl -I -L` against the Apple URL returned `HTTP/2 200` on 2026-07-03.
  - Local in-app browser verification against `http://127.0.0.1:8080/apps/` and `/apps/everything-clipboard/` found zero stale "coming soon" text matches, zero disabled buttons, no horizontal overflow, and no console warnings/errors. A real click on the product-page App Store button navigated to `https://apps.apple.com/us/app/everything-clipboard/id6784394264?mt=12` with title `Everything Clipboard App - App Store`.
  - Published commit `42ae0c0` to `origin/main`; GitHub Pages run `28678405338` completed successfully. The run had the same non-blocking Node.js 20 deprecation annotation seen on prior Pages runs.
  - Public readback confirmed `https://jbdapps.com/apps/?deploy=42ae0c0` and `https://jbdapps.com/apps/everything-clipboard/?deploy=42ae0c0` return `HTTP/2 200` and contain `Download from the Mac App Store` links pointing to the Apple URL.
  - Fresh in-app browser public verification confirmed `/apps/` has one App Store button, `/apps/everything-clipboard/` has the hero button plus FAQ link, both pages have zero stale "coming soon" text matches, zero disabled buttons, no horizontal overflow, and the product page shows `Available on the Mac App Store`.

## Verified Inputs

- `/Users/briscoe/Documents/MacApps` was not a Git repo before the website repo was created.
- `JBDApps.com` returned no WHOIS match and no DNS answers during the 2026-06-28 planning pass. Cloudflare checkout later confirmed availability and the user completed purchase.
- Attached app bundle metadata used for Everything Clipboard:
  - Path: `/Users/briscoe/Documents/Jimz Clipboard Manager/dist/Everything Clipboard.app`
  - `CFBundleName=Everything Clipboard`
  - `CFBundleShortVersionString=1.1.7`
  - `CFBundleVersion=7`
  - `LSMinimumSystemVersion=14.0`
  - Platform: macOS

## Do Not Regress

- Keep the site static: no WordPress, Wix, Squarespace, paid monthly hosting, backend, analytics, ads, tracking pixels, cookies, or third-party scripts by default.
- Do not expose private/local filesystem paths or a private forwarding email address on public pages.
- Do not claim a domain is registered or DNS/HTTPS is live until verified.
- Do not claim the app collects no data unless the actual app behavior has been reviewed for App Store submission.
- Keep the Everything Clipboard App Store buttons pointed at the verified public listing URL unless Apple changes the app listing: `https://apps.apple.com/us/app/everything-clipboard/id6784394264?mt=12`.
- Keep Voice Command Atlas App Store buttons pointed at the verified public listing URL unless Apple changes the app listing: `https://apps.apple.com/us/app/voice-command-atlas/id6789797051?mt=12`.
- Keep the Everything Clipboard screenshot carousel compact at `16 / 5` with `object-fit: contain`; do not make it taller or crop the screenshots.
- Keep `/` as a general JBDApps homepage with both apps represented. It can use real app screenshots and product links, but do not turn it into an Everything Clipboard-only showcase.
- Keep the Everything Clipboard product icon square on `/apps/everything-clipboard/`; avoid HTML image dimensions or CSS that distort it.
- Keep app-specific FAQs on their app product pages. The general `/support/` page should remain generic and should not accumulate app-specific FAQ sections.
- Keep Voice Command Atlas Mac App Store copy centered on the explicitly selected `.voicecontrolcommands` export and re-import workflow. Do not restore claims that the Mac App Store build reads another app's preferences or restarts Voice Control/system processes.

## Next Steps

1. Update App Store Connect away from the temporary `wch1zpnk.github.io/everything-clipboard-support` URLs:
   - Support URL: `https://jbdapps.com/support/`
   - Privacy Policy URL: `https://jbdapps.com/privacy/`
   - Preferred Marketing URL: `https://jbdapps.com/apps/everything-clipboard/`
2. Keep the Cloudflare web records proxied unless GitHub Pages later issues its own custom-domain certificate and the team intentionally chooses to return to DNS-only.
3. Optional cleanup later: retry GitHub Pages HTTPS enforcement, but do not treat it as blocking while Cloudflare HTTPS remains verified:
   - `gh api repos/wch1zpnk/JBDApps-Website/pages`
   - `gh api --method PUT repos/wch1zpnk/JBDApps-Website/pages -F cname=jbdapps.com -F https_enforced=true -f source[branch]=main -f source[path]=/`
