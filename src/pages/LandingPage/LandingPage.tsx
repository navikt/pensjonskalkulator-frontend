import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import {
  BodyLong,
  Button,
  Heading,
  HStack,
  Loader,
  VStack,
} from '@navikt/ds-react'

import { Card } from '@/components/common/Card'
import { HOST_BASEURL } from '@/paths'
import { externalUrls } from '@/router'
import useRequest from '@/utils/useRequest'

export function LandingPage() {
  const intl = useIntl()
  const { isLoading, status } = useRequest<null>(
    `${HOST_BASEURL}/oauth2/session`
  )
  const navigate = useNavigate()

  const isLoggedIn = React.useMemo(
    () => !isLoading && status === 200,
    [isLoading, status]
  )

  if (isLoading) {
    return <Loader />
  }

  const gaaTilDetaljertKalkulator = () => {
    window.open(externalUrls.detaljertKalkulator, '_self')
  }

  return (
    <Card hasNoPadding>
      <VStack gap="4">
        <section>
          <VStack gap="2">
            <Heading size="medium" level="2">
              {intl.formatMessage({
                id: 'landingsside.for.deg.foedt.foer.1963',
              })}
            </Heading>
            <BodyLong>
              {intl.formatMessage({
                id: 'landingsside.du.maa.bruke.detaljert',
              })}
            </BodyLong>
            <div>
              <Button
                data-testid="landingside-detaljert-kalkulator-button"
                variant="secondary"
                onClick={gaaTilDetaljertKalkulator}
              >
                {isLoggedIn
                  ? intl.formatMessage({
                      id: 'landingsside.button.detaljert-kalkulator',
                    })
                  : intl.formatMessage({
                      id: 'landingsside.button.detaljert-kalkulator-utlogget',
                    })}
              </Button>
            </div>
          </VStack>
        </section>

        <section>
          <VStack gap="2">
            <Heading size="medium" level="2">
              {intl.formatMessage({
                id: 'landingsside.for.deg.foedt.etter.1963',
              })}
            </Heading>
            <BodyLong>
              {intl.formatMessage({
                id: 'landingsside.velge-mellom-detaljert-og-enkel',
              })}
            </BodyLong>
            <ul>
              <li>
                {intl.formatMessage({
                  id: 'landingsside.liste.1',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'landingsside.liste.2',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'landingsside.liste.3',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'landingsside.liste.4',
                })}
              </li>
            </ul>
            <HStack gap="2">
              <Button variant="secondary" onClick={gaaTilDetaljertKalkulator}>
                {isLoggedIn
                  ? intl.formatMessage({
                      id: 'landingsside.button.detaljert-kalkulator',
                    })
                  : intl.formatMessage({
                      id: 'landingsside.button.detaljert-kalkulator-utlogget',
                    })}
              </Button>
              <Button
                data-testid="landingside-enkel-kalkulator-button"
                variant="secondary"
                /* c8 ignore next 1 */
                onClick={() => navigate('/start')}
              >
                {isLoggedIn
                  ? intl.formatMessage({
                      id: 'landingsside.button.enkel-kalkulator',
                    })
                  : intl.formatMessage({
                      id: 'landingsside.button.enkel-kalkulator-utlogget',
                    })}
              </Button>
            </HStack>
          </VStack>
        </section>

        {!isLoggedIn && (
          <section>
            <VStack gap="2">
              <Heading
                data-testid="uinlogget-kalkulator"
                size="medium"
                level="2"
              >
                {intl.formatMessage({
                  id: 'landingsside.heading.uinnlogget-kalkulator',
                })}
              </Heading>
              <BodyLong>
                {intl.formatMessage({
                  id: 'landingsside.body.uinnlogget-kalkulator',
                })}
              </BodyLong>
            </VStack>
          </section>
        )}
        <a href="">
          {intl.formatMessage({
            id: 'landingsside.link.personopplysninger',
          })}
        </a>
      </VStack>
    </Card>
  )
}
