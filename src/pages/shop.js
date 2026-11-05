import { site } from "../config/site.js";
import { products } from "../data/products.js";
import { html } from "../lib/html.js";
import {
  sectionHeading,
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
    <section class="section section--first">
      <div class="container">
        ${sectionHeading({ title: "Shop bouquets", level: 1, intro: "Handmade satin ribbon bouquets in three sizes. Choose your colours when you enquire." })}
        ${madeToOrderNotice()}
        ${productGrid(products, { headingLevel: 2, eager: true })}
        <div class="cta-panel">
          <h2>Looking for something different?</h2>
          <p>We can talk about other sizes, colours and wrapping.</p>
          ${button({ href: "/custom-orders/", label: "Request a custom bouquet", variant: "secondary" })}
        </div>
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
            ${image(main, { eager: true, sizes: "(min-width: 56em) 50vw, 100vw", cls: "product__main-img" })}
            ${gallery.length
              ? html`<ul class="product__gallery" role="list">${gallery.map((g) => html`<li>${image(g, { sizes: "25vw" })}</li>`)}</ul>`
              : ""}
          </div>
          <div class="product__info">
            <p class="eyebrow">${product.tier}</p>
            <h1>${product.name}</h1>
            ${priceTag(product)}
            <p class="small muted">Price excludes delivery.</p>
            ${product.description.map((p) => html`<p>${p}</p>`)}

            <dl class="details">
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

            <div class="btn-stack">
              ${whatsappButton({ message: productEnquiryMessage(product), label: `Order the ${product.tier} on WhatsApp`, block: true })}
              ${button({ href: `/custom-orders/?bouquet=${product.slug}#enquiry`, label: "Customise this bouquet", variant: "secondary", attrs: 'data-block="true"' })}
            </div>
            <p class="small muted">Your order is only confirmed once we've agreed the design, price and delivery or collection with you.</p>
          </div>
        </div>
      </section>
      <section class="section section--tint" aria-labelledby="more-title">
        <div class="container">
          ${sectionHeading({ title: "You might also like", id: "more-title" })}
          ${productGrid(others)}
        </div>
      </section>`,
  };
};
