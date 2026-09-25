// Toma el build del cliente (dist/) y el del servidor (dist-ssr/) y escribe un HTML completo por ruta,
// más robots.txt, sitemap.xml y llms.txt. Se ejecuta solo con `npm run build`.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");
const ssr = resolve(root, "dist-ssr");
const { render, ROUTES, robotsTxt, sitemapXml, llmsTxt, notFoundHtml, webManifest } = await import(pathToFileURL(resolve(ssr, "entry-server.js")).href);

const template = readFileSync(resolve(dist, "index.html"), "utf8");
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error("index.html necesita el bloque <!--seo:start-->...<!--seo:end--> y <div id=\"root\"></div>");
}

for (const route of ROUTES) {
  const { html, head } = render(route);
  const page = template.replace(SEO_BLOCK, head).replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  // /inventario -> inventario.html (vercel.json usa cleanUrls, así la URL queda sin .html)
  const file = route === "/" ? resolve(dist, "index.html") : resolve(dist, `${route.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  console.log(`prerender ${route} -> ${file.replace(root + "/", "")} (${(page.length / 1024).toFixed(0)} KB)`);
}

writeFileSync(resolve(dist, "robots.txt"), robotsTxt());
writeFileSync(resolve(dist, "sitemap.xml"), sitemapXml());
writeFileSync(resolve(dist, "llms.txt"), llmsTxt());
writeFileSync(resolve(dist, "404.html"), notFoundHtml());
writeFileSync(resolve(dist, "site.webmanifest"), webManifest());
rmSync(ssr, { recursive: true, force: true });
console.log("robots.txt, sitemap.xml, llms.txt, 404.html y site.webmanifest listos");
