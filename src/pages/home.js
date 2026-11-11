import { site } from "../config/site.js";
import { products } from "../data/products.js";
import { occasions, benefits, orderSteps, reviews, seasonalBanner } from "../data/content.js";
import { html } from "../lib/html.js";
import { button, sectionHeading, whatsappButton, icons, image, priceTag } from "../lib/components.js";
import { productUrl } from "../lib/helpers.js";

/*
 * Home page scenes (scroll motion lives in styles.css under "SCROLL SCENES"):
 *   hero        – headline words rise in; the image zooms and dims as you leave
 *   statement   – dark panel rises over the hero as a widening arch; script line drifts
 *   collection  – sticky frame beside the bouquet list; each bouquet's picture wipes in as its row passes
 *   ribbon      – two lines of text slide in opposite directions
 *   reasons     – columns start staggered and settle into line
 *   steps       – section pins while five panels slide sideways, each a shade deeper
 *   custom      – picture opens like a window; occasion gift tags spread out from a pile
 *   closing     – call to action; footer words slide together
 */

const pad = (n) => String(n + 1).padStart(2, "0");

export const homePage = () => {
  const featured = products.filter((p) => p.featured);
  const scope = featured.map((_, i) => `--pick-${i}`).join(", ");
  const ribbonWords = occasions.map((o) => o.name);

  return {
    path: "/",
    title: "Handmade satin ribbon flower bouquets",
    description: `Handmade, long-lasting satin ribbon flower bouquets for birthdays, anniversaries, graduations and more. Made to order in ${site.serviceArea}.`,
    bodyClass: "page-home",
    body: html`
    ${seasonalBanner.enabled
      ? html`<div class="banner"><div class="container"><p>${seasonalBanner.text} <a href="${seasonalBanner.href}">${seasonalBanner.linkText}</a></p></div></div>`
      : ""}

    <!-- HERO -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="container hero__type">
        <p class="eyebrow hero__eyebrow">Handmade satin ribbon bouquets · ${site.serviceArea}</p>
        <h1 class="hero__title" id="hero-title">
          <span class="hero__word">Flowers</span>
          <span class="hero__script script">made to keep</span>
        </h1>
        <div class="hero__row">
          <p class="hero__lead">Every petal folded by hand from satin ribbon, wrapped and ready to give. A bouquet they can keep on the shelf long after the day.</p>
          <div class="btn-row">
            ${button({ href: "/shop/", label: "Shop Bouquets" })}
            ${button({ href: "/custom-orders/", label: "Create a Custom Bouquet", variant: "secondary" })}
          </div>
        </div>
      </div>
      <div class="hero__media">
        ${image(
          {
            src: "/assets/img/placeholders/hero.svg",
            alt: "Placeholder illustration of a wrapped satin ribbon bouquet — real photo coming soon",
            width: 1600,
            height: 1000,
          },
          { eager: true, sizes: "100vw" }
        )}
      </div>
    </section>

    <!-- STATEMENT -->
    <section class="statement" aria-label="About our bouquets">
      <div class="container statement__inner">
        <p class="eyebrow eyebrow--light" data-reveal>Satin ribbon flowers</p>
        <p class="statement__text" data-reveal>No water, no wilting. Each flower starts as a length of satin ribbon and is folded, shaped and wrapped by hand into a gift-ready bouquet.</p>
      </div>
      <p class="statement__script script" aria-hidden="true">petal by petal</p>
    </section>

    <!-- COLLECTION -->
    <section class="collection" aria-labelledby="collection-title" style="timeline-scope: ${scope}">
      <div class="container">
        ${sectionHeading({ eyebrow: "The collection", title: "Three sizes, your colours", script: "pick your bouquet", id: "collection-title", align: "start" })}
        <div class="collection__layout">
          <div class="collection__frame" aria-hidden="true">
            ${featured.map(
              (p, i) => html`<div class="collection__frame-img" style="--i:${i}; animation-timeline: --pick-${i}">${image(p.images[0], { decorative: true, sizes: "45vw" })}</div>`
            )}
          </div>
          <ol class="collection__list" role="list">
            ${featured.map(
              (p, i) => html`<li class="pick" style="view-timeline-name: --pick-${i}">
                <div class="pick__img">${image(p.images[0], { sizes: "100vw" })}</div>
                <p class="pick__num">${pad(i)}</p>
                <h3 class="pick__name"><a href="${productUrl(p)}">${p.name}</a></h3>
                ${priceTag(p)}
                <p class="pick__desc">${p.shortDescription}</p>
                <a class="link-arrow" href="${productUrl(p)}">View details<span class="visually-hidden"> about the ${p.name}</span> ${icons.arrow}</a>
              </li>`
            )}
          </ol>
        </div>
      </div>
    </section>

    <!-- RIBBON -->
    <section class="ribbon" aria-label="Occasions">
      <p class="ribbon__line ribbon__line--a script" aria-hidden="true">${[...ribbonWords, ...ribbonWords].map((w) => html`<span>${w}</span>`)}</p>
      <p class="ribbon__line ribbon__line--b" aria-hidden="true">${[0, 1, 2].map(() => html`<span>Handmade</span><span>Long-lasting</span><span>Gift-ready</span><span>Made to order</span>`)}</p>
      <p class="visually-hidden">Bouquets for ${ribbonWords.join(", ")}.</p>
    </section>

    <!-- REASONS -->
    <section class="reasons" aria-labelledby="why-title">
      <div class="container">
        ${sectionHeading({ eyebrow: "Why ribbon flowers", title: "A bouquet that keeps", id: "why-title" })}
        <ul class="reasons__grid" role="list">
          ${benefits.map(
            (b, i) => html`<li class="reason" style="--i:${i}">
              <span class="reason__num" aria-hidden="true">${pad(i)}</span>
              <h3>${b.title}</h3>
              <p>${b.text}</p>
            </li>`
          )}
        </ul>
      </div>
    </section>

    <!-- STEPS -->
    <section class="steps-track" aria-labelledby="how-title" style="--n:${orderSteps.length + 1}">
      <div class="steps-track__sticky">
        <ol class="steps-track__rail" role="list">
          <li class="steps-track__panel steps-track__panel--intro">
            <div class="steps-track__intro">
              <p class="eyebrow">Ordering</p>
              <h2 id="how-title" class="display">How ordering works</h2>
              <p class="script" aria-hidden="true">simple as that</p>
              <p class="steps-track__hint">Five steps from idea to bouquet.</p>
            </div>
          </li>
          ${orderSteps.map(
            (s, i) => html`<li class="steps-track__panel" style="--i:${i}">
              <span class="steps-track__num" aria-hidden="true">${pad(i)}</span>
              <div class="steps-track__copy">
                <p class="eyebrow">Step ${i + 1} of ${orderSteps.length}</p>
                <h3>${s.title}</h3>
                <p>${s.text}</p>
              </div>
            </li>`
          )}
        </ol>
      </div>
    </section>

    <!-- CUSTOM -->
    <section class="custom" aria-labelledby="custom-title">
      <div class="container custom__layout">
        <div class="custom__window">
          ${image(
            { src: "/assets/img/placeholders/detail.svg", alt: "Placeholder illustration of ribbon roses close up — real photo coming soon", width: 900, height: 1100 },
            { sizes: "(min-width: 56em) 45vw, 100vw" }
          )}
        </div>
        <div class="custom__copy">
          ${sectionHeading({ eyebrow: "Custom orders", title: "Make it yours", script: "your colours", id: "custom-title", align: "start" })}
          <p data-reveal>Tell us the colours, the bouquet size and what you'd like on the message card. We'll confirm what's possible, the final price and timing before anything is made.</p>
          <p class="small muted" data-reveal>Custom requests are subject to ribbon and material availability.</p>
          <div class="btn-row" data-reveal>
            ${button({ href: "/custom-orders/#enquiry", label: "Start a custom enquiry" })}
            ${whatsappButton({ message: "Hi! I'd like to ask about a custom satin ribbon bouquet.", label: "Ask on WhatsApp" })}
          </div>
        </div>
      </div>
      <div class="container">
        <h3 class="tags__title" data-reveal>Made for</h3>
        <ul class="tags" role="list">
          ${occasions.map(
            (o, i) => html`<li class="tag" style="--i:${i}">
              <span class="tag__hole" aria-hidden="true"></span>
              <h4 class="tag__name">${o.name}</h4>
              <p>${o.text}</p>
            </li>`
          )}
        </ul>
      </div>
    </section>

    ${reviews.length
      ? html`<section class="section reviews" aria-labelledby="reviews-title">
          <div class="container">
            ${sectionHeading({ eyebrow: "Kind words", title: "From our customers", id: "reviews-title" })}
            <ul class="review-grid" role="list">
              ${reviews.map(
                (r) => html`<li><figure class="review" data-reveal>
                  <blockquote><p>${r.quote}</p></blockquote>
                  <figcaption>${r.name}${r.occasion ? html` · ${r.occasion}` : ""}</figcaption>
                </figure></li>`
              )}
            </ul>
          </div>
        </section>`
      : ""}

    <!-- CLOSING -->
    <section class="closing" aria-labelledby="closing-title">
      <div class="container closing__inner">
        <p class="script closing__script" aria-hidden="true" data-reveal>ready when you are</p>
        <h2 id="closing-title" class="display" data-reveal>Give flowers that stay</h2>
        <div class="btn-row btn-row--center" data-reveal>
          ${button({ href: "/shop/", label: "Shop Bouquets", variant: "light" })}
          ${whatsappButton({ message: "Hi! I'd like to order a satin ribbon bouquet.", label: "Order on WhatsApp" })}
        </div>
      </div>
    </section>
  `,
  };
};

