import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, Heading, VStack } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'
import { getFormatMessageValues } from '@/utils/translations'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface AfpDetaljerProps {
  opptjeningAfpPrivatListe?: DetaljRad[][]
  opptjeningPre2025OffentligAfpListe?: DetaljRad[]
}

export const AfpDetaljer: React.FC<AfpDetaljerProps> = ({
  opptjeningAfpPrivatListe,
  opptjeningPre2025OffentligAfpListe,
}) => {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  const afpPrivatAtUttaksalder =
    opptjeningAfpPrivatListe && opptjeningAfpPrivatListe.length === 2
      ? opptjeningAfpPrivatListe[0]
      : []
  const afpPrivatAt67 =
    opptjeningAfpPrivatListe && opptjeningAfpPrivatListe.length === 2
      ? opptjeningAfpPrivatListe[1]
      : (opptjeningAfpPrivatListe?.[0] ?? [])

  const currentAge = gradertUttaksperiode?.uttaksalder?.aar ?? uttaksalder?.aar
  const currentMonths =
    gradertUttaksperiode?.uttaksalder?.maaneder ?? uttaksalder?.maaneder

  return (
    <section>
      {opptjeningAfpPrivatListe && opptjeningAfpPrivatListe.length > 0 && (
        <VStack gap="20">
          {afpPrivatAtUttaksalder.length > 0 &&
            currentAge &&
            currentAge < 67 && (
              <div className="afpPrivatAtUttaksalder">
                <Heading size="small" level="3">
                  <FormattedMessage
                    id="beregning.detaljer.afpPrivat.gradertUttak.title"
                    values={{
                      ...getFormatMessageValues(),
                      alderAar: `${currentAge} år`,
                      alderMd:
                        currentMonths && currentMonths > 0
                          ? `og ${currentMonths} måneder`
                          : '',
                      grad: 100,
                    }}
                  />
                </Heading>
                <dl>
                  <div className={styles.hstackRow}>
                    <strong>
                      <FormattedMessage id="beregning.detaljer.OpptjeningDetaljer.afpPrivat.table.title" />
                    </strong>
                  </div>
                  {afpPrivatAtUttaksalder.map((detalj, index) => (
                    <Fragment key={index}>
                      <HStack
                        justify="space-between"
                        className={styles.hstackRow}
                      >
                        <dt>
                          {index === afpPrivatAtUttaksalder.length - 1 ? (
                            <strong>{detalj.tekst}:</strong>
                          ) : (
                            `${detalj.tekst}:`
                          )}
                        </dt>
                        <dd>
                          {index === afpPrivatAtUttaksalder.length - 1 ? (
                            <strong>{detalj.verdi}</strong>
                          ) : (
                            detalj.verdi
                          )}
                        </dd>
                      </HStack>
                    </Fragment>
                  ))}
                </dl>
              </div>
            )}

          <div className="afpPrivatAt67">
            <Heading size="small" level="3">
              <FormattedMessage
                id="beregning.detaljer.afpPrivat.heltUttak.title"
                values={{
                  ...getFormatMessageValues(),
                  alderAar: `${currentAge && currentAge < 67 ? 67 : currentAge} år`,
                  alderMd: '',
                  grad: 100,
                }}
              />
            </Heading>
            <dl>
              <div className={styles.hstackRow}>
                <strong>
                  <FormattedMessage id="beregning.detaljer.OpptjeningDetaljer.afpPrivat.table.title" />
                </strong>
              </div>
              {afpPrivatAt67.map((detalj, index) => (
                <Fragment key={index}>
                  <HStack justify="space-between" className={styles.hstackRow}>
                    <dt>
                      {index === afpPrivatAt67.length - 1 ? (
                        <strong>{detalj.tekst}:</strong>
                      ) : (
                        `${detalj.tekst}:`
                      )}
                    </dt>
                    <dd>
                      {index === afpPrivatAt67.length - 1 ? (
                        <strong>{detalj.verdi}</strong>
                      ) : (
                        detalj.verdi
                      )}
                    </dd>
                  </HStack>
                </Fragment>
              ))}
            </dl>
          </div>
        </VStack>
      )}

      {opptjeningPre2025OffentligAfpListe &&
        opptjeningPre2025OffentligAfpListe.length > 0 && (
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.OpptjeningDetaljer.pre2025OffentligAfp.table.title" />
              </strong>
            </div>
            {opptjeningPre2025OffentligAfpListe.map((detalj, index) => (
              <Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </Fragment>
            ))}
          </dl>
        )}
    </section>
  )
}
