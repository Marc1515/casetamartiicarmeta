---
name: SEO Overhaul Plan
overview: "Complete SEO overhaul for Caseta Marti i Carmeta: technical SEO (sitemap, robots, canonical, hreflang, OG, JSON-LD), on-page SEO (metadata, copy, image alts, geographic signals), and architecture (centralized constants, typed utilities)."
todos:
  - id: seo-constants
    content: Create src/lib/seo.ts with centralized SEO constants (domain, locales, contact, geo, OG image)
    status: completed
  - id: root-layout
    content: "Update src/app/layout.tsx: add metadataBase, move verification to metadata object, clean up"
    status: completed
  - id: site-layout-metadata
    content: "Update src/app/[locale]/(site)/layout.tsx: full generateMetadata with canonical, alternates, OG, Twitter, robots"
    status: completed
  - id: sitemap
    content: Create src/app/sitemap.ts with all localized public routes
    status: completed
  - id: robots
    content: Create src/app/robots.ts excluding admin/api/login
    status: completed
  - id: jsonld-component
    content: Create src/components/JsonLd.tsx typed component
    status: completed
  - id: jsonld-page
    content: Add JSON-LD (VacationRental + WebSite) to src/app/[locale]/(site)/page.tsx
    status: completed
  - id: messages-seo
    content: "Improve all 5 message JSON files: metadata, copy, image alts, geographic signals, footer"
    status: completed
  - id: gallery-alts
    content: Update GallerySection.tsx with descriptive per-image alt texts from translations
    status: completed
  - id: home-hero
    content: "Update HomeSection.tsx: improved alt text from translations"
    status: completed
  - id: footer-local
    content: "Update Footer.tsx: add location, contact info, geographic signals"
    status: completed
  - id: contact-a11y
    content: "Update ContactSection.tsx: accessibility improvements for map iframe"
    status: completed
  - id: build-verify
    content: Run next build to verify no errors, no any types, correct output
    status: completed
isProject: false
---

# Plan de implementacion SEO completa - Caseta Marti i Carmeta

## 1. Auditoria SEO actual

### Problemas de SEO Tecnico (impacto alto)

| Problema | Estado actual | Impacto |

- **No hay sitemap.xml** -- Google no puede descubrir eficientemente las URLs localizadas. Impacto ALTO.
- **No hay robots.txt** -- No hay directivas para crawlers; no se enlaza el sitemap. Impacto ALTO.
- **No hay canonical URLs** -- Riesgo de contenido duplicado entre locales. Impacto ALTO.
- **No hay hreflang / alternates** -- Google no sabe que `/ca/`, `/es/`, `/en/`, etc. son versiones del mismo contenido. Impacto CRITICO para SEO internacional.
- **No hay `metadataBase`** -- Las URLs de OG, canonical y sitemap no se resuelven correctamente contra el dominio de produccion. Impacto ALTO.
- **No hay Open Graph** -- Sin previsualizacion rica al compartir en redes sociales (Facebook, LinkedIn, WhatsApp). Impacto MEDIO-ALTO.
- **No hay Twitter Cards** -- Sin previsualizacion en Twitter/X. Impacto MEDIO.
- **No hay JSON-LD** -- Google no entiende que el sitio es un alojamiento turistico. Impacto ALTO para resultados enriquecidos.
- **No hay `x-default` hreflang** -- Visitantes sin idioma preferido no son redirigidos correctamente. Impacto MEDIO.
- **Metadata del root layout es estatica** -- `title: "Caseta Marti i Carmeta"` y `description: "Alquiler turistico"` no varian por idioma. Impacto MEDIO.
- **Google site verification hardcodeado en `<head>`** -- Deberia ir en `metadata.verification`. Impacto BAJO (funcional pero no idiomatico).

### Problemas de SEO On-Page (impacto medio-alto)

