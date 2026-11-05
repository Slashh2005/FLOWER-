/** Checks on the built site. Run with: npm test (builds first). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { site } from "../src/config/site.js";
import { products } from "../src/data/products.js";
import { reviews } from "../src/data/content.js";
import { formatPrice, productEnquiryMessage, whatsappUrl } from "../src/lib/helpers.js";

const dist = new URL("../dist/", import.meta.url);
const read = (p) => readFile(new URL(p, dist), "utf8");
const pages = ["index.html", "shop/index.html", "custom-orders/index.html", "about/index.html", "contact/index.html", "404.html",
  ...products.map((p) => `shop/${p.slug}/index.html`)];

test("every page is built", async () => {
  for (const p of pages) await access(new URL(p, dist));
});

test("titles and meta descriptions are unique and include the business name", async () => {
  const titles = new Set(), descs = new Set();
  for (const p of pages) {
    const html = await read(p);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const desc = html.match(/<meta name="description" content="(.*?)">/)[1];
    assert.ok(title.includes(site.businessName.replace(/&/g, "&amp;")), `${p} title`);
    assert.ok(!titles.has(title), `duplicate title on ${p}`);
    assert.ok(!descs.has(desc), `duplicate description on ${p}`);
    titles.add(title); descs.add(desc);
  }
});

test("each page has exactly one h1, a main landmark and a skip link", async () => {
  for (const p of pages) {
    const html = await read(p);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${p} h1 count`);
    assert.match(html, /<main id="main"/);
    assert.match(html, /class="skip-link" href="#main"/);
  }
});

test("all images have alt text and dimensions", async () => {
  for (const p of pages) {
    const html = await read(p);
    for (const img of html.match(/<img\b[^>]*>/g) || []) {
      assert.match(img, /alt="[^"]+"/, `${p}: ${img}`);
      assert.match(img, /width="\d+"/);
      assert.match(img, /height="\d+"/);
    }
  }
});

test("prices are centralised and formatted in Rand", async () => {
  assert.equal(formatPrice(199), "R199");
  const shop = await read("shop/index.html");
  for (const p of products) assert.ok(shop.includes(formatPrice(p.price)), `${p.slug} price shown`);
});

test("WhatsApp CTAs are disabled without a number and never point at an invented one", async () => {
  if (site.whatsappNumber) return;
  assert.equal(whatsappUrl("hi"), null);
  for (const p of pages) assert.ok(!(await read(p)).includes("wa.me/"), `${p} has a wa.me link`);
});

test("product enquiry message names the product", () => {
  const msg = productEnquiryMessage(products[0]);
  assert.ok(msg.includes(products[0].name));
  assert.match(msg, /confirm availability/);
});

test("no reviews section unless real reviews exist", async () => {
  const home = await read("index.html");
  assert.equal(home.includes("From our customers"), reviews.length > 0);
});

test("forms say that submitting does not confirm an order", async () => {
  for (const p of ["custom-orders/index.html", "contact/index.html"]) {
    assert.match(await read(p), /does <strong>not<\/strong> confirm an order/);
  }
});

test("delivery is never described as included", async () => {
  for (const p of pages) assert.doesNotMatch(await read(p), /(free|included) delivery|delivery (is )?included(?! in bouquet prices unless)/i, p);
});
