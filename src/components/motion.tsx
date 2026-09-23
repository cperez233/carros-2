import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

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
  const cls = `group inline-flex h-12 items-center justify-center gap-2 rounded-[10px] px-5 text-[15px] font-semibold transition-colors duration-300 ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      <ArrowUpRight
        aria-hidden
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </>
  );
  if (href)
    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        transition={softSpring}
        className={cls}
      >
        {inner}
      </motion.a>
    );
  return (
    <motion.button type={type} onClick={onClick} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} transition={softSpring} className={cls}>
      {inner}
    </motion.button>
  );
}
