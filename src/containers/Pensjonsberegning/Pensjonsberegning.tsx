import { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Alert, Heading } from '@navikt/ds-react'
import clsx from 'clsx'

import { Loader } from '@/components/components/Loader'
import { Forbehold } from '@/components/Forbehold'
import { Grunnlag } from '@/components/Grunnlag'
import { Pensjonssimulering } from '@/components/Pensjonssimulering'
import { TidligstMuligUttaksalder } from '@/components/TidligstMuligUttaksalder'
import { TilbakeEllerAvslutt } from '@/components/TilbakeEllerAvslutt'
import { VelgUttaksalder } from '@/components/VelgUttaksalder'
import { useTidligsteUttaksalderQuery } from '@/state/api/apiSlice'
import { useAppSelector } from '@/state/hooks'
import { selectFormatertUttaksalder } from '@/state/userInput/selectors'

import styles from './Pensjonsberegning.module.scss'

export function Pensjonsberegning() {
  const isAlderValgt = useAppSelector(selectFormatertUttaksalder) !== null

  const intl = useIntl()
  const {
    data: tidligstMuligUttak,
    isLoading,
    isError,
    isSuccess,
  } = useTidligsteUttaksalderQuery()

  useEffect(() => {
    document.title = intl.formatMessage({
      id: 'application.title.beregning',
    })
  }, [])

  if (isLoading) {
    return (
      <Loader
        data-testid="loader"
        size="3xlarge"
        title="Et øyeblikk, vi henter tidligste mulige uttaksalder"
      />
    )
  }

  if (isError || !isSuccess) {
    return (
      <Alert variant="error">
        <Heading spacing size="small" level="2">
          Vi klarte ikke å hente din tidligste mulige uttaksalder. Prøv igjen
          senere.
        </Heading>
      </Alert>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <TidligstMuligUttaksalder uttaksalder={tidligstMuligUttak} />
      </div>
      {
        // TODO etter merge - denne flyttes under routes/pages slik at containeren ikke har styles
      }
      <div
        className={clsx(styles.background, styles.background__hasMargin, {
          [styles.background__white]: isAlderValgt,
        })}
      >
        <div className={styles.container}>
          <VelgUttaksalder tidligstMuligUttak={tidligstMuligUttak} />
        </div>
        {
          // TODO PEK-107 - sørge for at fokuset flyttes riktig og at skjermleseren leser opp i riktig rekkefølge etter valg av uttaksalder + at lasting er ferdig.
        }
        {isAlderValgt && (
          <div
            className={`${styles.container} ${styles.container__hasPadding}`}
          >
            <Pensjonssimulering />
            <Grunnlag tidligstMuligUttak={tidligstMuligUttak} />
            <Forbehold />
          </div>
        )}
      </div>

      <div className={`${styles.background} ${styles.background__lightblue}`}>
        <div className={styles.container}>
          <TilbakeEllerAvslutt />
        </div>
      </div>
    </>
  )
}
