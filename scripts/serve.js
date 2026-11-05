/** Minimal static server for previewing /dist locally: npm run dev */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT) || 8080;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = normalize(join(dist, urlPath));
  if (!file.startsWith(dist)) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" }).end(body);
  } catch {
    const body = await readFile(join(dist, "404.html")).catch(() => "Not found");
    res.writeHead(404, { "Content-Type": types[".html"] }).end(body);
  }
}).listen(port, () => console.log(`Preview: http://localhost:${port}`));
