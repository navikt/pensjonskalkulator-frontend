import React from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import { Card } from '../../components/common/Card'
import { externalUrls, paths, henvisningUrlParams } from '@/router/constants'
import { apiSlice } from '@/state/api/apiSlice'
import { useAppDispatch } from '@/state/hooks'
import { wrapLogger } from '@/utils/logging'

const gaaTilDetaljertKalkulator = () => {
  window.open(externalUrls.detaljertKalkulator, '_self')
}

export const Henvisning: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const intl = useIntl()

  const { id } = useParams()

  const [ingress, setIngress] = React.useState<string>('')

  React.useEffect(() => {
    switch (id) {
      case henvisningUrlParams.foedselsdato:
        document.title = intl.formatMessage({
          id: 'application.title.henvisning.foedselsdato',
        })
        setIngress('henvisning.foedselsdato.body')
        break
      case henvisningUrlParams.ufoeretrygd:
        document.title = intl.formatMessage({
          id: 'application.title.henvisning.ufoeretrygd',
        })
        setIngress('henvisning.ufoeretrygd.body')
        break
      case henvisningUrlParams.gjenlevende:
        document.title = intl.formatMessage({
          id: 'application.title.henvisning.gjenlevende',
        })
        setIngress('henvisning.gjenlevende.body')
        break
      case henvisningUrlParams.apotekerne:
        document.title = intl.formatMessage({
          id: 'application.title.henvisning.apotekerne',
        })
        setIngress('henvisning.apotekerne.body')
        break
      case henvisningUrlParams.utland:
        document.title = intl.formatMessage({
          id: 'application.title.henvisning.utland',
        })
        setIngress('henvisning.utland.body')
        break
      default:
        setIngress('')
    }
  }, [id])

  const onAvbryt = (): void => {
    dispatch(apiSlice.util.resetApiState())
    navigate(paths.login)
  }

  return (
    <Card data-testid="henvisning" aria-live="polite" hasLargePadding hasMargin>
      <Card.Content
        text={{
          header: 'error.du_kan_ikke_bruke_enkel_kalkulator',
          ingress,
          primaryButton: 'henvisning.detaljert_kalkulator',
          secondaryButton: 'stegvisning.avbryt',
        }}
        onPrimaryButtonClick={wrapLogger('button klikk', { tekst: 'Tilbake' })(
          gaaTilDetaljertKalkulator
        )}
        onSecondaryButtonClick={wrapLogger('button klikk', { tekst: 'Avbryt' })(
          onAvbryt
        )}
      />
    </Card>
  )
}
