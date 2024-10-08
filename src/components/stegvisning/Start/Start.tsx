import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom'

import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Alert, BodyLong, Button, Heading, Link } from '@navikt/ds-react'

import FridaPortrett from '../../../assets/frida.svg'
import { Card } from '@/components/common/Card'
import { paths } from '@/router/constants'
import { useGetEndringFeatureToggleQuery } from '@/state/api/apiSlice'
import { logOpenLink, wrapLogger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './Start.module.scss'

interface Props {
  shouldRedirectTo?: string
  navn: string
  loependeVedtak?: LoependeVedtak
  onCancel?: () => void
  onNext: () => void
}

export function Start({
  shouldRedirectTo,
  navn,
  loependeVedtak,
  onCancel,
  onNext,
}: Props) {
  const intl = useIntl()
  const navigate = useNavigate()
  const navnString = navn !== '' ? ` ${navn}!` : '!'

  const { data: endringFeatureToggle } = useGetEndringFeatureToggleQuery()

  React.useEffect(() => {
    if (shouldRedirectTo) {
      navigate(shouldRedirectTo)
    }
  }, [shouldRedirectTo])

  const isEndring = React.useMemo(() => {
    return (
      loependeVedtak?.alderspensjon?.loepende ||
      loependeVedtak?.afpPrivat?.loepende ||
      loependeVedtak?.afpOffentlig?.loepende
    )
  }, [loependeVedtak])

  if (shouldRedirectTo) {
    return null
  }

  return (
    <>
      {isEndring && (
        <Alert className={styles.alert} variant="warning" aria-live="polite">
          <FormattedMessage
            id="stegvisning.endring.alert"
            values={{ ...getFormatMessageValues(intl) }}
          />
        </Alert>
      )}
      <Card hasLargePadding hasMargin>
        <div className={styles.wrapper}>
          <img className={styles.image} src={FridaPortrett} alt="" />
          <div className={styles.wrapperText}>
            <Heading level="2" size="medium" spacing>
              {`${intl.formatMessage({
                id: 'stegvisning.start.title',
              })}${navnString}`}
            </Heading>

            {isEndring ? (
              <>
                <BodyLong size="large">
                  <FormattedMessage
                    id="stegvisning.start.endring.ingress"
                    values={{
                      ...getFormatMessageValues(intl),
                      grad: loependeVedtak.alderspensjon?.grad,
                      ufoeretrygd: loependeVedtak.ufoeretrygd.grad
                        ? intl.formatMessage(
                            {
                              id: 'stegvisning.start.endring.ufoeretrygd',
                            },
                            {
                              ...getFormatMessageValues(intl),
                              grad: loependeVedtak.ufoeretrygd.grad,
                            }
                          )
                        : undefined,
                      afpPrivat: loependeVedtak.afpPrivat.grad
                        ? intl.formatMessage(
                            {
                              id: 'stegvisning.start.endring.afp.privat',
                            },
                            { ...getFormatMessageValues(intl) }
                          )
                        : undefined,
                      afpOffentlig: loependeVedtak.afpOffentlig.grad
                        ? intl.formatMessage(
                            {
                              id: 'stegvisning.start.endring.afp.offentlig',
                            },
                            { ...getFormatMessageValues(intl) }
                          )
                        : undefined,
                    }}
                  />
                </BodyLong>
                <BodyLong size="medium">
                  <FormattedMessage id="stegvisning.start.endring.ingress_2" />
                </BodyLong>
              </>
            ) : (
              <>
                <BodyLong size="large">
                  <FormattedMessage id="stegvisning.start.ingress" />
                </BodyLong>
                <ul className={styles.list}>
                  <li>
                    <BodyLong size="large">
                      <span
                        className={`${styles.ellipse} ${styles.ellipse__blue}`}
                      ></span>
                      <FormattedMessage id="stegvisning.start.list_item1" />
                    </BodyLong>
                  </li>
                  <li>
                    <BodyLong size="large">
                      <span
                        className={`${styles.ellipse} ${styles.ellipse__purple}`}
                      ></span>
                      <FormattedMessage id="stegvisning.start.list_item2" />{' '}
                    </BodyLong>
                  </li>
                  <li>
                    <BodyLong size="large">
                      <span
                        className={`${styles.ellipse} ${styles.ellipse__green}`}
                      ></span>
                      <FormattedMessage id="stegvisning.start.list_item3" />{' '}
                    </BodyLong>
                  </li>
                </ul>
                <BodyLong size="large">
                  <FormattedMessage id="stegvisning.start.ingress_2" />
                </BodyLong>
              </>
            )}

            {(!isEndring || (isEndring && endringFeatureToggle?.enabled)) && (
              <Button
                type="submit"
                className={styles.button}
                onClick={wrapLogger('button klikk', {
                  tekst: 'Kom i gang',
                })(onNext)}
              >
                <FormattedMessage id="stegvisning.start.button" />
              </Button>
            )}
            {onCancel && (
              <Button
                type="button"
                variant="tertiary"
                onClick={wrapLogger('button klikk', { tekst: 'Avbryt' })(
                  onCancel
                )}
              >
                <FormattedMessage id="stegvisning.avbryt" />
              </Button>
            )}
          </div>
        </div>
        <Link
          onClick={logOpenLink}
          className={styles.link}
          as={ReactRouterLink}
          to={paths.personopplysninger}
          target="_blank"
          inlineText
        >
          <FormattedMessage id="stegvisning.start.link" />
          <ExternalLinkIcon
            title={intl.formatMessage({
              id: 'application.global.external_link',
            })}
            width="1.25rem"
            height="1.25rem"
          />
        </Link>
      </Card>
    </>
  )
}
