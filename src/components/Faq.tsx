import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { waLink } from "../data";
import { FAQ } from "../faq";
import { Button, ease, Eyebrow, reveal, SplitWords, spring } from "./motion";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
// Aparición: la línea de carril se dibuja, la pregunta sube y el botón gira a su lugar
const line = { hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease } } };
const text = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };
const icon = { hidden: { opacity: 0, scale: 0.4, rotate: -90 }, show: { opacity: 1, scale: 1, rotate: 0, transition: spring } };

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <motion.li variants={{ hidden: {}, show: {} }} className="relative">
      <motion.span aria-hidden variants={line} className="absolute inset-x-0 top-0 h-px origin-left bg-bone/10" />
      {/* Marca amarilla a la izquierda mientras la pregunta está abierta */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ scaleY: open ? 1 : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.45, ease }}
        className="absolute -left-4 top-5 hidden h-[calc(100%-2.5rem)] w-[3px] origin-top rounded-full bg-lane sm:block"
      />
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-5 text-left"
        >
          <motion.span
            variants={text}
            className={`font-display text-[24px] font-semibold leading-tight tracking-tight transition-colors duration-300 group-hover:text-lane sm:text-[28px] ${
              open ? "text-lane" : ""
            }`}
          >
            {q}
          </motion.span>
          <motion.span variants={icon} className="flex shrink-0">
            <motion.span
              initial={false}
              animate={{ rotate: open ? 135 : 0 }}
              transition={spring}
              className={`flex h-10 w-10 items-center justify-center rounded-full ring-1 transition-colors duration-300 ${
                open ? "bg-lane text-asphalt ring-transparent" : "bg-tarmac text-lane ring-bone/10 group-hover:ring-bone/30"
              }`}
            >
              <Plus aria-hidden className="h-5 w-5" />
            </motion.span>
          </motion.span>
        </button>
      </h3>
      {/* La respuesta siempre está en el HTML (buscadores la leen); solo se anima su altura */}
      <motion.div
        id={id}
        role="region"
        aria-hidden={!open}
        initial={false}
        animate={{ height: open ? "auto" : 0 }}
        transition={{ duration: 0.5, ease }}
        className="overflow-hidden"
      >
        <motion.p
          initial={false}
          animate={{ opacity: open ? 1 : 0, y: open ? 0 : -10, filter: open ? "blur(0px)" : "blur(4px)" }}
          transition={{ duration: open ? 0.45 : 0.25, ease, delay: open ? 0.12 : 0 }}
          className="max-w-[46rem] pb-6 pr-14 text-[17px] leading-[1.7] text-bone/80"
        >
          {a}
        </motion.p>
      </motion.div>
    </motion.li>
  );
}

export default function Faq() {
  // Una abierta a la vez; la primera empieza abierta para mostrar que se despliegan
  const [open, setOpen] = useState<number | null>(0);
  const ask = (
    <Button href={waLink("Hola, tengo una pregunta sobre la renta de camionetas.")} external variant="ghost">
      Preguntar por WhatsApp
    </Button>
  );

  return (
    <section id="preguntas" className="scroll-mt-20 border-t border-bone/10 py-20 lg:py-32">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-tight">
            <SplitWords text="Lo que más" />
            <br />
            <SplitWords text="nos preguntan" className="text-bone/50" delay={0.12} />
          </h2>
          <motion.div {...reveal} className="mt-6 hidden lg:block">
            {ask}
          </motion.div>
        </div>

        <div className="lg:col-span-8">
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={list}
            className="relative"
          >
            {FAQ.map((f, i) => (
              <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
            ))}
            <motion.li aria-hidden variants={line} className="h-px origin-left bg-bone/10" />
          </motion.ul>
          <motion.div {...reveal} className="mt-8 lg:hidden">
            {ask}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
