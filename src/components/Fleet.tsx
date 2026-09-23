import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { cop, FLEET, waLink, type Category, type Vehicle } from "../data";
import { ease, Eyebrow, reveal, SplitWords, softSpring, spring } from "./motion";

type Filter = "all" | Category;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pickup", label: "Pick-up" },
  { id: "suv", label: "SUV" },
];

function VehicleCard({ v }: { v: Vehicle }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
      transition={spring}
      whileHover={{ y: -6 }}
      className="group relative flex w-[84%] shrink-0 snap-start flex-col rounded-[22px] bg-tarmac shadow-[var(--shadow-rest)] ring-1 ring-bone/[0.06] transition-shadow duration-500 hover:shadow-[var(--shadow-raised)] sm:w-[58%] md:w-auto"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[22px]">
        <img
          src={v.image}
          alt={v.name}
          loading="lazy"
          style={{ objectPosition: v.position }}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tarmac/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-asphalt/70 px-3 py-1 text-[12px] font-medium text-bone backdrop-blur">
          {v.category === "pickup" ? "Pick-up" : "SUV"} · {v.seats} puestos
        </span>
      </div>

      {/* Chip de precio montado sobre el borde de la foto */}
      <div className="relative z-10 -mt-9 ml-4 mr-auto rounded-[14px] bg-lane px-4 py-2.5 text-asphalt shadow-[var(--shadow-raised)]">
        <p className="font-display text-[30px] font-bold leading-none tracking-tight">{cop(v.price)}</p>
        <p className="mt-1 text-[12px] font-medium">al mes + IVA</p>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="font-display text-[28px] font-semibold leading-tight tracking-tight">{v.name}</h3>
        <p className="text-[13px] text-stone">o similar · {v.use}</p>
        <dl className="mt-5 grid grid-cols-3 border-t border-bone/10 pt-4 text-[13px]">
          {[
            ["Caja", v.gearbox],
            ["Tracción", v.drive],
            ["Motor", v.fuel],
          ].map(([k, val]) => (
            <div key={k}>
              <dt className="text-stone">{k}</dt>
              <dd className="mt-0.5 font-medium text-bone">{val}</dd>
            </div>
          ))}
        </dl>
        <a
          href={waLink(`Hola, quiero cotizar la renta mensual de una ${v.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-11 items-center justify-between rounded-[10px] border border-bone/15 px-4 text-[14px] font-semibold transition-colors duration-300 hover:border-lane hover:bg-lane hover:text-asphalt"
        >
          Cotizar este vehículo
          <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.article>
  );
}

export default function Fleet() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = FLEET.filter((v) => filter === "all" || v.category === filter);

  return (
    <section id="flota" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Flota</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-tight">
              <SplitWords text="Precio por mes," />
              <br />
              <SplitWords text="antes de IVA" className="text-bone/50" delay={0.12} />
            </h2>
            <motion.p {...reveal} className="mt-5 max-w-xl text-[16px] leading-[1.65] text-bone/75">
              Referencias disponibles hoy. Si necesitas otra línea o varias unidades para tu empresa, pregúntanos.
            </motion.p>
          </div>

          <motion.div
            {...reveal}
            role="tablist"
            aria-label="Filtrar por tipo de vehículo"
            className="inline-flex self-start rounded-[12px] bg-tarmac p-1 ring-1 ring-bone/[0.06] lg:self-auto"
          >
            {FILTERS.map((f) => (
              <motion.button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                whileTap={{ scale: 0.95 }}
                className={`relative h-11 rounded-[9px] px-5 text-[14px] font-semibold transition-colors duration-300 ${
                  filter === f.id ? "text-asphalt" : "text-stone hover:text-bone"
                }`}
              >
                {filter === f.id && (
                  <motion.span layoutId="fleet-filter" transition={softSpring} className="absolute inset-0 rounded-[9px] bg-lane" />
                )}
                <span className="relative">{f.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        layout
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-6 sm:scroll-px-8 sm:px-8 md:mx-auto md:grid md:max-w-[1320px] md:grid-cols-2 md:gap-6 md:overflow-visible lg:grid-cols-3"
      >
        <AnimatePresence initial={false}>
          {list.map((v) => (
            <VehicleCard key={v.id} v={v} />
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease }}
        className="mx-auto mt-4 max-w-[1320px] px-4 text-[13px] text-stone sm:px-8"
      >
        Las fotos son de referencia. El vehículo entregado puede ser de la misma línea en otro color o año.
        <span className="md:hidden"> Desliza para ver más.</span>
      </motion.p>
    </section>
  );
}
