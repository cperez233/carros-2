import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Building2, CarFront, MessageCircle, Phone, Route, ShieldCheck, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PHONE } from "../data";
import { ease, softSpring, spring, useCanHover } from "./motion";

export const LINKS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "flota", label: "Flota", icon: CarFront },
  { id: "incluye", label: "Incluye", icon: ShieldCheck },
  { id: "contrato", label: "Contrato", icon: Route },
  { id: "clientes", label: "Empresas", icon: Building2 },
];

export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <a href="#inicio" className={`group flex items-center gap-2.5 ${className}`} aria-label="Trocha, inicio">
      <motion.span
        aria-hidden
        whileHover={{ rotate: -8 }}
        transition={softSpring}
        className="flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-[3px] rounded-[9px] bg-lane"
      >
        <span className="h-[5px] w-[3px] rounded-full bg-asphalt transition-transform duration-500 group-hover:-translate-y-[3px]" />
        <span className="h-[5px] w-[3px] rounded-full bg-asphalt transition-transform duration-500 group-hover:translate-y-[3px]" />
      </motion.span>
      <AnimatePresence initial={false}>
        {!compact && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden whitespace-nowrap font-display text-[26px] font-bold leading-none tracking-tight"
          >
            Trocha
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}

function useActiveSection() {
  const [active, setActive] = useState("inicio");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["inicio", ...LINKS.map((l) => l.id), "contacto"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

/** Esquinas: logo que se encoge al bajar, teléfono a la derecha y línea de carril que marca el avance. */
function Corners() {
  const { scrollY, scrollYProgress } = useScroll();
  const [compact, setCompact] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 120));
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="lane-dash-x fixed inset-x-0 top-0 z-[55] h-[3px] origin-left"
      />
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-3 pt-3 sm:px-6 sm:pt-5"
      >
        <motion.div
          layout
          transition={spring}
          className={`pointer-events-auto rounded-[14px] p-1.5 pr-3 transition-colors duration-500 ${
            compact ? "bg-tarmac/90 pr-1.5 shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-md" : ""
          }`}
        >
          <Logo compact={compact} />
        </motion.div>
        <motion.a
          href={`tel:${PHONE.replace(/\s/g, "")}`}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={softSpring}
          className="group pointer-events-auto hidden h-11 items-center gap-2 rounded-[12px] bg-tarmac/80 px-4 text-[14px] font-medium text-bone shadow-[var(--shadow-rest)] ring-1 ring-bone/10 backdrop-blur-md transition-colors hover:bg-tarmac sm:inline-flex"
        >
          <Phone aria-hidden className="h-4 w-4 text-lane transition-transform duration-300 group-hover:rotate-12" />
          {PHONE}
        </motion.a>
      </motion.header>
    </>
  );
}

function DockItem({
  id,
  label,
  Icon,
  active,
  mouseX,
  magnify,
}: {
  id: string;
  label: string;
  Icon: LucideIcon;
  active: boolean;
  mouseX: MotionValue<number>;
  magnify: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (v) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? v - r.x - r.width / 2 : 999;
  });
  const scale = useSpring(useTransform(distance, [-140, 0, 140], [1, magnify ? 1.22 : 1, 1]), spring);
  const lift = useTransform(scale, [1, 1.22], [0, -6]);

  return (
    <motion.a
      ref={ref}
      href={`#${id}`}
      style={{ scale, y: lift }}
      whileTap={{ scale: 0.9 }}
      aria-current={active ? "true" : undefined}
      className={`relative flex h-[52px] min-w-[54px] flex-col items-center justify-center gap-1 rounded-[14px] px-2 transition-colors duration-300 sm:min-w-[74px] ${
        active ? "text-asphalt" : "text-stone hover:text-bone"
      }`}
    >
      {active && <motion.span layoutId="dock-active" transition={spring} className="absolute inset-0 rounded-[14px] bg-bone" />}
      <Icon aria-hidden className="relative h-[18px] w-[18px]" strokeWidth={2} />
      <span className="relative text-[11px] font-semibold leading-none">{label}</span>
    </motion.a>
  );
}

/** Dock flotante abajo: navegación y cotizar siempre a un toque. */
function Dock() {
  const active = useActiveSection();
  const mouseX = useMotionValue(Infinity);
  const magnify = useCanHover();
  // Aparece al empezar a bajar, para no tapar el hero en la primera pantalla
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShown(v > 160));

  return (
    <motion.nav
      aria-label="Principal"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: shown ? 0 : 120, opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.55, ease }}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:pb-5"
    >
      <div
        onMouseMove={(e) => magnify && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-0.5 rounded-[20px] bg-tarmac/90 p-1.5 shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-xl"
      >
        {LINKS.map((l) => (
          <DockItem key={l.id} id={l.id} label={l.label} Icon={l.icon} active={active === l.id} mouseX={mouseX} magnify={magnify} />
        ))}
        <span aria-hidden className="mx-1 mb-3 hidden h-7 w-px self-end bg-bone/10 sm:block" />
        <motion.a
          href="#contacto"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={softSpring}
          aria-current={active === "contacto" ? "true" : undefined}
          className="group relative flex h-[52px] items-center gap-2 overflow-hidden rounded-[14px] bg-lane px-3 text-[14px] sm:px-4 font-semibold text-asphalt shadow-[var(--shadow-rest)]"
        >
          <MessageCircle aria-hidden className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-12" />
          Cotizar
        </motion.a>
      </div>
    </motion.nav>
  );
}

export default function Nav() {
  return (
    <>
      <Corners />
      <Dock />
    </>
  );
}
