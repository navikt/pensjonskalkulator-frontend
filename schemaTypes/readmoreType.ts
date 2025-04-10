import { InfoOutlineIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import {
  innholdField,
  languageField,
  nameField,
  overskriftField,
} from './common/commonSchemaTypes'
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
    languageField,
    nameField,
    defineField({
      ...overskriftField,
      description: 'Tekst på ReadMore header (knappen som åpner og lukker)',
    }),
    defineField({
      ...innholdField,
      description: 'Avsnitt(ene) i ReadMore. Vises når ReadMore er åpent.',
    }),
  ],
})
