import { GA_ID } from "./site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Registra una conversión (clic a WhatsApp o llamada) en Google Analytics 4 si GA_ID está configurado. */
export function trackLead(method: "whatsapp" | "telefono" | "formulario", label = "") {
  if (!GA_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "generate_lead", { method, label, page_path: window.location.pathname });
}
