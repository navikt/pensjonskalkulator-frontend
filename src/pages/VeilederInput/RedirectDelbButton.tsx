import { Button } from '@navikt/ds-react'
import React from 'react'

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
      </form>
      <Button size="small" type="submit">
        Gå til Del B
      </Button>
    </div>
  )
}
