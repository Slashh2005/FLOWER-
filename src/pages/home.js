import { site } from "../config/site.js";
import { products } from "../data/products.js";
import { occasions, benefits, orderSteps, reviews, seasonalBanner } from "../data/content.js";
import { html } from "../lib/html.js";
import { button, sectionHeading, productGrid, whatsappButton, icons, image } from "../lib/components.js";

export const homePage = () => ({
  path: "/",
  title: "Handmade satin ribbon flower bouquets",
  description: `Handmade, long-lasting satin ribbon flower bouquets for birthdays, anniversaries, graduations and more. Made to order in ${site.serviceArea}.`,
  body: html`
    ${seasonalBanner.enabled
      ? html`<div class="banner"><div class="container"><p>${seasonalBanner.text} <a href="${seasonalBanner.href}">${seasonalBanner.linkText}</a></p></div></div>`
      : ""}

    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero__inner">
        <div class="hero__content">
          <p class="eyebrow">Handmade in ${site.serviceArea}</p>
          <h1 id="hero-title">Flowers that last, made by hand</h1>
          <p class="hero__lead">Satin ribbon flower bouquets, folded petal by petal and wrapped ready to give — a gift they can keep long after the day.</p>
          <div class="btn-row">
            ${button({ href: "/shop/", label: "Shop Bouquets" })}
            ${button({ href: "/custom-orders/", label: "Create a Custom Bouquet", variant: "secondary" })}
          </div>
        </div>
        <div class="hero__media">
          ${image(
            {
              src: "/assets/img/placeholders/hero.svg",
              alt: "Placeholder illustration of a wrapped satin ribbon flower bouquet — real photo coming soon",
              width: 960,
              height: 1080,
            },
            { eager: true, sizes: "(min-width: 56em) 45vw, 100vw" }
          )}
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="featured-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "The collection", title: "Featured bouquets", id: "featured-title", intro: "Three sizes to start with — every one can be made in your choice of colours." })}
        ${productGrid(products.filter((p) => p.featured))}
        <p class="center mt-l">${button({ href: "/shop/", label: "See all bouquets", variant: "text" })}</p>
      </div>
    </section>

    <section class="section section--tint" aria-labelledby="why-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "Why ribbon flowers", title: "A bouquet that keeps", id: "why-title" })}
        <ul class="feature-grid" role="list">
          ${benefits.map((b) => html`<li class="feature"><span class="feature__icon">${icons.check}</span><h3>${b.title}</h3><p>${b.text}</p></li>`)}
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="custom-title">
      <div class="container split">
        <div>
          ${sectionHeading({ eyebrow: "Custom orders", title: "Make it yours", id: "custom-title", align: "start" })}
          <p>Tell us the colours, the bouquet size and what you'd like on the message card. We'll confirm what's possible, the final price and timing before anything is made.</p>
          <p class="small muted">Custom requests are subject to ribbon and material availability.</p>
          <div class="btn-row">
            ${button({ href: "/custom-orders/#enquiry", label: "Start a custom enquiry" })}
            ${whatsappButton({ message: "Hi! I'd like to ask about a custom satin ribbon bouquet.", label: "Ask on WhatsApp" })}
          </div>
        </div>
        <ul class="occasion-list" role="list" aria-label="Occasions">
          ${occasions.map((o) => html`<li class="occasion"><h3>${o.name}</h3><p>${o.text}</p></li>`)}
        </ul>
      </div>
    </section>

    <section class="section section--tint" aria-labelledby="how-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "Ordering", title: "How ordering works", id: "how-title" })}
        <ol class="steps">
          ${orderSteps.map((s) => html`<li class="step"><h3>${s.title}</h3><p>${s.text}</p></li>`)}
        </ol>
      </div>
    </section>

    ${reviews.length
      ? html`<section class="section" aria-labelledby="reviews-title">
          <div class="container">
            ${sectionHeading({ eyebrow: "Kind words", title: "From our customers", id: "reviews-title" })}
            <ul class="review-grid" role="list">
              ${reviews.map(
                (r) => html`<li><figure class="review">
                  <blockquote><p>${r.quote}</p></blockquote>
                  <figcaption>${r.name}${r.occasion ? html` · ${r.occasion}` : ""}</figcaption>
                </figure></li>`
              )}
            </ul>
          </div>
        </section>`
      : ""}
  `,
});
