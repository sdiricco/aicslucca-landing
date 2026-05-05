# Archivio Documenti e Locandine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aggiungere una pagina `/documenti` raggruppata per categoria e una sezione carosello di locandine in homepage, entrambe alimentate da Sanity CMS.

**Architecture:** Due nuovi tipi Sanity (`documento`, `locandina`), una nuova pagina Nuxt, un nuovo componente Vue per il carosello con lightbox. I dati vengono fetchati lato server via `useSanityQuery` (pattern già usato nel progetto in `pages/news/index.vue`).

**Tech Stack:** Nuxt 4, Vue 3, Tailwind CSS, Sanity CMS, `@nuxtjs/sanity`, `@sanity/image-url`, TypeScript

---

## File Map

| File | Azione | Responsabilità |
|---|---|---|
| `sanity/schemas/documento.ts` | Crea | Schema Sanity tipo `documento` |
| `sanity/schemas/locandina.ts` | Crea | Schema Sanity tipo `locandina` |
| `sanity/schemas/index.ts` | Modifica | Registra i due nuovi tipi |
| `types/documento.ts` | Crea | Interfaccia TypeScript `Documento` |
| `types/locandina.ts` | Crea | Interfaccia TypeScript `Locandina` |
| `pages/documenti/index.vue` | Crea | Pagina `/documenti`, lista raggruppata per categoria |
| `components/Home/LocandineCarousel.vue` | Crea | Carosello auto-scroll + lightbox fullscreen |
| `components/Home/Content.vue` | Modifica | Aggiunge `<HomeLocandineCarousel />` |
| `components/Home/Header.vue` | Modifica | Aggiunge link "Documenti" nel menu desktop e mobile |

---

## Task 1: Schema Sanity — `documento`

**Files:**
- Create: `sanity/schemas/documento.ts`
- Modify: `sanity/schemas/index.ts`

- [ ] **Step 1: Crea `sanity/schemas/documento.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const documentoType = defineType({
  name: 'documento',
  title: 'Documenti',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titolo',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categoria',
      type: 'string',
      title: 'Categoria',
      options: {
        list: [
          { title: 'Bilancio', value: 'bilancio' },
          { title: 'Verbale', value: 'verbale' },
          { title: 'Statuto', value: 'statuto' },
          { title: 'Altro', value: 'altro' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'anno',
      type: 'number',
      title: 'Anno',
      validation: Rule => Rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'File PDF',
      options: { accept: '.pdf' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'descrizione',
      type: 'string',
      title: 'Descrizione',
    }),
  ],
  orderings: [
    {
      title: 'Anno (più recenti)',
      name: 'annoDesc',
      by: [{ field: 'anno', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'anno' },
  },
})
```

- [ ] **Step 2: Registra `documentoType` in `sanity/schemas/index.ts`**

```ts
import { postType } from './post'
import { documentoType } from './documento'

export const schemaTypes = [postType, documentoType]
```

- [ ] **Step 3: Commit**

```bash
git add sanity/schemas/documento.ts sanity/schemas/index.ts
git commit -m "feat(sanity): add documento schema"
```

---

## Task 2: Schema Sanity — `locandina`

**Files:**
- Create: `sanity/schemas/locandina.ts`

- [ ] **Step 1: Crea `sanity/schemas/locandina.ts`**

```ts
import { defineField, defineType } from 'sanity'

export const locandinaType = defineType({
  name: 'locandina',
  title: 'Locandine',
  type: 'document',
  fields: [
    defineField({
      name: 'titolo',
      type: 'string',
      title: 'Titolo',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'immagine',
      type: 'image',
      title: 'Immagine',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'dataEvento',
      type: 'date',
      title: 'Data evento',
    }),
    defineField({
      name: 'descrizione',
      type: 'string',
      title: 'Descrizione',
    }),
  ],
  orderings: [
    {
      title: 'Data evento (più recenti)',
      name: 'dataEventoDesc',
      by: [{ field: 'dataEvento', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'titolo', subtitle: 'dataEvento', media: 'immagine' },
  },
})
```

- [ ] **Step 2: Aggiorna `sanity/schemas/index.ts` aggiungendo `locandinaType`**

```ts
import { postType } from './post'
import { documentoType } from './documento'
import { locandinaType } from './locandina'

export const schemaTypes = [postType, documentoType, locandinaType]
```

- [ ] **Step 3: Verifica build Sanity**

```bash
cd sanity && yarn build 2>&1 | tail -5
```

