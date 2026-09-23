export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// PLACEHOLDER: número de WhatsApp, teléfono y correo del negocio
export const WHATSAPP = "573000000000";
export const PHONE = "+57 300 000 0000";
export const EMAIL = "flota@trocha.co";

export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

export const CITIES = ["Bogotá", "Medellín", "Bucaramanga", "Cali"] as const;
export type City = (typeof CITIES)[number];

export type Category = "pickup" | "suv";

export type Vehicle = {
  id: string;
  name: string;
  category: Category;
  price: number; // PLACEHOLDER: tarifas estimadas, antes de IVA
  seats: number;
  gearbox: string;
  drive: string;
  fuel: string;
  use: string;
  image: string;
  position?: string;
};

export const FLEET: Vehicle[] = [
  {
    id: "hilux",
    name: "Toyota Hilux",
    category: "pickup",
    price: 6_900_000,
    seats: 5,
    gearbox: "Automática",
    drive: "4x4",
    fuel: "Diésel",
    use: "Obra, campo y carga liviana",
    image: img("photo-1759213281196-6c5e463b3021", 1200),
    position: "50% 60%",
  },
  {
    id: "ranger",
    name: "Ford Ranger",
    category: "pickup",
    price: 7_200_000,
    seats: 5,
    gearbox: "Automática",
    drive: "4x4",
    fuel: "Diésel",
    use: "Trocha y carretera destapada",
    image: img("photo-1677739455846-2467604ea8b6", 1200),
    position: "50% 55%",
  },
  {
    id: "duster",
    name: "Renault Duster",
    category: "suv",
    price: 3_900_000,
    seats: 5,
    gearbox: "Mecánica",
    drive: "4x2",
    fuel: "Gasolina",
    use: "Ciudad y visitas comerciales",
    image: img("photo-1658504010272-0ee9efe72239", 1200),
    position: "50% 60%",
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    category: "suv",
    price: 7_800_000,
    seats: 7,
    gearbox: "Automática",
    drive: "4x4",
    fuel: "Diésel",
    use: "Equipos de trabajo y familia",
    image: img("photo-1670054953044-2605dbd0d747", 1200),
    position: "60% 60%",
  },
  {
    id: "prado",
    name: "Toyota Land Cruiser Prado",
    category: "suv",
    price: 10_500_000,
    seats: 7,
    gearbox: "Automática",
    drive: "4x4",
    fuel: "Diésel",
    use: "Gerencia y viajes largos",
    image: img("photo-1630826362226-a509049bcdbf", 1200),
    position: "50% 58%",
  },
];

export const cop = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });

export const INCLUDED = [
  {
    title: "Seguro todo riesgo",
    detail: "Daños propios, hurto y responsabilidad civil. El deducible depende de la póliza.",
  },
  {
    title: "Mantenimiento",
    detail: "Revisiones preventivas según el manual del fabricante y reparaciones por desgaste normal.",
  },
  {
    title: "SOAT",
    detail: "Vigente durante todo el contrato. La renovación la hacemos nosotros.",
  },
  {
    title: "Impuestos",
    detail: "El impuesto vehicular anual va por nuestra cuenta.",
  },
];

export const NOT_INCLUDED = ["Combustible", "Peajes y parqueaderos", "Multas de tránsito"];

export const IMAGES = {
  hero: img("photo-1631377875413-b1e3e660bfa2", 2400),
  empresas: img("photo-1605893477799-b99e3b8b93fe", 1800),
  particulares: img("photo-1670736297573-fde2cbcf1de7", 1800),
  valley: img("photo-1623167987947-c25a2cc06a21", 2400),
};
