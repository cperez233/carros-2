import {
  ADDRESS,
  CITIES,
  COMPANY,
  cop,
  EMAIL,
  GA_ID,
  GEO,
  GOOGLE_VERIFICATION,
  HOURS,
  IMAGES,
  INCLUDED,
  LAST_UPDATED,
  NOT_INCLUDED,
  PHONE,
  REGION,
  SITE_URL,
  SOCIAL,
  waLink,
} from "./data";
import { FAQ } from "./faq";
import { INVENTORY, TYPE_LABEL } from "./inventory";

export type Route = "/" | "/inventario";
export const ROUTES: Route[] = ["/", "/inventario"];

const minPrice = Math.min(...INVENTORY.map((u) => u.price));
const citiesText = `${CITIES.slice(0, -1).join(", ")} y ${CITIES[CITIES.length - 1]}`;
const abs = (path: string) => SITE_URL + path;

export const OG_IMAGE = { url: abs("/og-image.jpg"), width: 1200, height: 630, alt: `${COMPANY}: renta de camionetas en ${CITIES[0]}` };

export const PAGES: Record<Route, { title: string; description: string; name: string }> = {
  "/": {
    name: "Inicio",
    title: `Renta de camionetas en ${CITIES[0]} | ${COMPANY.replace(/ SAS$/, "")}`,
    description:
      `Camionetas 4x4, pick-ups y SUV en renta mensual para empresas en ${CITIES[0]} y el ${REGION}. ` +
      "Póliza, mantenimiento, GPS y SOAT incluidos.",
  },
  "/inventario": {
    name: "Inventario",
    title: `Inventario de camionetas en renta | ${COMPANY.replace(/ SAS$/, "")}`,
    description:
      `${INVENTORY.length} camionetas y SUV para renta mensual en ${citiesText}, ` +
      `con año, kilometraje y tarifa desde ${cop(minPrice)} al mes + IVA.`,
  },
};

const ORG_ID = abs("/#organization");
const BUSINESS_ID = abs("/#localbusiness");
const WEBSITE_ID = abs("/#website");

function entities() {
  const address = {
    "@type": "PostalAddress",
    ...(ADDRESS.street && { streetAddress: ADDRESS.street }),
    addressLocality: ADDRESS.city,
    addressRegion: ADDRESS.region,
    ...(ADDRESS.postalCode && { postalCode: ADDRESS.postalCode }),
    addressCountry: ADDRESS.country,
  };
  const contact = { telephone: PHONE.replace(/\s/g, ""), email: EMAIL };
  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: COMPANY,
      url: abs("/"),
      logo: { "@type": "ImageObject", url: abs("/logo-512.png"), width: 512, height: 512 },
      ...contact,
      address,
      ...(SOCIAL.length && { sameAs: SOCIAL }),
    },
    {
      "@type": "AutoRental",
      "@id": BUSINESS_ID,
      name: COMPANY,
      url: abs("/"),
      image: OG_IMAGE.url,
      ...contact,
      address,
      ...(GEO && { geo: { "@type": "GeoCoordinates", latitude: GEO.lat, longitude: GEO.lng } }),
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: HOURS.days, opens: HOURS.opens, closes: HOURS.closes },
      ],
      areaServed: CITIES.map((name) => ({ "@type": "City", name })),
      priceRange: `Desde ${cop(minPrice)} al mes`,
      currenciesAccepted: "COP",
      parentOrganization: { "@id": ORG_ID },
      ...(SOCIAL.length && { sameAs: SOCIAL }),
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: abs("/"),
      name: COMPANY,
      inLanguage: "es-CO",
      publisher: { "@id": ORG_ID },
    },
  ];
}

function webPage(route: Route, extra: Record<string, unknown> = {}) {
  return {
    "@type": "WebPage",
    "@id": abs(route) + "#webpage",
    url: abs(route),
    name: PAGES[route].title,
    description: PAGES[route].description,
    inLanguage: "es-CO",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    primaryImageOfPage: { "@type": "ImageObject", url: OG_IMAGE.url },
    dateModified: LAST_UPDATED,
    ...extra,
  };
}

function inventoryList() {
  return {
    "@type": "ItemList",
    "@id": abs("/inventario#lista"),
    name: "Camionetas disponibles para renta mensual",
    numberOfItems: INVENTORY.length,
    itemListElement: INVENTORY.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Car",
        name: `${u.model} ${u.year}`,
        sku: u.code,
        image: u.image,
        bodyType: TYPE_LABEL[u.type],
        vehicleModelDate: String(u.year),
        mileageFromOdometer: { "@type": "QuantitativeValue", value: u.km, unitCode: "KMT" },
        vehicleTransmission: u.gearbox,
        fuelType: u.fuel,
        driveWheelConfiguration: u.drive,
        seatingCapacity: u.seats,
        color: u.color,
        offers: {
          "@type": "Offer",
          businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
          availability: "https://schema.org/InStock",
          availableAtOrFrom: { "@type": "Place", name: u.city },
          seller: { "@id": BUSINESS_ID },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: u.price,
            priceCurrency: "COP",
            unitText: "mes",
            referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
            valueAddedTaxIncluded: false,
          },
        },
      },
    })),
  };
}

