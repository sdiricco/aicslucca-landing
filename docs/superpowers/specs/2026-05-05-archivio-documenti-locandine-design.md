# Design: Archivio Documenti e Locandine

## Problema e approccio

Il sito di AICS Lucca ha bisogno di un sistema per pubblicare documenti ufficiali (bilanci, verbali, statuto) e locandine di eventi. I contenuti saranno gestiti tramite Sanity CMS, già presente nel progetto.

- **Documenti** → nuova pagina dedicata `/documenti`, raggruppata per categoria
- **Locandine** → nuova sezione nella homepage, carosello auto-scrolling con lightbox fullscreen

---

## Schema Sanity

### Tipo `documento`

| Campo | Tipo | Note |
|---|---|---|
| `title` | string | Es. "Bilancio consuntivo 2024" |
| `categoria` | select | `"bilancio"` \| `"verbale"` \| `"statuto"` \| `"altro"` |
| `anno` | number | Es. 2024 |
| `file` | file | Asset PDF caricato su Sanity |
| `descrizione` | string | Opzionale |

### Tipo `locandina`

| Campo | Tipo | Note |
|---|---|---|
| `titolo` | string | Es. "Concerto di Natale 2024" |
| `immagine` | image | Asset immagine caricato su Sanity |
| `dataEvento` | date | Opzionale, usato per ordinamento |
| `descrizione` | string | Opzionale |

---

## Pagina Documenti (`/documenti`)

- Nuova pagina Nuxt: `pages/documenti/index.vue`
- Fetch dei documenti da Sanity via GROQ query
- Layout: lista raggruppata per categoria
- Ogni documento mostra: titolo, anno, pulsante "Scarica" (link diretto all'asset PDF su Sanity)
- Ordinamento: per anno decrescente all'interno di ogni categoria
- Categorie mostrate nell'ordine: Bilanci → Verbali → Statuto → Altro
- Se una categoria non ha documenti, non viene mostrata

## Sezione Locandine (Homepage)

- Nuovo componente: `components/Home/LocandineCarsousel.vue`
- Aggiunto in `pages/index.vue` dopo le sezioni esistenti
- Fetch delle locandine da Sanity, ordinate per `dataEvento` decrescente
- Carosello auto-scrolling (intervallo ~4s, si ferma al hover)
- Click su una locandina apre il **lightbox fullscreen**:
  - Sfondo scuro semi-trasparente
  - Immagine centrata
  - Frecce prev/next per navigare tra le locandine
  - Tasto ✕ per chiudere (anche ESC da tastiera)
- Indicatori (dots) sincronizzati con la slide corrente

---

## Integrazione Sanity

- Il modulo `@nuxtjs/sanity` è già nel progetto ma non ancora registrato in `nuxt.config.ts` — va aggiunto
- Le query GROQ vengono eseguite lato server tramite `useSanityQuery` composable
- Le immagini vengono servite tramite `@sanity/image-url` (già installato)
- I file PDF vengono serviti tramite URL diretto dell'asset Sanity (campo `file.asset._ref` → URL)

---

## Navigazione

- Aggiungere link "Documenti" nel componente di navigazione esistente (`components/Home/Header.vue` o layout)

---

## Componenti da creare / modificare

| File | Azione |
|---|---|
| `sanity/schemas/documento.ts` | Nuovo schema Sanity |
| `sanity/schemas/locandina.ts` | Nuovo schema Sanity |
| `sanity/schemas/index.ts` | Registrare i nuovi tipi |
| `pages/documenti/index.vue` | Nuova pagina |
| `components/Home/LocandineCarousel.vue` | Nuovo componente carosello + lightbox |
| `pages/index.vue` | Aggiungere `LocandineCarousel` |
| `nuxt.config.ts` | Registrare modulo `@nuxtjs/sanity` |
| Componente navigazione | Aggiungere link "Documenti" |
