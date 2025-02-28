import React from 'react'

import { Alert, Button, HStack } from '@navikt/ds-react'

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
        >
          <HStack>
            <div>
              Bruker er født før 1963. Gå til detaljert pensjonskalkulator (Del
              B) for å beregne AFP i offentlig sektor, lagre og se
              beregningsdetaljer.
            </div>
            <Button size="small" variant="secondary-neutral" onClick={submit}>
              Gå til detaljert pensjonskalkulator
            </Button>
          </HStack>
        </Alert>
      </form>
    </>
  )
}
