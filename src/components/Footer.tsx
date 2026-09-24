import { CITIES, EMAIL, PHONE } from "../data";
import { isInventoryPath, LINKS, linkHref, Logo } from "./Nav";

export function Footer() {
  return (
    <footer className="border-t border-bone/10 pb-32 pt-14">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-[14px] leading-[1.65] text-stone">
            Renta mensual de camionetas, pick-ups y SUV para empresas y particulares en {CITIES.slice(0, 3).join(", ")} y {CITIES[3]}.
          </p>
        </div>
        <nav aria-label="Pie de página" className="md:col-span-3">
          <ul className="grid gap-2 text-[14px]">
            {[...LINKS, { id: "contacto", label: "Cotizar", href: "/#contacto" }].map((l) => (
              <li key={l.id}>
                <a href={linkHref(l.href, isInventoryPath() ? "inventario" : "home")} className="relative text-bone/80 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-lane after:transition-transform after:duration-300 hover:text-bone hover:after:scale-x-100">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="text-[14px] md:col-span-4">
          <p className="text-bone/80">{PHONE}</p>
          <p className="mt-2 text-bone/80">{EMAIL}</p>
          <p className="mt-6 text-[13px] text-stone">© {new Date().getFullYear()} Trocha. Tarifas sujetas a disponibilidad y estudio de documentos.</p>
        </div>
      </div>
    </footer>
  );
}

