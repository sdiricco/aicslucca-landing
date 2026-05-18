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
