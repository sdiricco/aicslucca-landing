import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

/**
 * Returns a Sanity image URL builder scoped to the current request.
 * A fresh builder is created per composable call to avoid SSR state leaks.
 */
export function useSanityImageUrl() {
  const sanity = useSanity()
  const builder = imageUrlBuilder(sanity.client)

  function urlFor(source: SanityImageSource) {
    return builder.image(source)
  }

  return { urlFor }
}
