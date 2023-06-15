import React, { useMemo, useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Button, Chips, Heading } from '@navikt/ds-react'
import clsx from 'clsx'

import { UttaksalderButton } from '@/components/VelgUttaksalder/UttaksalderButton'

import { getAldere } from './utils'

import styles from './VelgUttaksalder.module.scss'

interface Props {
  tidligstMuligUttak: Uttaksalder
  valgtUttaksalder?: Uttaksalder
  setValgtUttaksalder: (alder: Uttaksalder) => void
  defaultAntallSynligeAldere?: number
  visFlereAldereLabelClose?: string
  visFlereAldereLabelOpen?: string
}

export const VelgUttaksalder: React.FC<Props> = ({
  tidligstMuligUttak,
  valgtUttaksalder,
  setValgtUttaksalder,
  defaultAntallSynligeAldere = 9,
  visFlereAldereLabelClose = 'Vis flere aldere',
  visFlereAldereLabelOpen = 'Vis færre aldere',
}) => {
  const aldere = useMemo(
    () => getAldere(tidligstMuligUttak),
    [tidligstMuligUttak]
  )
  const [showFlereAldere, setShowFlereAldere] = useState<boolean>(false)

  return (
    <div className={styles.wrapper}>
      <Heading size="xsmall" level="2">
        Når vil du ta ut alderspensjon?
      </Heading>
      <Chips className={clsx(styles.chipsWrapper, styles.chipsWrapper__hasGap)}>
        {aldere
          .slice(
            0,
            showFlereAldere ? aldere.length : defaultAntallSynligeAldere
          )
          .map((alder) => (
            <UttaksalderButton
              key={alder.aar}
              alder={alder}
              isSelected={alder.aar === valgtUttaksalder?.aar}
              onClick={setValgtUttaksalder}
            />
          ))}
      </Chips>
      <Button
        className={styles.visFlereAldere}
        icon={
          showFlereAldere ? (
            <ChevronUpIcon aria-hidden />
          ) : (
            <ChevronDownIcon aria-hidden />
          )
        }
        iconPosition="left"
        size={'xsmall'}
        variant="tertiary"
        onClick={() => {
          setShowFlereAldere((prevState) => !prevState)
        }}
      >
        {showFlereAldere ? visFlereAldereLabelOpen : visFlereAldereLabelClose}
      </Button>
    </div>
  )
}
