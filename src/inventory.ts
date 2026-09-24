import { img, type City } from "./data";

// PLACEHOLDER: inventario de ejemplo. Año, kilometraje, color, código y tarifa deben
// reemplazarse por los datos reales de cada unidad.

export type UnitType = "suv" | "pickup";

export type Unit = {
  code: string;
  model: string;
  type: UnitType;
  year: number;
  km: number;
  city: City;
  gearbox: "Automática" | "Mecánica";
  fuel: "Gasolina" | "Diésel" | "Híbrido";
  drive: string;
  seats: number;
  engine: string;
  cargo: { label: string; value: string };
  color: string;
  price: number;
  features: [string, string, string];
  image: string;
  position?: string;
};

export const TYPE_LABEL: Record<UnitType, string> = { suv: "SUV", pickup: "Pick-up" };

export const INVENTORY: Unit[] = [
  {
    code: "MS-201",
    model: "Renault Duster",
    type: "suv",
    year: 2023,
    km: 31000,
    city: "Barrancabermeja",
    gearbox: "Mecánica",
    fuel: "Gasolina",
    drive: "4x2",
    seats: 5,
    engine: "1.6 L",
    cargo: { label: "Maletero", value: "475 L" },
    color: "Verde",
    price: 3_900_000,
    features: ["Pantalla táctil", "Sensores de parqueo", "Aire acondicionado"],
    image: img("photo-1658504010272-0ee9efe72239", 1200),
    position: "50% 60%",
  },
  {
    code: "MS-202",
    model: "Mazda CX-5",
    type: "suv",
    year: 2024,
    km: 12400,
    city: "Barrancabermeja",
    gearbox: "Automática",
    fuel: "Gasolina",
    drive: "4x2",
    seats: 5,
    engine: "2.0 L",
    cargo: { label: "Maletero", value: "442 L" },
    color: "Blanco",
    price: 5_900_000,
    features: ["Control crucero adaptativo", "Cámara de reversa", "Apple CarPlay y Android Auto"],
    image: img("photo-1643142311296-304953706775", 1200),
    position: "50% 60%",
  },
  {
    code: "MS-203",
    model: "Kia Sportage",
    type: "suv",
    year: 2024,
    km: 7500,
    city: "Puerto Wilches",
    gearbox: "Automática",
    fuel: "Gasolina",
    drive: "4x2",
    seats: 5,
    engine: "2.0 L",
    cargo: { label: "Maletero", value: "543 L" },
    color: "Gris",
    price: 5_600_000,
    features: ["Pantalla panorámica", "Cámara de reversa", "Carga inalámbrica"],
    image: img("photo-1688893287874-ac7fbd686c24", 1200),
    position: "50% 60%",
  },
  {
    code: "MS-204",
    model: "Toyota RAV4",
    type: "suv",
    year: 2023,
    km: 21000,
    city: "Barrancabermeja",
    gearbox: "Automática",
    fuel: "Híbrido",
    drive: "AWD",
    seats: 5,
    engine: "2.5 L híbrido",
    cargo: { label: "Maletero", value: "580 L" },
    color: "Blanco",
    price: 6_400_000,
    features: ["Control crucero adaptativo", "Cámara de reversa", "Apple CarPlay y Android Auto"],
    image: img("photo-1617600346256-af3cd5b16a4d", 1200),
    position: "50% 55%",
  },
  {
    code: "MS-205",
    model: "Toyota Fortuner",
    type: "suv",
    year: 2023,
    km: 28000,
    city: "Sabana de Torres",
    gearbox: "Automática",
    fuel: "Diésel",
    drive: "4x4",
    seats: 7,
    engine: "2.8 L",
    cargo: { label: "Tercera fila", value: "Abatible" },
    color: "Plata",
    price: 7_800_000,
    features: ["Siete puestos", "Cámara de reversa", "Control de descenso"],
    image: img("photo-1670054953044-2605dbd0d747", 1200),
    position: "60% 60%",
  },
  {
    code: "MS-206",
    model: "Toyota Land Cruiser Prado",
    type: "suv",
    year: 2024,
    km: 11000,
    city: "Barrancabermeja",
    gearbox: "Automática",
    fuel: "Diésel",
    drive: "4x4",
    seats: 7,
    engine: "2.8 L",
    cargo: { label: "Tercera fila", value: "Abatible" },
    color: "Negro",
    price: 10_500_000,
    features: ["Siete puestos", "Cámaras 360°", "Asientos en cuero"],
    image: img("photo-1630826362226-a509049bcdbf", 1200),
    position: "50% 58%",
  },
  {
    code: "MS-301",
    model: "Toyota Hilux",
    type: "pickup",
    year: 2024,
    km: 15000,
    city: "Barrancabermeja",
    gearbox: "Automática",
    fuel: "Diésel",
    drive: "4x4",
    seats: 5,
    engine: "2.8 L",
    cargo: { label: "Carga útil", value: "1.000 kg" },
    color: "Blanco",
    price: 6_900_000,
    features: ["Doble cabina", "Barra antivuelco", "Alarma de reversa"],
    image: img("photo-1759213281196-6c5e463b3021", 1200),
    position: "50% 60%",
  },
  {
    code: "MS-302",
    model: "Toyota Hilux",
    type: "pickup",
    year: 2023,
    km: 34000,
    city: "Yondó",
    gearbox: "Mecánica",
    fuel: "Diésel",
    drive: "4x4",
    seats: 5,
    engine: "2.4 L",
    cargo: { label: "Carga útil", value: "1.000 kg" },
    color: "Gris",
    price: 6_300_000,
    features: ["Doble cabina", "Barra antivuelco", "Kit de carretera"],
    image: img("photo-1631377875413-b1e3e660bfa2", 1200),
    position: "50% 65%",
  },
  {
    code: "MS-303",
    model: "Ford Ranger",
    type: "pickup",
    year: 2024,
    km: 9000,
    city: "Puerto Wilches",
    gearbox: "Automática",
    fuel: "Diésel",
    drive: "4x4",
    seats: 5,
    engine: "2.0 L biturbo",
    cargo: { label: "Carga útil", value: "950 kg" },
    color: "Gris",
    price: 7_200_000,
    features: ["Doble cabina", "Modos de manejo todoterreno", "Alarma de reversa"],
    image: img("photo-1677739455846-2467604ea8b6", 1200),
    position: "50% 55%",
  },
];

export const kmFmt = (n: number) => n.toLocaleString("es-CO") + " km";

export const unitMessage = (u: Unit) =>
  `Hola, quiero cotizar la renta mensual de la unidad ${u.code}: ${u.model} ${u.year}, ${u.gearbox.toLowerCase()}, ` +
  `${u.color.toLowerCase()}, en ${u.city}. Vi la tarifa de $${u.price.toLocaleString("es-CO")} al mes + IVA en el inventario.`;
