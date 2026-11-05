/**
 * ============================================================
 *  BRAND & BUSINESS SETTINGS — the single place to rebrand.
 * ============================================================
 * Change a value here, run `npm run build`, and every page updates.
 * Leave a value as an empty string ("") until it is confirmed:
 * the site hides or disables anything that depends on it.
 */
export const site = {
  // ---- Identity -------------------------------------------------
  businessName: "[Business name to be decided]",
  // Short version used in tight spaces (mobile header). Defaults to businessName.
  shortName: "",
  // Path to a logo inside src/assets (e.g. "/assets/img/logo.svg"). Empty = text wordmark.
  logo: "",
  tagline: "[Tagline to be decided]",

  // Public URL once the site is hosted, without trailing slash
  // (e.g. "https://www.example.co.za"). Used for canonical links,
  // Open Graph and the sitemap. Empty = those are skipped.
  siteUrl: "",

  // ---- Contact --------------------------------------------------
  // International format, digits only, no "+" or spaces (e.g. "27821234567").
  // Empty = WhatsApp buttons are shown disabled and marked "not set up yet".
  whatsappNumber: "",
  email: "",
  instagramUrl: "",
  tiktokUrl: "",
  facebookUrl: "",

  // ---- Service details (confirm before publishing) --------------
  serviceArea: "Johannesburg, Gauteng",
  businessHours: "[Business hours to be confirmed]",
  deliveryPolicy:
    "[Delivery policy to be confirmed — areas covered, fees and timing.] Delivery is not included in bouquet prices unless stated.",
  collectionPolicy:
    "[Collection policy to be confirmed — collection point and times will be shared when your order is confirmed.]",
  paymentPolicy:
    "[Payment process to be confirmed — e.g. deposit or full payment before your bouquet is made.]",
  defaultLeadTime: "[Lead time to be confirmed — usually a few days, depending on design and demand.]",

  // ---- Enquiry form ---------------------------------------------
  // Optional URL of a form service that accepts POSTed form data
  // (e.g. Formspree, Basin, Netlify Forms endpoint).
  // Empty = the form opens WhatsApp (or email) with the details pre-filled instead.
  formEndpoint: "",
  // Set true only if the form service above accepts file uploads.
  formAcceptsUploads: false,

  // ---- Pre-launch helpers ---------------------------------------
  // While true, small "to be confirmed" markers appear next to unconfirmed
  // prices and details so reviewers can see what still needs checking.
  // Set to false when everything has been confirmed.
  showSetupMarkers: true,

  // Currency formatting
  locale: "en-ZA",
  currencySymbol: "R",
};
