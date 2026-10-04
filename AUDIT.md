# Site audit — paperclip-sandbox-site

Date: 2026-10-04
Branch: `audit-fixes`
Scope: `/paperclip/sandbox/paperclip-sandbox-site` (one Astro page, `src/pages/index.astro`)

Nothing was deployed and nothing was pushed to a remote. The only outside service used was the
npm registry, for `npm install`.

Build after the changes: `npm install` then `npm run build` — **passes**, 1 page built.

---

## Summary

| # | Area | Finding | Severity | Status |
|---|---|---|---|---|
| 1 | Links | `/contact` did not exist (404) | High | Fixed |
| 2 | Links | `/pricing.html` did not exist (404) | High | Removed, needs your decision |
| 3 | Links | `#top` pointed at no element | Medium | Fixed |
| 4 | Links | `target="_blank"` without `rel="noopener noreferrer"` | Medium | Fixed |
| 5 | Links | `https://example.com/terms` is a placeholder | Medium | Not fixed, flagged |
| 6 | Assets | `/hero.png` did not exist — broken image | High | Fixed |
| 7 | Meta | No `lang` on `<html>` | High | Fixed |
| 8 | Meta | No viewport meta tag | High | Fixed |
| 9 | Meta | Title was just "Home" | High | Fixed |
| 10 | Meta | No meta description | High | Fixed |
| 11 | Meta | No Open Graph or Twitter card tags | Medium | Fixed |
| 12 | Meta | No canonical URL | Medium | Fixed |
| 13 | A11y | Image had no `alt` | High | Fixed |
| 14 | A11y | Heading order was h2 → h1 → h4 → h3 | High | Fixed |
| 15 | A11y | No landmarks (all `<div>`) | Medium | Fixed |
| 16 | A11y | Body text contrast 2.8:1 — fails WCAG AA | High | Fixed |
| 17 | A11y | Footer text 10px | Medium | Fixed |
| 18 | A11y | No skip link | Low | Fixed |
| 19 | A11y | No visible focus style | Medium | Fixed |
| 20 | A11y | Service cards were not a list | Low | Fixed |
| 21 | SEO | No `site` origin set in Astro config | Medium | Fixed |
| 22 | SEO | No `robots.txt`, no sitemap | Medium | Fixed |
| 23 | Best practice | No favicon (404 on every load) | Low | Fixed |
| 24 | Content | Hard-coded "Copyright 2019" | Low | Fixed |
| 25 | Perf | Image had width but no height — layout shift | Medium | Fixed |
| 26 | Perf | `font-family: sans-serif` only | Low | Fixed |

---

## Findings in detail

### Broken and dead links

**1. `/contact` was a dead link.** The hero "Get in touch" button pointed at `/contact`. There is
no `contact` page and no `contact` route, so it returned 404.
*Change:* this stays a one-page site, so I added a real `#contact` section to the page and pointed
the button at it. The section holds a `mailto:hello@example.com` link, marked in the copy as a
sandbox address.

**2. `/pricing.html` was a dead link.** The hero "See pricing" link pointed at `/pricing.html`.
That file does not exist, and the `.html` suffix is also wrong for Astro routing.
*Change:* I removed the link. I did not build a pricing page, because I have no prices to put on
it and inventing them would be worse than removing the link. **This needs your decision:** tell me
the prices and I will add the section back, or confirm the link should stay gone.

**3. `#top` pointed at nothing.** The footer "Back to top" link used `href="#top"` but no element
had `id="top"`, so the browser did nothing on click.
*Change:* `id="top"` added to `<body>`.

**4. External link had no `rel`.** `<a href="https://example.com/terms" target="_blank">` with no
`rel`. In older browsers the opened page gets a `window.opener` handle back to your page, and the
referrer leaks.
*Change:* added `rel="noopener noreferrer"`. I also added screen-reader-only text
"(opens in a new tab)", because a link that changes context without warning is a WCAG 3.2.5 issue.

**5. The Terms link is a placeholder.** `https://example.com/terms` almost certainly returns 404 —
`example.com` is the IANA reserved documentation domain and only serves its root.
*Not changed.* I did not verify it live, because the task limited outside network calls to the npm
registry, and I have no real terms URL to put in its place. **Replace this before you go live.**

### Assets

**6. The hero image did not exist.** `src="/hero.png"` with an empty `public/` folder — a broken
image on the main visual element of the page.
*Change:* I added `public/hero.svg`, a small built-in placeholder (about 700 bytes) and pointed the
`<img>` at it. It is a placeholder, not artwork — swap in the real hero when you have one.

### Meta tags

**7. No `lang` attribute.** `<html>` had no `lang`, so screen readers guess the language and
pronounce the page with the wrong voice. *Change:* `<html lang="en">`.

**8. No viewport meta tag.** Mobile browsers rendered the page at desktop width and zoomed out.
This is the single biggest mobile usability problem on the page.
*Change:* `<meta name="viewport" content="width=device-width, initial-scale=1">`.

**9. The title was "Home".** It said nothing about the site, the brand, or the service, in search
results, in browser tabs, and in bookmarks.
*Change:* "Sandbox Site — website audits, fixes and monthly reports" (57 characters, inside the
~60-character limit before Google truncates).

**10. No meta description.** Search engines wrote their own snippet.
*Change:* added a 141-character description that names the three services.

**11. No social tags.** A shared link showed a bare URL with no title, text, or picture.
*Change:* added `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image`,
`og:image:alt`, and the matching `twitter:card`, `twitter:title`, `twitter:description`,
`twitter:image`.

