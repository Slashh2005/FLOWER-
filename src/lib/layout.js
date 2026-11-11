import { site } from "../config/site.js";
import { html, raw } from "./html.js";
import { header, footer } from "./components.js";
import { brandName, absoluteUrl, whatsappEnabled } from "./helpers.js";

/**
 * Full HTML document.
 * @param {object} page { path, title, description, image?, body, noindex?, bodyClass? }
 */
export function layout({ path, title, description, image = "/assets/img/og-image.png", body, noindex = false, bodyClass = "" }) {
  const fullTitle = title ? `${title} | ${brandName()}` : brandName();
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image);

  // Only non-secret, public settings reach the browser.
  const clientConfig = {
    businessName: site.businessName,
    whatsappNumber: whatsappEnabled() ? site.whatsappNumber : "",
    email: site.email,
    formEndpoint: site.formEndpoint,
  };

  return `<!doctype html>
${html`<html lang="en-ZA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${fullTitle}</title>
  <meta name="description" content="${description}">
  ${noindex ? raw('<meta name="robots" content="noindex">') : ""}
  ${canonical ? html`<link rel="canonical" href="${canonical}">` : ""}
  <meta name="theme-color" content="#FFF9F3">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${brandName()}">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:locale" content="en_ZA">
  ${canonical ? html`<meta property="og:url" content="${canonical}">` : ""}
  ${ogImage ? html`<meta property="og:image" content="${ogImage}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">` : ""}
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Parisienne&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script>
    // Motion gate: entrance animations only run with JS and when the visitor hasn't asked for reduced motion.
    document.documentElement.classList.add("js");
    if (matchMedia("(prefers-reduced-motion: no-preference)").matches) document.documentElement.classList.add("motion");
  </script>
</head>
<body class="${bodyClass}">
  ${header(path)}
  <main id="main" tabindex="-1">
    ${body}
  </main>
  ${footer()}
  <script type="application/json" id="site-config">${raw(JSON.stringify(clientConfig).replace(/</g, "\\u003c"))}</script>
  <script src="/assets/js/main.js" defer></script>
</body>
</html>`}`;
}
