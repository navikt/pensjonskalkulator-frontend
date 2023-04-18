import React from 'react'

import {
  Alert,
  BodyLong,
  Button,
  Heading,
  Link,
  Loader,
} from '@navikt/ds-react'
import clsx from 'clsx'

import whiteSectionStyles from '../../scss/WhiteSection/WhiteSection.module.scss'
import { useGetPensjonsberegningQuery } from '../../state/api/apiSlice'
import { formatAsDecimal } from '../../utils/currency'

import { UttaksalternativerChart } from './UttaksalternativerChart'

import styles from './Uttaksalternativer.module.scss'

const useInntekt = () => {
  return 678_000
}

export function Uttaksalternativer() {
  const { data, isLoading, isError, isSuccess } = useGetPensjonsberegningQuery()
  const inntekt = useInntekt()

  if (isLoading) {
    return (
      <Loader
        className={styles.loader}
        data-testid="loader"
        size="3xlarge"
        title="Henter pensjonsberegning"
      />
    )
  }

  if (isError || !isSuccess) {
    return (
      <Alert variant="error">
        <Heading spacing size="small" level="2">
          Vi klarte ikke å kalkulere pensjonen din. Prøv igjen senere.
        </Heading>
      </Alert>
    )
  }

  return (
    <section
      className={clsx(
        whiteSectionStyles.whiteSection,
        styles.uttaksalternativer
      )}
    >
      <Heading size="medium" level="2">
        Når kan du ta ut alderspensjon?
      </Heading>
      <BodyLong className={styles.uttaksalternativerParagraph}>
        Hvis du fortsetter å ha en inntekt på{' '}
        <strong>{formatAsDecimal(inntekt)} kr</strong> kan du tidligst gå av med
        alderspensjon når du blir <strong>{data[0].alder} år</strong>. Hvis du
        går av senere, får du høyere pensjon.
      </BodyLong>
      <section
        aria-label="Pensjonsberegning"
        className={styles.uttaksalternativerChart}
      >
        <UttaksalternativerChart lønn={inntekt} beregning={data} />
        <Button variant="secondary">Sjekk hele pensjonen din</Button>
      </section>
      <Link href="#">Om hvordan vi beregner din pensjon</Link>
    </section>
  )
}
