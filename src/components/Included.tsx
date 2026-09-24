import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { useRef } from "react";
import { INCLUDED, NOT_INCLUDED } from "../data";
import { ease, staggerChild, staggerParent, Tilt } from "./motion";

const STATEMENT =
  "Pagas lo mismo cada mes. Seguro todo riesgo, mantenimiento, SOAT e impuestos ya están en la tarifa, así que no hay cuentas sorpresa del carro.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{" "}
    </motion.span>
  );
}

function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.4"] });
  const words = STATEMENT.split(" ");
  return (
    <p
      ref={ref}
      className="font-display text-[clamp(2rem,5.2vw,4.1rem)] font-semibold leading-[1.02] tracking-tight text-asphalt"
    >
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

export default function Included() {
  return (
    <section id="incluye" className="relative scroll-mt-20 bg-paper text-asphalt">
      {/* Borde superior en diagonal leve, como una berma */}
      <div aria-hidden className="absolute inset-x-0 -top-px h-10 bg-asphalt [clip-path:polygon(0_0,100%_0,100%_15%,0_100%)]" />
      <div className="mx-auto max-w-[1320px] px-4 pb-20 pt-24 sm:px-8 lg:pb-28 lg:pt-32">
        <p className="flex items-center gap-2.5 text-[13px] font-medium text-stone-dark">
          <span aria-hidden className="h-[2px] w-5 bg-lane-deep" />
          Qué incluye la tarifa
        </p>
        <div className="mt-6 max-w-[62rem]">
          <Statement />
        </div>

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerParent}
            className="lg:col-span-7"
          >
            <motion.li variants={staggerChild} className="pb-4 text-[14px] font-semibold">
              Incluido
            </motion.li>
            {INCLUDED.map((item) => (
              <motion.li
                key={item.title}
                variants={staggerChild}
                className="group relative grid grid-cols-[auto_1fr] gap-x-4 border-t border-asphalt/12 py-6 sm:grid-cols-[auto_14rem_1fr] sm:items-baseline sm:gap-x-6"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-3 -right-3 origin-left scale-x-0 rounded-[14px] bg-lane/15 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100"
                />
                <span className="relative top-[3px] flex h-7 w-7 items-center justify-center rounded-full bg-asphalt text-lane transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <h3 className="relative font-display text-[28px] font-semibold leading-tight tracking-tight transition-transform duration-300 group-hover:translate-x-1">{item.title}</h3>
                <p className="relative col-start-2 mt-1 text-[15px] leading-[1.6] text-asphalt/70 sm:col-start-3 sm:mt-0">{item.detail}</p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
            className="lg:col-span-4 lg:col-start-9"
          >
            <Tilt max={5} className="rounded-[22px] bg-asphalt p-6 text-bone shadow-[var(--shadow-raised)] sm:p-7 lg:sticky lg:top-28">
              <p className="text-[14px] font-semibold">Por tu cuenta</p>
              <ul className="mt-4">
                {NOT_INCLUDED.map((n) => (
                  <li key={n} className="group flex items-center gap-3 border-t border-bone/10 py-3.5 text-[16px] transition-colors hover:text-lane">
                    <Minus aria-hidden className="h-4 w-4 text-stone transition-transform duration-300 group-hover:scale-x-150" />
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14px] leading-[1.6] text-stone">
                El vehículo tiene la restricción de pico y placa que le corresponda en cada ciudad, como cualquier otro.
              </p>
            </Tilt>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
