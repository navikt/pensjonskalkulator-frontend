import React from 'react'

import { Button } from '@navikt/ds-react'

interface IRedirectDelbButtonProps {
  fnr: string
}
export const RedirectDelbButton: React.FC<IRedirectDelbButtonProps> = ({
  fnr,
}) => {
  const formRef = React.useRef<HTMLFormElement>(null)

  return (
    <div>
      <form
        ref={formRef}
        action="/pensjon/kalkulator/redirect/detaljert-kalkulator"
        method="POST"
      >
        <input type="hidden" name="fnr" value={fnr} />
        <Button size="small" variant="secondary-neutral" type="submit">
          Gå til Del B
        </Button>
      </form>
    </div>
  )
}
