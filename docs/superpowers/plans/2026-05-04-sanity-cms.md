# Sanity CMS Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrare Sanity come CMS headless per permettere ai redattori di AICS Lucca di pubblicare notizie ed eventi senza competenze tecniche, con rebuild automatico su Vercel ad ogni pubblicazione.

**Architecture:** Sanity Cloud ospita i contenuti (schema `post`). Nuxt 3 fetcha i dati via GROQ API a build time con `@nuxtjs/sanity`. Un webhook Sanity → Vercel Deploy Hook triggera il rebuild. Sanity Studio è un'app separata nella cartella `sanity/` deployata su `*.sanity.studio`.

**Tech Stack:** Nuxt 3, `@nuxtjs/sanity` v2, `@sanity/image-url`, `@portabletext/vue`, Sanity v3, Tailwind CSS (palette esistente)

---

## File da creare / modificare

| File | Azione | Responsabilità |
|---|---|---|
| `sanity/package.json` | Crea | Dipendenze Sanity Studio |
| `sanity/sanity.config.ts` | Crea | Configurazione Studio (projectId, schema) |
| `sanity/schemas/post.ts` | Crea | Schema documento Notizie/Eventi |
| `sanity/schemas/index.ts` | Crea | Barrel export degli schemi |
| `.env.example` | Crea | Template variabili d'ambiente |
| `.env` | Crea/Modifica | Variabili con i valori reali (non committato) |
| `nuxt.config.ts` | Modifica | Aggiunge modulo `@nuxtjs/sanity` con config |
| `plugins/portable-text.ts` | Crea | Registra globalmente `<PortableText>` |
| `composables/useSanityImageUrl.ts` | Crea | Helper per costruire URL immagini Sanity |
| `components/News/PostCard.vue` | Crea | Card singolo post (immagine, titolo, data, categoria) |
| `components/News/PostList.vue` | Crea | Griglia di PostCard |
| `pages/news/index.vue` | Crea | Pagina lista `/news` |
| `pages/news/[slug].vue` | Crea | Pagina dettaglio `/news/[slug]` |
| `components/Home/LatestNews.vue` | Crea | Sezione ultimi 3 post in homepage |
| `components/Home/Content.vue` | Modifica | Include `<HomeLatestNews />` |
| `components/Home/Header.vue` | Modifica | Aggiunge link "Notizie" (desktop + mobile) |

---

## Task 1: Crea account Sanity e progetto (passi manuali)

**Files:** nessuno (operazioni sul browser)

- [ ] **Step 1: Crea account**

  Vai su https://www.sanity.io e registrati (gratuito).

- [ ] **Step 2: Crea nuovo progetto**

  Dal dashboard Sanity: "Create new project" → nome: `aicslucca` → dataset: `production`.

