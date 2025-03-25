import React from 'react'
import { useIntl } from 'react-intl'

import { GuidePanel } from '@navikt/ds-react'
import { PortableText } from '@portabletext/react'

import { SanityContext } from '@/context/SanityContext'
import { useGetSanityFeatureToggleQuery } from '@/state/api/apiSlice'
import { getSanityPortableTextComponents } from '@/utils/sanity'

interface Props {
  id: string
  className?: string
  children?: React.ReactNode
}

export const SanityGuidePanel = ({ id, className, children }: Props) => {
  const intl = useIntl()
  const { guidePanelData } = React.useContext(SanityContext)
  const { data: sanityFeatureToggle } = useGetSanityFeatureToggleQuery()
  const sanityContent = guidePanelData[id]

  if (children && (!sanityFeatureToggle?.enabled || !sanityContent)) {
    return children
  }

  return (
    <GuidePanel poster className={className} data-testid={sanityContent.name}>
      {sanityContent.overskrift && <h2>{sanityContent.overskrift}</h2>}

      <PortableText
        value={sanityContent.innhold}
        components={getSanityPortableTextComponents(intl)}
      />
    </GuidePanel>
  )
}
