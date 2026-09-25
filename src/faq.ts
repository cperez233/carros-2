import { CITIES, cop, REGION } from "./data";
import { INVENTORY } from "./inventory";

const fromPrice = (filter: (u: (typeof INVENTORY)[number]) => boolean) =>
  Math.min(...INVENTORY.filter(filter).map((u) => u.price));

const list = (items: readonly string[]) =>
  items.length > 1 ? `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}` : items[0];

/**
 * Preguntas frecuentes: se muestran en la página y alimentan llms.txt. Los precios salen del inventario.
 * Solo dudas que no responde otra sección: lo que incluye la tarifa vive en "Qué incluye" y los documentos
 * para el contratante en "Para quién". Repetirlos aquí no suma SEO y satura la página.
 */
export const FAQ: { q: string; a: string }[] = [
  {
    q: `¿Cuánto cuesta rentar una camioneta en ${CITIES[0]}?`,
    a:
      `Desde ${cop(fromPrice((u) => u.type === "suv"))} al mes + IVA para una SUV y desde ` +
      `${cop(fromPrice((u) => u.type === "pickup"))} al mes + IVA para una pick-up 4x4 doble cabina. ` +
      "La tarifa ya incluye póliza todo riesgo, mantenimiento, GPS satelital, SOAT y tecnomecánica. " +
      "El precio final depende del modelo, la cantidad de unidades y el tiempo del contrato.",
  },
  {
    q: "¿Cuál es el tiempo mínimo de contrato?",
    a: "No hay permanencia mínima. El contrato es mes a mes y puedes devolver la camioneta, o agregar unidades, al cierre de cualquier mes.",
  },
  {
    q: "¿Qué documentos necesito para rentar?",
    a:
      "Si rentas como empresa: RUT, certificado de Cámara de Comercio y cédula del representante legal. " +
      "Si rentas como persona natural: cédula, licencia de conducción vigente y estudio de crédito.",
  },
  {
    q: `¿Entregan camionetas fuera de ${CITIES[0]}?`,
    a: `Sí. Entregamos en ${list(CITIES)}. Para otros municipios del ${REGION}, escríbenos por WhatsApp y te confirmamos.`,
  },
  {
    q: "Tengo una camioneta, ¿puedo afiliarla?",
    a:
      "Sí. La rentamos a empresas de la región y te pagamos por los días trabajados, por transferencia y con comprobante detallado. " +
      "Necesitas tarjeta de propiedad, SOAT y tecnomecánica vigentes, cédula o RUT y certificación bancaria.",
  },
];