- [ ] **Step 3: Annota il Project ID**

  Dalla pagina del progetto (https://www.sanity.io/manage/personal/project/<id>), copia il **Project ID** (es. `abc12def`). Servirà nei passi successivi.

---

## Task 2: Sanity Studio — app separata in `sanity/`

**Files:**
- Crea: `sanity/package.json`
- Crea: `sanity/sanity.config.ts`
- Crea: `sanity/schemas/post.ts`
- Crea: `sanity/schemas/index.ts`

- [ ] **Step 1: Crea `sanity/package.json`**

  ```json
  {
    "name": "aicslucca-sanity-studio",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "dev": "sanity dev",
      "build": "sanity build",
      "deploy": "sanity deploy"
    },
    "dependencies": {
      "sanity": "^3.50.0",
      "@sanity/vision": "^3.50.0"
    }
  }
  ```

- [ ] **Step 2: Installa le dipendenze di Studio**

  ```bash
  cd sanity && npm install
  ```

  Atteso: `node_modules/` creata senza errori.

- [ ] **Step 3: Crea `sanity/schemas/post.ts`**

  ```ts
  import { defineField, defineType } from 'sanity'

  export const postType = defineType({
    name: 'post',
    title: 'Notizie & Eventi',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        type: 'string',
        title: 'Titolo',
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'slug',
        type: 'slug',
        title: 'URL (slug)',
        options: { source: 'title' },
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'publishedAt',
        type: 'datetime',
        title: 'Data pubblicazione',
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'category',
        type: 'string',
        title: 'Categoria',
        options: {
          list: [
            { title: 'Notizia', value: 'Notizia' },
            { title: 'Evento', value: 'Evento' },
          ],
          layout: 'radio',
        },
        validation: Rule => Rule.required(),
      }),
      defineField({
        name: 'coverImage',
        type: 'image',
        title: 'Immagine copertina',
        options: { hotspot: true },
      }),
      defineField({
        name: 'excerpt',
        type: 'text',
        title: 'Sommario',
        rows: 3,
      }),
      defineField({
        name: 'body',
        type: 'array',
        title: 'Contenuto',
        of: [{ type: 'block' }],
      }),
    ],
    orderings: [
      {
        title: 'Data (più recenti)',
        name: 'publishedAtDesc',
        by: [{ field: 'publishedAt', direction: 'desc' }],
      },
    ],
  })
  ```

- [ ] **Step 4: Crea `sanity/schemas/index.ts`**

  ```ts
  import { postType } from './post'

  export const schemaTypes = [postType]
  ```

- [ ] **Step 5: Crea `sanity/sanity.config.ts`**

  Sostituisci `TUO_PROJECT_ID` con il Project ID ottenuto nel Task 1.

  ```ts
  import { defineConfig } from 'sanity'
  import { structureTool } from 'sanity/structure'
  import { visionTool } from '@sanity/vision'
  import { schemaTypes } from './schemas'

  export default defineConfig({
    name: 'aicslucca',
    title: 'AICS Lucca CMS',
    projectId: 'TUO_PROJECT_ID',
    dataset: 'production',
    plugins: [structureTool(), visionTool()],
    schema: { types: schemaTypes },
  })
  ```

- [ ] **Step 6: Verifica che Studio si avvii**

  ```bash
  cd sanity && npm run dev
  ```

  Atteso: Studio accessibile su `http://localhost:3333` con la voce "Notizie & Eventi" nella sidebar.

- [ ] **Step 7: Commit**

  ```bash
  cd .. && git add sanity/ && git commit -m "feat: add Sanity Studio app with post schema

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ```

---

## Task 3: Configura Nuxt con `@nuxtjs/sanity`

**Files:**
- Modifica: `nuxt.config.ts`
- Crea: `.env.example`
- Crea/Modifica: `.env`
- Verifica: `.gitignore` (`.env` deve essere escluso)

- [ ] **Step 1: Installa le dipendenze Nuxt**

  Dalla radice del progetto (non da `sanity/`):

  ```bash
  npm install @nuxtjs/sanity @sanity/image-url @portabletext/vue
  ```

  Atteso: pacchetti aggiunti a `package.json` senza conflitti.

- [ ] **Step 2: Aggiorna `nuxt.config.ts`**

  ```ts
  // https://nuxt.com/docs/api/configuration/nuxt-config
  export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
      '@nuxtjs/tailwindcss',
      '@vueuse/nuxt',
      '@nuxtjs/sanity',
    ],
    sanity: {
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || 'production',
      useCdn: false,
      apiVersion: '2024-01-01',
    },
  })
  ```

- [ ] **Step 3: Crea `.env.example`**

  ```bash
  # Sanity CMS
  SANITY_PROJECT_ID=your_project_id_here
  SANITY_DATASET=production
  ```

- [ ] **Step 4: Crea `.env`**

  Sostituisci `abc12def` con il Project ID reale ottenuto nel Task 1.

  ```bash
  SANITY_PROJECT_ID=abc12def
  SANITY_DATASET=production
  ```

- [ ] **Step 5: Verifica `.gitignore`**

  Assicurati che `.env` (senza `.example`) sia già in `.gitignore`. Se non c'è, aggiungilo:

  ```bash
  echo ".env" >> .gitignore
  ```

- [ ] **Step 6: Verifica che Nuxt si avvii senza errori**

  ```bash
  npm run dev
  ```

  Atteso: dev server su `http://localhost:3000` senza errori relativi a Sanity. Se appare "SANITY_PROJECT_ID is not set", verificare che `.env` sia nella radice del progetto.

- [ ] **Step 7: Commit**

  ```bash
  git add nuxt.config.ts .env.example package.json package-lock.json .gitignore \
    && git commit -m "feat: add @nuxtjs/sanity module configuration

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ```

---

## Task 4: Plugin Portable Text e composable immagini

**Files:**
- Crea: `plugins/portable-text.ts`
- Crea: `composables/useSanityImageUrl.ts`

- [ ] **Step 1: Crea `plugins/portable-text.ts`**

  Registra `<PortableText>` come componente globale Vue per usarlo in qualsiasi template senza import.

  ```ts
  import { PortableText } from '@portabletext/vue'

  export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('PortableText', PortableText)
  })
  ```

- [ ] **Step 2: Crea `composables/useSanityImageUrl.ts`**

  ```ts
  import imageUrlBuilder from '@sanity/image-url'
  import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

  export function useSanityImageUrl() {
    const sanity = useSanity()
    const builder = imageUrlBuilder(sanity.client)

    function urlFor(source: SanityImageSource) {
      return builder.image(source)
    }

    return { urlFor }
  }
  ```

- [ ] **Step 3: Verifica che il composable venga auto-importato**

  ```bash
  npm run dev
  ```

  Atteso: nessun errore di import nel terminale.

- [ ] **Step 4: Commit**

  ```bash
  git add plugins/portable-text.ts composables/useSanityImageUrl.ts \
    && git commit -m "feat: add PortableText plugin and Sanity image URL composable

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ```

---

## Task 5: Pubblica 2-3 post di test su Sanity

**Files:** nessuno (operazioni su Sanity Studio)

> Questi post servono per verificare la fetch nei task successivi. Senza dati reali è impossibile verificare i componenti.

- [ ] **Step 1: Avvia Sanity Studio**

  ```bash
  cd sanity && npm run dev
  ```

  Apri `http://localhost:3333`.

- [ ] **Step 2: Crea un post di tipo "Notizia"**

  - Titolo: `Benvenuti sul nuovo sito AICS Lucca`
  - Slug: clicca "Generate" (auto dal titolo)
  - Data pubblicazione: oggi
  - Categoria: Notizia
  - Sommario: `Il nuovo sito dell'associazione è online.`
  - Pubblica con il pulsante "Publish"

- [ ] **Step 3: Crea un post di tipo "Evento"**

  - Titolo: `Torneo estivo 2025`
  - Slug: genera auto
  - Data pubblicazione: una data futura
  - Categoria: Evento
  - Sommario: `Appuntamento con il torneo estivo organizzato da AICS Lucca.`
  - Pubblica

- [ ] **Step 4: Aggiungi un terzo post a scelta**

  Utile per verificare la griglia con 3 elementi.

---

## Task 6: Componente `News/PostCard.vue`

**Files:**
- Crea: `components/News/PostCard.vue`

- [ ] **Step 1: Crea `components/News/PostCard.vue`**

  ```vue
  <template>
    <NuxtLink
      :to="`/news/${post.slug}`"
      class="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <!-- Immagine copertina -->
      <div class="aspect-video overflow-hidden bg-gray-100">
        <img
          v-if="post.coverImage"
          :src="coverImageUrl"
          :alt="post.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center bg-gray-100">
          <span class="text-gray-400 text-sm">Nessuna immagine</span>
        </div>
      </div>

      <!-- Corpo card -->
      <div class="p-4">
        <!-- Badge categoria -->
        <span
          :class="post.category === 'Evento' ? 'bg-primaryDark' : 'bg-primary'"
          class="text-white text-xs font-semibold px-2 py-1 rounded-full"
        >
          {{ post.category }}
        </span>

        <!-- Titolo -->
        <h3 class="mt-2 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
          {{ post.title }}
        </h3>

        <!-- Sommario -->
        <p v-if="post.excerpt" class="mt-1 text-paragraphText text-sm line-clamp-3">
          {{ post.excerpt }}
        </p>

        <!-- Data -->
        <p class="mt-2 text-xs text-gray-400">{{ formattedDate }}</p>
      </div>
    </NuxtLink>
  </template>

  <script setup lang="ts">
  import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

  const props = defineProps<{
    post: {
      title: string
      slug: string
      publishedAt: string
      category: string
      coverImage?: SanityImageSource
      excerpt?: string
    }
  }>()

  const { urlFor } = useSanityImageUrl()

  const coverImageUrl = computed(() =>
    props.post.coverImage
      ? urlFor(props.post.coverImage).width(600).height(338).fit('crop').url()
      : null
  )

  const formattedDate = computed(() =>
    new Date(props.post.publishedAt).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  )
  </script>
  ```

- [ ] **Step 2: Verifica che non ci siano errori TypeScript**

  ```bash
  npm run dev
  ```

  Atteso: dev server avviato, nessun errore nel terminale relativo a `PostCard`.

---

## Task 7: Componente `News/PostList.vue`

**Files:**
- Crea: `components/News/PostList.vue`

- [ ] **Step 1: Crea `components/News/PostList.vue`**

  ```vue
  <template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewsPostCard v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </template>

  <script setup lang="ts">
  import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

  defineProps<{
    posts: Array<{
      title: string
      slug: string
      publishedAt: string
      category: string
      coverImage?: SanityImageSource
      excerpt?: string
    }>
  }>()
  </script>
  ```

---

## Task 8: Pagina `/news` — lista articoli

**Files:**
- Crea: `pages/news/index.vue`

- [ ] **Step 1: Crea `pages/news/index.vue`**

  ```vue
  <template>
    <div class="bg-gray-50 min-h-screen py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-primaryDark mb-2">Notizie & Eventi</h1>
        <p class="text-paragraphText mb-8">Resta aggiornato sulle ultime novità di AICS Lucca.</p>

        <div v-if="pending" class="text-center text-gray-400 py-24">Caricamento...</div>

        <div v-else-if="!posts || posts.length === 0" class="text-center text-gray-400 py-24">
          Nessuna notizia disponibile al momento.
        </div>

        <NewsPostList v-else :posts="posts" />
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import groq from 'groq'

  useHead({ title: 'Notizie & Eventi — AICS Lucca' })

  const query = groq`
    *[_type == "post"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      publishedAt,
      category,
      coverImage,
      excerpt
    }
  `

  const { data: posts, pending } = await useSanityQuery(query)
  </script>
  ```

- [ ] **Step 2: Verifica la pagina nel browser**

  Con il dev server avviato (`npm run dev`), apri `http://localhost:3000/news`.

  Atteso: griglia con i post creati nel Task 5. Se appare "Nessuna notizia" verificare che i post su Sanity siano in stato "Published" (non "Draft").

- [ ] **Step 3: Commit**

  ```bash
  git add components/News/ pages/news/index.vue \
    && git commit -m "feat: add News PostCard, PostList components and /news page

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ```

---

## Task 9: Pagina `/news/[slug]` — dettaglio post

**Files:**
- Crea: `pages/news/[slug].vue`

- [ ] **Step 1: Crea `pages/news/[slug].vue`**

  ```vue
  <template>
    <div class="bg-white min-h-screen py-12">
      <div class="container mx-auto px-4 max-w-3xl">

        <!-- Loading -->
        <div v-if="pending" class="text-center text-gray-400 py-24">Caricamento...</div>

        <!-- Post not found -->
        <div v-else-if="!post" class="text-center py-24">
          <p class="text-xl text-gray-500">Articolo non trovato.</p>
          <NuxtLink to="/news" class="mt-4 inline-block text-primary hover:underline">← Torna alle notizie</NuxtLink>
        </div>

        <!-- Post content -->
        <article v-else>
          <!-- Breadcrumb -->
          <NuxtLink to="/news" class="text-primary text-sm hover:underline">← Notizie & Eventi</NuxtLink>

          <!-- Badge + Data -->
          <div class="flex items-center gap-3 mt-4">
            <span
              :class="post.category === 'Evento' ? 'bg-primaryDark' : 'bg-primary'"
              class="text-white text-xs font-semibold px-2 py-1 rounded-full"
            >
              {{ post.category }}
            </span>
            <span class="text-paragraphText text-sm">{{ formattedDate }}</span>
          </div>

          <!-- Titolo -->
          <h1 class="mt-3 text-3xl md:text-4xl font-bold text-primaryDark">{{ post.title }}</h1>

          <!-- Sommario -->
          <p v-if="post.excerpt" class="mt-4 text-lg text-paragraphText">{{ post.excerpt }}</p>

          <!-- Immagine copertina -->
          <img
            v-if="post.coverImage"
            :src="coverImageUrl"
            :alt="post.title"
            class="mt-6 w-full rounded-xl object-cover max-h-96"
          />

          <!-- Corpo articolo (Portable Text) -->
          <div v-if="post.body" class="mt-8 prose prose-lg max-w-none">
            <PortableText :value="post.body" />
          </div>
        </article>

      </div>
    </div>
  </template>

  <script setup lang="ts">
  import groq from 'groq'

  const route = useRoute()
  const slug = route.params.slug as string

  const query = groq`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      "slug": slug.current,
      publishedAt,
      category,
      coverImage,
      excerpt,
      body
    }
  `

  const { data: post, pending } = await useSanityQuery(query, { slug })

  useHead(() => ({
    title: post.value ? `${post.value.title} — AICS Lucca` : 'AICS Lucca',
  }))

  const { urlFor } = useSanityImageUrl()

  const coverImageUrl = computed(() =>
    post.value?.coverImage
      ? urlFor(post.value.coverImage).width(1200).height(630).fit('crop').url()
      : null
  )

  const formattedDate = computed(() =>
    post.value
      ? new Date(post.value.publishedAt).toLocaleDateString('it-IT', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : ''
  )
  </script>
  ```

