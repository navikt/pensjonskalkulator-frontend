import React from 'react'

import { Alert, Link } from '@navikt/ds-react'

interface IAlertDelBProps {
  fnr: string
}
export const AlertDelB: React.FC<IAlertDelBProps> = ({ fnr }) => {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [showAlert, setShowAlert] = React.useState(true)

  const submit = () => {
    formRef.current?.submit()
  }

  if (!showAlert) {
    return null
  }

  return (
    <>
      <form
        ref={formRef}
        action="/pensjon/kalkulator/redirect/detaljert-kalkulator"
        method="POST"
      >
        <input type="hidden" name="fnr" value={fnr} />
        <Alert
          variant="warning"
          onClose={() => setShowAlert(false)}
          closeButton
          fullWidth
        >
          Bruker er født før 1963. For å beregne AFP i offentlig sektor, lagre
          beregninger og se flere detaljer, gå til{' '}
          <Link href="#" onClick={submit}>
            detaljert pensjonskalkulator (Del B)
          </Link>
          .
        </Alert>
      </form>
    </>
  )
}
