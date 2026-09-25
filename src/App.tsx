import Clients from "./components/Clients";
import Contact from "./components/Contact";
import Contract from "./components/Contract";
import Faq from "./components/Faq";
import Fleet from "./components/Fleet";
import { Footer } from "./components/Footer";
import Hero, { CityStrip } from "./components/Hero";
import Included from "./components/Included";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Fleet />
        <CityStrip />
        <Included />
        <Contract />
        <Clients />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
