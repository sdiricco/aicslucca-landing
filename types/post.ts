export interface Post {
  title: string
  slug: string
  publishedAt: string
  category: 'evento' | 'notizia'
  coverImage?: string
  excerpt?: string
  body?: string
}
