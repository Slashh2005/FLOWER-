/**
 * Generates clearly-labelled placeholder illustrations (satin-ribbon style)
 * in src/assets/img/placeholders/. Run: node scripts/make-placeholders.js
 * Replace them with real product photos as soon as they exist.
 */
import { writeFile, mkdir } from "node:fs/promises";

const dir = new URL("../src/assets/img/placeholders/", import.meta.url);
await mkdir(dir, { recursive: true });

// [light, base, dark] satin tones
const tones = {
  blush: ["#FFE9EE", "#F2B8C6", "#C9798F"],
  rose: ["#F7C1CF", "#D9819A", "#9C4763"],
  berry: ["#C8738D", "#8E3A57", "#4F1A2E"],
  cream: ["#FFFDF8", "#F3E3D3", "#C9AE95"],
  ruby: ["#F59AAE", "#C2385D", "#6E1430"],
  lilac: ["#F1E2F2", "#CDA9D3", "#8B6394"],
};

let uid = 0;

function defsFor(name, [light, base, dark]) {
  return `<radialGradient id="r-${name}" cx="38%" cy="32%" r="78%">
      <stop offset="0" stop-color="${light}"/><stop offset=".5" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/>
    </radialGradient>`;
}

function spiral(r, turns = 2.6) {
  const pts = [];
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * turns * Math.PI * 2;
    const rr = (i / steps) * r * 0.86;
    pts.push(`${(Math.cos(t) * rr).toFixed(1)},${(Math.sin(t) * rr * 0.92).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function rose(x, y, r, tone) {
  const [light, , dark] = tones[tone];
  const rot = (uid++ * 47) % 360;
  const petals = [0, 72, 144, 216, 288]
    .map((a) => {
      const rad = ((a + rot) * Math.PI) / 180;
      return `<ellipse cx="${(Math.cos(rad) * r * 0.55).toFixed(1)}" cy="${(Math.sin(rad) * r * 0.55).toFixed(1)}" rx="${(r * 0.58).toFixed(1)}" ry="${(r * 0.46).toFixed(1)}" transform="rotate(${a + rot} ${(Math.cos(rad) * r * 0.55).toFixed(1)} ${(Math.sin(rad) * r * 0.55).toFixed(1)})" fill="url(#r-${tone})"/>`;
    })
    .join("");
  const s = spiral(r * 0.78);
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})" filter="url(#soft)">
    ${petals}
    <circle r="${(r * 0.8).toFixed(1)}" fill="url(#r-${tone})"/>
    <path d="${s}" fill="none" stroke="${dark}" stroke-opacity=".55" stroke-width="${(r * 0.16).toFixed(1)}" stroke-linecap="round"/>
    <path d="${s}" fill="none" stroke="${light}" stroke-opacity=".75" stroke-width="${(r * 0.05).toFixed(1)}" stroke-linecap="round" transform="translate(${(-r * 0.05).toFixed(1)} ${(-r * 0.06).toFixed(1)})"/>
  </g>`;
}

function leaf(x, y, rot, s = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 0 C 26 -34 74 -34 104 0 C 74 34 26 34 0 0Z" fill="url(#leaf)"/>
    <path d="M6 0 H96" stroke="#7E8F76" stroke-width="2" stroke-opacity=".6"/>
  </g>`;
}

function bouquet({ w, h, count, scale, palette, bg, wrap, label, labelDark = false }) {
  uid = 0;
  const cx = w / 2;
  const headY = h * 0.36;
  const r = 52 * scale;
  // Pack roses in a dome
  const roses = [];
  const rings = [1, 6, 10, 14];
  let placed = 0;
  for (let ring = 0; placed < count && ring < rings.length; ring++) {
    const n = Math.min(rings[ring], count - placed);
    for (let i = 0; i < n; i++, placed++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.5 - Math.PI / 2;
      const dist = ring * r * 1.55;
      roses.push({ x: cx + Math.cos(a) * dist * 1.05, y: headY + Math.sin(a) * dist * 0.7, tone: palette[(placed * 3 + ring) % palette.length] });
    }
  }
  roses.sort((a, b) => a.y - b.y);
  const ringsUsed = Math.ceil(Math.sqrt(count / 3)) + 1;
  const spread = Math.max(r * 1.6, ringsUsed * r * 1.55);
  const leaves = [
    leaf(cx - spread * 0.95, headY + r * 0.7, 200, scale * 1.2),
    leaf(cx + spread * 0.95, headY + r * 0.7, -20, scale * 1.2),
    leaf(cx - spread * 0.7, headY - r * 0.9, 230, scale),
    leaf(cx + spread * 0.7, headY - r * 0.9, -50, scale),
  ].join("");
  const wrapTop = headY + spread * 0.55;
  const tip = h * 0.86;
  const ww = spread * 1.25;
  const [wl, wb, wd] = wrap;
  const paper = `
    <path d="M${cx - ww} ${wrapTop - 30} Q ${cx - ww * 0.5} ${wrapTop + 10} ${cx} ${wrapTop - 10} Q ${cx + ww * 0.5} ${wrapTop + 10} ${cx + ww} ${wrapTop - 30} L ${cx + 58} ${tip} L ${cx - 58} ${tip} Z" fill="url(#paper)"/>
    <path d="M${cx - ww} ${wrapTop - 30} L ${cx - 20} ${tip} L ${cx - 58} ${tip} Z" fill="${wd}" fill-opacity=".25"/>
    <path d="M${cx + ww} ${wrapTop - 30} L ${cx + 30} ${tip} L ${cx + 58} ${tip} Z" fill="${wl}" fill-opacity=".5"/>`;
  const by = h * 0.69;
  const bow = `
    <g transform="translate(${cx} ${by})">
      <path d="M0 0 C -60 -50 -120 -10 -96 26 C -80 48 -30 22 0 0Z" fill="url(#satin)"/>
      <path d="M0 0 C 60 -50 120 -10 96 26 C 80 48 30 22 0 0Z" fill="url(#satin)"/>
      <path d="M-8 6 L -46 110 L -26 100 L -14 118 Z" fill="url(#satin)"/>
      <path d="M8 6 L 40 112 L 22 102 L 12 120 Z" fill="url(#satin)"/>
      <ellipse rx="16" ry="14" fill="url(#satin)"/>
    </g>`;
  const pillFill = labelDark ? "#3E1A27" : "#FFFFFF";
  const pillText = labelDark ? "#FFE9EE" : "#6F3548";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs>
    ${Object.entries(tones).map(([n, t]) => defsFor(n, t)).join("")}
    <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9D4C1"/><stop offset="1" stop-color="#8FA087"/></linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${wd}"/><stop offset=".25" stop-color="${wb}"/><stop offset=".5" stop-color="${wl}"/><stop offset=".75" stop-color="${wb}"/><stop offset="1" stop-color="${wd}"/>
    </linearGradient>
    <linearGradient id="satin" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#4F1A2E"/><stop offset=".35" stop-color="#A3466A"/><stop offset=".5" stop-color="#E7A1B8"/><stop offset=".65" stop-color="#A3466A"/><stop offset="1" stop-color="#4F1A2E"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#30282A" flood-opacity=".22"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <circle cx="${cx}" cy="${h * 0.42}" r="${Math.min(w, h) * 0.46}" fill="url(#glow)"/>
  ${leaves}
  ${paper}
  ${roses.map((p) => rose(p.x, p.y, r, p.tone)).join("")}
  ${bow}
  <g font-family="Inter, system-ui, sans-serif" text-anchor="middle">
    <rect x="${cx - 175}" y="${h - 70}" width="350" height="40" rx="20" fill="${pillFill}" fill-opacity=".92"/>
    <text x="${cx}" y="${h - 44}" font-size="17" font-weight="600" fill="${pillText}">Placeholder · real photo coming soon</text>
  </g>
</svg>
`;
}

const files = {
  "bouquet-mini.svg": bouquet({
    w: 800, h: 1000, count: 3, scale: 1.25, palette: ["blush", "rose", "cream"], bg: "#F7E7E8",
    wrap: ["#FFFFFF", "#F6EDE6", "#D9C6B8"], label: "Placeholder illustration of a small bouquet",
  }),
  "bouquet-classic.svg": bouquet({
    w: 800, h: 1000, count: 7, scale: 1.05, palette: ["rose", "blush", "ruby", "cream"], bg: "#E6EADF",
    wrap: ["#FFF6F8", "#F2C9D3", "#C98291"], label: "Placeholder illustration of a medium bouquet",
  }),
  "bouquet-premium.svg": bouquet({
    w: 800, h: 1000, count: 17, scale: 0.82, palette: ["ruby", "blush", "berry", "rose", "cream", "lilac"], bg: "#4A1F2E",
    wrap: ["#FFFDF8", "#EFE3D6", "#BBA38C"], label: "Placeholder illustration of a large bouquet", labelDark: true,
  }),
  "hero.svg": bouquet({
    w: 1600, h: 1000, count: 17, scale: 1.3, palette: ["blush", "rose", "ruby", "cream", "lilac", "berry"], bg: "#F2C9D3",
    wrap: ["#FFFFFF", "#F6EDE6", "#D9C6B8"], label: "Placeholder illustration of a wrapped bouquet",
  }),
  "detail.svg": bouquet({
    w: 900, h: 1100, count: 7, scale: 1.4, palette: ["cream", "blush", "rose"], bg: "#FFF1F3",
    wrap: ["#FFFFFF", "#F6EDE6", "#D9C6B8"], label: "Placeholder illustration of ribbon roses close up",
  }),
};

for (const [name, svg] of Object.entries(files)) await writeFile(new URL(name, dir), svg);
console.log("Wrote", Object.keys(files).join(", "));
