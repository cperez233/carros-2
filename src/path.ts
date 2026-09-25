/** Ruta actual. En el navegador es la del URL; durante el prerender la fija entry-server. */
let serverPath = "/";
export const setServerPath = (p: string) => {
  serverPath = p;
};
export const currentPath = () => (typeof window !== "undefined" ? window.location.pathname : serverPath);
