import React from 'react'
import { FormattedMessage } from 'react-intl'

import { HStack, Heading } from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectCurrentSimulation } from '@/state/userInput/selectors'
import { getFormatMessageValues } from '@/utils/translations'

import { DetaljRad } from '../hooks'

import styles from './Pensjonsdetaljer.module.scss'

export interface GrunnpensjonsdetaljerProps {
  grunnpensjonObjekter: DetaljRad[][]
}

export const Grunnpensjonsdetaljer: React.FC<GrunnpensjonsdetaljerProps> = ({
  grunnpensjonObjekter,
}) => {
  const { uttaksalder, gradertUttaksperiode } = useAppSelector(
    selectCurrentSimulation
  )

  console.log(grunnpensjonObjekter.length)
  console.log(grunnpensjonObjekter)

  const gradertUttak =
    grunnpensjonObjekter.length === 2 ? grunnpensjonObjekter[0] : null
  const heltUttak =
    grunnpensjonObjekter.length === 2
      ? grunnpensjonObjekter[1]
      : (grunnpensjonObjekter[0] ?? [])

  return (
    <>
      {gradertUttak && gradertUttak.length > 0 && (
        <div className="gradertUttak">
          <Heading size="small" level="3">
            <FormattedMessage
              id="beregning.detaljer.grunnpensjon.gradertUttak.title"
              values={{
                ...getFormatMessageValues(),
                alderAar: `${gradertUttaksperiode?.uttaksalder.aar} år`,
                alderMd:
                  gradertUttaksperiode?.uttaksalder.maaneder &&
                  gradertUttaksperiode.uttaksalder.maaneder > 0
                    ? `og ${gradertUttaksperiode.uttaksalder.maaneder} måneder`
                    : '',
                grad: gradertUttaksperiode?.grad,
              }}
            />
          </Heading>
          <dl>
            <div className={styles.hstackRow}>
              <strong>
                <FormattedMessage id="beregning.detaljer.grunnpensjon.table.title" />
              </strong>
            </div>
            {gradertUttak.map((detalj, index) => (
              <React.Fragment key={index}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt>
                    {index === gradertUttak.length - 1 ? (
                      <strong>{detalj.tekst}:</strong>
                    ) : (
                      `${detalj.tekst}:`
                    )}
                  </dt>
                  <dd>
                    {index === gradertUttak.length - 1 ? (
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
      <div className="heltUttak">
        <Heading size="small" level="3">
          <FormattedMessage
            id="beregning.detaljer.grunnpensjon.heltUttak.title"
            values={{
              ...getFormatMessageValues(),
              alderAar: `${uttaksalder?.aar} år`,
              alderMd:
                uttaksalder?.maaneder && uttaksalder.maaneder > 0
                  ? `og ${uttaksalder.maaneder} måneder`
                  : '',
              grad: 100,
            }}
          />
        </Heading>
        <dl>
          <div className={styles.hstackRow}>
            <strong>
              <FormattedMessage id="beregning.detaljer.grunnpensjon.table.title" />
            </strong>
          </div>
          {heltUttak.map((detalj, index) => (
            <React.Fragment key={index}>
              <HStack justify="space-between" className={styles.hstackRow}>
                <dt>
                  {index === heltUttak.length - 1 ? (
                    <strong>{detalj.tekst}:</strong>
                  ) : (
                    `${detalj.tekst}:`
                  )}
                </dt>
                <dd>
                  {index === heltUttak.length - 1 ? (
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
    </>
  )
}