**12. No canonical URL.** *Change:* added `<link rel="canonical">`, built from the configured site
origin, so the same page served on several URLs does not split its ranking.

### Accessibility

**13. The image had no `alt`.** A screen reader read out the filename, or nothing.
*Change:* added a description of what the image shows.

**14. Heading order was wrong.** The page went `h2` → `h1` → `h4` → `h3`. There was no single clear
page heading, and the levels skipped. Screen reader users navigate by heading level, so this
breaks the outline of the page.
*Change:* one `h1` for the page, `h2` for each section, `h3` for each service card, no skipped
levels. The decorative "Sandbox Site" line above the `h1` was not a heading at all, so it is now a
styled paragraph.

**15. No landmarks.** Everything was a `<div>`. Screen reader users could not jump to the main
content, the footer, or the navigation.
*Change:* `<main>`, `<header>`, two `<section>`s with `aria-labelledby`, `<footer>`, and a
`<nav aria-label="Footer">`.

**16. Body text failed contrast.** `color: #999` on `#fff` is about **2.8:1**. WCAG AA needs 4.5:1
for normal text. All the body copy on the page failed.
*Change:* body text is now `#1f2937` (about 14.7:1) and secondary text `#4b5563` (about 7.5:1).
Links and the call-to-action button use `#1d4ed8`, which is 6.7:1 against white and against the
white button text. All pass AA; most pass AAA.

**17. Footer text was 10px.** Too small to read comfortably, and it inherited the failing `#999`.
*Change:* 0.875rem (14px) and the AA-passing muted colour, so it also respects the reader's own
browser font size.

**18. No skip link.** Keyboard users had to tab through the header on every visit.
*Change:* added a "Skip to main content" link that appears on focus.

**19. No focus style.** The default outline was easy to lose against the layout.
*Change:* added a 3px `:focus-visible` outline with an offset.

**20. The service cards were loose divs.** A screen reader did not announce "list, 3 items".
*Change:* the cards are now a `<ul>` of `<li>`.

### SEO and best practices

**21. No `site` origin in `astro.config.mjs`.** Without it, Astro cannot build absolute URLs, so
canonical, Open Graph, and sitemap URLs are all impossible.
*Change:* set to `https://sandbox.example.com` with a comment. **This is a placeholder — change it
to the real domain before you go live.** Canonical, OG, and the sitemap all read from it.

**22. No `robots.txt` and no sitemap.** *Change:* added `public/robots.txt` and the first-party
`@astrojs/sitemap` integration, which now writes `sitemap-index.xml` into the build. This is the
one new dependency I added.

**23. No favicon.** Every page load fired a 404 for `/favicon.ico`, and tabs showed a blank icon.
*Change:* added `public/favicon.svg` and the `<link rel="icon">`. Also added `theme-color`.

**24. "Copyright 2019" was hard-coded.** It made the site look abandoned.
*Change:* the year is now computed at build time, so a rebuild keeps it current.

### Performance

**25. The image had `width` but no `height`.** The browser could not reserve space, so the page
jumped when the image loaded — a Cumulative Layout Shift hit.
*Change:* added `height="480"` to match the intrinsic size, plus `max-width:100%; height:auto` so
it still scales down on small screens. Also added `fetchpriority="high"` because the hero image is
the Largest Contentful Paint element, and `decoding="async"`.

**26. `font-family: sans-serif` only.** *Change:* `system-ui, sans-serif`, which picks the
platform's own UI font. No webfont is loaded, so there is no extra request and no font swap flash.

---

## Checked and found fine

- **No JavaScript ships.** Astro renders this page to static HTML with zero client JS. Good.
- **No render-blocking external CSS or fonts.** The styles are scoped and inlined by the build.
- **Total page weight** is a few kilobytes. Nothing to optimise.
- **No mixed content, no inline event handlers, no `document.write`.**
- **No cookies, no trackers, no third-party scripts.**
- **`charset="utf-8"`** was already set, and was already the first thing in `<head>`.
- **No vulnerabilities** reported by `npm install` (0 found, 188 packages).

---

## Chosen not to change

| Item | Why |
|---|---|
| The Terms URL (`https://example.com/terms`) | It is a dead placeholder, but I have no real URL to use and could not verify it live within the task's network limit. Flagged for you — see finding 5. |
| A real pricing page | I would have to invent prices. The dead link is removed instead; tell me the content and I will add it. See finding 2. |
| The site origin (`sandbox.example.com`) | A placeholder is needed for the build to produce absolute URLs at all. It must be replaced with the real domain, which only you know. |
| The hero image | `hero.svg` is a functional placeholder so the page is not broken. Real artwork is a design job, not an audit fix. |
| Converting to multiple pages | The brief says one-page site. I kept it one page. |
| Adding a layout component / `<Layout>` wrapper | Useful once there is a second page. With one page it adds indirection for no gain. |
| Structured data (JSON-LD `Organization`) | Would help search results, but needs a real company name, logo, and URL. Worth adding once the real details exist. |
| `npm audit` / dependency upgrades | 0 vulnerabilities, and Astro is already on a current major. |

---

## Before this goes live

1. Set the real domain in `astro.config.mjs`.
2. Replace the Terms link with a real URL.
3. Decide what happens to "See pricing".
4. Replace `hero.svg` and `favicon.svg` with real artwork.
5. Replace `hello@example.com` with a monitored address.
