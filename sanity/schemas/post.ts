import { defineField, defineType } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Notizie & Eventi',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titolo',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL (slug)',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Data pubblicazione',
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Categoria',
      options: {
        list: [
          { title: 'Notizia', value: 'notizia' },
          { title: 'Evento', value: 'evento' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      type: 'image',
      title: 'Immagine copertina',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      title: 'Sommario',
      rows: 3,
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Contenuto',
      of: [{ type: 'block' }],
    }),
  ],
  orderings: [
    {
      title: 'Data (più recenti)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
})
