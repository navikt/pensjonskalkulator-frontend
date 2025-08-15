import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import { Box, HStack, VStack } from '@navikt/ds-react'

import { AfpDetaljerListe, DetaljRad } from '../hooks'

import beregningsdetaljerStyles from '../BeregningsdetaljerForOvergangskull.module.scss'
import styles from './Pensjonsdetaljer.module.scss'

export interface AfpDetaljerProps {
  afpDetaljForValgtUttak: AfpDetaljerListe
}

export const AfpDetaljer: React.FC<AfpDetaljerProps> = ({
  afpDetaljForValgtUttak,
}) => {
  const hasAfpOffentlig = afpDetaljForValgtUttak?.afpOffentlig?.length > 0
  const maxWidthStyle = hasAfpOffentlig ? { maxWidth: '512px' } : undefined

  return (
    <Box data-testid="beregningsdetaljer-for-overgangskull">
      <div
        className={
          beregningsdetaljerStyles.beregningsdetaljerForOvergangskullDesktopOnly
        }
        style={maxWidthStyle}
      >
        <HStack gap="12">{renderAfpDetaljer(afpDetaljForValgtUttak)}</HStack>
      </div>
      <div
        className={
          beregningsdetaljerStyles.beregningsdetaljerForOvergangskullMobileOnly
        }
        style={maxWidthStyle}
      >
        <VStack gap="4 8" width="100%" marginBlock="2 0">
          {renderAfpDetaljer(afpDetaljForValgtUttak)}
        </VStack>
      </div>
    </Box>
  )
}

interface AfpSectionConfig {
  key: string
  data: DetaljRad[]
  titleId?: string
  boldLastItem?: boolean
  allItemsBold?: boolean
  noBorderBottom?: boolean
}

function renderAfpDetailRow(
  detalj: DetaljRad,
  detaljIndex: number,
  config: {
    boldLastItem?: boolean
    allItemsBold?: boolean
    noBorderBottom?: boolean
    totalItems: number
  }
) {
  const isBold =
    config.allItemsBold ||
    (config.boldLastItem && detaljIndex === config.totalItems - 1)

  return (
    <Fragment key={detaljIndex}>
      <HStack
        justify="space-between"
        className={styles.hstackRow}
        style={config.noBorderBottom ? { borderBottom: 'none' } : undefined}
      >
        <dt style={{ marginRight: '1rem' }}>
          {isBold ? <strong>{`${detalj.tekst}:`}</strong> : `${detalj.tekst}:`}
        </dt>
        <dd>{isBold ? <strong>{detalj.verdi}</strong> : detalj.verdi}</dd>
      </HStack>
    </Fragment>
  )
}

function renderAfpSection({
  key,
  data,
  titleId,
  boldLastItem,
  allItemsBold,
  noBorderBottom,
}: AfpSectionConfig) {
  return (
    <dl key={key}>
      {titleId && (
        <div className={styles.hstackRow}>
          <strong>
            <FormattedMessage id={titleId} />
          </strong>
        </div>
      )}
      {data.map((detalj, detaljIndex) =>
        renderAfpDetailRow(detalj, detaljIndex, {
          boldLastItem,
          allItemsBold,
          noBorderBottom,
          totalItems: data.length,
        })
      )}
    </dl>
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
      renderAfpSection({
        key: 'afpPrivat',
        data: afpDetaljForValgtUttak.afpPrivat,
        titleId: 'beregning.detaljer.OpptjeningDetaljer.afpPrivat.table.title',
        boldLastItem: true,
      })
    )
  }

  // AFP Offentlig
  if (afpDetaljForValgtUttak.afpOffentlig?.length > 0) {
    sections.push(
      renderAfpSection({
        key: 'afpOffentlig',
        data: afpDetaljForValgtUttak.afpOffentlig,
        allItemsBold: true,
        noBorderBottom: true,
      })
    )
  }

  // Pre-2025 Offentlig AFP
  if (afpDetaljForValgtUttak.pre2025OffentligAfp?.length > 0) {
    sections.push(
      renderAfpSection({
        key: 'pre2025OffentligAfp',
        data: afpDetaljForValgtUttak.pre2025OffentligAfp,
        titleId: 'beregning.detaljer.grunnpensjon.afp.table.title',
        boldLastItem: true,
      })
    )
  }

  // Pre-2025 Opptjening Details
  if (afpDetaljForValgtUttak.opptjeningPre2025OffentligAfp?.length > 0) {
    sections.push(
      renderAfpSection({
        key: 'opptjeningPre2025OffentligAfp',
        data: afpDetaljForValgtUttak.opptjeningPre2025OffentligAfp,
        titleId:
          'beregning.detaljer.OpptjeningDetaljer.pre2025OffentligAfp.table.title',
      })
    )
  }

  return sections
}
