/**
 * Generates the clearly-labelled placeholder illustrations in
 * src/assets/img/placeholders/. Run once: node scripts/make-placeholders.js
 * Replace these with real product photos as soon as they exist.
 */
import { writeFile, mkdir } from "node:fs/promises";

const dir = new URL("../src/assets/img/placeholders/", import.meta.url);
await mkdir(dir, { recursive: true });

const roseColours = ["#C98291", "#E8B4BC", "#6F3548", "#F2D4D7", "#B5687A"];

function rose(x, y, r, colour) {
  // Stylised folded-ribbon rose: a disc with a spiral of "folds".
  const s = r * 0.62;
  return `<g transform="translate(${x} ${y})">
    <circle r="${r}" fill="${colour}"/>
    <path d="M0 0 m-${s * 0.15} 0 a${s * 0.15} ${s * 0.15} 0 1 1 ${s * 0.3} 0 a${s * 0.35} ${s * 0.35} 0 1 1 -${s * 0.7} 0 a${s * 0.6} ${s * 0.6} 0 1 1 ${s * 1.2} 0 a${s * 0.85} ${s * 0.85} 0 1 1 -${s * 1.7} 0"
      fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="${Math.max(2, r * 0.08)}" stroke-linecap="round"/>
  </g>`;
}

function leaf(x, y, rot) {
  return `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0 C 18 -28 52 -28 70 0 C 52 28 18 28 0 0Z" fill="#A8B5A0"/>`;
}

function bouquet({ w, h, roses, label, scale = 1 }) {
  const cx = w / 2;
  const top = h * 0.2;
  // Arrange roses in rings
  const items = [];
  const r = 46 * scale;
  let placed = 0;
  let ring = 0;
  while (placed < roses) {
    const count = ring === 0 ? 1 : ring * 6;
    for (let i = 0; i < count && placed < roses; i++, placed++) {
      const a = (i / count) * Math.PI * 2 + ring * 0.4;
      const dist = ring * r * 1.7;
      items.push(rose(cx + Math.cos(a) * dist, top + 150 * scale + Math.sin(a) * dist * 0.75, r, roseColours[(placed + ring) % roseColours.length]));
    }
    ring++;
  }
  const spread = Math.min(ring, 4) * r * 1.7 + r;
  const leaves = [
    leaf(cx - spread * 0.9, top + 190 * scale, -150),
    leaf(cx + spread * 0.9, top + 190 * scale, -30),
    leaf(cx - spread * 0.6, top + 60 * scale, -120),
    leaf(cx + spread * 0.6, top + 60 * scale, -60),
  ].join("");
  const wrapTop = top + 170 * scale + ring * r * 0.9;
  const wrapW = spread * 1.15;
  const wrap = `
    <path d="M${cx - wrapW} ${wrapTop} L${cx + wrapW} ${wrapTop} L${cx + 60} ${h * 0.84} L${cx - 60} ${h * 0.84} Z" fill="#FFFFFF" stroke="#EAD8D9" stroke-width="3"/>
    <path d="M${cx - wrapW} ${wrapTop} L${cx - 10} ${h * 0.84} L${cx - 60} ${h * 0.84} Z" fill="#F7E7E8"/>
    <path d="M${cx - 70} ${h * 0.7} q70 30 140 0 v22 q-70 30 -140 0Z" fill="#6F3548"/>
    <path d="M${cx} ${h * 0.715} l-48 52 l18 4 l30 -40 l30 40 l18 -4Z" fill="#6F3548"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <rect width="${w}" height="${h}" fill="#F7E7E8"/>
  <circle cx="${cx}" cy="${h * 0.42}" r="${Math.min(w, h) * 0.42}" fill="#FFF9F3"/>
  ${leaves}
  ${items.join("")}
  ${wrap}
  <g font-family="Inter, system-ui, sans-serif" text-anchor="middle">
    <rect x="${cx - 190}" y="${h - 86}" width="380" height="50" rx="25" fill="#FFFFFF" stroke="#6F3548" stroke-dasharray="6 5" stroke-width="2"/>
    <text x="${cx}" y="${h - 54}" font-size="20" font-weight="600" fill="#6F3548">Placeholder · real photo coming soon</text>
  </g>
</svg>
`;
}

const files = {
  "bouquet-mini.svg": bouquet({ w: 800, h: 1000, roses: 3, scale: 1, label: "Placeholder illustration of a small bouquet" }),
  "bouquet-classic.svg": bouquet({ w: 800, h: 1000, roses: 7, scale: 0.95, label: "Placeholder illustration of a medium bouquet" }),
  "bouquet-premium.svg": bouquet({ w: 800, h: 1000, roses: 19, scale: 0.72, label: "Placeholder illustration of a large bouquet" }),
  "hero.svg": bouquet({ w: 960, h: 1080, roses: 12, scale: 0.85, label: "Placeholder illustration of a wrapped bouquet" }),
};

for (const [name, svg] of Object.entries(files)) {
  await writeFile(new URL(name, dir), svg);
}
console.log("Wrote", Object.keys(files).join(", "));
