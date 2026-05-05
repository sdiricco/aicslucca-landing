# Design Spec: Integrazione CMS Sanity per AICS Lucca

## Problema e obiettivo

L'associazione AICS Lucca ha bisogno di poter pubblicare notizie ed eventi sul proprio sito istituzionale senza intervento tecnico. Il sito è realizzato con Nuxt 3 e deployato su Vercel. Il CMS deve essere accessibile da browser, non richiedere competenze di sviluppo e aggiornarsi automaticamente dopo ogni pubblicazione.

## Approccio scelto

**Sanity (headless CMS cloud) + Nuxt 3 SSG + Vercel Deploy Hook.**

- I contenuti vivono su Sanity Cloud (API GROQ)
- Nuxt fetcha i dati a build time (`nuxt generate`)
- Un webhook Sanity → Vercel triggera il rebuild automatico ad ogni pubblicazione
- Sanity Studio (pannello admin) deployato su `<progetto>.sanity.studio`

---

## Architettura e flusso dati

```
Redattore
   │
   ▼
Sanity Studio  (https://<progetto>.sanity.studio)
   │  pubblica articolo
   ▼
Sanity Cloud  (API GROQ)
   │  webhook HTTP POST  on:publish
   ▼
Vercel Deploy Hook
   │  avvia nuxt generate
   ▼
Sito aggiornato su Vercel  (~2-3 min)
```

**Dipendenze esterne:**
- Account Sanity (free tier: 3 utenti, 10k CDN req/mese, 500k API req/mese)
- Progetto Vercel esistente con Deploy Hook abilitato

---

## Modello dati (Sanity Schema)

Unico documento `post`, gestisce sia notizie che eventi tramite campo `category`.

```ts
// sanity/schemas/post.ts
{
  name: 'post',
  title: 'Notizie & Eventi',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string',   title: 'Titolo',             validation: Rule => Rule.required() },
    { name: 'slug',        type: 'slug',     title: 'URL (slug)',          options: { source: 'title' }, validation: Rule => Rule.required() },
    { name: 'publishedAt', type: 'datetime', title: 'Data pubblicazione',  validation: Rule => Rule.required() },
    { name: 'category',    type: 'string',   title: 'Categoria',          options: { list: ['Notizia', 'Evento'] }, validation: Rule => Rule.required() },
    { name: 'coverImage',  type: 'image',    title: 'Immagine copertina',  options: { hotspot: true } },
    { name: 'excerpt',     type: 'text',     title: 'Sommario',            rows: 3 },
    { name: 'body',        type: 'array',    title: 'Contenuto',           of: [{ type: 'block' }] },
  ],
  orderings: [{ title: 'Data (più recenti)', by: [{ field: 'publishedAt', direction: 'desc' }] }],
}
```

Il campo `body` usa **Portable Text** (rich text WYSIWYG): grassetto, corsivo, link, immagini inline. Non richiede HTML.

---

## Struttura del progetto (modifiche)

```
aicslucca-landing/
│
├── sanity/                        ← NUOVO — Sanity Studio (app separata)
│   ├── schemas/
│   │   ├── post.ts                # schema documento post
│   │   └── index.ts               # esporta tutti gli schemi
│   ├── sanity.config.ts           # configurazione Studio
│   └── package.json               # dipendenze Sanity
│
├── pages/
│   └── news/
│       ├── index.vue              ← NUOVA — lista notizie/eventi (/news)
│       └── [slug].vue             ← NUOVA — dettaglio post (/news/[slug])
│
├── components/
│   ├── News/
│   │   ├── PostCard.vue           ← NUOVO — card post (immagine, titolo, data, categoria)
│   │   └── PostList.vue           ← NUOVO — griglia di PostCard
│   └── Home/
│       ├── LatestNews.vue         ← NUOVO — sezione "Ultime notizie" in homepage (ultimi 3 post)
│       └── Header.vue             ← MODIFICA — aggiunto link "Notizie" nella navbar
│
├── nuxt.config.ts                 ← MODIFICA — aggiunto modulo @nuxtjs/sanity
├── .env                           ← MODIFICA — aggiunte variabili SANITY_PROJECT_ID, SANITY_DATASET
└── .env.example                   ← NUOVO — template variabili d'ambiente
```

---

## Query GROQ

**Lista post (index):**
```groq
*[_type == "post"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  publishedAt,
  category,
  coverImage,
  excerpt
}
```

**Ultimi 3 post (homepage):**
```groq
*[_type == "post"] | order(publishedAt desc)[0..2] {
  title,
  "slug": slug.current,
  publishedAt,
  category,
  coverImage,
  excerpt
}
```

**Singolo post (dettaglio):**
```groq
*[_type == "post" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  publishedAt,
  category,
  coverImage,
  excerpt,
  body
}
```

---

## Variabili d'ambiente

```bash
# .env (non committato)
SANITY_PROJECT_ID=<da Sanity dashboard>
SANITY_DATASET=production
```

Le variabili devono essere aggiunte anche al progetto Vercel (Settings → Environment Variables).

---

## Configurazione webhook

Una volta configurato il progetto Sanity:
1. Ottenere il Deploy Hook URL da Vercel (Settings → Git → Deploy Hooks)
2. In Sanity: Manage → API → Webhooks → crea webhook con:
   - URL: `<Vercel Deploy Hook URL>`
   - Trigger: `on publish` (tipo `post`)
   - Metodo: `POST`

---

## Rendering del Portable Text

Il campo `body` (Portable Text) viene renderizzato con `@portabletext/vue`, un renderer ufficiale compatibile con Vue 3/Nuxt.

Esempio in `pages/news/[slug].vue`:
```vue
<PortableText :value="post.body" />
```

---

## Paletta colori

I componenti News usano le classi Tailwind personalizzate già definite in `tailwind.config.ts`:
- `text-primary` — titoli e accenti
- `text-paragraphText` — testi secondari
- `bg-primaryDark` — badge categoria "Evento"

---

## Fuori scope (questa iterazione)

- Filtro per categoria nella pagina `/news`
- Paginazione dei post
- Sistema di commenti
- Newsletter
- Modifica di altri contenuti statici (comitato, chi siamo, ecc.)
