import React from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, Heading, VStack } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'
import { getFormatMessageValues } from '@/utils/translations'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface AfpdetaljerProps {
  opptjeningAfpPrivatObjekt?: DetaljRad[][]
  opptjeningPre2025OffentligAfpObjekt?: DetaljRad[]
}

export const Afpdetaljer: React.FC<AfpdetaljerProps> = ({
  opptjeningAfpPrivatObjekt,
  opptjeningPre2025OffentligAfpObjekt,
}) => {
  const { uttaksalder } = useAppSelector(selectCurrentSimulation)

  const afpPrivatAtUttaksalder =
    opptjeningAfpPrivatObjekt && opptjeningAfpPrivatObjekt.length === 2
      ? opptjeningAfpPrivatObjekt[0]
      : []
  const afpPrivatAt67 =
    opptjeningAfpPrivatObjekt && opptjeningAfpPrivatObjekt.length === 2
      ? opptjeningAfpPrivatObjekt[1]
      : (opptjeningAfpPrivatObjekt?.[0] ?? [])

  return (
    <section>
      {opptjeningAfpPrivatObjekt && opptjeningAfpPrivatObjekt.length > 0 && (
        <VStack gap="20">
          {afpPrivatAtUttaksalder.length > 0 &&
            uttaksalder &&
            uttaksalder.aar < 67 && (
              <div className="afpPrivatAtUttaksalder">
                <Heading size="small" level="3">
                  <FormattedMessage
                    id="beregning.detaljer.afpPrivat.gradertUttak.title"
                    values={{
                      ...getFormatMessageValues(),
                      alderAar: `${uttaksalder.aar} år`,
                      alderMd:
                        uttaksalder.maaneder && uttaksalder.maaneder > 0
                          ? `og ${uttaksalder.maaneder} måneder`
                          : '',
                      grad: 100,
                    }}
                  />
                </Heading>
                <dl>
                  <div className={styles.hstackRow}>
                    <strong>
                      <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.afpPrivat.table.title" />
                    </strong>
                  </div>
                  {afpPrivatAtUttaksalder.map((detalj, index) => (
                    <React.Fragment key={index}>
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
                    </React.Fragment>
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
                  alderAar: `${uttaksalder?.aar && uttaksalder.aar < 67 ? 67 : uttaksalder?.aar} år`,
                  alderMd: '',
                  grad: 100,
                }}
              />
            </Heading>
            <dl>
              <div className={styles.hstackRow}>
                <strong>
                  <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.afpPrivat.table.title" />
                </strong>
              </div>
              {afpPrivatAt67.map((detalj, index) => (
                <React.Fragment key={index}>
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
                </React.Fragment>
              ))}
            </dl>
          </div>
        </VStack>
      )}

      {opptjeningPre2025OffentligAfpObjekt &&
        opptjeningPre2025OffentligAfpObjekt.length > 0 && (
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.opptjeningsdetaljer.pre2025OffentligAfp.table.title" />
              </strong>
            </div>
            {opptjeningPre2025OffentligAfpObjekt.map((detalj, index) => (
              <React.Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>{`${detalj.tekst}:`}</dt>
                  <dd>{detalj.verdi}</dd>
                </HStack>
              </React.Fragment>
            ))}
          </dl>
        )}
    </section>
  )
}
