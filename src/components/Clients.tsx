import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { IMAGES, waLink } from "../data";
import { Button, ease, Eyebrow, softSpring, staggerChild, staggerParent } from "./motion";

type Kind = "empresas" | "particulares";

const CONTENT: Record<
  Kind,
  { label: string; title: string; points: string[]; docs: string[]; cta: string; image: string; alt: string; position: string }
> = {
  empresas: {
    label: "Empresas",
    title: "Vehículos para tu operación, en una sola factura",
    points: [
      "Una o varias unidades en el mismo contrato.",
      "Factura electrónica mensual a nombre de la empresa.",
      "Vehículos en Bogotá, Medellín, Bucaramanga y Cali con la misma cuenta.",
      "Agregas o devuelves unidades al cierre de cada mes.",
    ],
    docs: ["RUT", "Certificado de Cámara de Comercio", "Cédula del representante legal"],
    cta: "Hola, quiero cotizar vehículos en renta mensual para mi empresa.",
    image: IMAGES.empresas,
    alt: "Ford Ranger gris en una calle de la ciudad",
    position: "50% 55%",
  },
  particulares: {
    label: "Particulares",
    title: "Un carro para ti, sin comprarlo",
    points: [
      "El contrato va a tu nombre y pagas cada mes.",
      "No pagas seguro, SOAT ni impuestos aparte.",
      "Lo usas el tiempo que lo necesites y lo devuelves al cierre del mes.",
    ],
    docs: ["Cédula de ciudadanía", "Licencia de conducción vigente", "Estudio de crédito"],
    cta: "Hola, quiero cotizar un vehículo en renta mensual para uso personal.",
    image: IMAGES.particulares,
    alt: "Toyota Land Cruiser Prado blanca junto a un lago rodeado de vegetación",
    position: "55% 92%",
  },
};

export default function Clients() {
  const [kind, setKind] = useState<Kind>("empresas");
  const c = CONTENT[kind];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <section id="clientes" ref={ref} className="scroll-mt-20 pb-20 lg:pb-32">
      <div className="mx-auto grid max-w-[1320px] items-center px-4 sm:px-8 lg:grid-cols-12">
        {/* Foto */}
        <motion.div
          initial={{ clipPath: "inset(10% 10% 10% 10% round 22px)" }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 22px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, ease }}
          className="relative aspect-[4/3] overflow-hidden rounded-[22px] lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:aspect-[5/4]"
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={kind}
              src={c.image}
              alt={c.alt}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.12 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease }}
              style={{ y: imgY, objectPosition: c.position }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt/50 to-transparent" />
        </motion.div>

        {/* Panel que se monta sobre la foto */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="relative z-10 -mt-16 mx-2 rounded-[22px] bg-tarmac p-6 shadow-[var(--shadow-float)] ring-1 ring-bone/[0.06] sm:mx-8 sm:p-8 lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:mx-0 lg:mt-0"
        >
          <Eyebrow>Para quién</Eyebrow>
          <div role="tablist" aria-label="Tipo de cliente" className="mt-5 inline-flex rounded-[12px] bg-asphalt p-1">
            {(Object.keys(CONTENT) as Kind[]).map((k) => (
              <motion.button
                key={k}
                role="tab"
                aria-selected={kind === k}
                onClick={() => setKind(k)}
                whileTap={{ scale: 0.95 }}
                className={`relative h-11 rounded-[9px] px-5 text-[14px] font-semibold transition-colors duration-300 ${
                  kind === k ? "text-asphalt" : "text-stone hover:text-bone"
                }`}
              >
                {kind === k && <motion.span layoutId="client-kind" transition={softSpring} className="absolute inset-0 rounded-[9px] bg-bone" />}
                <span className="relative">{CONTENT[k].label}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative mt-7 min-h-[430px] sm:min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={kind}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                variants={staggerParent}
              >
                <motion.h2
                  variants={staggerChild}
                  className="font-display text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[0.98] tracking-tight"
                >
                  {c.title}
                </motion.h2>
                <ul className="mt-6">
                  {c.points.map((p) => (
                    <motion.li
                      key={p}
                      variants={staggerChild}
                      className="group flex gap-3 border-t border-bone/10 py-3 text-[15px] leading-[1.55] text-bone/85 transition-colors hover:text-bone"
                    >
                      <span aria-hidden className="mt-[9px] h-[3px] w-3 shrink-0 origin-left bg-lane transition-transform duration-300 group-hover:scale-x-[1.8]" />
                      {p}
                    </motion.li>
                  ))}
                </ul>
                <motion.p variants={staggerChild} className="mt-5 text-[13px] leading-[1.6] text-stone">
                  Documentos: {c.docs.join(" · ")}
                </motion.p>
                <motion.div variants={staggerChild} className="mt-6">
                  <Button href={waLink(c.cta)} external>
                    Cotizar para {c.label.toLowerCase()}
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
