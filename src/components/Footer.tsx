import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { CITIES, EMAIL, PHONE, waLink } from "../data";
import { ease } from "./motion";
import { LINKS, Logo } from "./Nav";

export function Footer() {
  return (
    <footer className="border-t border-bone/10 pb-28 pt-14 sm:pb-12">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-[14px] leading-[1.65] text-stone">
            Renta mensual de camionetas, pick-ups y SUV para empresas y particulares en {CITIES.slice(0, 3).join(", ")} y {CITIES[3]}.
          </p>
        </div>
        <nav aria-label="Pie de página" className="md:col-span-3">
          <ul className="grid gap-2 text-[14px]">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="text-bone/80 transition-colors hover:text-lane">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-[14px] md:col-span-4">
          <p className="text-bone/80">{PHONE}</p>
          <p className="mt-2 text-bone/80">{EMAIL}</p>
          <p className="mt-6 text-[13px] text-stone">© {new Date().getFullYear()} Trocha. Tarifas sujetas a disponibilidad y estudio de documentos.</p>
        </div>
      </div>
    </footer>
  );
}

/** Botón de cotizar fijo abajo en celular; aparece al pasar el hero y se oculta en contacto. */
export function MobileCta() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const contact = document.getElementById("contacto");
    const nearContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.8 : false;
    setShow(v > window.innerHeight * 0.9 && !nearContact);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.45, ease }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:hidden"
        >
          <div className="flex items-center gap-3 rounded-[16px] bg-tarmac/95 p-2 pl-4 shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-md">
            <p className="flex-1 text-[13px] leading-tight text-bone/80">Tarifa fija al mes, contrato mes a mes</p>
            <a
              href={waLink("Hola, quiero cotizar la renta mensual de un vehículo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-[11px] bg-lane px-4 text-[14px] font-semibold text-asphalt active:scale-95"
            >
              Cotizar
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
