import { motion, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { trackLead } from "./analytics";
import HomePage from "./App";
import InventoryPage from "./InventoryPage";
import Nav, { LogoMark, Wordmark, type Page } from "./components/Nav";
import { currentPath } from "./path";
import { PAGES } from "./seo";

const pageOf = (pathname: string): Page => (pathname.startsWith("/inventario") ? "inventario" : "home");
const TITLES: Record<Page, string> = { home: PAGES["/"].title, inventario: PAGES["/inventario"].title };
// En el prerender no hay layout: useLayoutEffect solo en el navegador
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
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

/** Posición del inicio al salir hacia el inventario, para "Volver al inicio". Sobrevive a recargar la pestaña. */
const RETURN_KEY = "inicio-scroll";
const saveReturn = (y: number) => {
  try {
    sessionStorage.setItem(RETURN_KEY, String(Math.round(y)));
  } catch {
    /* sin almacenamiento: vuelve arriba */
  }
};
const readReturn = () => {
  try {
    const v = Number(sessionStorage.getItem(RETURN_KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
};

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
  const [path, setPath] = useState(currentPath);
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingHash = useRef(typeof window !== "undefined" ? window.location.hash.slice(1) : "");
  const pendingReturn = useRef<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const page = pageOf(path);

  // Al cargar: sin restauración automática de scroll y sin #ancla en la URL
  useEffect(() => {
    history.scrollRestoration = "manual";
    if (window.location.hash) history.replaceState(null, "", window.location.pathname);
  }, []);

  // Cada vez que cambia la página (tapada por el telón), se ubica el scroll
  useIsoLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const id = pendingHash.current;
    const y = pendingReturn.current;
    pendingHash.current = "";
    pendingReturn.current = null;
    if (id) setTimeout(() => scrollToSection(id, false), 60);
    // Detrás del telón: salta al punto donde estaba antes de ir al inventario
    else if (y !== null) setTimeout(() => window.scrollTo({ top: y, behavior: "instant" }), 60);
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
    (pathname: string, hash: string, returning = false) => {
      const target = pageOf(pathname);
      const from = pageOf(window.location.pathname);
      if (target === from) {
        scrollToSection(hash, true);
        return;
      }
      if (from === "home") saveReturn(window.scrollY);
      pendingHash.current = hash;
      pendingReturn.current = returning && !hash ? readReturn() : null;
      switchTo(target === "inventario" ? "/inventario" : "/", true);
    },
    [switchTo]
  );

  // Intercepta los enlaces internos de toda la página y el botón atrás del navegador
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href) return;
      // Conversiones: WhatsApp y llamadas
      if (href.includes("wa.me/")) trackLead("whatsapp", a.textContent?.trim() ?? "");
      else if (href.startsWith("tel:")) trackLead("telefono");
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (href.startsWith("tel:") || href.startsWith("mailto:")) return;
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      navigate(url.pathname, url.hash.slice(1), a.hasAttribute("data-return"));
    };
    // Atrás/adelante del navegador: también vuelve al punto donde estaba en el inicio
    const onPop = () => {
      const target = pageOf(window.location.pathname);
      if (target === "home") pendingReturn.current = readReturn();
      else saveReturn(window.scrollY);
      switchTo(window.location.pathname, false);
    };
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
