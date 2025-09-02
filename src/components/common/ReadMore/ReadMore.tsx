import React from 'react'

import { ReadMore as ReadMoreAksel, ReadMoreProps } from '@navikt/ds-react'

import { logger } from '@/utils/logging'

interface IProps extends ReadMoreProps {
  name: string
}

const logIsOpen = (name: string, isOpen: boolean) => {
  if (isOpen) {
    logger('les mer åpnet', { tittel: name })
  } else {
    logger('les mer lukket', { tittel: name })
  }
}

export const ReadMore: React.FC<IProps> = ({ name, onOpenChange, ...rest }) => (
  <ReadMoreAksel
    data-testid="readmore"
    onOpenChange={(open) => {
      logIsOpen(name, open)
      onOpenChange?.(open)
    }}
    {...rest}
  />
)
