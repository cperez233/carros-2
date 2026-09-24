import { MotionConfig } from "framer-motion";
import { useEffect } from "react";
import { Footer } from "./components/Footer";
import Inventory from "./components/Inventory";
import Nav from "./components/Nav";

export default function InventoryPage() {
  useEffect(() => {
    document.title = "Inventario · Trocha";
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain min-h-screen">
        <Nav page="inventario" />
        <main>
          <Inventory />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
