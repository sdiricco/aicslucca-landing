import type { SanityImageSource } from '@sanity/image-url'

export interface Locandina {
  _id: string
  titolo: string
  immagine: SanityImageSource & { asset: { url: string } }
  dataEvento?: string
  descrizione?: string
}
