import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import Root from "./Root";
import { setServerPath } from "./path";
import { headTags, llmsTxt, notFoundHtml, robotsTxt, ROUTES, sitemapXml, webManifest, type Route } from "./seo";

/** Genera el HTML de una ruta para que buscadores, IA y previews de WhatsApp lo lean sin ejecutar JavaScript. */
export function render(route: Route) {
  setServerPath(route);
  const html = renderToString(
    <StrictMode>
      <Root />
    </StrictMode>
  );
  return { html, head: headTags(route) };
}

export { llmsTxt, notFoundHtml, robotsTxt, ROUTES, sitemapXml, webManifest };
