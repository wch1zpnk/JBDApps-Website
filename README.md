# JBDApps Website

Static developer/support website for `JBDApps.com`, intended for GitHub Pages hosting and Cloudflare DNS.

## What This Site Includes

- Home page: `/`
- Apps page: `/apps/`
- Support page: `/support/`
- Contact page: `/contact/`
- Privacy policy: `/privacy/`
- Terms of use: `/terms/`
- Custom domain file: `CNAME`

The first app listing is `Everything Clipboard`, using verified local app metadata. The App Store link is intentionally marked as coming soon until the public listing is verified.

## Run Locally

From this folder:

```sh
python3 -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/
```

## Update Pages

- Edit page content in the matching `index.html` file.
- Edit shared visual styles in `assets/css/styles.css`.
- Edit the mobile navigation helper in `assets/js/main.js`.
- Replace app icons in `assets/images/` as final app artwork changes.

Do not add analytics, cookies, tracking scripts, ads, or third-party embeds unless the privacy policy is updated first.

## Deploy With GitHub Pages

1. Commit changes to the `main` branch.
2. Push to the GitHub repository.
3. In GitHub, open repository settings.
4. Go to Pages.
5. Set the source to `Deploy from a branch`.
6. Select branch `main` and folder `/root`.
7. Add the custom domain `JBDApps.com`.
8. Wait for DNS validation and enable `Enforce HTTPS`.

## Domain and DNS Setup

Preferred registrar and DNS provider: Cloudflare.

Register `JBDApps.com` in Cloudflare if checkout confirms it is available. If it is not available, do not buy an alternate domain without confirming the choice first.

For GitHub Pages custom domain setup, follow GitHub's current official Pages DNS documentation:

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

Expected shape:

- `CNAME` file contains `JBDApps.com`.
- Apex/root `JBDApps.com` points to GitHub Pages using GitHub's current `A` records:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- Optional IPv6 `AAAA` records:
  - `2606:50c0:8000::153`
  - `2606:50c0:8001::153`
  - `2606:50c0:8002::153`
  - `2606:50c0:8003::153`
- `www.JBDApps.com` is a CNAME to the GitHub Pages default host, for example `wch1zpnk.github.io`.
- Avoid wildcard DNS records.
- Add the custom domain in GitHub Pages before relying on the DNS records.
- Enable HTTPS after DNS validation passes.
- DNS changes can take up to 24 hours to propagate.

Cloudflare Registrar notes:

- Cloudflare Registrar requires a verified account email address.
- Cloudflare performs a final domain availability check after selecting Purchase.
- Domain contact and payment information must be completed in the Cloudflare dashboard.
- Cloudflare Registrar domains use Cloudflare nameservers while registered there.

## Support Email

Public support address:

```text
support@JBDApps.com
```

Configure this through Cloudflare Email Routing after the domain is registered. Forward it to the private email address chosen by the site owner. Do not place the private forwarding address in this repository.

## Privacy Policy Updates

Before using the Privacy Policy URL in an App Store submission, review the policy against the actual app behavior.

Update the policy whenever an app changes:

- Data collection
- Local storage behavior
- Network access
- Analytics
- Crash reporting
- Third-party services
- Contact or support handling

## App Store URL Checklist

Use these once the custom domain works:

- Support URL: `https://JBDApps.com/support/`
- Privacy Policy URL: `https://JBDApps.com/privacy/`
- Marketing URL: `https://JBDApps.com/apps/` or `https://JBDApps.com/`

Verify both:

- `https://JBDApps.com`
- `https://www.JBDApps.com`

Until GitHub Pages issues the `JBDApps.com` HTTPS certificate and HTTPS enforcement succeeds, use the existing verified HTTPS support/privacy URLs for App Store Connect instead of the custom domain.

## Verification Checklist

- Home page loads.
- Apps page loads.
- Support page loads.
- Contact page loads.
- Privacy page loads.
- Terms page loads.
- Navigation links work.
- Mobile menu works.
- Desktop and mobile layouts fit without overlap.
- No broken internal links.
- No browser console errors.
- No private local paths appear in public HTML.
- `CNAME` contains `JBDApps.com`.
