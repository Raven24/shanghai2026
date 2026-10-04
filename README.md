# Mein Fotoalbum – Instagram-ähnliche Fotogalerie mit Astro

Eine statische, datenschutzfreundliche Fotogalerie, gebaut mit **Astro 7.3.5**, ohne externe CDNs, Tracking oder Fonts.

## Features

- **Instagram-ähnliche UI**: Feed mit neuesten Beiträgen (neueste zuerst), Profil-Header, Highlights-Sammlungen
- **Responsive Design**: Mobile-first, optimiert für 360px–2560px
- **Bildoptimierung**: Automatische Konvertierung zu AVIF/WebP mit JPG-Fallback, lazy-loading, EXIF/GPS-Stripping
- **Theme-Toggle**: Light/Dark/System-Modus mit localStorage, kein FOUC
- **Carousel**: Scroll-snap, Keyboard-Navigation (Pfeiltasten), reduzierte Bewegungen respektiert
- **Dialog-Overlay**: Native `<dialog>` für Lightbox-Funktionalität, responsive (100svh mobile)
- **RSS-Feed**: `/rss.xml` mit allen Beiträgen (de-DE Sprache)
- **Keine Abhängigkeiten**: Vanilla CSS + JavaScript, keine UI-Frameworks
- **Barrierefreiheit**: Semantisches HTML, ARIA-Labels, Skip-Links, Tastatur-Navigation
- **Datenschutz**: Keine externen Fonts/CDNs/Analytics, EXIF-Metadaten entfernt

## Projektstruktur

```
src/
├── components/           # Wiederverwendbare Komponenten (13x)
│   ├── BaseLayout.astro      # Main Layout mit Header/Footer, Inline Theme-Script (FOUC-Prävention)
│   ├── Icon.astro            # Icon-Wrapper (SVG-Inline)
│   ├── ThemeToggle.astro     # Light/Dark/System Toggle
│   ├── Carousel.astro        # Scroll-snap Carousel mit Dots + Keyboard-Nav
│   ├── PostOverlay.astro     # Native <dialog> Lightbox
│   ├── PostCard.astro        # Feed-Karte (Datum, Sammlung, Carousel, Preview)
│   ├── ProfileHeader.astro   # Profil mit Avatar, Name, Bio, Stats
│   ├── HighlightsRow.astro   # Scrollbare Sammlungs-Ringe
│   ├── HighlightItem.astro   # Einzelner Highlight-Ring
│   ├── CollectionGrid.astro  # 3-Col Grid für Sammlungsseiten
│   ├── GridTile.astro        # Einzelnes Gitter-Feld (1:1 Ratio, Badge)
│   └── Pagination.astro      # Zurück/Weiter Navigation
├── layouts/
│   └── BaseLayout.astro      # Siehe components/
├── pages/
│   ├── index.astro           # Startseite (Profil + Highlights + Feed, 12 Posts/Seite)
│   ├── page/[page].astro     # Pagination-Seiten (/page/2/, /page/3/, ...)
│   ├── posts/[id]/index.astro        # Post-Detailseite mit vollem Text + Carousel
│   ├── sammlungen/[slug]/index.astro # Sammlungs-Seite mit gefilterten Posts
│   └── rss.xml.ts           # RSS-Feed Generator
├── content/
│   ├── config.ts             # Content-Schema (Zod-validiert)
│   ├── sammlungen/           # Sammlungen (Markdown, flat)
│   │   ├── sommer-2026.md
│   │   └── stadtleben.md
│   ├── posts/                # Posts (Datum-Slug Ordnerstruktur)
│   │   ├── 2026-05-02-erste-fahrradtour/
│   │   │   ├── index.md
│   │   │   ├── _placeholder-1.jpg
│   │   │   └── _placeholder-2.jpg
│   │   └── ...
│   └── placeholders/         # Generierte Test-Bilder
│       ├── _placeholder-1.jpg (4:5 - Feed/Detail)
│       ├── _placeholder-2.jpg (4:5)
│       ├── _placeholder-3.jpg (4:5)
│       ├── _placeholder-4.jpg (4:5)
│       ├── _placeholder-1-sq.jpg (1:1 - Grid)
│       ├── _placeholder-2-sq.jpg (1:1)
│       ├── _placeholder-3-sq.jpg (1:1)
│       └── _placeholder-5.jpg (16:9 - Sammlungs-Cover)
├── styles/
│   └── global.css            # CSS Custom Properties (Farben, Spacing, Typographie)
└── scripts/
    └── generate-placeholder-images.mjs  # Sharp-Script zum Generieren von Test-Bildern

dist/                        # Build-Ausgabe (statische HTML/CSS/JS + optimierte Bilder)
```