- **Descriptions demasiado cortas** -- "Allotjament turistic", "Alquiler turistico", etc. No hay keywords, no hay propuesta de valor. Impacto ALTO.
- **Alt de imagenes generico** -- "Foto del alojamiento" repetido en toda la galeria (+27 imagenes con el mismo alt). Impacto MEDIO.
- **Sin senales geograficas** -- No se menciona Delta de l'Ebre, Terres de l'Ebre, Tarragona, Catalunya, etc. en el contenido visible. Impacto ALTO para SEO local.
- **Subtitulo del hero muy corto** -- "Allotjament acollidor per a escapades a prop del mar i la natura." No menciona ubicacion. Impacto MEDIO.
- **Banners sin contenido textual** -- Banner1 y Banner2 son imagenes puras sin texto visible, sin H2/H3, sin alt en la imagen CSS. Impacto BAJO-MEDIO.
- **Footer sin datos de ubicacion** -- No hay direccion, municipio, region. Impacto MEDIO para SEO local.
- **Sin keywords en ninguna parte** -- No hay meta keywords (correcto que no esten, pero tampoco hay keyword strategy en copy). El copy necesita orientacion a busquedas reales.

### Oportunidades

- **5 idiomas ya configurados** con `next-intl` y `localePrefix: "always"` -- Base perfecta para hreflang.
- **Imagenes reales de alta calidad** (27+ fotos de la propiedad) -- Gran potencial para OG images y alt descriptivos.
- **Coordenadas ya definidas** en ContactSection (`LAT`, `LNG`) -- Facil generar datos estructurados con geo.
- **Datos de contacto ya presentes** (email, telefono, WhatsApp) -- Listos para JSON-LD.
- **Una sola pagina publica** (`/[locale]/`) -- Simplifica sitemap y canonical.

---

## 2. Plan de implementacion por fases

### Fase 1: Infraestructura SEO (Tecnico)

**Archivos nuevos:**

- `[src/lib/seo.ts](src/lib/seo.ts)` -- Constantes SEO centralizadas (dominio, nombre, locales, contacto, geo, imagen OG)
- `[src/app/sitemap.ts](src/app/sitemap.ts)` -- Sitemap dinamico con todas las rutas localizadas
- `[src/app/robots.ts](src/app/robots.ts)` -- Directivas para crawlers
- `[src/components/JsonLd.tsx](src/components/JsonLd.tsx)` -- Componente reutilizable para datos estructurados tipados

**Archivos modificados:**

- `[src/app/layout.tsx](src/app/layout.tsx)` -- Anadir `metadataBase`, mover verification a metadata, limpiar metadata base
- `[src/app/[locale]/(site)/layout.tsx](<src/app/[locale]/(site)`/layout.tsx>) -- Metadata completa: title template, description, canonical, alternates/hreflang, OG, Twitter, robots, category

### Fase 2: Datos estructurados JSON-LD

**Archivos modificados:**

- `[src/app/[locale]/(site)/page.tsx](<src/app/[locale]/(site)`/page.tsx>) -- Inyectar JSON-LD (VacationRental + WebSite)

Se usaran los schemas:

- `VacationRental` (schema.org) -- El mas preciso para este tipo de alojamiento
- `WebSite` -- Para sitelinks y busqueda interna
- `Organization` embebido dentro de VacationRental

### Fase 3: Copy SEO On-Page mejorado

**Archivos modificados (5 archivos de mensajes):**

- `[messages/ca.json](messages/ca.json)`
- `[messages/es.json](messages/es.json)`
- `[messages/en.json](messages/en.json)`
- `[messages/fr.json](messages/fr.json)`
- `[messages/de.json](messages/de.json)`

Mejoras en cada JSON:

- `metadata.title` -- Template con keywords naturales por idioma
- `metadata.description` -- 150-160 chars, keywords + propuesta de valor + ubicacion
- Nuevo namespace `metadata.ogTitle` y `metadata.ogDescription` si difieren del title/description
- `home.subtitle` -- Enriquecido con ubicacion geografica
- `home.imageAlt` -- Mas descriptivo
- `gallery.lead` -- Con mencion a espacios concretos y ubicacion
- `contact.lead` -- Con senales geograficas
- `footer.description` -- Con ubicacion y contexto
- Nuevo: `gallery.imageAlts` -- Objeto con alts descriptivos por imagen
- Nuevo: `seo.locationShort`, `seo.locationFull` -- Para reutilizar en JSON-LD y otros

### Fase 4: Imagenes y alt texts

**Archivos modificados:**

- `[src/components/public/GallerySection.tsx](src/components/public/GallerySection.tsx)` -- Alt texts descriptivos y unicos por imagen
- `[src/components/public/HomeSection.tsx](src/components/public/HomeSection.tsx)` -- Alt del hero mejorado
- `[src/components/public/Banner1.tsx](src/components/public/Banner1.tsx)` -- `role="img"` + `aria-label` mejorado
- `[src/components/public/Banner2.tsx](src/components/public/Banner2.tsx)` -- `role="img"` + `aria-label` mejorado

