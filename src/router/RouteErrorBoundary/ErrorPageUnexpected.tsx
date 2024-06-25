import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/common/Card'
import { FrameComponent } from '@/components/common/PageFramework'
import { onStegvisningCancel } from '@/components/stegvisning/stegvisning-utils'
import { useAppDispatch } from '@/state/hooks'
import { logger } from '@/utils/logging'

export function ErrorPageUnexpected() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onCancel = (): void => {
    onStegvisningCancel(dispatch, navigate)
  }

  React.useEffect(() => {
    logger('feilside', {
      feil: 'Uventet feil',
    })
    window.scrollTo(0, 0)
  })

  return (
    <FrameComponent>
      <Card data-testid="error-page-unexpected" hasLargePadding>
        <Card.Content
          text={{
            header: 'error.global.title',
            ingress: 'error.global.ingress',
            primaryButton: 'error.global.button',
          }}
          onPrimaryButtonClick={onCancel}
        />
      </Card>
    </FrameComponent>
  )
}