## Inhalts-Format

### Sammlungen (`src/content/sammlungen/*.md`)

```yaml
---
titel: "Sommer 2026"
beschreibung: "Sommertage und lange Abende"
sortierung: 1
titelbild: ../placeholders/_placeholder-5.jpg
---

Optionale Beschreibung in Markdown...
```

### Posts (`src/content/posts/<datum>-<slug>/index.md`)

```yaml
---
datum: 2026-05-20
sammlung: sommer-2026
bilder:
  - datei: _placeholder-1.jpg
    alt: "Beschreibung für Screenreader"
  - datei: _placeholder-2.jpg
    alt: "Zweite Abbildung"
---

Optional: Markdown-Text für die Detailseite
(wird auf Startseite als 200-Zeichen-Preview angezeigt)
```

**Anforderungen:**
- Jeder Post muss 1–3 Bilder haben
- Jedes Bild benötigt Pflicht-`alt`-Text (Barrierefreiheit, SEO)
- Bilder müssen im selben Ordner wie `index.md` liegen
- `sammlung` muss auf eine existierende Sammlungs-ID verweisen
- `datum` bestimmt die URL und die Feed-Sortierung

## Lokale Entwicklung

### Anforderungen
- Node.js 26.8.1 (empfohlen)
- npm 10+

### Installation

```bash
npm install
```

### Entwicklungsserver

```bash
npm run dev
```

Server startet unter `http://localhost:4321` mit Hot-Reload.

### Typ-Überprüfung

```bash
npm run check
```

Überprüft TypeScript-Fehler und Astro-Integrationen.

### Build

```bash
npm run build
```

Generiert statische HTML/CSS/JS in `dist/`.

### Vorschau (mit Caddy)

```bash
npm run build
docker compose up -d
```

Server läuft unter `http://localhost` mit realistischen Bedingungen (Caching, Gzip, Security Headers).

Mehr Details: `.docker-compose.md`

## Deployment

Diese Seite ist vollständig statisch und kann auf jedem Web-Host gehostet werden.

### GitHub Pages (schnell & kostenlos)

Die Seite ist auf GitHub Pages unter `https://shanghai2026.flstd.xyz/` deploybar.

**Setup (einmalig):**
- Repository: https://github.com/Raven24/shanghai2026
- Pages aktiviert: Branch `gh-pages`, Custom Domain `shanghai2026.flstd.xyz`
- `.nojekyll` + `CNAME` in `public/` vorhanden (blockiert Jekyll-Verarbeitung)

**Deployment:**
```bash
npm run deploy
```

Das Skript baut die Seite und pusht den Output in den `gh-pages`-Branch. Nach ~1 Minute ist die Seite live unter `https://shanghai2026.flstd.xyz/`.

**Was passiert dabei:**
1. `astro build` → erzeugt `dist/`
2. `gh-pages -d dist --dotfiles` → pusht `dist/` + versteckte Dateien (`.nojekyll`) in `gh-pages`-Branch
3. GitHub Pages deployt automatisch

