export interface Documento {
  _id: string
  title: string
  categoria: 'bilancio' | 'verbale' | 'statuto' | 'altro'
  anno: number
  file: {
    asset: {
      _ref: string
      url: string
    }
  }
  descrizione?: string
}
