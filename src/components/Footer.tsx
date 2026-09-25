import { motion, type Variants } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { ADDRESS_LABEL, BRAND, CITIES, COMPANY, EMAIL, HOURS, NIT, PHONE, REGION, waLink } from "../data";
import { ease, spring } from "./motion";
import { isInventoryPath, linkHref, Logo } from "./Nav";

// Enlaces propios del footer (el menú flotante usa "Inventario" para la sección Flota; aquí cada destino tiene su nombre)
const FOOTER_LINKS = [
  { label: "Flota y tarifas", href: "/#flota" },
  { label: "Inventario completo", href: "/inventario" },
  { label: "Qué incluye", href: "/#incluye" },
  { label: "Contrato", href: "/#contrato" },
  { label: "Empresas y propietarios", href: "/#clientes" },
  { label: "Preguntas frecuentes", href: "/#preguntas" },
  { label: "Cotizar", href: "/#cotizar" },
];

const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } };
const child: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };
const letter: Variants = { hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 1.1, ease } } };

const linkCls =
  "group/l relative inline-flex items-center text-bone/80 transition-colors duration-300 hover:text-bone after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-lane after:transition-transform after:duration-300 hover:after:scale-x-100";

function Heading({ children }: { children: string }) {
  return (
    <motion.p variants={child} className="mb-4 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-stone">
      <span aria-hidden className="h-[2px] w-3 bg-lane" />
      {children}
    </motion.p>
  );
}

export function Footer() {
  const page = isInventoryPath() ? "inventario" : "home";
  const contact: [string, string, boolean][] = [
    [PHONE, `tel:${PHONE.replace(/\s/g, "")}`, false],
    ["Escribir por WhatsApp", waLink("Hola, quiero información sobre la renta de camionetas."), true],
    [EMAIL, `mailto:${EMAIL}`, false],
  ];

  return (
    <footer className="relative overflow-hidden pb-28 pt-14">
      {/* Línea de carril que se dibuja al llegar al footer */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease }}
        className="lane-dash-x absolute inset-x-0 top-0 h-[3px] origin-left opacity-80"
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={parent}
        className="relative mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-8 md:grid-cols-12"
      >
        <div className="md:col-span-5">
          <motion.div
            variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: spring } }}
            className="inline-block"
          >
            <Logo />
          </motion.div>
          <motion.p variants={child} className="mt-4 max-w-sm text-[14px] leading-[1.65] text-stone">
            Renta mensual de camionetas, pick-ups y SUV para empresas contratistas en {CITIES[0]} y el {REGION}.
          </motion.p>
        </div>

        <nav aria-label="Pie de página" className="md:col-span-3">
          <Heading>Navegación</Heading>
          <ul className="grid gap-2.5 text-[14px]">
            {FOOTER_LINKS.map((l) => (
              <motion.li key={l.href} variants={child}>
                <a href={linkHref(l.href, page)} className={linkCls}>
                  <span className="transition-transform duration-300 group-hover/l:translate-x-1">{l.label}</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="text-[14px] md:col-span-4">
          <Heading>Contacto</Heading>
          <ul className="grid gap-2.5">
            {contact.map(([label, href, external]) => (
              <motion.li key={href} variants={child}>
                <a href={href} className={linkCls} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
                  <span className="transition-transform duration-300 group-hover/l:translate-x-1">{label}</span>
                </a>
              </motion.li>
            ))}
            <motion.li variants={child} className="text-bone/80">
              {ADDRESS_LABEL}
            </motion.li>
            <motion.li variants={child} className="text-stone">
              {HOURS.label}
            </motion.li>
          </ul>
        </div>

        <motion.div
          variants={child}
          className="flex flex-col-reverse gap-5 border-t border-bone/10 pt-6 sm:flex-row sm:items-center sm:justify-between md:col-span-12"
        >
          <p className="text-[13px] text-stone">
            © {new Date().getFullYear()} {COMPANY}
            {NIT ? ` · NIT ${NIT}` : ""}. Tarifas sujetas a disponibilidad y estudio de documentos.
          </p>
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileTap={{ scale: 0.94 }}
            className="group/top inline-flex h-11 shrink-0 items-center gap-2 self-start rounded-[12px] px-4 text-[14px] font-semibold text-bone/85 ring-1 ring-bone/15 transition-colors hover:bg-bone/5 hover:ring-bone/40 sm:self-auto"
          >
            Volver arriba
            <span className="relative h-4 w-4 overflow-hidden">
              <ArrowUp aria-hidden className="absolute inset-0 h-4 w-4 text-lane transition-transform duration-300 group-hover/top:-translate-y-4" />
              <ArrowUp aria-hidden className="absolute inset-0 h-4 w-4 translate-y-4 text-lane transition-transform duration-300 group-hover/top:translate-y-0" />
            </span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Nombre gigante que sube letra por letra desde el borde, como placa que aparece en la vía */}
      <motion.p
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
        className="pointer-events-none mt-10 select-none overflow-hidden text-center font-display text-[clamp(5.5rem,27vw,24rem)] font-bold uppercase leading-[0.8] tracking-[0.02em] text-bone/[0.05]"
      >
        {BRAND.split("").map((c, i) => (
          <motion.span key={i} variants={letter} className="inline-block">
            {c}
          </motion.span>
        ))}
      </motion.p>
    </footer>
  );
}
