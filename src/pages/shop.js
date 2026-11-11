import { site } from "../config/site.js";
import { products } from "../data/products.js";
import { html } from "../lib/html.js";
import {
  sectionHeading,
  pageHero,
  productGrid,
  madeToOrderNotice,
  priceTag,
  whatsappButton,
  button,
  image,
  setupMarker,
} from "../lib/components.js";
import { productEnquiryMessage, productUrl } from "../lib/helpers.js";

export const shopPage = () => ({
  path: "/shop/",
  title: "Shop satin ribbon flower bouquets",
  description: `Browse handmade satin ribbon flower bouquets in Mini, Classic and Premium sizes. Made to order in ${site.serviceArea}.`,
  body: html`
    ${pageHero({
      eyebrow: "The collection",
      title: "Shop bouquets",
      script: "in your colours",
      intro: "Handmade satin ribbon bouquets in three sizes. Choose your colours when you enquire.",
    })}
    <section class="section">
      <div class="container">
        ${madeToOrderNotice()}
        ${productGrid(products, { headingLevel: 2, eager: true })}
      </div>
    </section>
    <section class="closing closing--compact" aria-labelledby="different-title">
      <div class="container closing__inner">
        <p class="script closing__script" aria-hidden="true" data-reveal>something different?</p>
        <h2 id="different-title" class="display" data-reveal>Let's design it together</h2>
        <p data-reveal>Other sizes, colours and wrapping — tell us what you have in mind.</p>
        <div class="btn-row btn-row--center" data-reveal>${button({ href: "/custom-orders/", label: "Request a custom bouquet", variant: "light" })}</div>
      </div>
    </section>`,
});

function detailRow(label, value, marker) {
  return html`<div class="details__row"><dt>${label}</dt><dd>${value} ${marker || ""}</dd></div>`;
}

export const productPage = (product) => {
  const others = products.filter((p) => p.slug !== product.slug);
  const [main, ...gallery] = product.images;
  const leadTime = product.leadTime || site.defaultLeadTime;

  return {
    path: productUrl(product),
    title: `${product.name} — satin ribbon flowers`,
    description: `${product.shortDescription} Handmade to order in ${site.serviceArea}.`,
    image: main.src.endsWith(".svg") ? undefined : main.src,
    body: html`
      <nav class="breadcrumb container" aria-label="Breadcrumb">
        <ol><li><a href="/">Home</a></li><li><a href="/shop/">Shop</a></li><li><span aria-current="page">${product.name}</span></li></ol>
      </nav>
      <section class="section section--tight">
        <div class="container product">
          <div class="product__media">
            <div class="product__window">${image(main, { eager: true, sizes: "(min-width: 56em) 50vw, 100vw", cls: "product__main-img" })}</div>
            ${gallery.length
              ? html`<ul class="product__gallery" role="list">${gallery.map((g) => html`<li>${image(g, { sizes: "25vw" })}</li>`)}</ul>`
              : ""}
          </div>
          <div class="product__info">
            <p class="eyebrow" data-reveal>${product.tier}</p>
            <h1 class="product__title" data-reveal>${product.name}</h1>
            <p class="script product__script" aria-hidden="true" data-reveal>handmade for you</p>
            <div data-reveal>${priceTag(product)}</div>
            <p class="small muted" data-reveal>Price excludes delivery.</p>
            <div class="product__desc" data-reveal>${product.description.map((p) => html`<p>${p}</p>`)}</div>

            <dl class="details" data-reveal>
              ${product.size
                ? detailRow("Size", product.size)
                : detailRow("Size", "Size details coming soon", setupMarker())}
              ${detailRow(
                "Colours",
                product.colours.length ? product.colours.join(", ") : "Ask us about colour options when you enquire"
              )}
              ${product.personalisation.length ? detailRow("Personalisation", product.personalisation.join(", ")) : ""}
              ${detailRow("Made to order", leadTime)}
              ${detailRow("Collection", site.collectionPolicy)}
              ${detailRow("Delivery", site.deliveryPolicy)}
            </dl>

            <div class="btn-stack" data-reveal>
              ${whatsappButton({ message: productEnquiryMessage(product), label: `Order the ${product.tier} on WhatsApp`, block: true })}
              ${button({ href: `/custom-orders/?bouquet=${product.slug}#enquiry`, label: "Customise this bouquet", variant: "secondary", attrs: 'data-block="true"' })}
            </div>
            <p class="small muted">Your order is only confirmed once we've agreed the design, price and delivery or collection with you.</p>
          </div>
        </div>
      </section>
      <section class="section section--tint" aria-labelledby="more-title">
        <div class="container">
          ${sectionHeading({ title: "You might also like", script: "more to love", id: "more-title" })}
          ${productGrid(others)}
        </div>
      </section>`,
  };
};
