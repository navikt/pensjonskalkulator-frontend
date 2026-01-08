import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { LocalAlert } from '@navikt/ds-react'

interface Props {
  personError: FetchBaseQueryError | SerializedError | undefined
}

export const VeilederInputRequestError = ({ personError }: Props) => {
  if (!personError) return null

  if ('status' in personError) {
    switch (personError.status) {
      case 403:
        return (
          <LocalAlert status="warning" data-testid="alert-ikke-tilgang">
            <LocalAlert.Content>
              Du har ikke tilgang til brukeren eller pensjonskalkulatoren. Hvis
              du mener du skal ha tilgang, kontakt din lokale IT-ansvarlig.
            </LocalAlert.Content>
          </LocalAlert>
        )
      case 404:
        return (
          <LocalAlert status="warning" data-testid="alert-ikke-gyldig">
            <LocalAlert.Content>
              Fødselsnummeret er ikke gyldig.
            </LocalAlert.Content>
          </LocalAlert>
        )
      default:
        return (
          <LocalAlert status="warning" data-testid="alert-annet">
            <LocalAlert.Content>Feil ved henting av person.</LocalAlert.Content>
          </LocalAlert>
        )
    }
  } else {
    return (
      <LocalAlert status="warning" data-testid="alert-annet">
        <LocalAlert.Content>Feil ved henting av person.</LocalAlert.Content>
      </LocalAlert>
    )
  }
}