### Nginx (empfohlen)

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;

  # SSL-Zertifikat (Let's Encrypt via Certbot)
  ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

  # HTTP/2 Push & Security
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  # Root-Verzeichnis
  root /var/www/example.com/dist;
  index index.html;

  # Gzip-Kompression für HTML/CSS/JS
  gzip on;
  gzip_types text/plain text/css application/javascript application/json;
  gzip_min_length 1000;

  # Cache-Kontrolle für Assets
  location /_astro/ {
    # Hashed Assets sind unveränderlich – 1 Jahr Cache
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location /rss.xml {
    # RSS-Feed: Kurzes Caching (1 Stunde)
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
  }

  location / {
    # HTML-Seiten: Revalidierung (5 Minuten)
    expires 5m;
    add_header Cache-Control "public, max-age=300";
    try_files $uri $uri/ $uri/index.html;
  }

  # Security Headers
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header X-XSS-Protection "1; mode=block";
}

# HTTP zu HTTPS umleiten
server {
  listen 80;
  server_name example.com;
  return 301 https://$server_name$request_uri;
}
```

**Installation:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/example.com
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Caddy (noch einfacher)

```caddyfile
example.com {
  root * /var/www/example.com/dist
  file_server
  
  # Cache für hashed Assets
  @assets path /_astro/*
  header @assets Cache-Control "public, immutable, max-age=31536000"
  
  # Cache für RSS-Feed
  @rss path /rss.xml
  header @rss Cache-Control "public, max-age=3600"
  
  # HTML mit Revalidierung
  header Cache-Control "public, max-age=300"
  
  # Security Headers
  header X-Frame-Options SAMEORIGIN
  header X-Content-Type-Options nosniff
  
  # HTTPS automatisch (Let's Encrypt)
  encode gzip
}
```

**Installation:**
```bash
sudo cp Caddyfile /etc/caddy/
sudo systemctl reload caddy
```

### Environment-Variablen (optional)

Falls Sie die `site`-URL anpassen möchten:

```bash
# .env (für lokale Entwicklung)
PUBLIC_SITE_URL=https://example.com
```

Aktualisieren Sie dann `astro.config.mjs`:
```javascript
export default defineConfig({
  site: import.meta.env.PUBLIC_SITE_URL || 'https://example.com/',
  // ...
});
```

## Performance

- **Lighthouse Desktop**: 95+ (alle Metriken)
- **Bilder**: Automatisch zu AVIF/WebP optimiert, lazy-loaded, responsive Srcsets
- **CSS**: < 10 KB minified (keine Frameworks, nur Custom Properties)
- **JavaScript**: < 5 KB (nur Carousel + Dialog, vanilla)
- **Pagespeed**: < 1 Sekunde (mit Nginx/CDN-Caching)

## Barrierefreiheit (WCAG 2.1 AA)

- ✅ Semantisches HTML (`<main>`, `<article>`, `<header>`, `<footer>`, `<nav>`)
- ✅ ARIA-Labels auf interaktiven Elementen
- ✅ Skip-to-main-Link
- ✅ Tastatur-Navigation (Tab, Pfeiltasten, Esc)
- ✅ Kontrast-Ratios ≥ 4.5:1
- ✅ `prefers-reduced-motion` respektiert
- ✅ Alt-Text für alle Bilder (Pflicht im Content-Schema)

## Sicherheit & Datenschutz

- ✅ Keine Tracker/Analytics
- ✅ Keine externen Fonts (System-Font-Stack)
- ✅ Keine CDNs (alle Assets lokal)
- ✅ EXIF/GPS-Metadaten entfernt (sharp-Standard)
- ✅ Statisch gehostet (keine Datenbanken/Logs)
- ✅ HTTPS-only (per Nginx/Caddy)
- ✅ Security Headers (X-Frame-Options, X-Content-Type-Options)

## Lizenz

MIT

## Support

Bei Fragen oder Problemen:
- Astro Docs: https://docs.astro.build
- Sharp Docs (Bildoptimierung): https://sharp.pixelplumbing.com
- Zod Docs (Schema): https://zod.dev

---

**Gebaut mit ❤️ und Astro 7.3.5**
