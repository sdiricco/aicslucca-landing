# AICS Lucca — Landing Page

Sito web istituzionale dell'associazione **AICS Lucca** (Associazione Italiana Cultura e Sport). Realizzato con **Nuxt 3** e **Tailwind CSS**.

---

## Stack tecnologico

| Tool | Versione | Ruolo |
|---|---|---|
| [Nuxt 3](https://nuxt.com) | ^3.7 | Framework Vue SSR/SSG |
| [Vue 3](https://vuejs.org) | ^3.3 | UI framework |
| [Tailwind CSS](https://tailwindcss.com) | via `@nuxtjs/tailwindcss` | Styling utility-first |
| [VueUse](https://vueuse.org) | ^10.9 | Composable utilities |

---

## Struttura del progetto

```
aicslucca-landing/
├── app.vue                  # Entry point: avvolge tutto con <NuxtLayout> + <NuxtPage>
├── nuxt.config.ts           # Configurazione Nuxt (moduli: tailwindcss, vueuse)
├── tailwind.config.ts       # Palette colori personalizzata (rosso primario, blu scuro)
│
├── layouts/
│   └── default.vue          # Layout comune: Header sticky + <slot> + Footer
│
├── pages/                   # Routing file-system di Nuxt
│   ├── index.vue            # Homepage (/)
│   ├── comitato/            # Pagina comitato (/comitato)
│   ├── contatti/            # Pagina contatti (/contatti)
│   └── privacy/             # Pagina privacy policy (/privacy)
│
├── components/
│   ├── Home/                # Componenti della homepage
│   │   ├── Header.vue       # Navbar principale (usata nel layout)
│   │   ├── HeroVideo.vue    # Sezione hero con video
│   │   ├── Hero.vue         # Sezione hero alternativa
│   │   ├── Content.vue      # Contenuto principale della home
│   │   ├── ChiSiamo.vue     # Sezione "Chi siamo"
│   │   ├── SocialSection.vue# Link ai social
│   │   ├── AicsAppSection.vue  # Sezione promozione app AICS
│   │   ├── AppFeature.vue   # Feature singola dell'app
│   │   └── AicsPhotoGallery.vue # Galleria fotografica
│   ├── Comitato/
│   │   └── Content.vue      # Contenuto pagina comitato
│   ├── Contatti/
│   │   ├── Location.vue     # Info indirizzo/recapiti
│   │   └── Map.vue          # Mappa embed
│   ├── privacy/
│   │   └── Content.vue      # Testo privacy policy
│   ├── Footer.vue           # Footer globale
│   └── HeroSection.vue      # Componente hero generico riutilizzabile
│
├── assets/
│   ├── css/                 # Stili globali
│   ├── icons/               # Icone SVG/PNG
│   ├── images/              # Immagini statiche
│   └── video/               # Video (usati nella hero)
│
└── public/                  # File serviti staticamente (favicon, ecc.)
```

---

## Palette colori (Tailwind)

I colori personalizzati sono definiti in `tailwind.config.ts`:

| Classe | Hex | Uso |
|---|---|---|
| `primary` | `#900001` | Rosso principale AICS |
| `primaryLighter` | `#b40000` | Variante chiara |
| `primaryLight` | `#d20000` | Variante più chiara |
| `primaryDark` | `#183462` | Blu scuro |
| `secondaryAccent` | `#318343` | Verde accento |
| `paragraphText` | `#6b7280` | Testo paragrafo (grigio) |

---

## Avvio in sviluppo

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build produzione

```bash
npm run build    # build SSR
npm run generate # build statica (SSG)
npm run preview  # anteprima build
```

---

## Convenzioni per agenti AI

- **Aggiungere una nuova pagina**: creare `pages/<nome>/index.vue` e il relativo componente in `components/<Nome>/Content.vue`.
- **Modificare stili globali**: usare le classi Tailwind con i colori personalizzati (`primary`, `primaryDark`, ecc.) definiti in `tailwind.config.ts`. Non usare colori hardcoded.
- **Componenti**: ogni pagina compone componenti da `components/`. Il layout globale (Header + Footer) è in `layouts/default.vue` e non va replicato nelle pagine.
- **Head/SEO**: usare `useHead()` in ogni `<script setup>` di pagina per impostare titolo e meta.
- **Nessun CSS framework aggiuntivo**: usare solo Tailwind. Non introdurre altre librerie UI senza indicazione esplicita.