export function jsonLd(route: Route) {
  const page =
    route === "/inventario"
      ? webPage(route, {
          "@type": "CollectionPage",
          mainEntity: { "@id": abs("/inventario#lista") },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: abs("/") },
              { "@type": "ListItem", position: 2, name: "Inventario", item: abs("/inventario") },
            ],
          },
        })
      : webPage(route);
  return {
    "@context": "https://schema.org",
    "@graph": [...entities(), page, ...(route === "/inventario" ? [inventoryList()] : [])],
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Etiquetas del <head> de cada ruta. Las escribe el prerender en el HTML final. */
export function headTags(route: Route) {
  const p = PAGES[route];
  const url = abs(route);
  const tags = [
    `<title>${esc(p.title)}</title>`,
    `<meta name="description" content="${esc(p.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="es_CO" />`,
    `<meta property="og:site_name" content="${esc(COMPANY)}" />`,
    `<meta property="og:title" content="${esc(p.title)}" />`,
    `<meta property="og:description" content="${esc(p.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE.url}" />`,
    `<meta property="og:image:width" content="${OG_IMAGE.width}" />`,
    `<meta property="og:image:height" content="${OG_IMAGE.height}" />`,
    `<meta property="og:image:alt" content="${esc(OG_IMAGE.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(p.title)}" />`,
    `<meta name="twitter:description" content="${esc(p.description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE.url}" />`,
    `<meta name="geo.region" content="CO-SAN" />`,
    `<meta name="geo.placename" content="${esc(ADDRESS.city)}" />`,
  ];
  if (route === "/") tags.push(`<link rel="preload" as="image" href="${esc(IMAGES.hero)}" fetchpriority="high" />`);
  if (GOOGLE_VERIFICATION) tags.push(`<meta name="google-site-verification" content="${esc(GOOGLE_VERIFICATION)}" />`);
  if (GA_ID)
    tags.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>`,
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GA_ID}");</script>`
    );
  tags.push(
    `<script type="application/ld+json">${JSON.stringify(jsonLd(route)).replace(/</g, "\\u003c")}</script>`
  );
  return tags.join("\n    ");
}

export function robotsTxt() {
  return `# Buscadores
User-agent: *
Allow: /

# Busqueda con IA (citas en ChatGPT, Claude y Perplexity)
User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

# Entrenamiento de modelos (decision del cliente; cambiar a Disallow para bloquear)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`;
}

export function sitemapXml() {
  const urls = ROUTES.map(
    (r) => `  <url>\n    <loc>${abs(r)}</loc>\n    <lastmod>${LAST_UPDATED}</lastmod>\n  </url>`
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function llmsTxt() {
  const units = INVENTORY.map(
    (u) => `- ${u.code}: ${u.model} ${u.year}, ${TYPE_LABEL[u.type]}, ${u.drive}, ${u.gearbox.toLowerCase()}, ${u.city}. ${cop(u.price)} al mes + IVA.`
  ).join("\n");
  return `# ${COMPANY}

> Renta mensual de camionetas, pick-ups y SUV para empresas en ${CITIES[0]} y el ${REGION} (Colombia). Contrato mes a mes, sin permanencia.

- Sitio: ${abs("/")}
- Inventario: ${abs("/inventario")}
- Telefono y WhatsApp: ${PHONE}
- Correo: ${EMAIL}
- Horario: ${HOURS.label}
- Municipios de entrega: ${citiesText}

## Incluido en la tarifa
${INCLUDED.map((i) => `- ${i.title}: ${i.detail}`).join("\n")}

## No incluido
${NOT_INCLUDED.map((n) => `- ${n}`).join("\n")}

## Inventario (tarifas antes de IVA)
${units}

## Preguntas frecuentes
${FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;
}

/** Página 404 (Vercel la sirve con estado 404). */
export function notFoundHtml() {
  return `<!doctype html>
<html lang="es-CO">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <meta name="description" content="Esta página no existe. Vuelve al inicio o mira las camionetas disponibles para renta en ${CITIES[0]}." />
    <meta name="theme-color" content="#131514" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <title>Página no encontrada | ${COMPANY}</title>
    <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700&family=Public+Sans:wght@400;600&display=swap" rel="stylesheet" />
    <style>
      body { margin: 0; min-height: 100svh; display: grid; place-items: center; background: #131514; color: #ece7dc; font-family: "Public Sans", sans-serif; padding: 24px; box-sizing: border-box; }
      main { max-width: 560px; }
      .dash { height: 4px; width: 100%; background: repeating-linear-gradient(90deg, #e0a93b 0 28px, transparent 28px 52px); margin: 28px 0; }
      h1 { font-family: "Barlow Condensed", sans-serif; font-size: clamp(3rem, 12vw, 5.5rem); line-height: 0.9; text-transform: uppercase; margin: 0; }
      h1 span { color: #e0a93b; }
      p { color: #9d9a90; line-height: 1.65; font-size: 16px; }
      nav { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
      a { display: inline-flex; align-items: center; height: 48px; padding: 0 20px; border-radius: 12px; font-weight: 600; text-decoration: none; }
      .primary { background: #e0a93b; color: #131514; }
      .ghost { color: #ece7dc; box-shadow: inset 0 0 0 1px rgba(236, 231, 220, 0.2); }
      a:focus-visible { outline: 2px solid #e0a93b; outline-offset: 3px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Esta vía<br /><span>no tiene salida</span></h1>
      <div class="dash" aria-hidden="true"></div>
      <p>La página que buscas no existe o cambió de dirección. Desde aquí puedes volver al inicio o ver las camionetas disponibles.</p>
      <nav>
        <a class="primary" href="/inventario">Ver camionetas disponibles</a>
        <a class="ghost" href="/">Volver al inicio</a>
        <a class="ghost" href="${waLink("Hola, llegué a una página que no existe en su sitio y quiero cotizar una camioneta.")}" rel="noopener">Escribir por WhatsApp</a>
      </nav>
    </main>
  </body>
</html>
`;
}

export function webManifest() {
  return JSON.stringify(
    {
      name: COMPANY,
      short_name: COMPANY.split(" ")[0],
      lang: "es-CO",
      start_url: "/",
      display: "standalone",
      background_color: "#131514",
      theme_color: "#131514",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2
  );
}
