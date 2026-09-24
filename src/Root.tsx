import { motion, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import HomePage from "./App";
import InventoryPage from "./InventoryPage";
import Nav, { LogoMark, Wordmark, type Page } from "./components/Nav";

const pageOf = (pathname: string): Page => (pathname.startsWith("/inventario") ? "inventario" : "home");
const TITLES: Record<Page, string> = {
  home: "Master Service Quality · Renta de camionetas en Barrancabermeja",
  inventario: "Inventario · Master Service Quality",
};
const curtainEase = [0.76, 0, 0.24, 1] as [number, number, number, number];
const CLOSE_MS = 550;
const OPEN_MS = 750;

type Phase = "idle" | "closing" | "opening";

/** Avisa cuándo terminó el desplazamiento para que la sección haga su animación de llegada. */
function announceArrival(id: string, delay = 0) {
  let last = window.scrollY;
  let still = 0;
  const started = Date.now();
  const tick = setInterval(() => {
    still = Math.abs(window.scrollY - last) < 1 ? still + 1 : 0;
    last = window.scrollY;
    if (still >= 2 || Date.now() - started > 2500) {
      clearInterval(tick);
      setTimeout(() => window.dispatchEvent(new CustomEvent("master:arrive", { detail: id })), delay);
    }
  }, 80);
}

/** Lleva a una sección sin dejar el #ancla en la URL (así F5 vuelve arriba). */
function scrollToSection(id: string, smooth: boolean) {
  const el = id ? document.getElementById(id) : null;
  if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
  else window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "instant" });
  // Tras un cambio de página espera a que el telón se levante
  if (el) announceArrival(id, smooth ? 0 : 650);
}

/** Telón entre páginas: sube desde abajo para tapar y se levanta hacia arriba para mostrar la página nueva. */
function Curtain({ phase }: { phase: Phase }) {
  return (
    <motion.div
      aria-hidden
      initial={false}
      animate={phase}
      variants={{
        idle: { clipPath: "inset(100% 0% 0% 0%)", transition: { duration: 0 } },
        closing: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: CLOSE_MS / 1000, ease: curtainEase } },
        opening: { clipPath: "inset(0% 0% 100% 0%)", transition: { duration: OPEN_MS / 1000 - 0.1, ease: curtainEase, delay: 0.1 } },
      }}
      className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-tarmac"
    >
      <div className="flex w-[min(70vw,520px)] flex-col items-center gap-5">
        <span className="flex items-center gap-4 text-bone">
          <LogoMark size={60} />
          <Wordmark large />
        </span>
        <motion.span
          animate={{ scaleX: phase === "idle" ? 0 : 1 }}
          transition={{ duration: 0.6, ease: curtainEase }}
          className="lane-dash-x h-[4px] w-full origin-left"
        />
      </div>
    </motion.div>
  );
}

export default function Root() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingHash = useRef(window.location.hash.slice(1));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const page = pageOf(path);

  // Al cargar: sin restauración automática de scroll y sin #ancla en la URL
  useEffect(() => {
    history.scrollRestoration = "manual";
    if (window.location.hash) history.replaceState(null, "", window.location.pathname);
  }, []);

  // Cada vez que cambia la página (tapada por el telón), se ubica el scroll
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const id = pendingHash.current;
    pendingHash.current = "";
    if (id) setTimeout(() => scrollToSection(id, false), 60);
    document.title = TITLES[page];
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  /** Cambio de página con telón. Usa temporizadores para no depender de que la animación termine. */
  const switchTo = useCallback((pathname: string, push: boolean) => {
    timers.current.forEach(clearTimeout);
    setPhase("closing");
    timers.current = [
      setTimeout(() => {
        if (push) history.pushState(null, "", pathname);
        setPath(pathname);
        setPhase("opening");
      }, CLOSE_MS),
      setTimeout(() => setPhase("idle"), CLOSE_MS + OPEN_MS),
    ];
  }, []);

  const navigate = useCallback(
    (pathname: string, hash: string) => {
      const target = pageOf(pathname);
      if (target === pageOf(window.location.pathname)) {
        scrollToSection(hash, true);
        return;
      }
      pendingHash.current = hash;
      switchTo(target === "inventario" ? "/inventario" : "/", true);
    },
    [switchTo]
  );

  // Intercepta los enlaces internos de toda la página y el botón atrás del navegador
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("tel:") || href.startsWith("mailto:")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      navigate(url.pathname, url.hash.slice(1));
    };
    const onPop = () => switchTo(window.location.pathname, false);
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
      timers.current.forEach(clearTimeout);
    };
  }, [navigate, switchTo]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain min-h-screen">
        <Nav page={page} />
        {/* key: al cambiar de página se monta de cero y corren sus animaciones de entrada */}
        <div key={page}>{page === "inventario" ? <InventoryPage /> : <HomePage />}</div>
        <Curtain phase={phase} />
      </div>
    </MotionConfig>
  );
}
