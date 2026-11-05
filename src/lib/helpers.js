import { site } from "../config/site.js";

export const brandName = () => site.businessName;
export const shortName = () => site.shortName || site.businessName;

/** R199 / R1 299 style formatting. */
export function formatPrice(amount) {
  if (amount === null || amount === undefined) return "Price on request";
  const n = new Intl.NumberFormat(site.locale, {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${site.currencySymbol}${n}`;
}

export function productPriceLabel(product) {
  const p = formatPrice(product.price);
  return product.priceFrom && product.price != null ? `From ${p}` : p;
}

export function whatsappEnabled() {
  return /^\d{9,15}$/.test(site.whatsappNumber || "");
}

/** Returns a wa.me link with a prefilled message, or null when no number is configured. */
export function whatsappUrl(message) {
  if (!whatsappEnabled()) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsappNumber}${text}`;
}

export function productEnquiryMessage(product) {
  const price = product.price != null ? ` (${productPriceLabel(product)})` : "";
  return `Hi! I'm interested in the ${product.name}${price}. Could you please confirm availability, customisation options, and delivery/collection details?`;
}

export const productUrl = (product) => `/shop/${product.slug}/`;

export function absoluteUrl(path) {
  if (!site.siteUrl) return "";
  return site.siteUrl.replace(/\/$/, "") + path;
}

export const socialLinks = () =>
  [
    { label: "Instagram", url: site.instagramUrl },
    { label: "TikTok", url: site.tiktokUrl },
    { label: "Facebook", url: site.facebookUrl },
  ].filter((s) => s.url);
