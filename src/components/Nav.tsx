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
import { ArrowLeft, Building2, CarFront, LayoutGrid, MessageCircle, Phone, Route, ShieldCheck, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BRAND, BRAND_TAGLINE, COMPANY, PHONE } from "../data";
import { currentPath } from "../path";
import { ease, softSpring, spring, useCanHover } from "./motion";

export type Page = "home" | "inventario";
export const isInventoryPath = () => currentPath().startsWith("/inventario");

export const LINKS: { id: string; label: string; icon: LucideIcon; href: string }[] = [
  { id: "flota", label: "Inventario", icon: CarFront, href: "/#flota" },
  { id: "incluye", label: "Incluye", icon: ShieldCheck, href: "/#incluye" },
  { id: "contrato", label: "Contrato", icon: Route, href: "/#contrato" },
  { id: "clientes", label: "Empresas", icon: Building2, href: "/#clientes" },
];
const INVENTORY_LINK = { id: "inventario", label: "Inventario", icon: LayoutGrid, href: "/inventario" };

/** En la página de inicio los enlaces a secciones son anclas locales; desde otra página vuelven al inicio. */
export const linkHref = (href: string, page: Page) => (page === "home" && href.startsWith("/#") ? href.slice(1) : href);

/** Volante del logo de Master dentro del cuadro amarillo de carril. Gira al pasar el mouse. */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <motion.span
      aria-hidden
      whileHover={{ rotate: -8 }}
      transition={softSpring}
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
      className={`flex shrink-0 items-center justify-center bg-lane text-asphalt ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        className="h-[72%] w-[72%] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-rotate-[35deg]"
      >
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
        <path d="M3.4 11.2 9.5 12M14.5 12l6.1-.8M12 14.6V21" />
      </svg>
    </motion.span>
  );
}

/** Nombre en dos niveles: MASTER grande y SERVICE QUALITY debajo, como en el logo original. */
export function Wordmark({ large = false }: { large?: boolean }) {
  return (
    <span className="flex flex-col items-start">
      <span className={`font-display font-bold uppercase leading-[0.82] tracking-[0.03em] ${large ? "text-[56px]" : "text-[24px]"}`}>
        {BRAND}
      </span>
      <span
        className={`flex w-full items-center font-semibold uppercase ${
          large ? "mt-2 gap-2 text-[13px] tracking-[0.34em] text-stone" : "mt-[3px] gap-1 text-[8.5px] tracking-[0.24em] text-bone/60"
        }`}
      >
        <span aria-hidden className={`shrink-0 bg-lane ${large ? "h-[3px] w-5" : "h-[2px] w-2"}`} />
        {BRAND_TAGLINE}
      </span>
    </span>
  );
}

export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <a href={isInventoryPath() ? "/" : "#inicio"} className={`group flex items-center gap-2.5 ${className}`} aria-label={`${COMPANY}, inicio`}>
      <LogoMark />
      <AnimatePresence initial={false}>
        {!compact && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden whitespace-nowrap"
          >
            <Wordmark />
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
}

function useActiveSection(page: Page) {
  const [active, setActive] = useState(page === "inventario" ? "inventario" : "inicio");
  useEffect(() => {
    setActive(page === "inventario" ? "inventario" : "inicio");
    if (page !== "home") return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["inicio", ...LINKS.map((l) => l.id), "contacto"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [page]);
  return active;
}

/** Esquinas: logo que se encoge al bajar, teléfono a la derecha y línea de carril que marca el avance. */
function Corners({ page }: { page: Page }) {
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
          className={`pointer-events-auto rounded-[14px] bg-tarmac/85 p-1.5 shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-md ${
            compact ? "" : "pr-3.5"
          }`}
        >
          <Logo compact={compact} />
        </motion.div>
        <AnimatePresence>
          {page === "inventario" && (
            <motion.a
              href="/"
              data-return
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.4, ease }}
              whileTap={{ scale: 0.95 }}
              className="group pointer-events-auto ml-2 mr-auto flex h-11 items-center gap-2 rounded-[14px] bg-tarmac/85 px-3.5 text-[14px] font-semibold text-bone shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-md transition-colors hover:bg-tarmac"
            >
              <ArrowLeft aria-hidden className="h-4 w-4 text-lane transition-transform duration-300 group-hover:-translate-x-1" />
              Volver al inicio
            </motion.a>
          )}
        </AnimatePresence>
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
  href,
  label,
  Icon,
  active,
  mouseX,
  magnify,
}: {
  href: string;
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
      href={href}
      style={{ scale, y: lift }}
      whileTap={{ scale: 0.9 }}
      aria-current={active ? "true" : undefined}
      className={`relative flex h-[52px] min-w-[52px] flex-col items-center justify-center gap-1 rounded-[14px] pt-0.5 px-1.5 sm:px-2 transition-colors duration-300 sm:min-w-[74px] ${
        active ? "text-asphalt" : "text-stone hover:text-bone"
      }`}
    >
      {active && <DockIndicator />}
      <DockIcon Icon={Icon} active={active} />
      <span className={`relative mb-1 text-[11px] leading-none transition-[font-weight] ${active ? "font-bold" : "font-semibold"}`}>{label}</span>
    </motion.a>
  );
}

/** Indicador compartido: se desliza entre botones con un leve estiramiento y dibuja una línea de carril. */
const indicatorSpring = { type: "spring" as const, stiffness: 420, damping: 30, mass: 0.9 };
function DockIndicator() {
  return (
    <motion.span
      layoutId="dock-active"
      transition={indicatorSpring}
      className="absolute inset-0 rounded-[14px] bg-bone shadow-[0_8px_18px_-8px_rgba(236,231,220,0.55),inset_0_-2px_0_rgba(19,21,20,0.08)]"
    >
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease, delay: 0.12 }}
        className="absolute inset-x-3 bottom-[5px] h-[3px] origin-left rounded-full bg-lane"
      />
    </motion.span>
  );
}

/** Ícono que da un pequeño salto cuando su botón pasa a estar activo. */
function DockIcon({ Icon, active, className = "" }: { Icon: LucideIcon; active: boolean; className?: string }) {
  return (
    <motion.span
      key={active ? "on" : "off"}
      initial={active ? { y: 0, scale: 1, rotate: 0 } : false}
      animate={active ? { y: [0, -5, 0], scale: [1, 1.2, 1], rotate: [0, -8, 0] } : { y: 0, scale: 1, rotate: 0 }}
      transition={{ duration: 0.5, ease }}
      className={`relative flex ${className}`}
    >
      <Icon aria-hidden className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 2} />
    </motion.span>
  );
}

/** Dock flotante abajo: navegación y cotizar siempre a un toque. */
function Dock({ page }: { page: Page }) {
  const active = useActiveSection(page);
  const mouseX = useMotionValue(Infinity);
  const magnify = useCanHover();
  // Aparece al empezar a bajar, para no tapar el hero en la primera pantalla
  const { scrollY } = useScroll();
  const [shown, setShown] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShown(page !== "home" || v > 160));
  useEffect(() => {
    if (page !== "home") setShown(true);
  }, [page]);

  return (
    <motion.nav
      aria-label="Principal"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: shown ? 0 : 120, opacity: shown ? 1 : 0 }}
      transition={{ duration: 0.55, ease }}
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:pb-5"
    >
      <div className="relative">
      <div
        onMouseMove={(e) => magnify && mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex items-end gap-0.5 rounded-[20px] bg-tarmac/90 p-1.5 shadow-[var(--shadow-float)] ring-1 ring-bone/10 backdrop-blur-xl"
      >
        {(page === "inventario" ? [INVENTORY_LINK, ...LINKS.slice(1)] : LINKS).map((l) => (
          <DockItem key={l.id} href={linkHref(l.href, page)} label={l.label} Icon={l.icon} active={active === l.id} mouseX={mouseX} magnify={magnify} />
        ))}
        <span aria-hidden className="mx-1 mb-3 hidden h-7 w-px self-end bg-bone/10 sm:block" />
        <motion.a
          href={linkHref("/#cotizar", page)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={softSpring}
          aria-current={active === "contacto" ? "true" : undefined}
          className="group relative flex h-[52px] items-center gap-2 rounded-[14px] bg-lane px-3 text-[14px] font-semibold text-asphalt shadow-[var(--shadow-rest)] sm:px-4"
        >
          {/* En la sección de cotizar, el indicador blanco también llega aquí */}
          {active === "contacto" && <DockIndicator />}
          <DockIcon Icon={MessageCircle} active={active === "contacto"} className="transition-transform duration-300 group-hover:-rotate-12" />
          <span className="relative">Cotizar</span>
        </motion.a>
      </div>
      </div>
    </motion.nav>
  );
}

export default function Nav({ page = "home" }: { page?: Page }) {
  return (
    <>
      <Corners page={page} />
      <Dock page={page} />
    </>
  );
}
