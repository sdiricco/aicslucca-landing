<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <NewsPostCard v-for="post in posts" :key="post.slug" :post="post" />
  </div>
</template>

<script setup lang="ts">
import type { Post } from '~/types/post'

defineProps<{ posts: Post[] }>()
</script>
