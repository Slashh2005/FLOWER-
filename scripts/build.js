/**
 * Static site build: renders every page to /dist and copies assets.
 *   npm run build
 * No dependencies — just Node 18+.
 */
import { mkdir, rm, writeFile, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { site } from "../src/config/site.js";
import { products } from "../src/data/products.js";
import { layout } from "../src/lib/layout.js";
import { absoluteUrl, whatsappEnabled } from "../src/lib/helpers.js";
import { homePage } from "../src/pages/home.js";
import { shopPage, productPage } from "../src/pages/shop.js";
import { customOrdersPage, aboutPage, contactPage, notFoundPage } from "../src/pages/other.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");

// Basic data validation so a typo in products.js fails loudly.
const slugs = new Set();
for (const p of products) {
  if (!/^[a-z0-9-]+$/.test(p.slug)) throw new Error(`Invalid product slug "${p.slug}"`);
  if (slugs.has(p.slug)) throw new Error(`Duplicate product slug "${p.slug}"`);
  slugs.add(p.slug);
  if (!p.images?.length) throw new Error(`Product "${p.slug}" needs at least one image`);
  for (const img of p.images) if (!img.alt) throw new Error(`Image for "${p.slug}" is missing alt text`);
}

const pages = [
  homePage(),
  shopPage(),
  ...products.map(productPage),
  customOrdersPage(),
  aboutPage(),
  contactPage(),
  notFoundPage(),
];

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(join(root, "src/assets"), join(out, "assets"), { recursive: true });
await cp(join(root, "src/static"), out, { recursive: true });

for (const page of pages) {
  const file = page.path.endsWith(".html") ? join(out, page.path) : join(out, page.path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, layout(page));
}

// robots.txt + sitemap (sitemap only when the public URL is known)
const indexable = pages.filter((p) => !p.noindex);
let robots = "User-agent: *\nAllow: /\n";
if (site.siteUrl) {
  const urls = indexable.map((p) => `  <url><loc>${absoluteUrl(p.path)}</loc></url>`).join("\n");
  await writeFile(
    join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
  robots += `Sitemap: ${absoluteUrl("/sitemap.xml")}\n`;
}
await writeFile(join(out, "robots.txt"), robots);

console.log(`Built ${pages.length} pages into dist/`);

// Pre-launch checklist
const todo = [];
if (site.businessName.startsWith("[")) todo.push("businessName");
if (!whatsappEnabled()) todo.push("whatsappNumber (WhatsApp buttons are disabled)");
if (!site.email) todo.push("email");
if (!site.instagramUrl && !site.tiktokUrl && !site.facebookUrl) todo.push("social links");
if (!site.siteUrl) todo.push("siteUrl (needed for canonical/Open Graph/sitemap)");
if (!site.formEndpoint && !whatsappEnabled() && !site.email)
  todo.push("formEndpoint, whatsappNumber or email (enquiry forms cannot send anything yet)");
const unconfirmed = products.filter((p) => !p.priceConfirmed).map((p) => p.slug);
if (unconfirmed.length) todo.push(`confirm prices: ${unconfirmed.join(", ")}`);
if (products.some((p) => p.images.some((i) => i.src.includes("/placeholders/")))) todo.push("replace placeholder product photos");
if (site.showSetupMarkers) todo.push("showSetupMarkers is on (turn off at launch)");

if (todo.length) {
  console.log("\nStill to set up before launch:");
  for (const t of todo) console.log(`  • ${t}`);
}
