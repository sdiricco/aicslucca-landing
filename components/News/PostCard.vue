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
        :class="post.category === 'evento' ? 'bg-primaryDark' : 'bg-primary'"
        class="text-white text-xs font-semibold px-2 py-1 rounded-full"
      >
        {{ post.category === 'evento' ? 'Evento' : 'Notizia' }}
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
import type { Post } from '~/types/post'

const props = defineProps<{ post: Post }>()

const { urlFor } = useSanityImageUrl()

const coverImageUrl = computed(() =>
  props.post.coverImage
    ? urlFor(props.post.coverImage).width(600).height(338).fit('crop').url()
    : undefined
)

const formattedDate = computed(() => {
  const d = new Date(props.post.publishedAt)
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>
