import React from 'react'
import { useIntl } from 'react-intl'

import { PortableText } from '@portabletext/react'

import { ReadMore } from '@/components/common/ReadMore'
import { SanityContext } from '@/context/SanityContext'
import { useGetSanityFeatureToggleQuery } from '@/state/api/apiSlice'
import { getSanityPortableTextComponents } from '@/utils/sanity'

interface IProps {
  id: string
  className?: string
  children: React.ReactNode
  useFeatureToggle?: boolean
}

export function SanityReadmore({
  id,
  className,
  children,
  useFeatureToggle = true,
}: IProps) {
  const intl = useIntl()
  const { readMoreData } = React.useContext(SanityContext)
  const { data: sanityFeatureToggle } = useGetSanityFeatureToggleQuery()
  const sanityContent = readMoreData[id]

  const renderSanityContent = () => {
    return (
      <ReadMore
        data-testid={sanityContent.name}
        name={sanityContent.name}
        header={sanityContent.overskrift}
        className={className}
      >
        <PortableText
          value={sanityContent.innhold}
          components={getSanityPortableTextComponents(intl)}
        />
      </ReadMore>
    )
  }

  if (useFeatureToggle === false) {
    return renderSanityContent()
  }

  if (!sanityFeatureToggle?.enabled || !sanityContent) {
    return children
  }

  return renderSanityContent()
}
