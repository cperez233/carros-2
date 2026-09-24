import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
export const spring = { type: "spring" as const, stiffness: 260, damping: 24 };
export const softSpring = { type: "spring" as const, stiffness: 420, damping: 24 };

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

export function useCanHover() {
  const [can, setCan] = useState(false);
  useEffect(() => setCan(canHover()), []);
  return can;
}

/** Número que corre hasta el nuevo valor cuando cambia. */
export function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const mv = useSpring(value, { stiffness: 90, damping: 20 });
  useEffect(() => {
    mv.set(value);
  }, [mv, value]);
  const text = useTransform(mv, (v) => format(v));
  return <motion.span>{text}</motion.span>;
}

/** Inclinación 3D siguiendo el puntero (solo con mouse). */
export function Tilt({ children, className = "", max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);
  const hover = useCanHover();
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={
        hover
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
              rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
            }
          : undefined
      }
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SplitWords({
  text,
  className = "",
  delay = 0,
  animateNow = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  animateNow?: boolean;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <motion.span
            className={`inline-block ${className}`}
            initial={{ y: "108%" }}
            {...(animateNow ? { animate: { y: "0%" } } : { whileInView: { y: "0%" }, viewport: { once: true } })}
            transition={{ duration: 0.95, delay: delay + i * 0.06, ease }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 text-[13px] font-medium text-stone ${className}`}>
      <span aria-hidden className="h-[2px] w-5 bg-lane" />
      {children}
    </p>
  );
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  external?: boolean;
  variant?: "lane" | "ghost" | "ink";
  type?: "button" | "submit";
};

const variants = {
  lane: "bg-lane text-asphalt hover:bg-[#ebb84f] shadow-[var(--shadow-rest)]",
  ghost: "border border-bone/25 text-bone hover:border-bone/60 hover:bg-bone/5",
  ink: "bg-asphalt text-bone hover:bg-tarmac",
};

export function Button({ children, href, onClick, className = "", external, variant = "lane", type = "button" }: BtnProps) {
  const hover = useCanHover();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 18 });
  const y = useSpring(my, { stiffness: 300, damping: 18 });
  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!hover) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left - r.width / 2) * 0.22);
    my.set((e.clientY - r.top - r.height / 2) * 0.3);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };
  const cls = `group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-[10px] px-5 text-[15px] font-semibold transition-colors duration-300 ${variants[variant]} ${className}`;
  const inner = (
    <>
      {/* Barrido de luz al pasar el mouse */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/25 opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
      />
      <span className="relative">{children}</span>
      <span className="relative h-4 w-4 overflow-hidden">
        <ArrowUpRight
          aria-hidden
          className="absolute inset-0 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-4 group-hover:translate-x-4"
        />
        <ArrowUpRight
          aria-hidden
          className="absolute inset-0 h-4 w-4 -translate-x-4 translate-y-4 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0"
        />
      </span>
    </>
  );
  const common = {
    style: { x, y },
    onMouseMove: onMove,
    onMouseLeave: reset,
    whileTap: { scale: 0.95 },
    className: cls,
  };
  if (href)
    return (
      <motion.a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...common}>
        {inner}
      </motion.a>
    );
  return (
    <motion.button type={type} onClick={onClick} {...common}>
      {inner}
    </motion.button>
  );
}
