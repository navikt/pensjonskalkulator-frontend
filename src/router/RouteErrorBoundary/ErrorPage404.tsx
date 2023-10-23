import { FormattedMessage } from 'react-intl'
import { Link as ReactRouterLink } from 'react-router-dom'

import { BodyLong, Link, List, VStack } from '@navikt/ds-react'

import { Card } from '@/components/common/Card'
import { FrameComponent } from '@/components/common/PageFramework'
import { externalUrls, paths } from '@/router'

export function ErrorPage404() {
  return (
    <FrameComponent>
      <Card data-testid="error-page-404" hasLargePadding>
        <Card.Content
          text={{
            header: 'error.404.title',
          }}
        >
          <>
            <List>
              <List.Item>
                <BodyLong>
                  <FormattedMessage id="error.404.list_item1" />
                </BodyLong>
              </List.Item>
              <List.Item>
                <BodyLong>
                  <FormattedMessage id="error.404.list_item2" />
                </BodyLong>
              </List.Item>
            </List>
            <VStack gap="4">
              <Link as={ReactRouterLink} to={paths.login}>
                <FormattedMessage id="error.404.button.link_1" />
              </Link>
              <Link href={externalUrls.dinPensjon}>
                <FormattedMessage id="error.404.button.link_2" />
              </Link>
            </VStack>
          </>
        </Card.Content>
      </Card>
    </FrameComponent>
  )
}