- [ ] **Step 2: Verifica la pagina nel browser**

  Clicca su una card dalla pagina `/news`.

  Atteso: pagina dettaglio con titolo, badge categoria, data, eventuale immagine e testo dell'articolo.

- [ ] **Step 3: Commit**

  ```bash
  git add pages/news/\[slug\].vue \
    && git commit -m "feat: add /news/[slug] post detail page with PortableText

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ```

---

## Task 10: Sezione "Ultime Notizie" in homepage

**Files:**
- Crea: `components/Home/LatestNews.vue`
- Modifica: `components/Home/Content.vue`

- [ ] **Step 1: Crea `components/Home/LatestNews.vue`**

  ```vue
  <template>
    <section v-if="posts && posts.length > 0" class="bg-gray-50 py-12">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-baseline mb-6">
          <h2 class="text-3xl font-bold text-primaryDark">Ultime notizie</h2>
          <NuxtLink to="/news" class="text-primary hover:underline text-sm font-medium">
            Vedi tutte →
          </NuxtLink>
        </div>
        <NewsPostList :posts="posts" />
      </div>
    </section>
  </template>

  <script setup lang="ts">
  import groq from 'groq'

  const query = groq`
    *[_type == "post"] | order(publishedAt desc)[0..2] {
      title,
      "slug": slug.current,
      publishedAt,
      category,
      coverImage,
      excerpt
    }
  `

  const { data: posts } = await useSanityQuery(query)
  </script>
  ```

