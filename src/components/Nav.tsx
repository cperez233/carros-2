import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { waLink } from "../data";
import { ease, softSpring } from "./motion";

export const LINKS = [
  { id: "flota", label: "Flota" },
  { id: "incluye", label: "Qué incluye" },
  { id: "contrato", label: "Contrato" },
  { id: "clientes", label: "Empresas" },
  { id: "contacto", label: "Contacto" },
];

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#inicio" className={`group flex items-center gap-2.5 ${className}`} aria-label="Trocha, inicio">
      <span aria-hidden className="flex h-7 w-7 flex-col items-center justify-center gap-[3px] rounded-[7px] bg-lane">
        <span className="h-[5px] w-[3px] rounded-full bg-asphalt transition-transform duration-500 group-hover:-translate-y-[2px]" />
        <span className="h-[5px] w-[3px] rounded-full bg-asphalt transition-transform duration-500 group-hover:translate-y-[2px]" />
      </span>
      <span className="font-display text-[26px] font-bold leading-none tracking-tight">Trocha</span>
    </a>
  );
}

function useActiveSection() {
  const [active, setActive] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["inicio", ...LINKS.map((l) => l.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

export default function Nav() {
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection();
  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <motion.div
          animate={{
            height: compact ? 60 : 80,
            backgroundColor: compact ? "rgba(19,21,20,0.86)" : "rgba(19,21,20,0)",
            borderColor: compact ? "rgba(236,231,220,0.08)" : "rgba(236,231,220,0)",
          }}
          transition={{ duration: 0.35, ease }}
          className="flex items-center justify-between border-b px-4 backdrop-blur-md sm:px-8"
        >
          <Logo />
          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`relative px-3 py-2 text-[14px] font-medium transition-colors duration-300 ${
                  active === l.id ? "text-bone" : "text-stone hover:text-bone"
                }`}
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-lane"
                    transition={softSpring}
                    className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-lane"
                  />
                )}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <motion.a
              href={waLink("Hola, quiero cotizar la renta mensual de un vehículo.")}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={softSpring}
              className="hidden h-10 items-center rounded-[9px] bg-lane px-4 text-[14px] font-semibold text-asphalt transition-colors hover:bg-[#ebb84f] sm:inline-flex"
            >
              Cotizar
            </motion.a>
            <motion.button
              onClick={() => setOpen(true)}
              whileTap={{ scale: 0.94 }}
              className="inline-flex h-11 items-center gap-2 rounded-[9px] px-3 text-[14px] font-medium text-bone hover:bg-bone/5 lg:hidden"
              aria-expanded={open}
              aria-controls="menu-movil"
            >
              Menú
              <span aria-hidden className="flex flex-col gap-[5px]">
                <span className="h-[1.5px] w-5 bg-bone" />
                <span className="h-[1.5px] w-3.5 self-end bg-bone" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-lane px-5 pb-8 pt-5 text-asphalt"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-[26px] font-bold tracking-tight">Trocha</span>
              <button
                onClick={() => setOpen(false)}
                className="h-11 rounded-[9px] px-3 text-[14px] font-semibold hover:bg-asphalt/10"
              >
                Cerrar
              </button>
            </div>
            <nav className="mt-10 flex flex-col" aria-label="Menú móvil">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.22 + i * 0.06, duration: 0.6, ease }}
                  className="border-b border-asphalt/15 py-3 font-display text-[44px] font-semibold leading-none tracking-tight"
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-auto text-[15px] leading-relaxed text-asphalt/75"
            >
              Renta mensual en Bogotá, Medellín, Bucaramanga y Cali.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
