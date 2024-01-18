/* c8 ignore start */
import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { PencilIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import {
  selectAarligInntektFoerUttak,
  selectCurrentSimulation,
} from '@/state/userInput/selectors'
import { formatUttaksalder } from '@/utils/alder'
import { formatWithoutDecimal } from '@/utils/currency'
interface Props {
  onButtonClick: () => void
}

import styles from './ResultatkortAvansertBeregning.module.scss'

export const ResultatkortAvansertBeregning: React.FC<Props> = ({
  onButtonClick,
}) => {
  const intl = useIntl()
  const aarligInntektFoerUttak = useAppSelector(selectAarligInntektFoerUttak)

  const { uttaksalder, aarligInntektVsaHelPensjon, gradertUttaksperiode } =
    useAppSelector(selectCurrentSimulation)

  return (
    <div className={styles.card}>
      <div className={styles.cardLeft}>
        <dl className={styles.cardLeftList}>
          <dt className={styles.cardLeftListTitle}>
            <FormattedMessage id="beregning.avansert.resultatkort.frem_til_uttak" />
          </dt>
          <dd className={styles.cardLeftListDescription}>
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.inntekt_1',
            })}
            {formatWithoutDecimal(aarligInntektFoerUttak)}
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.inntekt_2',
            })}
          </dd>
          {uttaksalder && gradertUttaksperiode?.uttaksalder && (
            <>
              <dt className={styles.cardLeftListTitle}>
                {intl.formatMessage({
                  id: 'beregning.avansert.resultatkort.Fra',
                })}
                {formatUttaksalder(
                  intl,
                  {
                    aar: gradertUttaksperiode.uttaksalder.aar,
                    maaneder: gradertUttaksperiode.uttaksalder.maaneder,
                  },
                  { compact: true }
                )}
                {intl.formatMessage({
                  id: 'beregning.avansert.resultatkort.til',
                })}

                {formatUttaksalder(
                  intl,
                  {
                    aar:
                      uttaksalder.maaneder > 0
                        ? uttaksalder.aar
                        : uttaksalder.aar - 1,
                    maaneder:
                      uttaksalder.maaneder > 0 ? uttaksalder.maaneder - 1 : 11,
                  },
                  { compact: true }
                )}
              </dt>
              <dd className={styles.cardLeftListDescription}>
                {gradertUttaksperiode.grad && (
                  <>
                    {intl.formatMessage({
                      id: 'beregning.avansert.resultatkort.alderspensjon',
                    })}
                    {gradertUttaksperiode.grad} %<br />
                  </>
                )}
                {gradertUttaksperiode.aarligInntekt && (
                  <>
                    {intl.formatMessage({
                      id: 'beregning.avansert.resultatkort.inntekt_1',
                    })}
                    {formatWithoutDecimal(gradertUttaksperiode.aarligInntekt)}
                    {intl.formatMessage({
                      id: 'beregning.avansert.resultatkort.inntekt_2',
                    })}
                  </>
                )}
              </dd>
            </>
          )}

          <dt className={styles.cardLeftListTitle}>
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.Fra',
            })}
            {uttaksalder &&
              formatUttaksalder(
                intl,
                {
                  ...uttaksalder,
                },
                { compact: true }
              )}
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.til',
            })}
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.livsvarig',
            })}
          </dt>
          <dd className={styles.cardLeftListDescription}>
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.alderspensjon',
            })}
            100 %
            {aarligInntektVsaHelPensjon && (
              <>
                <br />
                {intl.formatMessage({
                  id: 'beregning.avansert.resultatkort.inntekt_1',
                })}
                {formatWithoutDecimal(aarligInntektVsaHelPensjon?.beloep)}
                {intl.formatMessage({
                  id: 'beregning.avansert.resultatkort.inntekt_2',
                })}
                {intl.formatMessage({
                  id: 'beregning.avansert.resultatkort.til',
                })}
                {formatUttaksalder(
                  intl,
                  aarligInntektVsaHelPensjon?.sluttAlder,
                  { compact: true }
                )}
              </>
            )}
          </dd>
        </dl>
      </div>
      <div className={styles.cardRight}>
        <Button
          className={styles.cardRightButton}
          variant="tertiary"
          icon={<PencilIcon aria-hidden />}
          onClick={onButtonClick}
        >
          {intl.formatMessage({
            id: 'beregning.avansert.resultatkort.button',
          })}
        </Button>
      </div>
    </div>
  )
}
/* c8 ignore end */
