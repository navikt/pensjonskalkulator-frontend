import clsx from 'clsx'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import {
  Alert,
  BodyLong,
  Heading,
  HeadingProps,
  Table,
  VStack,
} from '@navikt/ds-react'

import { Divider } from '@/components/common/Divider'
import { Loader } from '@/components/common/Loader'
import { useAppSelector } from '@/state/hooks'
import { selectAfp } from '@/state/userInput/selectors'
import {
  formaterLivsvarigString,
  formaterSluttAlderString,
} from '@/utils/alder'
import { formatInntekt } from '@/utils/inntekt'
import { ALERT_VIST } from '@/utils/loggerConstants'
import { logger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'
import { useIsMobile } from '@/utils/useIsMobile'

import { useOffentligTjenestePensjonAlertList } from '../hooks'
import {
  formatLeverandoerList,
  getInfoOmAfpOgBetingetTjenestepensjon,
  getLeverandoerHeading,
} from './utils'

import styles from './OffentligTjenestepensjon.module.scss'

export const OffentligTjenestepensjon = (props: {
  isLoading: boolean
  isError: boolean
  offentligTp?: OffentligTp
  headingLevel: HeadingProps['level']
}) => {
  const { isLoading, isError, offentligTp, headingLevel } = props
  const { tpLeverandoer, tpNummer } = offentligTp?.simulertTjenestepensjon || {}
  const intl = useIntl()
  const isMobile = useIsMobile()
  const afp = useAppSelector(selectAfp)
  const loggedStatusesRef = React.useRef<Set<string>>(new Set())
  //const isErrorLogRef = React.useRef(false)
  const alerts = useOffentligTjenestePensjonAlertList({ isError, offentligTp })

  if (isLoading) {
    return (
      <Loader
        data-testid="offentligtp-loader"
        size="3xlarge"
        title={intl.formatMessage({
          id: 'beregning.loading',
        })}
      />
    )
  }

  const showResults =
    offentligTp?.simuleringsresultatStatus === 'OK' && tpNummer !== undefined

  return (
    <VStack gap="3">
      <Divider smallMargin />
      <Heading id="tpo-heading" level={headingLevel} size="small">
        {intl.formatMessage({ id: 'pensjonsavtaler.offentligtp.title' })}
      </Heading>

      {alerts &&
        alerts.map((alert, index) => {
          if (!loggedStatusesRef.current.has(alert.status)) {
            logger(ALERT_VIST, {
              tekst: alert.logTekst,
              variant: 'warning',
            })
            loggedStatusesRef.current.add(alert.status)
          }

          const leverandoerList = offentligTp?.muligeTpLeverandoerListe
          const chunk =
            alert.hasLeverandoerList && leverandoerList
              ? formatLeverandoerList(intl.locale, leverandoerList)
              : undefined

          return (
            <Alert
              key={`offentligtp-alert-${index}`}
              inline
              variant={alert.variant}
              data-testid={alert.testId}
            >
              <FormattedMessage
                id={alert.alertTextId}
                values={chunk ? { chunk } : undefined}
              />
            </Alert>
          )
        })}

      {showResults && (
        <>
          {isMobile ? (
            <>
              <Heading id="tpo-subheading" level={headingLevel} size="xsmall" data-testid={`tpo-subheading-${tpLeverandoer}`}>
                {getLeverandoerHeading(intl, tpNummer, tpLeverandoer)}
              </Heading>
              <table
                className={styles.mobileTable}
                data-testid="offentlig-tjenestepensjon-mobile"
              >
                <tbody>
                  {offentligTp.simulertTjenestepensjon?.simuleringsresultat.utbetalingsperioder.map(
                    (utbetalingsperiode: UtbetalingsperiodeOffentligTP) => (
                      <tr key={`${JSON.stringify(utbetalingsperiode)}-mobile`}>
                        <th
                          style={{ fontWeight: 'normal' }}
                          scope="row"
                          align="left"
                        >
                          {utbetalingsperiode.sluttAlder
                            ? formaterSluttAlderString(
                                intl,
                                utbetalingsperiode.startAlder,
                                utbetalingsperiode.sluttAlder
                              )
                            : formaterLivsvarigString(
                                intl,
                                utbetalingsperiode.startAlder
                              )}
                        </th>
                        <td align="right" className={styles.valueCell}>
                          {formatInntekt(utbetalingsperiode.aarligUtbetaling)}{' '}
                          <FormattedMessage id="pensjonsavtaler_mobil.kr_pr_aar" />
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </>
          ) : (
            <Table data-testid="offentlig-tjenestepensjon-desktop">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    <FormattedMessage id="pensjonsavtaler.tabell.title.left" />
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ width: '15em' }}>
                    <FormattedMessage id="pensjonsavtaler.tabell.title.middle" />
                  </Table.HeaderCell>
                  <Table.HeaderCell align="right" style={{ width: '7em' }}>
                    <FormattedMessage id="pensjonsavtaler.tabell.title.right" />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {offentligTp.simulertTjenestepensjon?.simuleringsresultat.utbetalingsperioder.map(
                  (
                    utbetalingsperiode: UtbetalingsperiodeOffentligTP,
                    i,
                    utbetalingsperioder
                  ) => {
                    const dataCellClassName = clsx({
                      [styles.desktopTableRader__noBottomBorder]:
                        utbetalingsperioder.length - 1 > i,
                    })
                    return (
                      <Table.Row
                        shadeOnHover={false}
                        key={`${JSON.stringify(utbetalingsperiode)}-row`}
                      >
                        {i === 0 && (
                          <Table.HeaderCell
                            scope="row"
                            className={styles.desktopTableRader__alignTop}
                            rowSpan={utbetalingsperioder.length}
                          >
                            {getLeverandoerHeading(
                              intl,
                              tpNummer,
                              tpLeverandoer
                            )}
                          </Table.HeaderCell>
                        )}
                        <Table.DataCell className={dataCellClassName}>
                          {utbetalingsperiode.sluttAlder
                            ? formaterSluttAlderString(
                                intl,
                                utbetalingsperiode.startAlder,
                                utbetalingsperiode.sluttAlder
                              )
                            : formaterLivsvarigString(
                                intl,
                                utbetalingsperiode.startAlder
                              )}
                        </Table.DataCell>
                        <Table.DataCell
                          align="right"
                          className={dataCellClassName}
                        >
                          {`${formatInntekt(utbetalingsperiode.aarligUtbetaling)} kr`}
                        </Table.DataCell>
                      </Table.Row>
                    )
                  }
                )}
              </Table.Body>
            </Table>
          )}
          <BodyLong size="small">
            <FormattedMessage
              id={getInfoOmAfpOgBetingetTjenestepensjon(
                tpNummer,
                afp,
                offentligTp.simulertTjenestepensjon?.simuleringsresultat
                  .betingetTjenestepensjonErInkludert
              )}
              values={getFormatMessageValues()}
            />
          </BodyLong>
        </>
      )}
    </VStack>
  )
}
