import type { SanityImageSource } from '@sanity/image-url'

export interface Post {
  title: string
  slug: string
  publishedAt: string
  category: 'evento' | 'notizia'
  coverImage?: SanityImageSource
  excerpt?: string
  body?: unknown[]
}
