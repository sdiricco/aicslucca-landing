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
