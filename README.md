# Landing de renta de camionetas

React + Vite. `npm run build` genera HTML completo por ruta (prerender) con título, descripción, Open Graph,
datos estructurados, `robots.txt`, `sitemap.xml`, `llms.txt` y `404.html`. Se despliega en Vercel tal cual.

## Entregar a un cliente: qué cambiar

| Qué | Dónde |
|---|---|
| Dominio, razón social, NIT, WhatsApp, teléfono, correo, dirección, horario, municipios, redes, Google Analytics, verificación de Search Console, fecha de actualización | `src/site.ts` |
| Inventario (unidades, precios, fotos, municipio) | `src/inventory.ts` |
| Flota destacada del inicio, qué incluye la tarifa, fotos generales, tipos del formulario | `src/data.ts` |
| Preguntas frecuentes (los precios "desde" se calculan del inventario) | `src/faq.ts` |
| Favicon, íconos, logo e imagen para compartir en WhatsApp/redes | Editar textos arriba de `scripts/brand-assets.py` y correr `python3 scripts/brand-assets.py` (requiere Pillow) |

Todo lo marcado `[COMPLETAR]` o `PROVISIONAL` en esos archivos está pendiente de confirmar.
Cada vez que cambie el inventario, actualiza `LAST_UPDATED` en `src/site.ts`.

## Comandos

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # build + prerender en dist/
npm run preview  # ver el build final
```

## Después de publicar (una sola vez por dominio)

1. Google Search Console: agregar propiedad de dominio, verificar y enviar `https://DOMINIO/sitemap.xml`.
2. Bing Webmaster Tools: importar desde Search Console.
3. Probar `https://DOMINIO/` en Rich Results Test y PageSpeed Insights.
4. Google Business Profile con el mismo nombre, dirección y teléfono de `src/site.ts`.
