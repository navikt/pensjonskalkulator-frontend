import React from 'react'

import { Chips } from '@navikt/ds-react'

import { formatUttaksalder } from '@/components/VelgUttaksalder/utils'

interface Props {
  alder: Uttaksalder
  isSelected: boolean
  onClick: (alder: Uttaksalder) => void
}

export const UttaksalderButton: React.FC<Props> = React.memo(
  ({ alder, isSelected, onClick }) => {
    return (
      <Chips.Toggle selected={isSelected} onClick={() => onClick(alder)}>
        {formatUttaksalder(alder)}
      </Chips.Toggle>
    )
  }
)
