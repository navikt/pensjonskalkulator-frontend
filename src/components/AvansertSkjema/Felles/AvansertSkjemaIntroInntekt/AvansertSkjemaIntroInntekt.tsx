import { useIntl } from 'react-intl'

import { ReadMore } from '@/components/common/ReadMore'
import { EndreInntekt } from '@/components/EndreInntekt'
import { InfoOmInntekt } from '@/components/EndreInntekt/InfoOmInntekt'
import { formatInntekt } from '@/utils/inntekt'

import styles from './AvansertSkjemaIntroInntekt.module.scss'

interface Props {
  localInntektFremTilUttak: string | null
  aarligInntektFoerUttakBeloep: string | null | undefined
  setLocalInntektFremTilUttak: (value: string | null) => void
}

export const AvansertSkjemaIntroInntekt = ({
  localInntektFremTilUttak,
  aarligInntektFoerUttakBeloep,
  setLocalInntektFremTilUttak,
}: Props) => {
  const intl = useIntl()

  return (
    <>
      <div className={styles.description}>
        <span className={styles.descriptionText}>
          <span
            className="nowrap"
            data-testid="formatert-inntekt-frem-til-uttak"
          >
            {formatInntekt(
              localInntektFremTilUttak ?? aarligInntektFoerUttakBeloep
            )}
          </span>
          {` ${intl.formatMessage({ id: 'beregning.avansert.rediger.inntekt_frem_til_uttak.description' })}`}
        </span>

        <EndreInntekt
          visning="avansert"
          buttonLabel="beregning.avansert.rediger.inntekt.button"
          value={localInntektFremTilUttak}
          onSubmit={(uformatertInntekt) => {
            setLocalInntektFremTilUttak(formatInntekt(uformatertInntekt))
          }}
        />
      </div>

      <div className={`${styles.spacer} ${styles.spacer__small}`} />

      <ReadMore
        name="Endring av inntekt i avansert fane"
        header={intl.formatMessage({
          id: 'inntekt.info_om_inntekt.read_more.label',
        })}
      >
        <InfoOmInntekt />
      </ReadMore>
    </>
  )
}