- [ ] **Step 2: Aggiorna `components/Home/Content.vue`**

  Aggiungi `<HomeLatestNews />` come primo elemento, prima di `<HomeChiSiamo />`.

  ```vue
  <template>
    <div>
      <HomeLatestNews />
      <HomeChiSiamo />
      <HomeAicsAppSection />
      <HomeAppFeature />
      <HomeAicsPhotoGallery />
      <HomeSocialSection />
    </div>
  </template>
  ```

- [ ] **Step 3: Verifica in browser**

  Apri `http://localhost:3000`.

  Atteso: sezione "Ultime notizie" visibile sopra "Chi siamo", con le card dei post. Se non ci sono post la sezione non appare (grazie a `v-if`).

- [ ] **Step 4: Commit**

  ```bash
  git add components/Home/LatestNews.vue components/Home/Content.vue \
    && git commit -m "feat: add LatestNews section to homepage

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ```

---

## Task 11: Aggiorna la navbar con link "Notizie"

**Files:**
- Modifica: `components/Home/Header.vue`

- [ ] **Step 1: Aggiorna `components/Home/Header.vue`**

  Aggiungi `<li><NuxtLink to="/news" ...>Notizie</NuxtLink></li>` sia nel menu desktop che nel menu mobile, dopo il link "Il Comitato".

  Menu **desktop** (blocco `nav.hidden.lg:flex`):
  ```html
  <ul class="flex space-x-4">
    <li><NuxtLink to="/" class="hover:border-b-2 text text-lg">Home</NuxtLink></li>
    <li><NuxtLink to="/comitato" class="hover:border-b-2 text-lg">Il Comitato</NuxtLink></li>
    <li><NuxtLink to="/news" class="hover:border-b-2 text-lg">Notizie</NuxtLink></li>
    <li><NuxtLink to="/contatti" class="hover:border-b-2 text-lg">Contatti</NuxtLink></li>
    <li><a href="https://www.aicsnetwork.net/" class="hover:border-b-2 text-lg">Tesseramento AICS</a></li>
  </ul>
  ```

  Menu **mobile** (blocco `div.lg:hidden`):
  ```html
  <ul class="flex flex-col space-y-2 p-3">
    <li><NuxtLink @click="onClickNavLink" to="/" class="text-white hover:border-b-2">Home</NuxtLink></li>
    <li><NuxtLink @click="onClickNavLink" to="/comitato" class="text-white hover:border-b-2">Il Comitato</NuxtLink></li>
    <li><NuxtLink @click="onClickNavLink" to="/news" class="text-white hover:border-b-2">Notizie</NuxtLink></li>
    <li><NuxtLink @click="onClickNavLink" to="/contatti" class="text-white hover:border-b-2">Contatti</NuxtLink></li>
    <li><a href="https://www.aicsnetwork.net/" class="hover:border-b-2">Tesseramento AICS</a></li>
  </ul>
  ```

