# JBDApps Website Handoff

Updated: 2026-07-01

## New Chat Rule

Read this file before making website, domain, GitHub Pages, Cloudflare DNS, support email, privacy policy, or App Store URL changes for the JBDApps website.

## Project State

- Project path: `/Users/briscoe/Documents/MacApps/JBDApps-Website`
- GitHub repo: `https://github.com/wch1zpnk/JBDApps-Website`
- Branch: `main`
- Latest pushed site/source commit before this handoff refresh: `b894f49 Refresh handoff after raw captures deployment`
- Current handoff refresh: updated after the 2026-07-01 Everything Clipboard raw-capture compact-height correction.
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
  - `assets/images/favicon.png`
- `CNAME` contains `JBDApps.com`.
- `README.md` documents local run, deployment, DNS setup, support email routing, privacy updates, and App Store URL checklist.
- The Apps page names `Everything Clipboard` as the first real app with conservative App Store wording, a coming-soon store link, and a View Details link to `/apps/everything-clipboard/`.
- `/apps/everything-clipboard/` is the dedicated public product page for Everything Clipboard. It uses the raw screenshot captures from `/Users/briscoe/Documents/Jimz Clipboard Manager/MAS_Version/App Store Assets 2026-06-27 Sequoia Night/Raw Captures/`, the prepared App Store description text, feature bullets, privacy/control notes, and support/privacy links. The screenshot area uses the compact `16 / 5` carousel height, auto-cycles, stops advancing while hovered or focused, supports previous/next and dot navigation, scales screenshots inside the preview frame with `object-fit: contain`, and opens the current screenshot larger in an overlay.
- The primary navigation now includes `Other Tools` between `Apps` and `Support`; its first dropdown item is `AppleScript`, which links to `/other-tools/`.
- `.nojekyll` is present so GitHub Pages serves the static files directly.

## Current Deployment State

- GitHub Pages source is configured as `main` branch root.
- GitHub Pages custom domain is configured as `jbdapps.com` in the GitHub API.
- GitHub Pages deployment completed successfully on 2026-07-01 after the Everything Clipboard raw-capture carousel push; latest observed run was `28538566704` (`pages build and deployment`, success, about 2m49s). Use `gh run list --repo wch1zpnk/JBDApps-Website --limit 3` to confirm the latest Pages deployment after any new commit.
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
- Keep App Store links marked as coming soon until the public listing URL is verified.

## Next Steps

1. Update App Store Connect away from the temporary `wch1zpnk.github.io/everything-clipboard-support` URLs:
   - Support URL: `https://jbdapps.com/support/`
   - Privacy Policy URL: `https://jbdapps.com/privacy/`
   - Preferred Marketing URL: `https://jbdapps.com/apps/everything-clipboard/`
2. Keep the Cloudflare web records proxied unless GitHub Pages later issues its own custom-domain certificate and the team intentionally chooses to return to DNS-only.
3. Optional cleanup later: retry GitHub Pages HTTPS enforcement, but do not treat it as blocking while Cloudflare HTTPS remains verified:
   - `gh api repos/wch1zpnk/JBDApps-Website/pages`
   - `gh api --method PUT repos/wch1zpnk/JBDApps-Website/pages -F cname=jbdapps.com -F https_enforced=true -f source[branch]=main -f source[path]=/`
