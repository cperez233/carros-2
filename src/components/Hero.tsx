import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CITIES, IMAGES, waLink } from "../data";
import { Button, ease, SplitWords, spring } from "./motion";

const ROWS: { label: string; on: boolean }[] = [
  { label: "Seguro todo riesgo", on: true },
  { label: "Mantenimiento", on: true },
  { label: "SOAT", on: true },
  { label: "Impuestos", on: true },
  { label: "Combustible y peajes", on: false },
];

function Toggle({ on, delay }: { on: boolean; delay: number }) {
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setLit(true), delay * 1000);
    return () => clearTimeout(t);
  }, [on, delay]);
  return (
    <span
      aria-hidden
      className={`relative flex h-[26px] w-[46px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-500 ${
        lit ? "bg-lane" : "bg-bone/15"
      }`}
    >
      <motion.span
        animate={{ x: lit ? 20 : 0 }}
        transition={spring}
        className={`h-5 w-5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,.35)] ${lit ? "bg-asphalt" : "bg-bone/80"}`}
      />
    </span>
  );
}

function TariffPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease, delay: 0.9 }}
      className="relative w-full rounded-[22px] bg-tarmac/80 p-5 shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-xl sm:p-6"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[13px] font-medium text-stone">Tu tarifa mensual</p>
        <p className="text-[13px] text-stone">Contrato mes a mes</p>
      </div>
      <ul className="mt-4">
        {ROWS.map((r, i) => (
          <li
            key={r.label}
            className={`flex items-center justify-between gap-4 border-t border-bone/10 py-3 ${r.on ? "" : "text-stone-dark"}`}
          >
            <span className={`text-[16px] ${r.on ? "font-medium text-bone" : ""}`}>
              {r.label}
              <span className="sr-only">{r.on ? ": incluido" : ": no incluido"}</span>
            </span>
            <Toggle on={r.on} delay={1.5 + i * 0.22} />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[13px] leading-relaxed text-stone">
        Lo que está encendido ya viene en el precio. Combustible, peajes y multas corren por tu cuenta.
      </p>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.12]);

  return (
    <section id="inicio" ref={ref} className="relative">
      {/* Foto + titular */}
      <div className="relative flex min-h-[640px] items-end overflow-hidden pb-24 pt-32 sm:min-h-[720px] lg:min-h-[100svh] lg:pb-40">
        <motion.div
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease }}
          className="absolute inset-0"
        >
          <motion.img
            src={IMAGES.hero}
            alt="Toyota Hilux gris doble cabina estacionada en un camino de tierra al atardecer"
            style={{ y: imgY, scale: imgScale }}
            className="h-full w-full object-cover object-[62%_70%] lg:object-[50%_68%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/30 to-asphalt/40" />
        <div className="absolute inset-0 bg-asphalt/35 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-asphalt/75 via-asphalt/10 to-transparent" />

        <div className="relative mx-auto grid w-full max-w-[1320px] items-end gap-10 px-4 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease }}
              className="flex items-center gap-2.5 text-[14px] font-medium text-bone/80"
            >
              <span aria-hidden className="h-[2px] w-5 bg-lane" />
              Renta mensual de vehículos
            </motion.p>
            <h1 className="mt-5 font-display text-[clamp(2.75rem,6.4vw,5.9rem)] font-semibold leading-[0.92] tracking-[-0.01em]">
              <SplitWords text="Camionetas, pick-ups y SUV" animateNow delay={0.35} />
              <br />
              <SplitWords text="en renta mensual" className="text-bone/55" animateNow delay={0.6} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.05, ease }}
              className="mt-6 max-w-[34rem] text-[16px] leading-[1.65] text-bone/80 sm:text-[17px]"
            >
              Para empresas y particulares en Bogotá, Medellín, Bucaramanga y Cali. Una tarifa fija cada mes con seguro todo riesgo,
              mantenimiento, SOAT e impuestos. Sin permanencia: el contrato es mes a mes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.2, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button href="#flota">Ver flota y tarifas</Button>
              <Button href={waLink("Hola, quiero cotizar la renta mensual de un vehículo.")} external variant="ghost">
                Cotizar por WhatsApp
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* El panel se monta sobre el borde inferior de la foto */}
      <div className="relative z-10 -mt-14 px-4 sm:px-8 lg:-mt-44">
        <div className="mx-auto max-w-[560px] lg:max-w-[1320px] lg:grid lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-8 lg:pl-6">
            <TariffPanel />
          </div>
        </div>
      </div>

      <CityStrip />
    </section>
  );
}

function CityStrip() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-4 pt-14 sm:px-8 lg:pt-10">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
        className="flex flex-col gap-4 border-y border-bone/10 py-6 sm:flex-row sm:items-center sm:gap-8"
      >
        <motion.p
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          className="shrink-0 text-[14px] font-medium text-stone"
        >
          Entregamos en
        </motion.p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:flex sm:flex-1 sm:items-center sm:justify-between">
          {CITIES.map((c, i) => (
            <motion.li
              key={c}
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
              className="flex items-center gap-5 font-display text-[30px] font-semibold leading-none tracking-tight sm:text-[38px]"
            >
              {c}
              {i < CITIES.length - 1 && <span aria-hidden className="lane-dash-x hidden h-[3px] w-16 opacity-80 lg:block xl:w-24" />}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
