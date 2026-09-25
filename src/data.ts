export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

import { WHATSAPP } from "./site";

// Los datos del negocio viven en site.ts
export * from "./site";

export const waLink = (text: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

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
    use: "Campo, pozos y vías destapadas",
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
    use: "Supervisión de obra y mantenimiento",
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
    use: "Diligencias en casco urbano",
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
    use: "Cuadrillas y equipos de trabajo",
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
    use: "Gerencia y visitas a campo",
    image: img("photo-1630826362226-a509049bcdbf", 1200),
    position: "50% 58%",
  },
];

export const cop = (n: number) =>
  "$" + Math.round(n).toLocaleString("es-CO", { maximumFractionDigits: 0 });

export const INCLUDED = [
  {
    title: "Póliza todo riesgo",
    detail: "Daños propios, hurto y responsabilidad civil. El deducible depende de la póliza.",
  },
  {
    title: "Mantenimiento",
    detail: "Preventivo según el manual del fabricante y correctivo por desgaste normal: correas, frenos, llantas y aceite.",
  },
  {
    title: "GPS satelital",
    detail: "Cada unidad lleva GPS activo durante todo el contrato.",
  },
  {
    title: "SOAT y tecnomecánica",
    detail: "Vigentes durante todo el contrato, junto con los impuestos. Las renovaciones corren por nuestra cuenta.",
  },
];

export const NOT_INCLUDED = ["Combustible", "Peajes y parqueaderos", "Multas de tránsito"];

export const IMAGES = {
  hero: img("photo-1649280501271-1b51feaaafd3", 2400),
  empresas: img("photo-1605893477799-b99e3b8b93fe", 1800),
  propietarios: img("photo-1670736297573-fde2cbcf1de7", 1800),
  valley: img("photo-1623167987947-c25a2cc06a21", 2400),
};

// Modelos comunes en la región para el formulario de cotización
export const VEHICLE_TYPES = [
  { id: "pickup4x4", label: "Pick-up 4x4", hint: "Campo, pozos y vías destapadas", models: ["Toyota Hilux", "Ford Ranger", "Nissan Frontier", "Chevrolet D-Max"] },
  { id: "pickup4x2", label: "Pick-up 4x2", hint: "Obra y vía pavimentada", models: ["Toyota Hilux", "Nissan Frontier", "Mitsubishi L200", "Chevrolet D-Max"] },
  { id: "suv", label: "SUV", hint: "Personal, supervisión y gerencia", models: ["Renault Duster", "Toyota Fortuner", "Toyota Prado", "Mitsubishi Montero"] },
  { id: "nose", label: "Aún no sé", hint: "Te recomendamos uno", models: [] as string[] },
] as const;
export type VehicleTypeId = (typeof VEHICLE_TYPES)[number]["id"];
