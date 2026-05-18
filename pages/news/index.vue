<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl font-bold text-primaryDark mb-2">Notizie & Eventi</h1>
      <p class="text-paragraphText mb-8">Resta aggiornato sulle ultime novità di AICS Lucca.</p>

      <div v-if="pending" role="status" aria-live="polite" class="text-center text-gray-400 py-24">Caricamento...</div>

      <div v-else-if="error" class="text-center text-red-500 py-24">
        Si è verificato un errore. Riprova più tardi.
      </div>

      <div v-else-if="!posts || posts.length === 0" class="text-center text-gray-400 py-24">
        Nessuna notizia disponibile al momento.
      </div>

      <NewsPostList v-else :posts="posts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/post'

useHead({ title: 'Notizie & Eventi — AICS Lucca' })

const posts = ref<Post[]>([])
const pending = ref(false)
const error = ref(null)
</script>
