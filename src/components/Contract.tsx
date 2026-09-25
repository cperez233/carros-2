import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ease, Eyebrow, reveal, SplitWords } from "./motion";

const STEPS = [
  {
    title: "Cotizas",
    body: "Nos dices qué vehículo, cuántas unidades, dónde y por cuánto tiempo. Te enviamos la tarifa por escrito.",
  },
  {
    title: "Firmas y lo recibes",
    body: "Revisamos tus documentos, firmas y te entregamos la camioneta en Barrancabermeja o en el sitio de la operación.",
  },
  {
    title: "Sigues mes a mes",
    body: "Pagas la misma tarifa cada mes y la devuelves al cierre del mes cuando ya no la necesites.",
  },
];

export default function Contract() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  // Las líneas "avanzan" como si fuéramos manejando
  const dashX = useTransform(scrollYProgress, [0, 1], ["0px 0", "-208px 0"]);
  const dashY = useTransform(scrollYProgress, [0, 1], ["0 0px", "0 -160px"]);

  return (
    <section id="contrato" className="scroll-mt-20 py-20 lg:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Contrato</Eyebrow>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-tight">
              <SplitWords text="Mes a mes," />
              <br />
              <SplitWords text="sin atarte a un plazo" className="text-bone/50" delay={0.12} />
            </h2>
          </div>
          <motion.p {...reveal} className="max-w-md text-[17px] leading-[1.65] text-bone/80 lg:col-span-4 lg:col-start-9">
            Sirve para un contrato de obra o mantenimiento de pocos meses, para cubrir una unidad propia que está en el taller o para toda la vigencia del contrato con tu cliente.
          </motion.p>
        </div>

        <div ref={ref} className="relative mt-16 lg:mt-24">
          {/* Carretera horizontal (escritorio) */}
          <div aria-hidden className="absolute inset-x-0 top-[10px] hidden h-12 rounded-full bg-tarmac lg:block">
            <motion.div style={{ scaleX: draw }} className="absolute inset-x-6 top-1/2 h-[3px] origin-left -translate-y-1/2">
              <motion.div style={{ backgroundPosition: dashX }} className="lane-dash-x h-full w-full" />
            </motion.div>
          </div>
          {/* Carretera vertical (móvil) */}
          <div aria-hidden className="absolute bottom-6 left-3 top-0 w-11 rounded-full bg-tarmac lg:hidden">
            <motion.div style={{ scaleY: draw }} className="absolute inset-y-5 left-1/2 w-[3px] origin-top -translate-x-1/2">
              <motion.div style={{ backgroundPosition: dashY }} className="lane-dash-y h-full w-full" />
            </motion.div>
          </div>

          <ol className="relative grid gap-12 lg:grid-cols-3 lg:gap-10">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease, delay: i * 0.12 }}
                className="group grid grid-cols-[68px_1fr] gap-x-4 lg:block"
              >
                <motion.span
                  initial={{ scale: 0.4, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 + i * 0.12 }}
                  aria-hidden
                  className="relative z-10 flex h-[68px] w-[68px] items-center justify-center lg:ml-10"
                >
                  <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-lane shadow-[0_0_0_7px_var(--color-asphalt)] transition-transform duration-500 group-hover:scale-125">
                    <span className="h-2 w-2 rounded-full bg-asphalt" />
                  </span>
                </motion.span>
                <div className="pt-4 lg:pt-6">
                  <h3 className="font-display text-[34px] font-semibold leading-none tracking-tight transition-colors duration-300 group-hover:text-lane">{s.title}</h3>
                  <p className="mt-3 max-w-sm text-[17px] leading-[1.6] text-bone/75 transition-colors duration-300 group-hover:text-bone/90">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
