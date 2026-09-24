import { AnimatePresence, motion, useInView, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cop, FLEET, waLink, type Category } from "../data";
import { AnimatedNumber, Button, ease, Eyebrow, reveal, softSpring, SplitWords, spring, Tilt, useCanHover } from "./motion";

type Filter = "all" | Category;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pickup", label: "Pick-up" },
  { id: "suv", label: "SUV" },
];
const AUTOPLAY_MS = 6000;

export default function Fleet() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = FLEET.filter((v) => filter === "all" || v.category === filter);
  const [activeId, setActiveId] = useState(FLEET[0].id);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false); // tras interactuar se detiene el autoplay
  const hover = useCanHover();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });

  const index = Math.max(0, list.findIndex((v) => v.id === activeId));
  const v = list[index] ?? list[0];

  useEffect(() => {
    if (!list.some((x) => x.id === activeId)) setActiveId(list[0].id);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (next: number, user = true) => {
    const n = list.length;
    const i = ((next % n) + n) % n;
    setDir(next > index ? 1 : -1);
    setActiveId(list[i].id);
    if (user) setTouched(true);
  };

  const autoplay = !touched && !paused && inView && list.length > 1;
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => go(index + 1, false), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [autoplay, index, activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Celular: la fila de nombres es un carrusel centrado sincronizado con la foto
  const rowRef = useRef<HTMLUListElement>(null);
  const programmatic = useRef(0);
  const settle = useRef<ReturnType<typeof setTimeout>>();
  const isRow = () => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;

  useEffect(() => {
    const row = rowRef.current;
    if (!row || !isRow()) return;
    const chip = row.querySelector<HTMLElement>(`[data-id="${v.id}"]`);
    if (!chip) return;
    programmatic.current = Date.now();
    row.scrollTo({ left: chip.offsetLeft + chip.offsetWidth / 2 - row.clientWidth / 2, behavior: "smooth" });
  }, [v.id]);

  const onRowScroll = () => {
    const row = rowRef.current;
    if (!row || !isRow() || Date.now() - programmatic.current < 700) return;
    clearTimeout(settle.current);
    settle.current = setTimeout(() => {
      const center = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      row.querySelectorAll<HTMLElement>("[data-id]").forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      if (list[best] && list[best].id !== v.id) go(best);
    }, 90);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(index + 1);
    else if (info.offset.x > 60) go(index - 1);
  };

  return (
    <section id="flota" className="scroll-mt-20 py-20 lg:py-28">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>Flota</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-tight">
              <SplitWords text="Elige el vehículo," />
              <br />
              <SplitWords text="ve la tarifa del mes" className="text-bone/50" delay={0.12} />
            </h2>
            <motion.p {...reveal} className="mt-5 max-w-xl text-[16px] leading-[1.65] text-bone/75">
              Precios por mes, antes de IVA. Si necesitas otra línea o varias unidades para tu contrato, pregúntanos.
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
                onClick={() => {
                  setFilter(f.id);
                  setTouched(true);
                }}
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

        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          {/* Escenario: foto grande */}
          <motion.div
            ref={stageRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease }}
            className="relative lg:col-span-7"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Sombra ambiental bajo el escenario */}
            <div aria-hidden className="absolute inset-x-10 -bottom-6 h-16 rounded-[50%] bg-black/60 blur-2xl" />
            <Tilt max={4} className="relative">
              <motion.div
                drag={hover ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
                className="relative aspect-[4/3] cursor-default touch-pan-y overflow-hidden rounded-[26px] bg-tarmac sm:aspect-[16/11]"
              >
                <AnimatePresence initial={false} custom={dir}>
                  <motion.img
                    key={v.id}
                    src={v.image}
                    alt={v.name}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ x: `${d * 12}%`, opacity: 0, scale: 1.08 }),
                      center: { x: "0%", opacity: 1, scale: 1 },
                      exit: (d: number) => ({ x: `${d * -8}%`, opacity: 0, scale: 1.02 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease }}
                    style={{ objectPosition: v.position }}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-asphalt/70 via-transparent to-asphalt/20" />

                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={v.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-full bg-asphalt/75 px-3 py-1.5 text-[12px] font-medium text-bone backdrop-blur"
                    >
                      {v.category === "pickup" ? "Pick-up" : "SUV"} · {v.seats} puestos · o similar
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Flechas */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {[
                    { label: "Vehículo anterior", Icon: ChevronLeft, step: -1 },
                    { label: "Vehículo siguiente", Icon: ChevronRight, step: 1 },
                  ].map(({ label, Icon, step }) => (
                    <motion.button
                      key={label}
                      aria-label={label}
                      onClick={() => go(index + step)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      transition={softSpring}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-asphalt/70 text-bone backdrop-blur transition-colors hover:bg-lane hover:text-asphalt"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.button>
                  ))}
                </div>

                {/* Progreso del autoplay */}
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-bone/10">
                  <motion.span
                    key={`${v.id}-${autoplay}`}
                    initial={{ width: "0%" }}
                    animate={{ width: autoplay ? "100%" : "0%" }}
                    transition={{ duration: autoplay ? AUTOPLAY_MS / 1000 : 0.2, ease: "linear" }}
                    className="block h-full bg-lane"
                  />
                </div>
              </motion.div>
            </Tilt>

            {/* Precio montado sobre el borde del escenario */}
            <div className="relative z-10 -mt-10 ml-4 inline-block rounded-[16px] bg-lane px-5 py-3 text-asphalt shadow-[var(--shadow-float)] sm:ml-6">
              <p className="font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-none tracking-tight">
                <AnimatedNumber value={v.price} format={cop} />
              </p>
              <p className="mt-1 text-[12px] font-semibold">al mes + IVA</p>
            </div>
            {!hover && <p className="mt-3 text-[13px] text-stone">Desliza la foto para ver otro vehículo.</p>}
          </motion.div>

          {/* Lista de modelos + ficha */}
          <div className="lg:col-span-5">
            <ul
              ref={rowRef}
              onScroll={onRowScroll}
              role="listbox"
              aria-label="Vehículos"
              className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-[calc(50%-100px)] pb-2 sm:-mx-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
            >
              {list.map((x, i) => {
                const on = x.id === v.id;
                return (
                  <li
                    key={x.id}
                    data-id={x.id}
                    className={`shrink-0 snap-center transition-[opacity,transform] duration-500 lg:scale-100 lg:border-t lg:border-bone/10 lg:opacity-100 lg:last:border-b ${
                      on ? "" : "scale-[0.92] opacity-55"
                    }`}
                  >
                    <motion.button
                      role="option"
                      aria-selected={on}
                      onClick={() => go(i)}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative flex w-[200px] flex-col items-start gap-1 rounded-[14px] px-4 py-3 text-left transition-colors duration-300 lg:w-full lg:flex-row lg:items-baseline lg:justify-between lg:rounded-none lg:px-0 lg:py-4 ${
                        on ? "bg-tarmac text-bone lg:bg-transparent" : "bg-tarmac/50 text-stone hover:text-bone lg:bg-transparent"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="fleet-marker"
                          transition={spring}
                          className="absolute inset-x-4 bottom-1.5 h-[3px] rounded-full bg-lane lg:inset-x-auto lg:-left-5 lg:bottom-auto lg:top-1/2 lg:h-8 lg:w-[3px] lg:-translate-y-1/2"
                        />
                      )}
                      <span className="font-display text-[24px] font-semibold leading-none tracking-tight transition-transform duration-300 lg:text-[32px] lg:group-hover:translate-x-2">
                        {x.name}
                      </span>
                      <span className={`text-[14px] font-medium ${on ? "text-lane" : ""}`}>{cop(x.price)}</span>
                    </motion.button>
                  </li>
                );
              })}
            </ul>

            <AnimatePresence mode="wait">
              <motion.div
                key={v.id}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                className="mt-8"
              >
                <motion.p
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                  className="text-[15px] text-bone/75"
                >
                  {v.use}
                </motion.p>
                <dl className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    ["Caja", v.gearbox],
                    ["Tracción", v.drive],
                    ["Motor", v.fuel],
                  ].map(([k, val]) => (
                    <motion.div
                      key={k}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                      whileHover={{ y: -3 }}
                      className="rounded-[14px] bg-tarmac px-3 py-3 ring-1 ring-bone/[0.06]"
                    >
                      <dt className="text-[12px] text-stone">{k}</dt>
                      <dd className="mt-1 font-display text-[22px] font-semibold leading-none">{val}</dd>
                    </motion.div>
                  ))}
                </dl>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                  className="mt-6"
                >
                  <Button href={waLink(`Hola, quiero cotizar la renta mensual de: ${v.name}.`)} external>
                    Cotizar {v.name.replace("Toyota Land Cruiser ", "")}
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mt-10 text-[13px] text-stone"
        >
          Las fotos son de referencia. El vehículo entregado puede ser de la misma línea en otro color o año.
        </motion.p>
        <motion.a
          href="/inventario"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="group mt-8 flex items-center justify-between gap-6 rounded-[22px] bg-tarmac p-5 ring-1 ring-bone/[0.06] transition-colors duration-300 hover:bg-shoulder sm:p-7"
        >
          <span>
            <span className="block font-display text-[30px] font-semibold leading-none tracking-tight sm:text-[40px]">
              Ver el inventario completo
            </span>
            <span className="mt-2 block text-[14px] text-stone">
              Unidades disponibles por municipio, con año, kilometraje, caja y tarifa.
            </span>
          </span>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-lane text-asphalt transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-110">
            <ChevronRight className="h-6 w-6" />
          </span>
        </motion.a>
      </div>
    </section>
  );
}
