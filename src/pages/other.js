import { site } from "../config/site.js";
import { aboutStory, faqs, orderSteps } from "../data/content.js";
import { html } from "../lib/html.js";
import { sectionHeading, pageHero, enquiryForm, whatsappButton, button, setupMarker, image } from "../lib/components.js";
import { brandName, socialLinks as getSocials } from "../lib/helpers.js";

export const customOrdersPage = () => ({
  path: "/custom-orders/",
  title: "Custom satin ribbon bouquets",
  description: `Request a custom satin ribbon flower bouquet in your colours and size, with a message card. Handmade to order in ${site.serviceArea}.`,
  body: html`
    ${pageHero({
      eyebrow: "Custom orders",
      title: "Custom bouquets",
      script: "made just for them",
      intro: "Choose the colours, the size and the message. We'll help you design a bouquet that suits the person and the occasion.",
      tone: "night",
    })}
    <section class="section">
      <div class="container">
        <ol class="mini-steps" role="list">
          ${orderSteps.slice(1, 4).map(
            (s, i) => html`<li class="mini-step" data-reveal style="--d:${i}"><span class="mini-step__num" aria-hidden="true">0${i + 1}</span><h2 class="h3">${s.title}</h2><p>${s.text}</p></li>`
          )}
        </ol>
      </div>
    </section>
    <section class="section section--tint" aria-labelledby="enquiry">
      <div class="container narrow">
        <div class="card card--form" data-reveal>
          ${sectionHeading({ title: "Custom bouquet enquiry", id: "enquiry", align: "start", intro: "Fill in what you know — we'll help with the rest." })}
          ${enquiryForm({ variant: "custom" })}
        </div>
        <p class="center mt-l">Prefer to chat? ${whatsappButton({ message: "Hi! I'd like to ask about a custom satin ribbon bouquet.", label: "Message us on WhatsApp", variant: "whatsapp" })}</p>
      </div>
    </section>`,
});

export const aboutPage = () => ({
  path: "/about/",
  title: "About us",
  description: `${brandName()} makes satin ribbon flower bouquets by hand in ${site.serviceArea}.`,
  body: html`
    ${pageHero({ eyebrow: "Our story", title: "About", script: "folded with care", tone: "petal" })}
    <section class="section">
      <div class="container about">
        <div class="about__window">
          ${image(
            { src: "/assets/img/placeholders/detail.svg", alt: "Placeholder illustration of ribbon roses close up — real photo coming soon", width: 900, height: 1100 },
            { sizes: "(min-width: 56em) 40vw, 100vw" }
          )}
        </div>
        <div class="prose">
          ${setupMarker("Placeholder story — replace with the owner's own words")}
          ${aboutStory.map((p) => html`<p data-reveal>${p}</p>`)}
          <h2 class="display" data-reveal>How each bouquet is made</h2>
          <p data-reveal>Every flower starts as a length of satin ribbon that is folded, shaped and secured by hand. The flowers are then arranged, wrapped and finished as a gift-ready bouquet.</p>
          <div class="btn-row" data-reveal>
            ${button({ href: "/shop/", label: "Shop Bouquets" })}
            ${button({ href: "/custom-orders/", label: "Create a Custom Bouquet", variant: "secondary" })}
          </div>
        </div>
      </div>
    </section>`,
});

export const contactPage = () => {
  const socials = getSocials();
  return {
    path: "/contact/",
    title: "Contact & FAQ",
    description: `Contact ${brandName()} about satin ribbon flower bouquets — WhatsApp, email and frequently asked questions. Serving ${site.serviceArea}.`,
    body: html`
      ${pageHero({ eyebrow: "Say hello", title: "Contact", script: "we'd love to hear from you", intro: "WhatsApp is the quickest way to reach us.", tone: "petal" })}
      <section class="section">
        <div class="container">
          <div class="contact-grid">
            <div class="card card--night contact-card" data-reveal>
              <h2 class="h3">Get in touch</h2>
              ${whatsappButton({ message: "Hi! I have a question about your satin ribbon bouquets.", label: "Chat on WhatsApp", block: true })}
              <dl class="details">
                <div class="details__row"><dt>Email</dt><dd>${site.email ? html`<a href="mailto:${site.email}">${site.email}</a>` : html`Coming soon ${setupMarker("Add in site config")}`}</dd></div>
                <div class="details__row"><dt>Social</dt><dd>${socials.length
                  ? socials.map((s, i) => html`${i ? ", " : ""}<a href="${s.url}" target="_blank" rel="noopener">${s.label}<span class="visually-hidden"> (opens in a new tab)</span></a>`)
                  : html`Coming soon ${setupMarker("Add in site config")}`}</dd></div>
                <div class="details__row"><dt>Service area</dt><dd>${site.serviceArea} ${setupMarker()}</dd></div>
                <div class="details__row"><dt>Hours</dt><dd>${site.businessHours}</dd></div>
                <div class="details__row"><dt>Collection</dt><dd>${site.collectionPolicy}</dd></div>
                <div class="details__row"><dt>Delivery</dt><dd>${site.deliveryPolicy}</dd></div>
              </dl>
            </div>
            <div class="card card--form" data-reveal style="--d:1">
              <h2 class="h3" id="contact-form-title">Send a message</h2>
              ${enquiryForm({ variant: "contact" })}
            </div>
          </div>
        </div>
      </section>
      <section class="section section--tint" aria-labelledby="faq">
        <div class="container narrow">
          ${sectionHeading({ title: "Frequently asked questions", script: "good to know", id: "faq" })}
          <div class="faq">
            ${faqs.map((f, i) => html`<details class="faq__item" data-reveal style="--d:${i % 3}"><summary>${f.q}</summary><div class="faq__answer"><p>${f.a}</p></div></details>`)}
          </div>
        </div>
      </section>`,
  };
};

export const notFoundPage = () => ({
  path: "/404.html",
  title: "Page not found",
  description: "The page you were looking for could not be found.",
  noindex: true,
  body: html`
    ${pageHero({ title: "Page not found", script: "oops", intro: "Sorry, we couldn't find that page." })}
    <section class="section">
      <div class="container center">
        <div class="btn-row btn-row--center">${button({ href: "/", label: "Go to the home page" })}${button({ href: "/shop/", label: "Shop Bouquets", variant: "secondary" })}</div>
      </div>
    </section>`,
});
