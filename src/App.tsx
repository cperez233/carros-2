import { MotionConfig } from "framer-motion";
import Clients from "./components/Clients";
import Contact from "./components/Contact";
import Contract from "./components/Contract";
import Fleet from "./components/Fleet";
import { Footer } from "./components/Footer";
import Hero from "./components/Hero";
import Included from "./components/Included";
import Nav from "./components/Nav";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain min-h-screen">
        <Nav />
        <main>
          <Hero />
          <Fleet />
          <Included />
          <Contract />
          <Clients />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
