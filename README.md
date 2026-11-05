# Satin Ribbon Flower Bouquet Website

This is a mobile-first storefront for a small handmade satin ribbon bouquet business in South Africa. It's a static site with no dependencies: a small Node build script turns the config and data files into plain HTML. You can host it free on Netlify, Cloudflare Pages or GitHub Pages.

Orders come in through WhatsApp or an enquiry form. There's no checkout, accounts or database yet. The code is laid out so those can be added later.

## Quick start

Requires Node 18 or newer. There's nothing to install.

```bash
npm run dev      # build + preview at http://localhost:8080
npm run build    # build the site into dist/
npm test         # build + run checks
```

After each build you get a **"Still to set up before launch"** checklist showing which settings are still placeholders.

## Where to edit things

| What | File |
| --- | --- |
| Business name, logo, tagline, WhatsApp number, email, social links, service area, hours, delivery, collection and payment policies, form service | `src/config/site.js` |
| Products, prices, sizes, colours, lead times, photos | `src/data/products.js` |
| Occasions, benefits, ordering steps, FAQ, About story, seasonal banner, **real** reviews | `src/data/content.js` |
| Colours, fonts, spacing, corner radius (design tokens) | top of `src/assets/css/styles.css` |
| Favicon | `src/static/favicon.svg` |
| Social sharing image (1200×630) | `src/assets/img/og-image.png` |

Change a value, run `npm run build`, and it updates on every page.

### WhatsApp
Set `whatsappNumber` in international format, digits only. A South African number like `082 123 4567` becomes `27821234567`. Until you set it, the WhatsApp buttons stay disabled and say "(not set up yet)". Each product button pre-fills a message with the product name and price.

### Enquiry forms
The custom-order and contact forms check required fields in the browser, then send in this order of preference:
1. **`formEndpoint` set**: the form posts to a form service such as Formspree, Basin or Netlify Forms. Set `formAcceptsUploads: true` only if that service accepts file uploads. That also turns on the reference-image field.
2. **Otherwise, if a WhatsApp number is set**: WhatsApp opens with the enquiry already written out.
3. **Otherwise, if an email is set**: the customer's email app opens with the enquiry filled in.

None of these messages ever tells the customer their order is confirmed.

### Products and photos
- `price` is a number in Rand, displayed as `R199`. Once a price is confirmed, set `priceConfirmed: true`.
- `size: null` hides the size until it's checked. `colours: []` shows "ask us".
- To swap in real photos, put them in `src/assets/img/products/` and update `images`. Every image needs `alt`, `width` and `height`. For responsive sizes you can add `srcset`, for example `"/assets/img/products/classic-600.webp 600w, /assets/img/products/classic-1200.webp 1200w"`. Use a 4:5 portrait ratio and the same background on every photo, and show the wrapping and the bouquet's size.
- The placeholder illustrations come from `node scripts/make-placeholders.js`. They're clearly labelled as placeholders.

### Reviews
The reviews section is hidden until `reviews` in `content.js` has entries. Only add genuine reviews, with the customer's permission.

### Launch checklist
1. Fill in `businessName`, contact details, `siteUrl` and the policies in `site.js`.
2. Confirm every price (`priceConfirmed: true`), size and lead time.
3. Replace the placeholder photos, the about story and the FAQ answers marked `[ … ]`.
4. Set `showSetupMarkers: false`.
5. Run `npm test`, then deploy the `dist/` folder.

## Hosting
Any static host will do. Set the build command to `npm run build` and the output folder to `dist`. `404.html` is generated, and so is `sitemap.xml` once you set `siteUrl`.

## Structure
```
src/config/site.js     brand + business settings (single source)
src/data/              products and editable content
src/lib/               templating, helpers, reusable components, page layout
src/pages/             one module per page (title, description, body)
src/assets/            CSS, JS, images (copied to dist/assets)
src/static/            files copied to the site root (favicon)
scripts/               build, preview server, placeholder generator
tests/                 checks on the built output
```

### Adding online checkout later
Product data already has stable `slug`s and numeric `price`s. A cart or payment link (for example PayFast or Yoco) can be added as another button in `src/pages/shop.js` without changing the catalogue data.
