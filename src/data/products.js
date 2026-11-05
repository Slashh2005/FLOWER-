/**
 * ============================================================
 *  PRODUCT CATALOGUE — edit products and prices here only.
 * ============================================================
 * Prices and specifications below are PLANNING VALUES. The owner
 * must confirm them before launch, then set `confirmed: true` on
 * the relevant fields.
 *
 * Fields:
 *   slug             URL name: /shop/<slug>/  (lowercase, hyphens)
 *   name             Display name
 *   tier             Short label shown on cards
 *   price            Number in Rand (no symbol). null = "Price on request"
 *   priceFrom        true = show "From R…" (price depends on options)
 *   priceConfirmed   false = show "to be confirmed" marker while setup markers are on
 *   shortDescription One sentence for cards
 *   description      Array of paragraphs for the detail page
 *   size             e.g. "7 roses, approx. 30 cm tall". null = not shown until verified
 *   colours          Array of colour names offered. [] = "ask us"
 *   personalisation  Array of options offered. [] = hidden
 *   leadTime         Overrides site.defaultLeadTime when set
 *   images           [{ src, alt, width, height }] — first is the main image
 *   featured         true = shown on the home page
 */
export const products = [
  {
    slug: "mini",
    name: "Mini Bouquet",
    tier: "Mini",
    price: 99,
    priceFrom: false,
    priceConfirmed: false,
    shortDescription: "A small, sweet satin ribbon bouquet — a thoughtful little gift.",
    description: [
      "Our smallest bouquet: handmade satin ribbon flowers, wrapped and ready to give.",
      "A lovely add-on gift, thank-you, or “just because” surprise.",
    ],
    size: null,
    colours: [],
    personalisation: [],
    leadTime: "",
    images: [
      {
        src: "/assets/img/placeholders/bouquet-mini.svg",
        alt: "Placeholder illustration of a small satin ribbon bouquet — real photo coming soon",
        width: 800,
        height: 1000,
      },
    ],
    featured: true,
  },
  {
    slug: "classic",
    name: "Classic Bouquet",
    tier: "Classic",
    price: 199,
    priceFrom: false,
    priceConfirmed: false,
    shortDescription: "A medium bouquet with a fuller arrangement of ribbon flowers.",
    description: [
      "A generous handmade bouquet of satin ribbon flowers, gift-wrapped for birthdays, anniversaries and celebrations.",
      "Choose your colours and we’ll confirm the design with you before it is made.",
    ],
    size: null,
    colours: [],
    personalisation: [],
    leadTime: "",
    images: [
      {
        src: "/assets/img/placeholders/bouquet-classic.svg",
        alt: "Placeholder illustration of a medium satin ribbon bouquet — real photo coming soon",
        width: 800,
        height: 1000,
      },
    ],
    featured: true,
  },
  {
    slug: "premium",
    name: "Premium Bouquet",
    tier: "Premium",
    price: 349,
    priceFrom: false,
    priceConfirmed: false,
    shortDescription: "Our larger statement bouquet for the moments that matter most.",
    description: [
      "A large, full bouquet of handmade satin ribbon flowers with premium gift wrapping.",
      "Ideal for milestone birthdays, anniversaries, graduations and Mother’s Day.",
    ],
    size: null,
    colours: [],
    personalisation: [],
    leadTime: "",
    images: [
      {
        src: "/assets/img/placeholders/bouquet-premium.svg",
        alt: "Placeholder illustration of a large satin ribbon bouquet — real photo coming soon",
        width: 800,
        height: 1000,
      },
    ],
    featured: true,
  },
];