### Fase 5: SEO Local y Footer

**Archivos modificados:**

- `[src/components/public/Footer.tsx](src/components/public/Footer.tsx)` -- Anadir ubicacion, region, datos de contacto visibles
- `[src/components/public/ContactSection.tsx](src/components/public/ContactSection.tsx)` -- Mejorar accesibilidad del iframe del mapa

---

## 3. Detalle tecnico por archivo

### 3.1 `src/lib/seo.ts` (NUEVO)

Constantes centralizadas:

```typescript
export const SITE_URL = "https://casetamartiicarmeta.com";
export const SITE_NAME = "Caseta Marti i Carmeta";
export const LOCALES = ["ca", "es", "en", "fr", "de"] as const;
export const DEFAULT_LOCALE = "ca";
export const OG_IMAGE_PATH = "/img/housebetter.png"; // imagen principal para OG
export const CONTACT = {
  email: "pajuanf@gmail.com",
  phone: "+34 652 75 92 94",
  phoneClean: "+34652759294",
} as const;
export const GEO = {
  latitude: 40.72502884042648,
  longitude: 0.6799424640762735,
  // PENDIENTE DE CONFIRMAR: direccion exacta
  address: {
    streetAddress: "", // pendiente de confirmar
    addressLocality: "", // pendiente de confirmar (municipio)
    addressRegion: "Terres de l'Ebre, Tarragona",
    postalCode: "", // pendiente de confirmar
    addressCountry: "ES",
  },
} as const;
```

### 3.2 `src/app/layout.tsx`

Cambios clave:

- Anadir `metadataBase: new URL("https://casetamartiicarmeta.com")`
- Mover `google-site-verification` al objeto `metadata.verification`
- Eliminar description del root (la pone el site layout por locale)
- Mantener title como fallback

### 3.3 `src/app/[locale]/(site)/layout.tsx`

Metadata completa usando `generateMetadata`:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const canonicalUrl = `${SITE_URL}/${locale}`;
  const alternates = Object.fromEntries(
    LOCALES.map((l) => [l, `${SITE_URL}/${l}`]),
  );

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...alternates,
        "x-default": `${SITE_URL}/${DEFAULT_LOCALE}`,
      },
    },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: locale,
      type: "website",
      images: [
        {
          url: `${SITE_URL}${OG_IMAGE_PATH}`,
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: [`${SITE_URL}${OG_IMAGE_PATH}`],
    },
    robots: { index: true, follow: true },
    category: "travel",
  };
}
```

### 3.4 `src/app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES } from "@/lib/seo";

const PUBLIC_ROUTES = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const route of PUBLIC_ROUTES) {
    const path = route === "/" ? "" : route;
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "/" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }
  return entries;
}
```

### 3.5 `src/app/robots.ts`

```typescript
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/login"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

### 3.6 `src/components/JsonLd.tsx`

Componente server que inyecta `<script type="application/ld+json">` con tipado seguro.

### 3.7 Estrategia de keywords por idioma

**Catalan (ca):**

- Marca: "Caseta Marti i Carmeta"
- Local: "allotjament turistic Terres de l'Ebre", "casa rural Delta de l'Ebre"
- Alojamiento: "allotjament vacacional amb piscina", "caseta rural Catalunya"
- Long tail: "escapada rural a prop del mar Delta de l'Ebre", "allotjament amb piscina i jardi"

**Espanol (es):**

- Marca: "Caseta Marti i Carmeta"
- Local: "alojamiento turistico Terres de l'Ebre", "casa rural Delta del Ebro"
- Alojamiento: "alquiler vacacional con piscina", "casa rural Tarragona"
- Internacional: "alojamiento rural Cataluna cerca del mar"
- Long tail: "escapada rural cerca de la playa Delta del Ebro", "casa con piscina y jardin alquiler vacacional"

**Ingles (en):**

- Marca: "Caseta Marti i Carmeta"
- Local: "holiday rental Ebro Delta", "vacation home Terres de l'Ebre"
- Alojamiento: "vacation rental with pool Spain", "rural cottage Catalonia"
- Internacional: "holiday home near beach Spain", "rural accommodation Ebro Delta"
- Long tail: "holiday rental with pool near Ebro Delta Spain", "charming rural cottage Catalonia coast"

**Frances (fr):**

