/* c8 ignore start */
import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { PencilIcon } from '@navikt/aksel-icons'
import { Button, ExpansionCard } from '@navikt/ds-react'

import { useGetPersonQuery } from '@/state/api/apiSlice'
import { useAppSelector } from '@/state/hooks'
import {
  selectAarligInntektFoerUttakBeloep,
  selectCurrentSimulation,
} from '@/state/userInput/selectors'
import { formatUttaksalder, transformUttaksalderToDate } from '@/utils/alder'
import { formatWithoutDecimal } from '@/utils/inntekt'
interface Props {
  onButtonClick: () => void
}

import styles from './ResultatkortAvansertBeregning.module.scss'

export const ResultatkortAvansertBeregning: React.FC<Props> = ({
  onButtonClick,
}) => {
  const intl = useIntl()
  const aarligInntektFoerUttakBeloep = useAppSelector(
    selectAarligInntektFoerUttakBeloep
  )
  const { data: person } = useGetPersonQuery()

  const { uttaksalder, aarligInntektVsaHelPensjon, gradertUttaksperiode } =
    useAppSelector(selectCurrentSimulation)

  return (
    <ExpansionCard
      className={styles.card}
      aria-labelledby="expansion-card-label"
      size="small"
    >
      <ExpansionCard.Header>
        <ExpansionCard.Title id="expansion-card-label" size="small">
          <FormattedMessage id="beregning.avansert.resultatkort.tittel" />
        </ExpansionCard.Title>
        <ExpansionCard.Description>
          <FormattedMessage id="beregning.avansert.resultatkort.description" />
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <dl className={styles.list}>
          <dt className={styles.listTitle}>
            <FormattedMessage id="beregning.avansert.resultatkort.frem_til_uttak" />
          </dt>
          <dd className={styles.listDescription}>
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.inntekt_1',
            })}
            :{' '}
            <span className="nowrap">
              {formatWithoutDecimal(aarligInntektFoerUttakBeloep)}
            </span>
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.inntekt_2',
            })}
          </dd>
          {uttaksalder && gradertUttaksperiode?.uttaksalder && (
            <>
              <dt className={styles.listTitle}>
                {formatUttaksalder(
                  intl,
                  {
                    aar: gradertUttaksperiode.uttaksalder.aar,
                    maaneder: gradertUttaksperiode.uttaksalder.maaneder,
                  },
                  { compact: true }
                )}
                {` (${transformUttaksalderToDate(
                  gradertUttaksperiode.uttaksalder,
                  person?.foedselsdato as string
                )})`}
              </dt>
              <dd className={styles.listDescription}>
                {gradertUttaksperiode.grad && (
                  <>
                    {intl.formatMessage({
                      id: 'beregning.avansert.resultatkort.alderspensjon',
                    })}
                    {gradertUttaksperiode.grad} %<br />
                  </>
                )}
                {gradertUttaksperiode.aarligInntektVsaPensjonBeloep !==
                  undefined &&
                  gradertUttaksperiode.aarligInntektVsaPensjonBeloep > 0 && (
                    <>
                      {intl.formatMessage({
                        id: 'beregning.avansert.resultatkort.inntekt_1',
                      })}
                      {': '}
                      <span className="nowrap">
                        {formatWithoutDecimal(
                          gradertUttaksperiode.aarligInntektVsaPensjonBeloep
                        )}
                      </span>
                      {intl.formatMessage({
                        id: 'beregning.avansert.resultatkort.inntekt_2',
                      })}
                    </>
                  )}
              </dd>
            </>
          )}

          <dt className={styles.listTitle}>
            {uttaksalder && (
              <>{`${formatUttaksalder(
                intl,
                {
                  ...uttaksalder,
                },
                { compact: true }
              )}
                  (${transformUttaksalderToDate(
                    uttaksalder,
                    person?.foedselsdato as string
                  )})`}</>
            )}
          </dt>
          <dd className={styles.listDescription}>
            {intl.formatMessage({
              id: 'beregning.avansert.resultatkort.alderspensjon',
            })}
            100 %
            {aarligInntektVsaHelPensjon &&
              aarligInntektVsaHelPensjon.beloep > 0 && (
                <>
                  <br />
                  {intl.formatMessage({
                    id: 'beregning.avansert.resultatkort.inntekt_1',
                  })}
                  {intl.formatMessage({
                    id: aarligInntektVsaHelPensjon?.sluttAlder.maaneder
                      ? 'beregning.tom'
                      : 'beregning.til',
                  })}
                  {formatUttaksalder(
                    intl,
                    aarligInntektVsaHelPensjon?.sluttAlder,
                    {
                      compact: true,
                    }
                  )}
                  {': '}
                  <span className="nowrap">
                    {formatWithoutDecimal(aarligInntektVsaHelPensjon?.beloep)}
                  </span>
                  {intl.formatMessage({
                    id: 'beregning.avansert.resultatkort.inntekt_2',
                  })}
                </>
              )}
          </dd>
        </dl>

        <Button
          className={styles.button}
          variant="tertiary"
          icon={<PencilIcon aria-hidden />}
          onClick={onButtonClick}
        >
          {intl.formatMessage({
            id: 'beregning.avansert.resultatkort.button',
          })}
        </Button>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
/* c8 ignore end */