Expected: nessun errore TypeScript negli schemi.

- [ ] **Step 4: Commit**

```bash
git add sanity/schemas/locandina.ts sanity/schemas/index.ts
git commit -m "feat(sanity): add locandina schema"
```

---

## Task 3: Tipi TypeScript

**Files:**
- Create: `types/documento.ts`
- Create: `types/locandina.ts`

- [ ] **Step 1: Crea `types/documento.ts`**

```ts
export interface Documento {
  _id: string
  title: string
  categoria: 'bilancio' | 'verbale' | 'statuto' | 'altro'
  anno: number
  file: {
    asset: {
      _ref: string
      url: string
    }
  }
  descrizione?: string
}
```

- [ ] **Step 2: Crea `types/locandina.ts`**

```ts
import type { SanityImageSource } from '@sanity/image-url'

export interface Locandina {
  _id: string
  titolo: string
  immagine: SanityImageSource & { asset: { url: string } }
  dataEvento?: string
  descrizione?: string
}
```

- [ ] **Step 3: Commit**

```bash
git add types/documento.ts types/locandina.ts
git commit -m "feat(types): add Documento and Locandina interfaces"
```

---

## Task 4: Pagina Documenti

**Files:**
- Create: `pages/documenti/index.vue`

La pagina fetcha tutti i documenti da Sanity e li mostra raggruppati per categoria. L'ordine delle categorie è fisso: Bilanci → Verbali → Statuto → Altro. I documenti sono ordinati per anno decrescente all'interno di ogni categoria.

- [ ] **Step 1: Crea `pages/documenti/index.vue`**

```vue
<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold text-primaryDark mb-2">Documenti</h1>
      <p class="text-paragraphText mb-8">Documentazione ufficiale dell'associazione.</p>

      <div v-if="pending" class="text-center text-gray-400 py-24">Caricamento...</div>

      <div v-else-if="error" class="text-center text-red-500 py-24">
        Si è verificato un errore. Riprova più tardi.
      </div>

      <div v-else-if="!documenti || documenti.length === 0" class="text-center text-gray-400 py-24">
        Nessun documento disponibile al momento.
      </div>

      <div v-else class="space-y-10">
        <div v-for="cat in categorieOrdinate" :key="cat.value">
          <div v-if="perCategoria[cat.value]?.length">
            <h2 class="text-xl font-semibold text-primaryDark mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">
              {{ cat.label }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="doc in perCategoria[cat.value]"
                :key="doc._id"
                class="flex items-center justify-between bg-white rounded-lg shadow-sm px-5 py-4 hover:shadow-md transition"
              >
                <div>
                  <p class="font-medium text-gray-800">{{ doc.title }}</p>
                  <p class="text-sm text-paragraphText">{{ doc.anno }}</p>
                  <p v-if="doc.descrizione" class="text-sm text-paragraphText mt-1">{{ doc.descrizione }}</p>
                </div>
                <a
                  :href="doc.file.asset.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="ml-4 flex-shrink-0 text-sm font-medium text-primaryDark border border-primaryDark rounded px-4 py-2 hover:bg-primaryDark hover:text-white transition"
                >
                  ⬇ Scarica
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import groq from 'groq'
import type { Documento } from '~/types/documento'

useHead({ title: 'Documenti — AICS Lucca' })

const query = groq`
  *[_type == "documento"] | order(anno desc) {
    _id,
    title,
    categoria,
    anno,
    "file": {
      "asset": {
        "_ref": file.asset._ref,
        "url": file.asset->url
      }
    },
    descrizione
  }
`

const { data: documenti, pending, error } = await useSanityQuery<Documento[]>(query)

const categorieOrdinate = [
  { value: 'bilancio', label: 'Bilanci' },
  { value: 'verbale', label: 'Verbali' },
  { value: 'statuto', label: 'Statuto' },
  { value: 'altro', label: 'Altro' },
]

const perCategoria = computed(() => {
  if (!documenti.value) return {}
  return categorieOrdinate.reduce((acc, cat) => {
    acc[cat.value] = documenti.value!.filter(d => d.categoria === cat.value)
    return acc
  }, {} as Record<string, Documento[]>)
})
</script>
```

- [ ] **Step 2: Verifica build**

```bash
yarn build 2>&1 | tail -10
```

Expected: build completata senza errori.

- [ ] **Step 3: Commit**

```bash
git add pages/documenti/index.vue
git commit -m "feat: add documenti page with category grouping"
```

