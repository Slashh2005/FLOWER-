/**
 * Editable site content that isn't product data.
 * Keep claims factual. Do not add reviews that are not real.
 */

export const occasions = [
  { name: "Birthdays", text: "A colourful bouquet that's still beautiful long after the party." },
  { name: "Anniversaries", text: "A romantic keepsake in their favourite colours." },
  { name: "Graduations", text: "Celebrate the achievement with flowers that keep." },
  { name: "Mother's Day", text: "A handmade thank-you she can keep on display." },
  { name: "Just because", text: "Any other special moment — or no reason at all." },
];

export const benefits = [
  { title: "Long-lasting", text: "Ribbon flowers don't wilt, so the bouquet can be kept and displayed." },
  { title: "Handmade", text: "Each flower is folded and shaped by hand, one bouquet at a time." },
  { title: "Customisable", text: "Request colours, bouquet size and a message card, subject to availability." },
  { title: "Gift-ready", text: "Bouquets are wrapped and ready to hand over." },
];

export const orderSteps = [
  { title: "Choose a bouquet", text: "Browse the shop or describe a custom design." },
  { title: "Send an enquiry", text: "Message us on WhatsApp or use the enquiry form." },
  { title: "Confirm the details", text: "We'll confirm design, final price, timing and delivery or collection." },
  { title: "Pay as agreed", text: "Payment follows the process we agree on together." },
  { title: "Receive your bouquet", text: "Collect it or have it delivered, as arranged." },
];

/**
 * Real customer reviews ONLY. The reviews section stays hidden while this is empty.
 * Format: { quote: "…", name: "First name or initials", occasion: "Birthday", image: optional {src, alt} }
 * Only add a review with the customer's permission.
 */
export const reviews = [];

/** FAQ — answers marked [ ] need the owner's confirmation. */
export const faqs = [
  {
    q: "What are satin ribbon flowers?",
    a: "They are flowers made by hand from satin ribbon, folded and shaped into petals. They are not fresh flowers, so they don't need water and don't wilt.",
  },
  {
    q: "How long does an order take?",
    a: "Bouquets are made to order. We'll confirm the timing when you enquire. [Typical lead time to be confirmed.]",
  },
  {
    q: "Can I choose the colours?",
    a: "Yes — tell us your preferred colours and we'll confirm what's available before your bouquet is made.",
  },
  {
    q: "Do you deliver?",
    a: "[Delivery details to be confirmed.] Delivery is not included in bouquet prices unless we tell you otherwise.",
  },
  {
    q: "How do I pay?",
    a: "[Payment process to be confirmed.] You'll only be asked to pay once we've agreed the design, price and timing.",
  },
  {
    q: "How should I care for my bouquet?",
    a: "Keep it dry and out of strong direct sunlight, and dust it gently. [Care tips to be confirmed by the maker.]",
  },
];

/** Optional seasonal banner on the home page. Set `enabled: true` to show it. */
export const seasonalBanner = {
  enabled: false,
  text: "Mother's Day orders are open — order early to secure your date.",
  linkText: "Shop bouquets",
  href: "/shop/",
};

/** About page story — replace with the owner's own words. */
export const aboutStory = [
  "[Owner's story to be added.] This is a small, home-based business making satin ribbon flower bouquets by hand.",
  "Ribbon flowers are a way to give flowers that last: each petal is folded, shaped and assembled by hand, so no two bouquets are exactly alike.",
  "[Add a few sentences about why you started, what you love about making bouquets, and what customers can expect.]",
];
