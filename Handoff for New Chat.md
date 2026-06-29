# JBDApps Website Handoff

Updated: 2026-06-29

## New Chat Rule

Read this file before making website, domain, GitHub Pages, Cloudflare DNS, support email, privacy policy, or App Store URL changes for the JBDApps website.

## Project State

- Project path: `/Users/briscoe/Documents/MacApps/JBDApps-Website`
- GitHub repo: `https://github.com/wch1zpnk/JBDApps-Website`
- Branch: `main`
- Latest pushed site/source commit before this handoff refresh: `a04bebd Refresh handoff after HTTPS retry`
- Current handoff refresh: updated after the 2026-06-29 Cloudflare proxy/SSL fix that made `https://jbdapps.com/` live.
- Website goal: static independent developer/support site for App Store support URLs, privacy policy, contact, and app listings.
- Public domain: `JBDApps.com`
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
- GitHub Pages deployment completed successfully on 2026-06-29 after the Cloudflare DNS completion; latest observed run was `28383159157` (`pages build and deployment`, success, about 1m33s). Use `gh run list --repo wch1zpnk/JBDApps-Website --limit 3` to confirm the latest Pages deployment after any new commit.
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
  - Marketing URL: `https://jbdapps.com/` or `https://jbdapps.com/apps/`
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
   - Marketing URL: `https://jbdapps.com/` or `https://jbdapps.com/apps/`
2. Keep the Cloudflare web records proxied unless GitHub Pages later issues its own custom-domain certificate and the team intentionally chooses to return to DNS-only.
3. Optional cleanup later: retry GitHub Pages HTTPS enforcement, but do not treat it as blocking while Cloudflare HTTPS remains verified:
   - `gh api repos/wch1zpnk/JBDApps-Website/pages`
   - `gh api --method PUT repos/wch1zpnk/JBDApps-Website/pages -F cname=jbdapps.com -F https_enforced=true -f source[branch]=main -f source[path]=/`
