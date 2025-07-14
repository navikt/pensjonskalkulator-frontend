import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, HStack, VStack } from '@navikt/ds-react'

import { AfpDetaljerListe } from '../hooks'

import beregningsdetaljerStyles from '../BeregningsdetaljerForOvergangskull.module.scss'
import styles from './Pensjonsdetaljer.module.scss'

export interface AfpDetaljerProps {
  afpDetaljForValgtUttak: AfpDetaljerListe
}

export const AfpDetaljer: React.FC<AfpDetaljerProps> = ({
  afpDetaljForValgtUttak,
}) => {

  return (
    <Box data-testid="beregningsdetaljer-for-overgangskull">
      <div
        className={
          beregningsdetaljerStyles.beregningsdetaljerForOvergangskullDesktopOnly
        }
      >
        <HStack
          gap="12"
          className={styles.hstackRow}
          style={{ borderBottom: 'none' }}
        >
          {renderAfpDetaljer(afpDetaljForValgtUttak)}
        </HStack>
      </div>
      <div
        className={
          beregningsdetaljerStyles.beregningsdetaljerForOvergangskullMobileOnly
        }
      >
        <VStack gap="4 8" width="100%" marginBlock="2 0">
          {renderAfpDetaljer(afpDetaljForValgtUttak)}
        </VStack>
      </div>
    </Box>
  )
}

function renderAfpDetaljer(afpDetaljForValgtUttak?: AfpDetaljerListe) {
  const sections: React.ReactElement[] = []

  // Early return if no data
  if (!afpDetaljForValgtUttak) {
    return sections
  }

  // AFP Privat
  if (afpDetaljForValgtUttak.afpPrivat?.length > 0) {
    sections.push(
      <dl key="afpPrivat">
        <div className={styles.hstackRow}>
          <strong>
            <FormattedMessage id="beregning.detaljer.OpptjeningDetaljer.afpPrivat.table.title" />
          </strong>
        </div>
        {afpDetaljForValgtUttak.afpPrivat.map((detalj, detaljIndex) => {
          const isBold = detaljIndex === afpDetaljForValgtUttak.afpPrivat.length - 1
          return (
            <Fragment key={detaljIndex}>
              <HStack justify="space-between" className={styles.hstackRow}>
                <dt style={{ marginRight: '1rem' }}>
                  {isBold ? (
                    <strong>{detalj.tekst}:</strong>
                  ) : (
                    `${detalj.tekst}:`
                  )}
                </dt>
                <dd>
                  {isBold ? <strong>{detalj.verdi}</strong> : detalj.verdi}
                </dd>
              </HStack>
            </Fragment>
          )
        })}
      </dl>
    )
  }

  // AFP Offentlig
  if (afpDetaljForValgtUttak.afpOffentlig?.length > 0) {
    sections.push(
      <dl key="afpOffentlig">
        {afpDetaljForValgtUttak.afpOffentlig.map((detalj, detaljIndex) => (
          <Fragment key={detaljIndex}>
            <HStack justify="space-between" className={styles.hstackRow}>
              <dt style={{ marginRight: '1rem' }}>
                <strong>{`${detalj.tekst}:`}</strong>
              </dt>
              <dd>
                <strong>{detalj.verdi}</strong>
              </dd>
            </HStack>
          </Fragment>
        ))}
      </dl>
    )
  }

  // Pre-2025 Offentlig AFP
  if (afpDetaljForValgtUttak.pre2025OffentligAfp?.length > 0) {
    sections.push(
      <dl key="pre2025OffentligAfp">
        <div className={styles.hstackRow}>
          <strong>
            <FormattedMessage id="beregning.detaljer.grunnpensjon.afp.table.title" />
          </strong>
        </div>
        {afpDetaljForValgtUttak.pre2025OffentligAfp.map(
          (detalj, detaljIndex) => {
            const isBold =
              detaljIndex ===
              afpDetaljForValgtUttak.pre2025OffentligAfp.length - 1
            return (
              <Fragment key={detaljIndex}>
                <HStack justify="space-between" className={styles.hstackRow}>
                  <dt style={{ marginRight: '1rem' }}>
                    {isBold ? (
                      <strong>{detalj.tekst}:</strong>
                    ) : (
                      `${detalj.tekst}:`
                    )}
                  </dt>
                  <dd>
                    {isBold ? <strong>{detalj.verdi}</strong> : detalj.verdi}
                  </dd>
                </HStack>
              </Fragment>
            )
          }
        )}
      </dl>
    )
  }

  // Pre-2025 Opptjening Details
  if (afpDetaljForValgtUttak.opptjeningPre2025OffentligAfp?.length > 0) {
    sections.push(
      <dl key="opptjeningPre2025OffentligAfp">
        <div className={styles.hstackRow}>
          <strong>
            <FormattedMessage id="beregning.detaljer.OpptjeningDetaljer.pre2025OffentligAfp.table.title" />
          </strong>
        </div>
        {afpDetaljForValgtUttak.opptjeningPre2025OffentligAfp.map(
          (detalj, detaljIndex) => (
            <Fragment key={detaljIndex}>
              <HStack justify="space-between" className={styles.hstackRow}>
                <dt style={{ marginRight: '1rem' }}>{`${detalj.tekst}:`}</dt>
                <dd>{detalj.verdi}</dd>
              </HStack>
            </Fragment>
          )
        )}
      </dl>
    )
  }

  return sections
}
