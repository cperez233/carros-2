import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { waLink } from "../data";
import { FAQ } from "../faq";
import { Button, ease, Eyebrow, reveal, SplitWords } from "./motion";

/** Preguntas frecuentes con <details>: se abren sin JavaScript y el texto queda en el HTML para buscadores. */
export default function Faq() {
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
            <Button href={waLink("Hola, tengo una pregunta sobre la renta de camionetas.")} external variant="ghost">
              Preguntar por WhatsApp
            </Button>
          </motion.div>
        </div>

        <ul className="lg:col-span-8">
          {FAQ.map((f, i) => (
            <motion.li
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease, delay: Math.min(i, 4) * 0.05 }}
              className="border-t border-bone/10 last:border-b"
            >
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[24px] font-semibold leading-tight tracking-tight transition-colors duration-300 group-hover:text-lane sm:text-[28px]">
                    {f.q}
                  </h3>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tarmac text-lane ring-1 ring-bone/10 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-open:rotate-45 group-open:bg-lane group-open:text-asphalt">
                    <Plus aria-hidden className="h-5 w-5" />
                  </span>
                </summary>
                <p className="max-w-[46rem] pb-6 pr-14 text-[16px] leading-[1.7] text-bone/75">{f.a}</p>
              </details>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
