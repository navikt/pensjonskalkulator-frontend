import React from 'react'
import { useIntl } from 'react-intl'

import { PortableText } from '@portabletext/react'
import clsx from 'clsx'

import { ReadMore } from '@/components/common/ReadMore'
import { SanityContext } from '@/context/SanityContext'
import { getSanityPortableTextComponents } from '@/utils/sanity'

import styles from './SanityReadmore.module.scss'

interface Props {
  id: string
  className?: string
}

export const SanityReadmore = ({ id, className }: Props) => {
  const intl = useIntl()
  const { readMoreData } = React.useContext(SanityContext)
  const sanityContent = readMoreData[id]

  if (!sanityContent) {
    throw new Error(`No content found for readmore with id: ${id}`)
  }

  return (
    <ReadMore
      data-testid={sanityContent.name}
      name={sanityContent.name}
      header={sanityContent.overskrift}
      className={clsx(styles.wrapper, className)}
    >
      <PortableText
        value={sanityContent.innhold}
        components={getSanityPortableTextComponents(intl)}
      />
    </ReadMore>
  )
}