- Marca: "Caseta Marti i Carmeta"
- Local: "location vacances Delta de l'Ebre", "gite rural Catalogne"
- Alojamiento: "maison de vacances avec piscine Espagne", "hebergement rural Catalogne"
- Long tail: "location vacances avec piscine pres de la mer Catalogne"

**Aleman (de):**

- Marca: "Caseta Marti i Carmeta"
- Local: "Ferienhaus Ebro Delta", "Unterkunft Terres de l'Ebre"
- Alojamiento: "Ferienhaus mit Pool Spanien", "Ferienwohnung Katalonien"
- Long tail: "Ferienhaus mit Pool nahe Strand Ebro Delta Spanien"

### 3.8 Imagenes - alt texts descriptivos

Se creara un mapa de alts en el GallerySection basado en las keys de las imagenes:

- `house.jpg` -> "Fachada principal de la Caseta Marti i Carmeta"
- `pool.jpg` -> "Piscina privada rodeada de jardin"
- `terrace.jpg` -> "Terraza con vistas al jardin"
- `garden.jpg` -> "Jardin con vegetacion mediterranea"
- `diningroom.jpg` -> "Comedor luminoso con mesa para invitados"
- `kitchen.jpg` -> "Cocina completamente equipada"
- `bathroom.jpg` -> "Bano con acabados modernos"
- `doubleroom.jpg` -> "Habitacion doble con luz natural"
- `bedroom.jpg` -> "Dormitorio acogedor con decoracion cuidada"
- (variantes 2, 3, 4 con descripciones complementarias)

Estos alts se moveran a los archivos de traduccion para ser multilingue.

### 3.9 Footer mejorado

Se anadira al footer:

- Ubicacion (region/comarca): "Terres de l'Ebre, Tarragona, Catalunya"
- Contacto: email + telefono visibles
- Texto descriptivo ampliado con senales geograficas

### 3.10 Accesibilidad

- Banners: `role="img"` en el div de background CSS + `aria-label` descriptivo
- Mapa iframe: ya tiene `title`, verificar que es descriptivo
- Galeria: ya tiene `DialogTitle` con sr-only, correcto
- Headings: H1 en hero, H2 en secciones -- estructura correcta, sin cambios

---

## 4. Resumen de archivos

### Archivos nuevos (4):

- `src/lib/seo.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/JsonLd.tsx`

### Archivos modificados (12):

- `src/app/layout.tsx`
- `src/app/[locale]/(site)/layout.tsx`
- `src/app/[locale]/(site)/page.tsx`
- `messages/ca.json`
- `messages/es.json`
- `messages/en.json`
- `messages/fr.json`
- `messages/de.json`
- `src/components/public/GallerySection.tsx`
- `src/components/public/HomeSection.tsx`
- `src/components/public/Footer.tsx`
- `src/components/public/ContactSection.tsx`

---

## 5. Checklist de validacion

- Verificar que `next build` compila sin errores
- Verificar que no hay tipos `any`
- Comprobar `/sitemap.xml` en navegador
- Comprobar `/robots.txt` en navegador
- Inspeccionar `<head>` en cada locale: canonical, hreflang, OG, Twitter
- Validar JSON-LD con [Google Rich Results Test](https://search.google.com/test/rich-results)
- Validar OG con [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Comprobar que las imagenes tienen alt descriptivo (Lighthouse audit)
- Verificar que admin/login/api no aparecen en sitemap
- Verificar estructura de headings con extension de accesibilidad

## 6. Siguientes pasos fuera del codigo

- **Google Search Console**: verificar propiedad, enviar sitemap, monitorizar indexacion por idioma
- **Google Business Profile**: crear ficha si no existe, vincular web, solicitar resenas
- **Performance/CWV**: auditar LCP (imagen hero es `priority`, bien), CLS, FID con Lighthouse
- **Backlinks y citaciones locales**: registrar en directorios turisticos locales (Turisme Terres de l'Ebre, portal de turisme de Catalunya, etc.)
- **Generacion de resenas**: pedir a huespedes que dejen resenas en Google
- **Imagen OG optimizada**: considerar crear una imagen OG dedicada de 1200x630px en lugar de usar la foto de la casa directamente
- **Schema adicional futuro**: si se anade seccion de FAQ visible, implementar `FAQPage` schema
- **Monitoring**: configurar Ahrefs/SEMrush o herramienta gratuita para seguimiento de posiciones
