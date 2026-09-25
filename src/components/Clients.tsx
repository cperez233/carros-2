import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { IMAGES, waLink } from "../data";
import { Button, ease, Eyebrow, softSpring, staggerChild, staggerParent } from "./motion";

type Kind = "empresas" | "propietarios";

const CONTENT: Record<
  Kind,
  { label: string; title: string; points: string[]; docs: string[]; cta: string; button: string; image: string; alt: string; position: string }
> = {
  empresas: {
    label: "Empresas",
    title: "Camionetas para tu contrato, en una sola factura",
    points: [
      "Una o varias unidades en el mismo contrato.",
      "Factura electrónica mensual a nombre de la empresa.",
      "Te entregamos SOAT, tecnomecánica y póliza de cada unidad para inscribirla con tu contratante.",
    ],
    docs: ["RUT", "Certificado de Cámara de Comercio", "Cédula del representante legal"],
    cta: "Hola, quiero cotizar camionetas en renta mensual para mi empresa.",
    button: "Cotizar para empresas",
    image: IMAGES.empresas,
    alt: "Ford Ranger gris en una calle de la ciudad",
    position: "50% 55%",
  },
  // PLACEHOLDER: condiciones para propietarios, basadas en el comprobante de pago a proveedores
  propietarios: {
    label: "Propietarios",
    title: "Pon tu camioneta a trabajar con nosotros",
    points: [
      "La rentamos a empresas de la región y te pagamos por los días trabajados.",
      "Pago mensual por transferencia a tu cuenta, con comprobante detallado.",
      "GPS, póliza, mantenimientos y parqueo se descuentan uno por uno en el comprobante.",
      "Retención en la fuente y ReteICA se aplican según la ley.",
    ],
    docs: ["Tarjeta de propiedad", "SOAT y tecnomecánica vigentes", "Cédula o RUT", "Certificación bancaria"],
    cta: "Hola, tengo una camioneta y quiero afiliarla a Master Service Quality.",
    button: "Afiliar mi camioneta",
    image: IMAGES.propietarios,
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
              width={1800}
              height={1350}
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
          <div role="tablist" aria-label="Tipo de aliado" className="mt-5 inline-flex rounded-[12px] bg-asphalt p-1">
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
                      className="group flex gap-3 border-t border-bone/10 py-3 text-[17px] leading-[1.5] text-bone/85 transition-colors hover:text-bone"
                    >
                      <span aria-hidden className="mt-[9px] h-[3px] w-3 shrink-0 origin-left bg-lane transition-transform duration-300 group-hover:scale-x-[1.8]" />
                      {p}
                    </motion.li>
                  ))}
                </ul>
                <motion.p variants={staggerChild} className="mt-5 text-[14px] leading-[1.6] text-stone">
                  Documentos: {c.docs.join(" · ")}
                </motion.p>
                <motion.div variants={staggerChild} className="mt-6">
                  <Button href={waLink(c.cta)} external>
                    {c.button}
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
