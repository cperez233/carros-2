import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { CITIES, EMAIL, IMAGES, PHONE, waLink, type City } from "../data";
import { Button, ease, Eyebrow, SplitWords, softSpring } from "./motion";

type Kind = "Pick-up" | "SUV" | "Aún no sé";
type Who = "Empresa" | "Particular";

function Chips<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <motion.button
          type="button"
          role="radio"
          aria-checked={value === o}
          key={o}
          onClick={() => onChange(o)}
          whileTap={{ scale: 0.95 }}
          className={`relative h-11 rounded-[10px] px-4 text-[14px] font-medium ring-1 transition-colors duration-300 ${
            value === o ? "text-asphalt ring-transparent" : "text-bone/80 ring-bone/15 hover:ring-bone/40"
          }`}
        >
          {value === o && <motion.span layoutId={`chip-${name}`} transition={softSpring} className="absolute inset-0 rounded-[10px] bg-lane" />}
          <span className="relative">{o}</span>
        </motion.button>
      ))}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-bone/10 pt-4">
      <p className="mb-3 text-[13px] font-medium text-stone">{label}</p>
      {children}
    </div>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-[10px] ring-1 ring-bone/15">
      <button
        type="button"
        aria-label="Menos vehículos"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-11 w-11 items-center justify-center rounded-l-[10px] hover:bg-bone/5 disabled:opacity-30"
        disabled={value <= 1}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="relative flex h-11 w-14 items-center justify-center overflow-hidden font-display text-[24px] font-semibold" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -22, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        aria-label="Más vehículos"
        onClick={() => onChange(Math.min(50, value + 1))}
        className="flex h-11 w-11 items-center justify-center rounded-r-[10px] hover:bg-bone/5"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Contact() {
  const [city, setCity] = useState<City>("Bogotá");
  const [kind, setKind] = useState<Kind>("Pick-up");
  const [who, setWho] = useState<Who>("Empresa");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const message =
    `Hola, soy ${name.trim() || "[nombre]"}. Quiero cotizar la renta mensual de ${qty} ${kind === "Aún no sé" ? "vehículo(s)" : kind}` +
    ` en ${city}, para ${who === "Empresa" ? "mi empresa" : "uso personal"}.`;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contacto" ref={ref} className="relative scroll-mt-20 overflow-hidden py-20 lg:py-32">
      <motion.img
        src={IMAGES.valley}
        alt=""
        aria-hidden
        loading="lazy"
        style={{ y: bgY }}
        className="absolute inset-0 -top-16 h-[calc(100%+8rem)] w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-asphalt via-asphalt/60 to-asphalt" />

      <div className="relative mx-auto grid max-w-[1320px] gap-12 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Eyebrow className="text-bone/70">Cotizar</Eyebrow>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[0.95] tracking-tight">
            <SplitWords text="Cuéntanos qué necesitas" />
            <br />
            <SplitWords text="y te respondemos con la tarifa" className="text-bone/55" delay={0.12} />
          </h2>
          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-10 grid max-w-md gap-0 text-[15px]"
          >
            {[
              ["Teléfono y WhatsApp", PHONE, `tel:${PHONE.replace(/\s/g, "")}`],
              ["Correo", EMAIL, `mailto:${EMAIL}`],
              ["Horario", "Lunes a viernes, 8:00 a. m. a 6:00 p. m.", undefined],
            ].map(([k, v, href]) => (
              <div key={k} className="flex flex-col gap-1 border-t border-bone/10 py-4 sm:flex-row sm:justify-between">
                <dt className="text-stone">{k}</dt>
                <dd className="font-medium">
                  {href ? (
                    <a
                      href={href}
                      className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-lane after:transition-transform after:duration-300 hover:after:scale-x-100"
                    >
                      {v}
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease }}
          className="rounded-[22px] bg-tarmac/90 p-5 shadow-[var(--shadow-float)] ring-1 ring-bone/[0.08] backdrop-blur-md sm:p-8 lg:col-span-6 lg:col-start-7"
        >
          <div className="grid gap-5">
            <label className="block">
              <span className="mb-3 block text-[13px] font-medium text-stone">Tu nombre o el de tu empresa</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="organization"
                placeholder="Ej. Constructora Los Andes"
                className="h-12 w-full rounded-[10px] bg-asphalt px-4 text-[16px] text-bone ring-1 ring-bone/10 placeholder:text-stone-dark focus:outline-none focus:ring-2 focus:ring-lane"
              />
            </label>
            <Field label="Ciudad de entrega">
              <Chips name="ciudad" options={CITIES} value={city} onChange={setCity} />
            </Field>
            <Field label="Tipo de vehículo">
              <Chips name="tipo" options={["Pick-up", "SUV", "Aún no sé"] as const} value={kind} onChange={setKind} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Es para">
                <Chips name="cliente" options={["Empresa", "Particular"] as const} value={who} onChange={setWho} />
              </Field>
              <Field label="Cantidad">
                <Counter value={qty} onChange={setQty} />
              </Field>
            </div>
          </div>

          <div className="mt-7 rounded-[14px] bg-asphalt/70 p-4">
            <p className="text-[12px] font-medium text-stone">Mensaje que se enviará</p>
            <p className="mt-1.5 text-[14px] leading-[1.55] text-bone/85">{message}</p>
          </div>

          <Button type="submit" className="mt-5 w-full sm:w-auto">
            Enviar por WhatsApp
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