- [ ] **Step 2: Verifica nel browser**

  - Desktop: link "Notizie" visibile nella navbar tra "Il Comitato" e "Contatti"
  - Mobile: apri il menu hamburger, verifica che "Notizie" sia presente e che il tap chiuda il menu

- [ ] **Step 3: Commit**

  ```bash
  git add components/Home/Header.vue \
    && git commit -m "feat: add Notizie link to navbar (desktop + mobile)

  Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
  ```

---

## Task 12: Deploy Sanity Studio (passi manuali)

**Files:** nessuno (operazioni da terminale + browser)

- [ ] **Step 1: Effettua il login Sanity da terminale**

  ```bash
  cd sanity && npx sanity login
  ```

  Si aprirà il browser per autenticarsi con l'account Sanity creato nel Task 1.

- [ ] **Step 2: Deploy Studio su sanity.studio**

  ```bash
  npm run deploy
  ```

  Inserisci un hostname quando richiesto (es. `aicslucca`). Il risultato sarà: `https://aicslucca.sanity.studio`

  Condividi questo URL con i redattori di AICS Lucca.

- [ ] **Step 3: Aggiungi i redattori al progetto**

  Sul dashboard Sanity (https://www.sanity.io/manage/personal/project/<id>):
  - Members → Invite → inserisci le email dei redattori
  - Ruolo: `Editor`

---

## Task 13: Configura variabili d'ambiente su Vercel e webhook

**Files:** nessuno (operazioni su Vercel dashboard + Sanity dashboard)

- [ ] **Step 1: Aggiungi variabili d'ambiente su Vercel**

  Dal progetto Vercel → Settings → Environment Variables:
  - `SANITY_PROJECT_ID` = il tuo Project ID
  - `SANITY_DATASET` = `production`

  Seleziona tutti gli ambienti: Production, Preview, Development.

- [ ] **Step 2: Crea un Deploy Hook su Vercel**

  Vercel → Settings → Git → Deploy Hooks → "Create Hook":
  - Name: `Sanity publish`
  - Branch: `main`
  - Copia l'URL generato (es. `https://api.vercel.com/v1/integrations/deploy/prj_.../abc123`)

- [ ] **Step 3: Configura il webhook su Sanity**

  Su https://www.sanity.io/manage/personal/project/<id> → API → Webhooks → "Add webhook":
  - Name: `Vercel rebuild`
  - URL: incolla il Deploy Hook di Vercel
  - Dataset: `production`
  - Trigger on: `Create`, `Update`, `Delete`
  - Filter: `_type == "post"`
  - HTTP Method: `POST`
  - Save

- [ ] **Step 4: Verifica il funzionamento end-to-end**

  1. Crea o modifica un post su Sanity Studio (`https://aicslucca.sanity.studio`)
  2. Pubblica
  3. Vai su Vercel → Deployments: verifica che un nuovo deploy venga avviato entro 30 secondi
  4. Attendi il completamento (~2-3 minuti) e apri il sito: il nuovo post deve essere visibile

---

## Checklist finale

- [ ] Sanity Studio accessibile e funzionante su `https://aicslucca.sanity.studio`
- [ ] Redattori invitati con ruolo Editor
- [ ] Pagina `/news` mostra la griglia dei post
- [ ] Pagina `/news/[slug]` mostra il dettaglio con Portable Text
- [ ] Homepage mostra "Ultime notizie" con gli ultimi 3 post
- [ ] Navbar contiene il link "Notizie" su desktop e mobile
- [ ] Webhook Sanity → Vercel funzionante (rebuild entro 3 minuti dalla pubblicazione)
- [ ] `.env` non committato, `.env.example` committato
