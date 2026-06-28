# JBDApps Website Handoff

Updated: 2026-06-28

## New Chat Rule

Read this file before making website, domain, GitHub Pages, Cloudflare DNS, support email, privacy policy, or App Store URL changes for the JBDApps website.

## Project State

- Project path: `/Users/briscoe/Documents/MacApps/JBDApps-Website`
- GitHub repo: `https://github.com/wch1zpnk/JBDApps-Website`
- Branch: `main`
- Latest pushed commit after initial implementation: `cbd1894 Create JBDApps static website`
- Website goal: static independent developer/support site for App Store support URLs, privacy policy, contact, and app listings.
- Planned public domain: `JBDApps.com`
- Hosting target: GitHub Pages from `main` branch root.
- DNS/registrar target: Cloudflare Registrar and Cloudflare DNS.
- Public support address planned for the site: `support@JBDApps.com`

## Current Implementation

- Static pages created:
  - `/`
  - `/apps/`
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
- The Apps page names `Everything Clipboard` as the first real app with conservative App Store wording and a coming-soon store link.
- `.nojekyll` is present so GitHub Pages serves the static files directly.

## Current Deployment State

- GitHub Pages source is configured as `main` branch root.
- GitHub Pages custom domain is configured as `jbdapps.com` in the GitHub API.
- GitHub Pages deployment completed successfully on 2026-06-28. Use `gh run list --repo wch1zpnk/JBDApps-Website --limit 3` to confirm the latest Pages deployment after any new commit.
- GitHub Pages API reported status `built`, `html_url=http://jbdapps.com/`, `https_enforced=false`.
- `https://wch1zpnk.github.io/JBDApps-Website/` currently redirects to `http://jbdapps.com/` because the custom domain is configured.
- `https://JBDApps.com/` does not resolve yet because domain registration/DNS is not complete.
- `dig` returned no answers for `JBDApps.com` or `www.JBDApps.com` after deployment.

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

## Verified Inputs

- `/Users/briscoe/Documents/MacApps` was not a Git repo before the website repo was created.
- `JBDApps.com` returned no WHOIS match and no DNS answers during the 2026-06-28 planning pass. Final availability must still be confirmed in Cloudflare checkout before purchase.
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

1. Register `JBDApps.com` in Cloudflare if checkout confirms availability. This requires the user's Cloudflare login, final availability check, registrant contact details, and payment confirmation.
2. In Cloudflare DNS, add GitHub Pages apex records and `www` CNAME using GitHub's current official Pages DNS documentation. Current GitHub Pages values checked on 2026-06-28:
   - `A @ 185.199.108.153`
   - `A @ 185.199.109.153`
   - `A @ 185.199.110.153`
   - `A @ 185.199.111.153`
   - Optional `AAAA @ 2606:50c0:8000::153`
   - Optional `AAAA @ 2606:50c0:8001::153`
   - Optional `AAAA @ 2606:50c0:8002::153`
   - Optional `AAAA @ 2606:50c0:8003::153`
   - `CNAME www wch1zpnk.github.io`
3. Configure Cloudflare Email Routing for `support@JBDApps.com` to the user's private email.
4. After DNS propagation, verify:
   - `https://JBDApps.com`
   - `https://www.JBDApps.com`
   - HTTPS enforcement
   - Support URL: `https://JBDApps.com/support/`
   - Privacy Policy URL: `https://JBDApps.com/privacy/`
   - Marketing URL: `https://JBDApps.com/` or `https://JBDApps.com/apps/`
5. After DNS validation passes in GitHub Pages, enable `Enforce HTTPS` if GitHub has not enabled it automatically.
