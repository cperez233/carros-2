import Clients from "./components/Clients";
import Contact from "./components/Contact";
import Contract from "./components/Contract";
import Fleet from "./components/Fleet";
import { Footer } from "./components/Footer";
import Hero from "./components/Hero";
import Included from "./components/Included";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Fleet />
        <Included />
        <Contract />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