---

## Task 5: Componente LocandineCarousel

**Files:**
- Create: `components/Home/LocandineCarousel.vue`

Carosello auto-scrolling con intervallo 4s (si ferma al hover), con lightbox fullscreen che si apre al click. Il lightbox supporta navigazione prev/next e chiusura con ✕ o tasto ESC.

- [ ] **Step 1: Crea `components/Home/LocandineCarousel.vue`**

```vue
<template>
  <section v-if="locandine && locandine.length" class="bg-primaryDarker py-12">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-semibold mb-6 text-center text-white">Locandine</h2>

      <!-- Carousel -->
      <div
        class="relative overflow-hidden"
        @mouseenter="stopAutoPlay"
        @mouseleave="startAutoPlay"
      >
        <div
          class="flex transition-transform duration-500 ease-in-out gap-4"
          :style="{ transform: `translateX(calc(-${currentIndex} * (160px + 16px)))` }"
        >
          <div
            v-for="(loc, i) in locandine"
            :key="loc._id"
            class="flex-shrink-0 w-40 cursor-pointer relative rounded-lg overflow-hidden shadow-lg group"
            @click="openLightbox(i)"
          >
            <img
              :src="loc.immagine.asset.url"
              :alt="loc.titolo"
              class="w-40 h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
              <p class="text-white text-xs font-medium truncate">{{ loc.titolo }}</p>
            </div>
            <div class="absolute top-2 right-2 bg-black/50 rounded text-white text-xs px-1.5 py-0.5">⛶</div>
          </div>
        </div>
      </div>

      <!-- Dots -->
      <div class="flex justify-center gap-2 mt-4">
        <button
          v-for="(_, i) in locandine"
          :key="i"
          class="w-2 h-2 rounded-full transition-colors"
          :class="i === currentIndex ? 'bg-white' : 'bg-white/30'"
          @click="goTo(i)"
        />
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
        @click.self="closeLightbox"
      >
        <!-- Close -->
        <button
          class="absolute top-4 right-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 transition"
          @click="closeLightbox"
        >
          ✕
        </button>

        <!-- Prev -->
        <button
          class="absolute left-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 transition"
          @click="lightboxPrev"
        >
          ‹
        </button>

        <!-- Image -->
        <img
          :src="locandine[lightboxIndex].immagine.asset.url"
          :alt="locandine[lightboxIndex].titolo"
          class="max-h-[90vh] max-w-[90vw] object-contain rounded shadow-2xl"
        />

        <!-- Next -->
        <button
          class="absolute right-4 text-white text-3xl w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 transition"
          @click="lightboxNext"
        >
          ›
        </button>

        <!-- Caption -->
        <div class="absolute bottom-6 left-0 right-0 text-center text-white text-sm px-4">
          {{ locandine[lightboxIndex].titolo }}
          <span v-if="locandine[lightboxIndex].dataEvento" class="ml-2 text-white/60">
            · {{ locandine[lightboxIndex].dataEvento }}
          </span>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import groq from 'groq'
import type { Locandina } from '~/types/locandina'

const query = groq`
  *[_type == "locandina"] | order(dataEvento desc) {
    _id,
    titolo,
    "immagine": {
      "asset": {
        "url": immagine.asset->url
      }
    },
    dataEvento,
    descrizione
  }
`

const { data: locandine } = await useSanityQuery<Locandina[]>(query)

// Carousel state
const currentIndex = ref(0)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

function goTo(i: number) {
  if (!locandine.value) return
  currentIndex.value = (i + locandine.value.length) % locandine.value.length
}

function startAutoPlay() {
  stopAutoPlay()
  autoPlayTimer = setInterval(() => {
    if (locandine.value) goTo(currentIndex.value + 1)
  }, 4000)
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

onMounted(startAutoPlay)
onBeforeUnmount(stopAutoPlay)

// Lightbox state
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openLightbox(i: number) {
  lightboxIndex.value = i
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function lightboxNext() {
  if (!locandine.value) return
  lightboxIndex.value = (lightboxIndex.value + 1) % locandine.value.length
}

function lightboxPrev() {
  if (!locandine.value) return
  lightboxIndex.value = (lightboxIndex.value - 1 + locandine.value.length) % locandine.value.length
}

// ESC to close lightbox
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') lightboxNext()
  if (e.key === 'ArrowLeft') lightboxPrev()
}
</script>
```

- [ ] **Step 2: Verifica build**

