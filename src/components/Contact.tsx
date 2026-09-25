import { AnimatePresence, motion, useAnimationControls, useScroll, useTransform } from "framer-motion";
import { CarFront, CircleHelp, Minus, Plus, Truck, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { trackLead } from "../analytics";
import { ADDRESS_LABEL, CITIES, EMAIL, IMAGES, PHONE, HOURS, VEHICLE_TYPES, waLink, type City, type VehicleTypeId } from "../data";
import { Button, ease, Eyebrow, SplitWords, softSpring } from "./motion";

type Who = "Empresa" | "Persona natural";

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

const TYPE_ICONS: Record<VehicleTypeId, LucideIcon> = { pickup4x4: Truck, pickup4x2: Truck, suv: CarFront, nose: CircleHelp };

function VehiclePicker({
  type,
  model,
  onType,
  onModel,
}: {
  type: VehicleTypeId;
  model: string;
  onType: (t: VehicleTypeId) => void;
  onModel: (m: string) => void;
}) {
  const current = VEHICLE_TYPES.find((t) => t.id === type)!;
  return (
    <div>
      <div role="radiogroup" aria-label="Tipo de vehículo" className="grid grid-cols-2 gap-2">
        {VEHICLE_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t.id];
          const on = t.id === type;
          return (
            <motion.button
              type="button"
              role="radio"
              aria-checked={on}
              key={t.id}
              onClick={() => {
                onType(t.id);
                onModel("");
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={softSpring}
              className={`group relative flex items-center gap-3 rounded-[14px] p-3 text-left ring-1 transition-colors duration-300 ${
                on ? "text-asphalt ring-transparent" : "text-bone/80 ring-bone/15 hover:ring-bone/40"
              }`}
            >
              {on && <motion.span layoutId="type-card" transition={softSpring} className="absolute inset-0 rounded-[14px] bg-lane" />}
              <span
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-300 ${
                  on ? "bg-asphalt text-lane" : "bg-asphalt text-bone/70"
                }`}
              >
                <Icon aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              </span>
              <span className="relative min-w-0">
                <span className="block text-[15px] font-semibold leading-tight">{t.label}</span>
                <span className={`hidden truncate text-[12px] sm:block ${on ? "text-asphalt/70" : "text-stone"}`}>{t.hint}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Alto fijo: el formulario no salta al cambiar de tipo */}
      <div className="relative mt-3 h-[112px] overflow-hidden rounded-[14px] bg-asphalt/70 p-3 ring-1 ring-bone/[0.06] sm:h-[64px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25, ease }}
            className="h-full"
          >
            {current.models.length > 0 ? (
              <div role="radiogroup" aria-label="Modelo (opcional)" className="grid h-full grid-cols-2 gap-2 sm:grid-cols-4">
                {current.models.map((m) => {
                  const on = m === model;
                  return (
                    <motion.button
                      type="button"
                      role="radio"
                      aria-checked={on}
                      key={m}
                      onClick={() => onModel(on ? "" : m)}
                      whileTap={{ scale: 0.95 }}
                      className={`relative truncate rounded-[10px] px-2 text-[13px] font-medium transition-colors duration-300 ${
                        on ? "text-asphalt" : "text-bone/75 hover:bg-bone/5 hover:text-bone"
                      }`}
                    >
                      {on && <motion.span layoutId="model-pill" transition={softSpring} className="absolute inset-0 rounded-[10px] bg-bone" />}
                      <span className="relative">{m}</span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <p className="flex h-full items-center justify-center px-3 text-center text-[14px] text-bone/75">
                Cuéntanos para qué lo necesitas y te recomendamos el vehículo.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="mt-2 text-[12px] text-stone">Modelo opcional. Si no eliges uno, cotizamos el tipo con la opción disponible.</p>
    </div>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  // 1 = subió (el número nuevo entra desde abajo y el viejo sale por arriba), -1 = bajó
  const [dir, setDir] = useState(1);
  const set = (n: number) => {
    setDir(n > value ? 1 : -1);
    onChange(n);
  };
  return (
    <div className="inline-flex items-center rounded-[10px] ring-1 ring-bone/15">
      <motion.button
        type="button"
        aria-label="Menos vehículos"
        onClick={() => set(Math.max(1, value - 1))}
        whileTap={{ scale: 0.85 }}
        className="flex h-11 w-11 items-center justify-center rounded-l-[10px] hover:bg-bone/5 disabled:opacity-30"
        disabled={value <= 1}
      >
        <Minus className="h-4 w-4" />
      </motion.button>
      <span className="relative flex h-11 w-14 items-center justify-center overflow-hidden font-display text-[24px] font-semibold" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.span
            key={value}
            custom={dir}
            variants={{
              enter: (d: number) => ({ y: d * 24, opacity: 0 }),
              center: { y: 0, opacity: 1 },
              exit: (d: number) => ({ y: d * -24, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <motion.button
        type="button"
        aria-label="Más vehículos"
        onClick={() => set(Math.min(50, value + 1))}
        whileTap={{ scale: 0.85 }}
        className="flex h-11 w-11 items-center justify-center rounded-r-[10px] hover:bg-bone/5"
      >
        <Plus className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

export default function Contact() {
  const [city, setCity] = useState<City>("Barrancabermeja");
  const [type, setType] = useState<VehicleTypeId>("pickup4x4");
  const [model, setModel] = useState("");
  const [who, setWho] = useState<Who>("Empresa");
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const message =
    `Hola, soy ${name.trim() || "[nombre]"}. Quiero cotizar la renta mensual de ${qty} ${
      model ? `${model} (o similar)` : type === "nose" ? "vehículo(s), aún no sé cuál" : VEHICLE_TYPES.find((t) => t.id === type)!.label
    }` +
    ` en ${city}, para ${who === "Empresa" ? "mi empresa" : "uso personal"}.`;

  // Llegada desde el botón "Cotizar": el formulario se levanta, se ilumina el borde y pasa una línea de carril
  const arrive = useAnimationControls();
  const sweep = useAnimationControls();
  useEffect(() => {
    const onArrive = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== "cotizar") return;
      arrive.start({
        y: [0, -14, 0],
        scale: [1, 1.015, 1],
        boxShadow: [
          "0 0 0 0px rgba(224,169,59,0)",
          "0 0 0 3px rgba(224,169,59,0.9)",
          "0 0 0 0px rgba(224,169,59,0)",
        ],
        transition: { duration: 1.1, ease },
      });
      sweep.start({ scaleX: [0, 1, 1], opacity: [1, 1, 0], transition: { duration: 1.1, ease, times: [0, 0.55, 1] } });
    };
    window.addEventListener("master:arrive", onArrive);
    return () => window.removeEventListener("master:arrive", onArrive);
  }, [arrive, sweep]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    trackLead("formulario", `${qty} ${type} ${city}`);
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contacto" ref={ref} className="relative scroll-mt-20 overflow-hidden py-20 lg:py-32">
      <motion.img
        src={IMAGES.valley}
        width={2400}
        height={1600}
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
              ["Horario", HOURS.label, undefined],
              ["Oficina", ADDRESS_LABEL, undefined],
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

        <motion.div id="cotizar" animate={arrive} className="relative scroll-mt-24 rounded-[22px] lg:col-span-6 lg:col-start-7">
        <motion.span
          aria-hidden
          initial={{ scaleX: 0, opacity: 0 }}
          animate={sweep}
          className="lane-dash-x pointer-events-none absolute inset-x-6 -top-3 z-10 h-[4px] origin-left"
        />
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease }}
          className="rounded-[22px] bg-tarmac/90 p-5 shadow-[var(--shadow-float)] ring-1 ring-bone/[0.08] backdrop-blur-md sm:p-8"
        >
          <div className="grid gap-5">
            <label className="block">
              <span className="mb-3 block text-[13px] font-medium text-stone">Tu nombre o el de tu empresa</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="organization"
                placeholder="Ej. Montajes y Obras SAS"
                className="h-12 w-full rounded-[10px] bg-asphalt px-4 text-[16px] text-bone ring-1 ring-bone/10 placeholder:text-stone-dark focus:outline-none focus:ring-2 focus:ring-lane"
              />
            </label>
            <Field label="Municipio de entrega">
              <Chips name="ciudad" options={CITIES} value={city} onChange={setCity} />
            </Field>
            <Field label="Tipo de vehículo">
              <VehiclePicker type={type} model={model} onType={setType} onModel={setModel} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Es para">
                <Chips name="cliente" options={["Empresa", "Persona natural"] as const} value={who} onChange={setWho} />
              </Field>
              <Field label="Cantidad">
                <Counter value={qty} onChange={setQty} />
              </Field>
            </div>
          </div>

          <div className="mt-7 rounded-[16px] bg-asphalt/70 p-4">
            <p className="text-[12px] font-medium text-stone">Así llega tu mensaje por WhatsApp</p>
            <div className="mt-3 flex justify-end">
              <motion.div
                layout
                transition={{ layout: { duration: 0.3, ease } }}
                className="relative max-w-[92%] rounded-[16px] rounded-br-[4px] bg-lane/15 px-4 py-3 text-[14px] leading-[1.55] text-bone ring-1 ring-lane/30"
              >
                <motion.p layout="position">{message}</motion.p>
                <motion.p layout="position" className="mt-1 text-right text-[11px] text-lane">
                  ahora ✓✓
                </motion.p>
              </motion.div>
            </div>
          </div>

          <Button type="submit" className="mt-5 w-full sm:w-auto">
            Enviar por WhatsApp
          </Button>
        </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
