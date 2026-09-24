import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import InventoryPage from "./InventoryPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.location.pathname.startsWith("/inventario") ? <InventoryPage /> : <App />}
  </StrictMode>
);
