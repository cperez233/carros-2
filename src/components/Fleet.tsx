import { AnimatePresence, motion, useInView, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cop, FLEET, waLink, type Category } from "../data";
import { INVENTORY } from "../inventory";
import { AnimatedNumber, Button, ease, Eyebrow, reveal, softSpring, SpeedWords, SplitWords, spring, Tilt, useCanHover } from "./motion";

type Filter = "all" | Category;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "pickup", label: "Pick-up" },
  { id: "suv", label: "SUV" },
];
const UNIT_CITIES = new Set(INVENTORY.map((u) => u.city)).size;
const AUTOPLAY_MS = 5000;
const IDLE_MS = 12000; // tras tocar algo, espera esto antes de seguir rotando sola

export default function Fleet() {
  const [filter, setFilter] = useState<Filter>("all");
  const list = FLEET.filter((v) => filter === "all" || v.category === filter);
  const [activeId, setActiveId] = useState(FLEET[0].id);
  const [dir, setDir] = useState(1);
  const [hold, setHold] = useState(0); // cada interacción reinicia la pausa corta del autoplay
  const touch = () => setHold((h) => h + 1);
  const reduced = useReducedMotion();
  const hover = useCanHover();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.25 });

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
    if (user) touch();
  };

  useEffect(() => {
    if (!hold) return;
    const t = setTimeout(() => setHold(0), IDLE_MS);
    return () => clearTimeout(t);
  }, [hold]);

  const autoplay = !hold && !reduced && inView && list.length > 1;
  useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => go(index + 1, false), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [autoplay, index, activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Celular: la fila de nombres es un carrusel centrado sincronizado con la foto
  const rowRef = useRef<HTMLUListElement>(null);
  const programmatic = useRef(0);
  // Solo un deslizamiento hecho con el dedo o la rueda cambia de carro; el que hace la rotación sola no cuenta
  const userScroll = useRef(false);
  const markUser = () => (userScroll.current = true);
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
    if (!row || !isRow() || !userScroll.current || Date.now() - programmatic.current < 700) return;
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
      userScroll.current = false;
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
            <motion.p {...reveal} className="mt-5 max-w-xl text-[17px] leading-[1.65] text-bone/80">
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
                  touch();
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

        {/* Escenario de cine: la foto a todo el ancho y el nombre del carro encima, grande como el titular */}
        <motion.div
          ref={stageRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease }}
          className="relative mt-12 lg:mt-16"
        >
          {/* Sombra ambiental bajo el escenario */}
          <div aria-hidden className="absolute inset-x-10 -bottom-6 h-16 rounded-[50%] bg-black/60 blur-2xl" />
          <Tilt max={2} className="relative">
            <motion.div
              drag={hover ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={onDragEnd}
              className="relative aspect-[4/3] cursor-default touch-pan-y overflow-hidden rounded-[26px] bg-tarmac sm:aspect-[16/9] lg:aspect-[2/1]"
            >
              <AnimatePresence initial={false} custom={dir}>
                <motion.img
                  key={v.id}
                  src={v.image.replace("w=1200", "w=2000")}
                  width={2000}
                  height={1000}
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
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-asphalt/90 via-asphalt/15 via-45% to-asphalt/25" />
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-asphalt/60 via-transparent via-50% to-transparent lg:block" />

              <div className="absolute left-4 top-4 flex items-center gap-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={v.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-full bg-asphalt/75 px-3 py-1.5 text-[13px] font-medium text-bone backdrop-blur"
                  >
                    {v.category === "pickup" ? "Pick-up" : "SUV"} · {v.seats} puestos · o similar
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Nombre del carro: entra como las palabras del titular */}
              <div className="pointer-events-none absolute inset-x-5 bottom-14 sm:inset-x-8 sm:bottom-20 lg:bottom-24 lg:left-10 lg:right-40">
                <AnimatePresence mode="wait">
                  <motion.div key={v.id} exit={{ opacity: 0, x: -30, filter: "blur(8px)", transition: { duration: 0.25 } }}>
                    <p className="font-display text-[clamp(2.1rem,7.4vw,6.6rem)] font-bold uppercase leading-[0.86] tracking-[-0.01em] [text-shadow:0_2px_18px_rgba(10,10,8,.6)]">
                      <SpeedWords text={v.name} delay={0.05} />
                    </p>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease, delay: 0.35 }}
                      className="mt-3 hidden text-[17px] font-medium text-bone/85 [text-shadow:0_1px_10px_rgba(10,10,8,.8)] sm:block"
                    >
                      {v.use}
                    </motion.p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Flechas */}
              <div className="absolute bottom-4 right-4 flex gap-2 sm:bottom-6 sm:right-6">
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
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-asphalt/70 text-bone backdrop-blur transition-colors hover:bg-lane hover:text-asphalt sm:h-12 sm:w-12"
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

          {/* Precio montado sobre el borde del escenario y ficha a la derecha */}
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="-mt-10 ml-4 inline-block self-start rounded-[16px] bg-lane px-5 py-3 text-asphalt shadow-[var(--shadow-float)] sm:ml-8 lg:ml-10">
              <p className="font-display text-[clamp(2rem,5vw,3rem)] font-bold leading-none tracking-tight">
                <AnimatedNumber value={v.price} format={cop} />
              </p>
              <p className="mt-1 text-[14px] font-semibold">al mes + IVA</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={v.id}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center lg:pt-5"
              >
                <dl className="grid grid-cols-3 gap-2">
                  {[
                    ["Caja", v.gearbox],
                    ["Tracción", v.drive],
                    ["Motor", v.fuel],
                  ].map(([k, val]) => (
                    <motion.div
                      key={k}
                      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
                      whileHover={{ y: -3 }}
                      className="rounded-[14px] bg-tarmac px-3 py-3 ring-1 ring-bone/[0.06] sm:min-w-[118px]"
                    >
                      <dt className="text-[13px] text-stone">{k}</dt>
                      <dd className="mt-1 font-display text-[22px] font-semibold leading-none">{val}</dd>
                    </motion.div>
                  ))}
                </dl>
                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
                  <Button href={waLink(`Hola, quiero cotizar la renta mensual de: ${v.name}.`)} external>
                    Cotizar {v.name.replace("Toyota Land Cruiser ", "")}
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          {!hover && <p className="mt-3 text-[13px] text-stone">Desliza la foto para ver otro vehículo.</p>}
        </motion.div>

        {/* Selector de modelos: una barra delgada debajo del escenario */}
        <ul
          ref={rowRef}
          onScroll={onRowScroll}
          onTouchStart={markUser}
          onPointerDown={markUser}
          onWheel={markUser}
          role="listbox"
          aria-label="Vehículos"
          className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-2 overflow-x-auto px-[calc(50%-100px)] pb-2 sm:-mx-8 lg:mx-0 lg:mt-14 lg:grid lg:snap-none lg:gap-0 lg:overflow-visible lg:border-t lg:border-bone/10 lg:px-0 lg:pb-0"
          style={{ gridTemplateColumns: `repeat(${list.length}, minmax(0, 1fr))` }}
        >
          {list.map((x, i) => {
            const on = x.id === v.id;
            return (
              <li
                key={x.id}
                data-id={x.id}
                className={`shrink-0 snap-center transition-[opacity,transform] duration-500 lg:scale-100 ${on ? "" : "scale-[0.92] opacity-55 lg:opacity-60 lg:hover:opacity-100"}`}
              >
                <motion.button
                  role="option"
                  aria-selected={on}
                  onClick={() => go(i)}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative flex w-[200px] flex-col items-start gap-1 rounded-[14px] px-4 py-3 text-left transition-colors duration-300 lg:w-full lg:rounded-none lg:px-0 lg:pb-2 lg:pt-5 ${
                    on ? "bg-tarmac text-bone lg:bg-transparent" : "bg-tarmac/50 text-stone hover:text-bone lg:bg-transparent"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="fleet-marker"
                      transition={spring}
                      className="absolute inset-x-4 bottom-1.5 h-[3px] rounded-full bg-lane lg:inset-x-0 lg:-top-px lg:bottom-auto"
                    />
                  )}
                  <span className="font-display text-[24px] font-semibold leading-none tracking-tight transition-transform duration-300 lg:text-[26px] lg:group-hover:translate-x-1">
                    {x.name}
                  </span>
                  <span className={`text-[15px] font-medium ${on ? "text-lane" : ""}`}>{cop(x.price)}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="mt-10 text-[13px] text-stone"
        >
          Las fotos son de referencia. El vehículo entregado puede ser de la misma línea en otro color o año.
        </motion.p>
        {/* Puerta al inventario: el número de unidades manda y la línea de carril avanza al pasar el mouse */}
        <motion.a
          href="/inventario"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="group relative mt-8 flex items-center gap-5 overflow-hidden rounded-[22px] bg-tarmac p-5 ring-1 ring-lane/25 transition-[background-color,box-shadow] duration-300 hover:bg-shoulder hover:ring-lane/60 sm:gap-8 sm:p-7"
        >
          <span className="font-display text-[68px] font-bold leading-[0.8] tracking-tight text-lane sm:text-[104px]">
            {INVENTORY.length}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-bone/75 sm:text-[16px]">
              unidades disponibles en {UNIT_CITIES} municipios
            </span>
            <span className="mt-1.5 block font-display text-[28px] font-semibold leading-none tracking-tight sm:text-[42px]">
              Ver el inventario completo
            </span>
            <span className="mt-2 hidden text-[15px] text-stone sm:block">Año, kilometraje, caja y tarifa de cada una.</span>
          </span>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lane text-asphalt transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-110 sm:h-16 sm:w-16">
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
          </span>
          <span
            aria-hidden
            className="lane-dash-x absolute inset-x-0 bottom-0 h-[3px] opacity-50 transition-[background-position,opacity] duration-[1.4s] ease-out group-hover:opacity-100 group-hover:[background-position:-208px_0]"
          />
        </motion.a>
      </div>
    </section>
  );
}
