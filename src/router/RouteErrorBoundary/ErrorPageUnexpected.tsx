import React from 'react'
import { isRouteErrorResponse } from 'react-router'

import { Card } from '@/components/common/Card'
import { FrameComponent } from '@/components/common/PageFramework'
import { useStegvisningNavigation } from '@/components/stegvisning/stegvisning-hooks'
import { paths } from '@/router/constants'
import { logger } from '@/utils/logging'

export interface ErrorPageUnexpectedProps {
  error?: unknown
}

export const ErrorPageUnexpected: React.FC<ErrorPageUnexpectedProps> = ({
  error,
}) => {
  const [{ onStegvisningCancel }] = useStegvisningNavigation(paths.uventetFeil)

  React.useEffect(() => {
    let errorData = 'fra RouteErrorBoundary'

    if (error) {
      if (isRouteErrorResponse(error)) {
        errorData = `Route Error ${error.status}: ${error.statusText || 'Unknown route error'}`
      } else if (error instanceof Error) {
        errorData = `Unexpected Error: ${error.message}`
      } else {
        try {
          errorData = `Unknown Error: ${JSON.stringify(error)}`
        } catch {
          errorData = `Unknown Error: ${typeof error}`
        }
      }
    }

    logger('info', {
      tekst: 'Redirect til /uventet-feil',
      data: errorData,
    })
    window.scrollTo(0, 0)
  }, [error])

  return (
    <FrameComponent>
      <Card data-testid="error-page-unexpected" hasLargePadding>
        <Card.Content
          text={{
            header: 'error.global.title',
            ingress: 'error.global.ingress',
            primaryButton: 'error.global.button',
          }}
          onPrimaryButtonClick={onStegvisningCancel}
        />
      </Card>
    </FrameComponent>
  )
}
