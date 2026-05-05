export interface Locandina {
  _id: string
  titolo: string
  immagine: { asset: { url: string } }
  dataEvento?: string
  descrizione?: string
}