```bash
yarn build 2>&1 | tail -10
```

Expected: build completata senza errori.

- [ ] **Step 3: Commit**

```bash
git add components/Home/LocandineCarousel.vue
git commit -m "feat: add LocandineCarousel component with lightbox"
```

---

## Task 6: Integra carosello in homepage

**Files:**
- Modify: `components/Home/Content.vue`

- [ ] **Step 1: Aggiorna `components/Home/Content.vue`**

```vue
<template>
  <div>
    <HomeLatestNews />
    <HomeChiSiamo />
    <HomeAicsAppSection />
    <HomeAppFeature />
    <HomeAicsPhotoGallery />
    <HomeLocandineCarousel />
    <HomeSocialSection />
  </div>
</template>
```

- [ ] **Step 2: Verifica build**

```bash
yarn build 2>&1 | tail -10
```

Expected: build completata senza errori.

- [ ] **Step 3: Commit**

```bash
git add components/Home/Content.vue
git commit -m "feat: add LocandineCarousel to homepage"
```

---

## Task 7: Link "Documenti" nella navigazione

**Files:**
- Modify: `components/Home/Header.vue`

Aggiungere "Documenti" sia nel menu desktop che in quello mobile, dopo "Il Comitato".

- [ ] **Step 1: Modifica `components/Home/Header.vue`**

Nel menu **desktop** (dopo `<li>Il Comitato</li>`):
```html
<li><NuxtLink to="/documenti" class="hover:border-b-2 text-lg">Documenti</NuxtLink></li>
```

Nel menu **mobile** (dopo `<li>Il Comitato</li>`):
```html
<li><NuxtLink @click="onClickNavLink" to="/documenti" class="text-white hover:border-b-2">Documenti</NuxtLink></li>
```

Il file completo modificato:

```vue
<template>
  <div class="bg-primaryDarker text-white p-3 flex justify-between items-center w-full" ref="outsideRef">
    <div class="container flex items-center justify-between mx-auto">
      <img src="/assets/images/Logo_Mini.png" />
      <button @click="toggleMobileMenu" class="block lg:hidden">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <nav class="hidden lg:flex">
        <ul class="flex space-x-4">
          <li><NuxtLink to="/" class="hover:border-b-2 text-lg">Home</NuxtLink></li>
          <li><NuxtLink to="/comitato" class="hover:border-b-2 text-lg">Il Comitato</NuxtLink></li>
          <li><NuxtLink to="/documenti" class="hover:border-b-2 text-lg">Documenti</NuxtLink></li>
          <li><NuxtLink to="/news" class="hover:border-b-2 text-lg">Notizie</NuxtLink></li>
          <li><NuxtLink to="/contatti" class="hover:border-b-2 text-lg">Contatti</NuxtLink></li>
          <li><a href="https://www.aicsnetwork.net/" class="hover:border-b-2 text-lg">Tesseramento AICS</a></li>
        </ul>
      </nav>
    </div>
    <div v-if="isMobileMenuOpen" class="lg:hidden absolute top-16 left-0 bg-primaryDarker w-full z-10">
      <ul class="flex flex-col space-y-2 p-3">
        <li><NuxtLink @click="onClickNavLink" to="/" class="text-white hover:border-b-2">Home</NuxtLink></li>
        <li><NuxtLink @click="onClickNavLink" to="/comitato" class="text-white hover:border-b-2">Il Comitato</NuxtLink></li>
        <li><NuxtLink @click="onClickNavLink" to="/documenti" class="text-white hover:border-b-2">Documenti</NuxtLink></li>
        <li><NuxtLink @click="onClickNavLink" to="/news" class="text-white hover:border-b-2">Notizie</NuxtLink></li>
        <li><NuxtLink @click="onClickNavLink" to="/contatti" class="text-white hover:border-b-2">Contatti</NuxtLink></li>
        <li><a @click="onClickNavLink" href="https://www.aicsnetwork.net/" class="text-white hover:border-b-2">Tesseramento AICS</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const outsideRef = ref(null)

onClickOutside(outsideRef, () => {
  isMobileMenuOpen.value = false
})

function onClickNavLink() {
  isMobileMenuOpen.value = false
}
</script>
```

- [ ] **Step 2: Verifica build finale**

```bash
yarn build 2>&1 | tail -10
```

Expected: build completata senza errori.

- [ ] **Step 3: Commit e push**

```bash
git add components/Home/Header.vue
git commit -m "feat: add Documenti link to navigation"
git push
```
