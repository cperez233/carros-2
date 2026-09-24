import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { ArrowDownUp, ArrowUpRight, Cog, Fuel, Gauge, MapPin, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CITIES, cop, waLink, type City } from "../data";
import { INVENTORY, kmFmt, TYPE_LABEL, unitMessage, type Unit, type UnitType } from "../inventory";
import { AnimatedNumber, Button, ease, Eyebrow, softSpring, SplitWords, spring, Tilt } from "./motion";

type TypeFilter = "all" | UnitType;
type CityFilter = "all" | City;
type Sort = "asc" | "desc";

const TYPES: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "suv", label: "SUV" },
  { id: "pickup", label: "Pick-up" },
];

function Segmented<T extends string>({
  id,
  options,
  value,
  onChange,
  label,
}: {
  id: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex shrink-0 rounded-[12px] bg-asphalt p-1">
      {options.map((o) => (
        <motion.button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          whileTap={{ scale: 0.94 }}
          className={`relative h-10 whitespace-nowrap rounded-[9px] px-3.5 text-[13px] font-semibold transition-colors duration-300 ${
            value === o.id ? "text-asphalt" : "text-stone hover:text-bone"
          }`}
        >
          {value === o.id && <motion.span layoutId={`seg-${id}`} transition={softSpring} className="absolute inset-0 rounded-[9px] bg-lane" />}
          <span className="relative">{o.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function Spec({ icon: Icon, children }: { icon: typeof Users; children: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-bone/80">
      <Icon aria-hidden className="h-3.5 w-3.5 text-stone" />
      {children}
    </span>
  );
}

function UnitCard({ u, onOpen }: { u: Unit; onOpen: () => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={spring}
    >
      <Tilt max={5} className="group h-full">
        <div className="relative flex h-full flex-col rounded-[22px] bg-tarmac shadow-[var(--shadow-rest)] ring-1 ring-bone/[0.06] transition-shadow duration-500 group-hover:shadow-[var(--shadow-raised)]">
          <button onClick={onOpen} className="relative block aspect-[16/11] overflow-hidden rounded-t-[22px]" aria-label={`Ver ficha de ${u.model} ${u.year}`}>
            <img
              src={u.image}
              alt={`${u.model} ${u.year}`}
              loading="lazy"
              style={{ objectPosition: u.position }}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.07]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-tarmac/80 via-transparent to-asphalt/25" />
            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-asphalt/75 px-3 py-1.5 text-[12px] font-medium text-bone backdrop-blur">
              <MapPin aria-hidden className="h-3.5 w-3.5 text-lane" />
              {u.city}
            </span>
            <span className="absolute right-3 top-3 rounded-full bg-asphalt/75 px-3 py-1.5 text-[12px] font-medium text-bone/80 backdrop-blur">
              {TYPE_LABEL[u.type]}
            </span>
            <span className="absolute bottom-3 right-3 translate-y-2 rounded-full bg-bone px-3 py-1.5 text-[12px] font-semibold text-asphalt opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              Ver ficha
            </span>
          </button>

          {/* Precio montado sobre el borde de la foto */}
          <div className="relative z-10 -mt-7 ml-4 mr-auto rounded-[12px] bg-lane px-3.5 py-2 text-asphalt shadow-[var(--shadow-raised)]">
            <p className="font-display text-[24px] font-bold leading-none tracking-tight">{cop(u.price)}</p>
            <p className="mt-0.5 text-[11px] font-semibold">al mes + IVA</p>
          </div>

          <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[26px] font-semibold leading-tight tracking-tight">{u.model}</h3>
              <span className="shrink-0 text-[13px] font-medium text-stone">{u.year}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-bone/10 pt-3">
              <Spec icon={Cog}>{u.gearbox}</Spec>
              <Spec icon={Fuel}>{u.fuel}</Spec>
              <Spec icon={Users}>{`${u.seats} puestos`}</Spec>
              <Spec icon={Gauge}>{kmFmt(u.km)}</Spec>
            </div>
            <div className="mt-auto flex gap-2 pt-4">
              <motion.button
                onClick={onOpen}
                whileTap={{ scale: 0.95 }}
                className="h-11 flex-1 rounded-[10px] text-[14px] font-semibold ring-1 ring-bone/15 transition-colors hover:bg-bone/5 hover:ring-bone/40"
              >
                Ver ficha
              </motion.button>
              <motion.a
                href={waLink(unitMessage(u))}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.95 }}
                className="group/cta flex h-11 flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-lane text-[14px] font-semibold text-asphalt transition-colors hover:bg-[#ebb84f]"
              >
                Cotizar
                <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
              </motion.a>
            </div>
          </div>
        </div>
      </Tilt>
    </motion.article>
  );
}

/** Ficha completa: panel lateral en escritorio, hoja inferior arrastrable en celular. */
function UnitSheet({ u, onClose }: { u: Unit; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) onClose();
  };
  const controls = useDragControls();
  const [desktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);

  const rows: [string, string][] = [
    ["Código", u.code],
    ["Año", String(u.year)],
    ["Kilometraje", kmFmt(u.km)],
    ["Municipio", u.city],
    ["Caja", u.gearbox],
    ["Combustible", u.fuel],
    ["Tracción", u.drive],
    ["Motor", u.engine],
    ["Puestos", String(u.seats)],
    [u.cargo.label, u.cargo.value],
    ["Color", u.color],
  ];

  return (
    <motion.div className="fixed inset-0 z-[80]" initial="hidden" animate="show" exit="hidden">
      <motion.button
        aria-label="Cerrar ficha"
        onClick={onClose}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-asphalt/70 backdrop-blur-sm"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`${u.model} ${u.year}`}
        variants={{
          hidden: desktop ? { x: "110%", y: 0 } : { y: "100%", x: 0 },
          show: { y: 0, x: 0 },
        }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        drag={desktop ? false : "y"}
        dragListener={false}
        dragControls={controls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={onDragEnd}
        className="absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto rounded-t-[28px] bg-tarmac shadow-[var(--shadow-float)] ring-1 ring-bone/10 md:inset-y-3 md:left-auto md:right-3 md:max-h-none md:w-[480px] md:rounded-[28px]"
      >
        <div
          onPointerDown={(e) => controls.start(e)}
          className="sticky top-0 z-10 flex cursor-grab touch-none justify-center bg-gradient-to-b from-tarmac to-transparent pb-3 pt-3 md:hidden"
        >
          <span className="h-1.5 w-12 rounded-full bg-bone/25" />
        </div>
        <div className="relative mx-3 overflow-hidden rounded-[20px] md:mt-3">
          <motion.img
            src={u.image}
            alt={`${u.model} ${u.year}`}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, ease }}
            style={{ objectPosition: u.position }}
            className="aspect-[16/11] w-full object-cover"
            draggable={false}
          />
          <motion.button
            onClick={onClose}
            aria-label="Cerrar"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={softSpring}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-asphalt/75 text-bone backdrop-blur"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>

        <motion.div
          className="px-5 pb-8 pt-5 sm:px-6"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}
        >
          <motion.p variants={item} className="text-[13px] font-medium text-stone">
            {TYPE_LABEL[u.type]} · {u.code} · Disponible en {u.city}
          </motion.p>
          <motion.h2 variants={item} className="mt-1 font-display text-[40px] font-semibold leading-none tracking-tight">
            {u.model} <span className="text-bone/45">{u.year}</span>
          </motion.h2>
          <motion.div variants={item} className="mt-4 inline-block rounded-[14px] bg-lane px-4 py-2.5 text-asphalt">
            <p className="font-display text-[34px] font-bold leading-none tracking-tight">{cop(u.price)}</p>
            <p className="mt-1 text-[12px] font-semibold">al mes + IVA · póliza, mantenimiento, GPS, SOAT y tecnomecánica incluidos</p>
          </motion.div>

          <motion.dl variants={item} className="mt-6 grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 border-t border-bone/10 py-2.5 text-[14px]">
                <dt className="text-stone">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.div variants={item} className="mt-5">
            <p className="text-[13px] font-semibold">Equipamiento</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {u.features.map((f) => (
                <li key={f} className="rounded-full bg-asphalt px-3 py-1.5 text-[13px] text-bone/85 ring-1 ring-bone/10">
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={item} className="mt-7">
            <Button href={waLink(unitMessage(u))} external className="w-full">
              Cotizar esta unidad por WhatsApp
            </Button>
            <p className="mt-3 text-[12px] leading-[1.6] text-stone">
              El mensaje incluye el código {u.code}, así sabemos exactamente de qué vehículo hablas.
            </p>
          </motion.div>
        </motion.div>
      </motion.aside>
    </motion.div>
  );
}

const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

export default function Inventory() {
  const [type, setType] = useState<TypeFilter>("all");
  const [city, setCity] = useState<CityFilter>("all");
  const [sort, setSort] = useState<Sort>("asc");
  const [open, setOpen] = useState<Unit | null>(null);

  const list = useMemo(
    () =>
      INVENTORY.filter((u) => (type === "all" || u.type === type) && (city === "all" || u.city === city)).sort((a, b) =>
        sort === "asc" ? a.price - b.price : b.price - a.price
      ),
    [type, city, sort]
  );

  const reset = () => {
    setType("all");
    setCity("all");
  };

  return (
    <section id="inventario" className="pb-32 pt-28 sm:pt-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow>Inventario</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(2.8rem,7vw,5.6rem)] font-bold uppercase leading-[0.9] tracking-[-0.01em]">
              <SplitWords text="Vehículos disponibles" animateNow delay={0.1} />
              <br />
              <SplitWords text="para renta mensual" className="text-bone/45" animateNow delay={0.3} />
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="lg:col-span-4 lg:text-right"
          >
            <p className="font-display text-[56px] font-bold leading-none text-lane">
              <AnimatedNumber value={list.length} format={(v) => String(Math.round(v))} />
            </p>
            <p className="text-[14px] text-stone">
              {list.length === 1 ? "unidad" : "unidades"} con los filtros actuales. Toca una para ver la ficha.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Barra de filtros fija */}
      <div className="sticky top-[68px] z-40 mt-10 sm:top-[76px]">
        <div className="mx-auto max-w-[1320px] px-3 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="no-scrollbar flex items-center gap-2 overflow-x-auto rounded-[16px] bg-tarmac/90 p-2 shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-xl"
          >
            <Segmented id="type" label="Tipo" options={TYPES} value={type} onChange={setType} />
            <span aria-hidden className="h-8 w-px shrink-0 bg-bone/10" />
            <Segmented
              id="city"
              label="Municipio"
              options={[{ id: "all" as CityFilter, label: "Todas" }, ...CITIES.map((c) => ({ id: c as CityFilter, label: c }))]}
              value={city}
              onChange={setCity}
            />
            <span aria-hidden className="h-8 w-px shrink-0 bg-bone/10" />
            <motion.button
              onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
              whileTap={{ scale: 0.94 }}
              className="flex h-12 shrink-0 items-center gap-2 rounded-[12px] px-3.5 text-[13px] font-semibold text-bone/85 hover:bg-bone/5"
            >
              <motion.span animate={{ rotate: sort === "asc" ? 0 : 180 }} transition={spring} className="flex">
                <ArrowDownUp aria-hidden className="h-4 w-4 text-lane" />
              </motion.span>
              {sort === "asc" ? "Menor precio" : "Mayor precio"}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1320px] px-4 sm:px-8">
        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {list.map((u) => (
              <UnitCard key={u.code} u={u} onOpen={() => setOpen(u)} />
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {list.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-[22px] bg-tarmac p-8 text-center ring-1 ring-bone/[0.06]"
            >
              <p className="font-display text-[30px] font-semibold">No hay unidades con esos filtros</p>
              <p className="mt-2 text-[15px] text-stone">Podemos llevar la unidad desde otro municipio o conseguir una similar.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button onClick={reset} variant="ghost">
                  Ver todo el inventario
                </Button>
                <Button
                  href={waLink(
                    `Hola, busco un ${type === "all" ? "vehículo" : TYPE_LABEL[type as UnitType]} en renta mensual en ${
                      city === "all" ? "el Magdalena Medio" : city
                    }.`
                  )}
                  external
                >
                  Preguntar por WhatsApp
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-10 text-[13px] leading-[1.6] text-stone">
          Las tarifas incluyen póliza todo riesgo, mantenimiento, GPS satelital, SOAT y tecnomecánica, antes de IVA. Las fotos son de referencia de la línea;
          la disponibilidad se confirma al cotizar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" variant="ghost">
            Volver al inicio
          </Button>
          <Button href="/#cotizar">Cotizar otro vehículo</Button>
        </div>
      </div>

      <AnimatePresence>{open && <UnitSheet key={open.code} u={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
