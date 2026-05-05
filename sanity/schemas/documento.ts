import { defineField, defineType } from 'sanity'

export const documentoType = defineType({
  name: 'documento',
  title: 'Documenti',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Titolo',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categoria',
      type: 'string',
      title: 'Categoria',
      options: {
        list: [
          { title: 'Bilancio', value: 'bilancio' },
          { title: 'Verbale', value: 'verbale' },
          { title: 'Statuto', value: 'statuto' },
          { title: 'Altro', value: 'altro' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'anno',
      type: 'number',
      title: 'Anno',
      validation: Rule => Rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'File PDF',
      options: { accept: '.pdf' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'descrizione',
      type: 'string',
      title: 'Descrizione',
    }),
  ],
  orderings: [
    {
      title: 'Anno (più recenti)',
      name: 'annoDesc',
      by: [{ field: 'anno', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'anno' },
  },
})
