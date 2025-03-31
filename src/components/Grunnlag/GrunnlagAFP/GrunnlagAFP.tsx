import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import { BodyLong, Link } from '@navikt/ds-react'

import { GrunnlagSection } from '../GrunnlagSection'
import { AccordionItem } from '@/components/common/AccordionItem'
import { BeregningContext } from '@/pages/Beregning/context'
import { paths } from '@/router/constants'
import { useGetGradertUfoereAfpFeatureToggleQuery } from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectIsEndring,
  selectUfoeregrad,
  selectFoedselsdato,
  selectLoependeVedtak,
  selectSamtykkeOffentligAFP,
  selectCurrentSimulation,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { formatAfp } from '@/utils/afp'
import {
  AFP_UFOERE_OPPSIGELSESALDER,
  isFoedselsdatoOverAlder,
} from '@/utils/alder'
import { getFormatMessageValues } from '@/utils/translations'

export const GrunnlagAFP: React.FC = () => {
  const intl = useIntl()

  const afp = useAppSelector(selectAfp)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const samtykkeOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const isEndring = useAppSelector(selectIsEndring)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const { beregningsvalg } = useAppSelector(selectCurrentSimulation)

  const { data: getGradertUfoereAfpFeatureToggle } =
    useGetGradertUfoereAfpFeatureToggleQuery()

  const isGradertUfoereAfpToggleEnabled =
    getGradertUfoereAfpFeatureToggle?.enabled

  if (
    loependeVedtak.ufoeretrygd.grad &&
    foedselsdato &&
    isFoedselsdatoOverAlder(foedselsdato, AFP_UFOERE_OPPSIGELSESALDER)
  ) {
    return null
  }

  const hasAFP = afp === 'ja_offentlig' || afp === 'ja_privat'
  const hasOffentligAFP = afp === 'ja_offentlig'
  const isUfoerAndDontWantAfp = !!ufoeregrad && beregningsvalg !== 'med_afp'

  const formatertAfpHeader = React.useMemo(() => {
    const afpString = formatAfp(intl, afp ?? 'vet_ikke')

    if (isEndring && loependeVedtak.afpPrivat) {
      return `${formatAfp(intl, 'ja_privat')} (${intl.formatMessage({ id: 'grunnlag.afp.endring' })})`
    }

    if (loependeVedtak.afpOffentlig) {
      return `${formatAfp(intl, 'ja_offentlig')} (${intl.formatMessage({ id: 'grunnlag.afp.endring' })})`
    }

    if (
      (hasAFP && isUfoerAndDontWantAfp) ||
      (hasOffentligAFP && !samtykkeOffentligAFP && !isUfoerAndDontWantAfp)
    ) {
      return `${afpString} (${intl.formatMessage({ id: 'grunnlag.afp.ikke_beregnet' })})`
    }

    if (ufoeregrad === 100) {
      return formatAfp(intl, 'nei')
    }

    return afpString
  }, [afp])

  const formatertAfpIngress = React.useMemo(() => {
    if (isEndring && loependeVedtak.afpPrivat) {
      return 'grunnlag.afp.ingress.ja_privat.endring'
    }

    if (loependeVedtak.afpOffentlig) {
      return 'grunnlag.afp.ingress.ja_offentlig.endring'
    }

    if (isEndring && afp === 'nei') {
      return 'grunnlag.afp.ingress.nei.endring'
    }

    if (ufoeregrad === 100) {
      return 'grunnlag.afp.ingress.full_ufoeretrygd'
    }

    if (hasOffentligAFP && samtykkeOffentligAFP === false) {
      return 'grunnlag.afp.ingress.ja_offentlig_utilgjengelig'
    }

    const ufoeregradString = isUfoerAndDontWantAfp ? '.ufoeretrygd' : ''

    // TODO: Remove this once when feature toggle is enabled in production.
    if (!isGradertUfoereAfpToggleEnabled) {
      return `grunnlag.afp.ingress.${afp}${ufoeregradString}.gammel`
    }
    return `grunnlag.afp.ingress.${afp}${ufoeregradString}`
  }, [afp])

  return (
    <AccordionItem name="Grunnlag: AFP">
      <GrunnlagSection
        headerTitle={intl.formatMessage({
          id: 'grunnlag.afp.title',
        })}
        headerValue={formatertAfpHeader}
      >
        <BodyLong data-testid={formatertAfpIngress}>
          <FormattedMessage
            id={formatertAfpIngress}
            values={{
              ...getFormatMessageValues(),
              afpStepEvent: AfpStepEvent,
              avansertStepEvent: AvansertStepEvent,
              startStepEvent: StartStepEvent,
            }}
          />
        </BodyLong>
      </GrunnlagSection>
    </AccordionItem>
  )
}

const AfpStepEvent = (chunks: React.ReactNode) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const goToAFP: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    dispatch(userInputActions.flushCurrentSimulation())
    navigate(paths.afp)
  }
  return (
    <Link href="#" onClick={goToAFP} data-testid="grunnlag.afp.afp_link">
      {chunks}
    </Link>
  )
}
const AvansertStepEvent = (chunks: React.ReactNode) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { avansertSkjemaModus, setAvansertSkjemaModus } =
    React.useContext(BeregningContext)

  const goToAvansert: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    if (avansertSkjemaModus === 'resultat') {
      setAvansertSkjemaModus('redigering')
    } else {
      dispatch(userInputActions.flushCurrentSimulation())
      navigate(paths.beregningAvansert)
    }
  }
  return (
    <Link
      href="#"
      onClick={goToAvansert}
      data-testid="grunnlag.afp.avansert_link"
    >
      {chunks}
    </Link>
  )
}
const StartStepEvent = (chunks: React.ReactNode) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const goToStart: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    dispatch(userInputActions.flush())
    navigate(paths.start)
  }
  return (
    <Link href="#" onClick={goToStart} data-testid="grunnlag.afp.reset_link">
      {chunks}
    </Link>
  )
}
