import { site } from "../config/site.js";
import { products } from "../data/products.js";
import { html, raw } from "./html.js";
import {
  brandName,
  shortName,
  productPriceLabel,
  productUrl,
  whatsappUrl,
  whatsappEnabled,
  productEnquiryMessage,
  socialLinks,
} from "./helpers.js";

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop Bouquets", href: "/shop/" },
  { label: "Custom Orders", href: "/custom-orders/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

/* ---------- Icons (inline, decorative) ---------- */
const icons = {
  whatsapp: raw(
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z"/></svg>'
  ),
  menu: raw(
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
  ),
  close: raw(
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>'
  ),
  check: raw(
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
  ),
};
export { icons };

/* ---------- Small pieces ---------- */

/** "To be confirmed" marker shown only while site.showSetupMarkers is true. */
export const setupMarker = (text = "To be confirmed") =>
  site.showSetupMarkers ? html`<span class="setup-marker">${text}</span>` : "";

export function button({ href, label, variant = "primary", attrs = "" }) {
  return html`<a class="btn btn--${variant}" href="${href}" ${raw(attrs)}>${label}</a>`;
}

/**
 * WhatsApp CTA. With no number configured it renders a disabled button
 * whose text says so (state isn't communicated by colour alone).
 */
export function whatsappButton({ message = "", label = "Chat on WhatsApp", variant = "whatsapp", block = false } = {}) {
  const cls = `btn btn--${variant}${block ? " btn--block" : ""}`;
  const url = whatsappUrl(message);
  if (!url) {
    return html`<button type="button" class="${cls}" disabled title="Add whatsappNumber in src/config/site.js">
      ${icons.whatsapp}<span>${label} <span class="btn__note">(not set up yet)</span></span>
    </button>`;
  }
  return html`<a class="${cls}" href="${url}" target="_blank" rel="noopener">
    ${icons.whatsapp}<span>${label}<span class="visually-hidden"> (opens WhatsApp)</span></span>
  </a>`;
}

export function priceTag(product) {
  return html`<p class="price">
    <span class="price__amount">${productPriceLabel(product)}</span>
    ${product.priceConfirmed ? "" : setupMarker("Price to be confirmed")}
  </p>`;
}

export function sectionHeading({ eyebrow, title, intro, id, level = 2, align = "center" }) {
  const tag = `h${level}`;
  return html`<header class="section-heading section-heading--${align}">
    ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ""}
    ${raw(`<${tag}${id ? ` id="${id}"` : ""}>`)}${title}${raw(`</${tag}>`)}
    ${intro ? html`<p class="section-heading__intro">${intro}</p>` : ""}
  </header>`;
}

/** Responsive <img>. `img.srcset` (optional) lets real photos ship several sizes. */
export function image(img, { eager = false, sizes = "(min-width: 64em) 30vw, (min-width: 40em) 45vw, 100vw", cls = "" } = {}) {
  return html`<img class="${cls}" src="${img.src}" ${img.srcset ? raw(`srcset="${img.srcset}" sizes="${sizes}"`) : ""}
    alt="${img.alt}" width="${img.width}" height="${img.height}"
    ${eager ? raw('fetchpriority="high"') : raw('loading="lazy" decoding="async"')}>`;
}

/* ---------- Product card ---------- */
export function productCard(product, { headingLevel = 3, eager = false } = {}) {
  const tag = `h${headingLevel}`;
  const main = product.images[0];
  return html`<article class="product-card">
    <a class="product-card__media" href="${productUrl(product)}" tabindex="-1" aria-hidden="true">
      ${image(main, { eager })}
    </a>
    <div class="product-card__body">
      <p class="product-card__tier">${product.tier}</p>
      ${raw(`<${tag} class="product-card__title">`)}<a href="${productUrl(product)}">${product.name}</a>${raw(`</${tag}>`)}
      ${priceTag(product)}
      <p class="product-card__desc">${product.shortDescription}</p>
      <div class="product-card__actions">
        ${button({ href: productUrl(product), label: "View details", variant: "secondary" })}
      </div>
    </div>
  </article>`;
}

export function productGrid(list = products, opts = {}) {
  return html`<div class="product-grid">${list.map((p, i) => productCard(p, { ...opts, eager: opts.eager && i === 0 }))}</div>`;
}

export function madeToOrderNotice() {
  return html`<aside class="notice" aria-label="Made to order">
    <p><strong>Every bouquet is made to order.</strong> Lead times vary with the design and how busy we are — we'll confirm timing, final price and delivery or collection before you pay.</p>
  </aside>`;
}

/* ---------- Header ---------- */
export function header(currentPath) {
  const isCurrent = (href) => (href === "/" ? currentPath === "/" : currentPath.startsWith(href));
  const brand = site.logo
    ? html`<img src="${site.logo}" alt="${brandName()}" class="brand__logo" width="160" height="40">`
    : html`<span class="brand__name">${shortName()}</span>`;
  return html`<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand" href="/" ${currentPath === "/" ? raw('aria-current="page"') : ""}>${brand}</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="nav-toggle__open">${icons.menu}</span><span class="nav-toggle__close">${icons.close}</span>
        <span class="nav-toggle__label">Menu</span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul class="site-nav__list">
          ${navItems.map(
            (item) =>
              html`<li><a href="${item.href}" ${isCurrent(item.href) ? raw('aria-current="page"') : ""}>${item.label}</a></li>`
          )}
        </ul>
      </nav>
    </div>
  </header>`;
}

/* ---------- Footer ---------- */
export function footer() {
  const year = new Date().getFullYear();
  const socials = socialLinks();
  return html`<footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__brand">
        <p class="site-footer__name">${brandName()}</p>
        <p>Handmade satin ribbon flower bouquets, made to order in ${site.serviceArea}.</p>
        ${whatsappButton({ label: "WhatsApp us", variant: "whatsapp" })}
      </div>
      <nav class="site-footer__nav" aria-label="Footer">
        <h2 class="site-footer__heading">Explore</h2>
        <ul>${navItems.map((i) => html`<li><a href="${i.href}">${i.label}</a></li>`)}<li><a href="/contact/#faq">FAQ</a></li></ul>
      </nav>
      <div>
        <h2 class="site-footer__heading">Delivery &amp; collection</h2>
        <p>Serving ${site.serviceArea}.</p>
        <p class="small">${site.deliveryPolicy}</p>
      </div>
      <div>
        <h2 class="site-footer__heading">Follow</h2>
        ${socials.length
          ? html`<ul>${socials.map((s) => html`<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}<span class="visually-hidden"> (opens in a new tab)</span></a></li>`)}</ul>`
          : html`<p class="small">Social links coming soon. ${setupMarker("Add in site config")}</p>`}
        ${site.email ? html`<p><a href="mailto:${site.email}">${site.email}</a></p>` : ""}
      </div>
    </div>
    <div class="container site-footer__base">
      <p class="small">&copy; ${year} ${brandName()}. All rights reserved.</p>
    </div>
  </footer>`;
}

/* ---------- Enquiry form ---------- */
const occasionOptions = ["Birthday", "Anniversary / romantic", "Graduation", "Mother's Day", "Other"];

function field({ id, label, required = false, hint = "", control }) {
  return html`<div class="field">
    <label for="${id}">${label}${required ? html` <span class="field__req">(required)</span>` : html` <span class="field__opt">(optional)</span>`}</label>
    ${hint ? html`<p class="field__hint" id="${id}-hint">${hint}</p>` : ""}
    ${control}
    <p class="field__error" id="${id}-error" hidden></p>
  </div>`;
}

const describedBy = (id, hint) => raw(`aria-describedby="${hint ? `${id}-hint ` : ""}${id}-error"`);

/**
 * variant "custom"  – full custom bouquet enquiry
 * variant "contact" – short general message
 */
export function enquiryForm({ variant = "custom" } = {}) {
  const id = (n) => `${variant}-${n}`;
  const uploads = site.formEndpoint && site.formAcceptsUploads;
  const enctype = uploads ? raw('enctype="multipart/form-data"') : "";
  const action = site.formEndpoint ? raw(`action="${site.formEndpoint}" method="POST"`) : raw('action="#" method="POST"');

  const common = html`
    ${field({
      id: id("name"),
      label: "Your name",
      required: true,
      control: html`<input id="${id("name")}" name="name" type="text" autocomplete="name" required ${describedBy(id("name"))}>`,
    })}
    ${field({
      id: id("contact"),
      label: "WhatsApp number or email",
      required: true,
      hint: "So we can reply to you, e.g. 082 123 4567 or name@example.com",
      control: html`<input id="${id("contact")}" name="contact" type="text" autocomplete="on" required data-validate="contact" ${describedBy(id("contact"), true)}>`,
    })}`;

  const customFields = html`
    <div class="form-grid">
      ${field({
        id: id("occasion"),
        label: "Occasion",
        control: html`<select id="${id("occasion")}" name="occasion" ${describedBy(id("occasion"))}>
          <option value="">Choose an occasion</option>
          ${occasionOptions.map((o) => html`<option>${o}</option>`)}
        </select>`,
      })}
      ${field({
        id: id("size"),
        label: "Bouquet size",
        control: html`<select id="${id("size")}" name="bouquet" ${describedBy(id("size"))}>
          <option value="">Not sure yet</option>
          ${products.map((p) => html`<option value="${p.name}" data-slug="${p.slug}">${p.name} — ${productPriceLabel(p)}</option>`)}
          <option value="Custom size">Something else / custom size</option>
        </select>`,
      })}
    </div>
    ${field({
      id: id("colours"),
      label: "Preferred colours",
      hint: "e.g. blush pink and cream, or red and white",
      control: html`<input id="${id("colours")}" name="colours" type="text" ${describedBy(id("colours"), true)}>`,
    })}
    ${field({
      id: id("card"),
      label: "Message card",
      hint: "Write the message you'd like on the card, if any",
      control: html`<textarea id="${id("card")}" name="card_message" rows="3" maxlength="300" ${describedBy(id("card"), true)}></textarea>`,
    })}
    <div class="form-grid">
      ${field({
        id: id("date"),
        label: "Date you need it",
        hint: "We'll confirm whether this date is possible",
        control: html`<input id="${id("date")}" name="date_needed" type="date" data-validate="future-date" ${describedBy(id("date"), true)}>`,
      })}
      <fieldset class="field fieldset">
        <legend>Delivery or collection <span class="field__opt">(optional)</span></legend>
        <div class="choice-list">
          <label class="choice"><input type="radio" name="fulfilment" value="Collection"> Collection</label>
          <label class="choice"><input type="radio" name="fulfilment" value="Delivery"> Delivery</label>
          <label class="choice"><input type="radio" name="fulfilment" value="Not sure yet" checked> Not sure yet</label>
        </div>
      </fieldset>
    </div>
    <div class="field" data-show-when="Delivery" hidden>
      <label for="${id("area")}">Delivery suburb / area <span class="field__opt">(optional)</span></label>
      <input id="${id("area")}" name="delivery_area" type="text" autocomplete="address-level2">
    </div>
    ${uploads
      ? field({
          id: id("image"),
          label: "Reference image",
          hint: "A photo of a style or colours you like (JPG or PNG, max 5 MB)",
          control: html`<input id="${id("image")}" name="reference_image" type="file" accept="image/jpeg,image/png,image/webp" data-max-mb="5" ${describedBy(id("image"), true)}>`,
        })
      : html`<p class="field__hint">Have a reference photo? You can send it to us on WhatsApp once we reply.</p>`}
    ${field({
      id: id("notes"),
      label: "Anything else?",
      control: html`<textarea id="${id("notes")}" name="notes" rows="3" maxlength="1000" ${describedBy(id("notes"))}></textarea>`,
    })}`;

  const contactFields = field({
    id: id("message"),
    label: "Your message",
    required: true,
    control: html`<textarea id="${id("message")}" name="message" rows="5" maxlength="1500" required ${describedBy(id("message"))}></textarea>`,
  });

  const submitLabel = variant === "custom" ? "Send enquiry" : "Send message";

  return html`<form class="enquiry-form" data-enquiry-form data-variant="${variant}" ${action} ${enctype} novalidate>
    <input type="hidden" name="form" value="${variant === "custom" ? "Custom bouquet enquiry" : "General enquiry"}">
    <p class="visually-hidden" aria-hidden="true"><label>Leave this empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></p>
    <div class="form-errors" role="alert" tabindex="-1" hidden></div>
    ${common}
    ${variant === "custom" ? customFields : contactFields}
    <p class="notice notice--quiet">
      Sending this ${variant === "custom" ? "enquiry" : "message"} does <strong>not</strong> confirm an order. We'll get back to you to confirm availability, final pricing and timing.
    </p>
    <button type="submit" class="btn btn--primary btn--block-sm">${submitLabel}</button>
    <p class="form-method small" data-form-method></p>
    <div class="form-status" role="status" aria-live="polite" tabindex="-1" hidden></div>
  </form>`;
}

export { productEnquiryMessage, whatsappEnabled };
