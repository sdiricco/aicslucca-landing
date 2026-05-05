import { defineField, defineType } from 'sanity'

export const locandinaType = defineType({
  name: 'locandina',
  title: 'Locandine',
  type: 'document',
  fields: [
    defineField({
      name: 'titolo',
      type: 'string',
      title: 'Titolo',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'immagine',
      type: 'image',
      title: 'Immagine',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'dataEvento',
      type: 'date',
      title: 'Data evento',
    }),
    defineField({
      name: 'descrizione',
      type: 'string',
      title: 'Descrizione',
    }),
  ],
  orderings: [
    {
      title: 'Data evento (più recenti)',
      name: 'dataEventoDesc',
      by: [{ field: 'dataEvento', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'titolo', subtitle: 'dataEvento', media: 'immagine' },
  },
})
