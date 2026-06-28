# JBDApps Website Handoff

Updated: 2026-06-28

## New Chat Rule

Read this file before making website, domain, GitHub Pages, Cloudflare DNS, support email, privacy policy, or App Store URL changes for the JBDApps website.

## Project State

- Project path: `/Users/briscoe/Documents/MacApps/JBDApps-Website`
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
- `CNAME` contains `JBDApps.com`.
- `README.md` documents local run, deployment, DNS setup, support email routing, privacy updates, and App Store URL checklist.
- The Apps page names `Everything Clipboard` as the first real app with conservative App Store wording and a coming-soon store link.

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

1. If not already done, create the GitHub repo `wch1zpnk/JBDApps-Website` and push `main`.
2. Register `JBDApps.com` in Cloudflare if checkout confirms availability.
3. In GitHub Pages, set source to `main` branch root and add custom domain `JBDApps.com`.
4. In Cloudflare DNS, add GitHub Pages apex records and `www` CNAME using GitHub's current official Pages DNS documentation. Current GitHub Pages values checked on 2026-06-28:
   - `A @ 185.199.108.153`
   - `A @ 185.199.109.153`
   - `A @ 185.199.110.153`
   - `A @ 185.199.111.153`
   - Optional `AAAA @ 2606:50c0:8000::153`
   - Optional `AAAA @ 2606:50c0:8001::153`
   - Optional `AAAA @ 2606:50c0:8002::153`
   - Optional `AAAA @ 2606:50c0:8003::153`
   - `CNAME www wch1zpnk.github.io`
5. Configure Cloudflare Email Routing for `support@JBDApps.com` to the user's private email.
6. After DNS propagation, verify:
   - `https://JBDApps.com`
   - `https://www.JBDApps.com`
   - HTTPS enforcement
   - Support URL: `https://JBDApps.com/support/`
   - Privacy Policy URL: `https://JBDApps.com/privacy/`
   - Marketing URL: `https://JBDApps.com/` or `https://JBDApps.com/apps/`
