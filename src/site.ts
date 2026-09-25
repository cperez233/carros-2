/**
 * DATOS DEL NEGOCIO. Este es el único archivo que hay que editar para entregar la página a un cliente
 * (junto con el inventario en inventory.ts y la flota destacada en data.ts).
 * Todo lo demás (textos legales, metadatos, Google, WhatsApp, robots.txt, sitemap.xml, llms.txt) sale de aquí.
 * Los valores marcados [COMPLETAR] o PROVISIONAL están pendientes de confirmar con el cliente.
 */

/** Dominio final, sin "/" al final. [COMPLETAR: dominio real cuando se compre] */
export const SITE_URL = "https://www.masterservicequality.co";

export const BRAND = "Master"; // Palabra grande del logo
export const BRAND_TAGLINE = "Service Quality"; // Línea pequeña del logo
export const COMPANY = "Master Service Quality SAS"; // Razón social
export const NIT = ""; // [COMPLETAR: NIT, se muestra en el footer si se llena]

// PROVISIONAL: número de WhatsApp y teléfono mientras se define el oficial
export const WHATSAPP = "573232015887"; // Solo dígitos, con 57
export const PHONE = "+57 323 201 5887";
export const EMAIL = "comercial@masterservicequality.co"; // [COMPLETAR: correo real]

export const ADDRESS = {
  street: "", // [COMPLETAR: dirección de la oficina, ej. "Cra 00 # 00-00"]
  city: "Barrancabermeja",
  region: "Santander",
  country: "CO",
  postalCode: "", // [COMPLETAR]
};
export const ADDRESS_LABEL = [ADDRESS.street, `${ADDRESS.city}, ${ADDRESS.region}`].filter(Boolean).join(", ");

/** Coordenadas de Google Maps (clic derecho sobre el punto). Vacías = no se publican. */
export const GEO: { lat: number; lng: number } | null = null; // [COMPLETAR]

export const HOURS = {
  label: "Lunes a viernes, 8:00 a. m. a 6:00 p. m.",
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  opens: "08:00",
  closes: "18:00",
};

/** Municipios donde se entregan vehículos. El primero es la sede. [COMPLETAR: confirmar] */
export const CITIES = ["Barrancabermeja", "Puerto Wilches", "Sabana de Torres", "Yondó"] as const;
export type City = (typeof CITIES)[number];
export const REGION = "Magdalena Medio";

/** Perfiles reales (Instagram, Facebook, LinkedIn, Google Maps). Solo URLs que existan. */
export const SOCIAL: string[] = []; // [COMPLETAR]

/** ID de Google Analytics 4 (G-XXXXXXX). Vacío = analítica apagada. */
export const GA_ID = ""; // [COMPLETAR]

/** Código de verificación de Google Search Console (método etiqueta HTML). Vacío = no se agrega. */
export const GOOGLE_VERIFICATION = ""; // [COMPLETAR]

/** Fecha de la última actualización real del contenido o del inventario (va al sitemap). */
export const LAST_UPDATED = "2026-09-25";
