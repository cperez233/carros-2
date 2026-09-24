import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CITIES, IMAGES, waLink } from "../data";
import { Button, ease, spring, Tilt } from "./motion";

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
      transition={{ duration: 1, ease, delay: 1.7 }}
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
            className={`group flex items-center justify-between gap-4 border-t border-bone/10 py-3 transition-[padding] duration-300 hover:pl-1.5 ${r.on ? "" : "text-stone-dark"}`}
          >
            <span className={`text-[16px] ${r.on ? "font-medium text-bone" : ""}`}>
              {r.label}
              <span className="sr-only">{r.on ? ": incluido" : ": no incluido"}</span>
            </span>
            <Toggle on={r.on} delay={2.3 + i * 0.22} />
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[13px] leading-relaxed text-stone">
        Lo que está encendido ya viene en el precio. Combustible, peajes y multas corren por tu cuenta.
      </p>
    </motion.div>
  );
}

/** Palabras que entran rápido desde la derecha con desenfoque, como un carro que pasa. */
function SpeedWords({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ opacity: 0, x: 90, filter: "blur(14px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: delay + i * 0.07, ease }}
          className={`inline-block ${className}`}
        >
          {w}
          {i < words.length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // En celular la franja de entrada se abre a la altura de la camioneta
  const [phone] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Al bajar, la foto se recoge en un marco redondeado y el texto sube más rápido que ella
  const frame = useTransform(
    scrollYProgress,
    [0, 0.6],
    ["inset(0% 0% 0% 0% round 0px)", "inset(4% 3% 0% 3% round 32px)"]
  );
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.16]);
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -110]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <section id="inicio" ref={ref} className="relative">
      {/* Foto + titular */}
      <div className="relative flex min-h-[100svh] items-end overflow-hidden pb-20 pt-32 sm:pb-28 lg:min-h-[100svh] lg:pb-44">
        <motion.div style={{ clipPath: frame }} className="absolute inset-0">
          {/* Entrada: la foto se abre desde una franja, como un parabrisas */}
          <motion.div
            initial={{ clipPath: phone ? "inset(26% 0% 60% 0%)" : "inset(46% 0% 46% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="absolute inset-0"
          >
            <motion.div
              initial={{ scale: 1.25 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease }}
              className="absolute inset-0"
            >
              <motion.img
                src={IMAGES.hero}
                alt="Pick-up doble cabina levantando polvo en una carretera destapada"
                style={{ y: imgY, scale: imgScale }}
                className="absolute -left-[52%] -top-[35%] h-[137%] w-[192%] max-w-none object-cover object-center sm:-left-[10%] sm:-top-[22%] sm:h-[122%] sm:w-[120%] lg:left-0 lg:top-0 lg:h-full lg:w-full lg:object-[50%_56%]"
              />
            </motion.div>
            {/* Celular: solo una sombra corta abajo para que la foto conserve su color */}
            <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/35 via-25% to-transparent to-50% sm:hidden" />
            {/* Tablet y computador */}
            <div className="absolute inset-0 hidden bg-gradient-to-t from-asphalt via-asphalt/45 to-asphalt/20 sm:block" />
            <div className="absolute inset-0 hidden bg-gradient-to-t from-asphalt from-20% via-asphalt/60 via-45% to-transparent to-65% sm:block lg:hidden" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-asphalt/85 via-asphalt/35 to-transparent sm:block" />
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-asphalt/50 to-transparent sm:h-40 sm:from-asphalt/70" />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative mx-auto grid w-full max-w-[1320px] items-end gap-10 px-4 sm:px-8 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <h1 className="font-display text-[clamp(3.2rem,8.6vw,7.6rem)] font-bold uppercase leading-[0.86] tracking-[-0.01em] [text-shadow:0_2px_18px_rgba(10,10,8,.7),0_0_48px_rgba(10,10,8,.45)]">
              <SpeedWords text="Camionetas, pick-ups y SUV" delay={1.05} />
              <br />
              <SpeedWords text="por mes" className="text-lane" delay={1.35} />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.6, ease }}
              className="mt-6 hidden max-w-[34rem] text-[17px] font-medium leading-[1.65] text-bone [text-shadow:0_1px_12px_rgba(10,10,8,.8)] sm:block"
            >
              Para empresas y particulares. Una tarifa fija cada mes con seguro todo riesgo, mantenimiento, SOAT e impuestos. Sin
              permanencia: el contrato es mes a mes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.75, ease }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button href="#flota">Ver flota y tarifas</Button>
              <Button href={waLink("Hola, quiero cotizar la renta mensual de un vehículo.")} external variant="ghost">
                Cotizar por WhatsApp
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* El panel se monta sobre el borde inferior de la foto */}
      <div className="relative z-10 -mt-14 px-4 sm:px-8 lg:-mt-44">
        <div className="mx-auto max-w-[560px] lg:max-w-[1320px] lg:grid lg:grid-cols-12">
          <Tilt max={5} className="lg:col-span-5 lg:col-start-8 lg:pl-6">
            <TariffPanel />
          </Tilt>
        </div>
      </div>

      <CityStrip />
    </section>
  );
}

function CityStrip() {
  const items = [...CITIES, ...CITIES, ...CITIES];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease }}
      className="mt-14 border-y border-bone/10 py-6 lg:mt-12"
    >
      <p className="mx-auto mb-4 max-w-[1320px] px-4 text-[14px] font-medium text-stone sm:px-8">Entregamos en</p>
      <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee flex w-max items-center group-hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex items-center">
              {items.map((c, i) => (
                <li
                  key={`${c}-${i}`}
                  className="flex items-center font-display text-[40px] font-semibold leading-none tracking-tight text-bone/90 transition-colors duration-300 hover:text-lane sm:text-[56px]"
                >
                  <span className="px-6 sm:px-8">{c}</span>
                  <span aria-hidden className="lane-dash-x h-[4px] w-20 opacity-70 sm:w-28" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
