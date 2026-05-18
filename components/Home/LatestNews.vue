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
import type { Post } from '~/types/post'

const posts = ref<Post[]>([])
</script>
