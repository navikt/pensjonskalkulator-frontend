import { InfoOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { supportedLanguages } from './supportedLanguages'

export const readmoreType = defineType({
  name: 'readmore',
  title: 'ReadMore',
  icon: InfoOutlineIcon,
  type: 'document',
  preview: {
    select: {
      title: 'overskrift',
      subtitle: 'name',
      language: 'language',
    },
    prepare(selection) {
      return {
        ...selection,
        title: `${selection.title} (${
          supportedLanguages.find((lang) => lang.id === selection.language)
            ?.title
        })`,
      }
    },
  },
  fields: [
    defineField({
      title: 'Language',
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'name',
      type: 'string',
      description: 'Denne brukes som ID i koden',
      validation: (rule) => rule.required().error(`Påkrevd`),
    }),
    defineField({
      name: 'overskrift',
      type: 'string',
      description: 'Tekst på ReadMore header (knappen som åpner og lukker)',
    }),
    defineField({
      name: 'innhold',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Lenke',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Åpnes i ny fane',
                    description:
                      'Ved å huke av denne boksen vil lenken vises med "external" ikon og åpnes i ny fane',
                  },
                ],
              },
            ],
          },
        },
      ],
      description: 'Avsnitt(ene) i ReadMore. Vises når ReadMore er åpent.',
    }),
  ],
})
