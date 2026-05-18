<template>
  <div class="bg-white min-h-screen py-12">
    <div class="container mx-auto px-4 max-w-3xl">

      <!-- Loading -->
      <div v-if="pending" role="status" aria-live="polite" class="text-center text-gray-400 py-24">Caricamento...</div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-red-500 py-24">
        Si è verificato un errore. Riprova più tardi.
      </div>

      <!-- Post content -->
      <article v-else-if="post">
        <!-- Breadcrumb -->
        <NuxtLink to="/news" class="text-primary text-sm hover:underline">← Notizie & Eventi</NuxtLink>

        <!-- Badge + Data -->
        <div class="flex items-center gap-3 mt-4">
          <span
            :class="post.category === 'evento' ? 'bg-primaryDark' : 'bg-primary'"
            class="text-white text-xs font-semibold px-2 py-1 rounded-full"
          >
            {{ post.category === 'evento' ? 'Evento' : 'Notizia' }}
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
          width="1200"
          height="630"
          loading="lazy"
          class="mt-6 w-full rounded-xl object-cover max-h-96"
        />

        <!-- Corpo articolo (Portable Text) -->
        <div v-if="post.body" class="mt-8 prose prose-lg max-w-none">
          <PortableText :value="post.body" />
        </div>
      </article>

      <!-- Post non trovato (CSR fallback) -->
      <div v-else class="text-center text-gray-400 py-24">Articolo non trovato.</div>

    </div>
  </div>
</template>

<script setup lang="ts">
import groq from 'groq'
import type { Post } from '~/types/post'

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

const { data: post, pending, error } = await useSanityQuery<Post | null>(query, { slug })

if (!pending.value && !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Articolo non trovato' })
}

const { urlFor } = useSanityImageUrl()

useHead(() => ({
  title: post.value ? `${post.value.title} — AICS Lucca` : 'AICS Lucca',
  meta: post.value ? [
    { name: 'description', content: post.value.excerpt ?? '' },
    { property: 'og:title', content: post.value.title },
    { property: 'og:description', content: post.value.excerpt ?? '' },
    { property: 'og:type', content: 'article' },
    ...(post.value.coverImage
      ? [{ property: 'og:image', content: urlFor(post.value.coverImage).width(1200).height(630).fit('crop').url() }]
      : []),
  ] : [],
}))

const coverImageUrl = computed(() =>
  post.value?.coverImage
    ? urlFor(post.value.coverImage).width(1200).height(630).fit('crop').url()
    : undefined
)

const formattedDate = computed(() => {
  if (!post.value) return ''
  const d = new Date(post.value.publishedAt)
  return isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
})
</script>
