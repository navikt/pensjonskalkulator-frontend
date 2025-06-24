import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import { BodyLong, Heading, Link, VStack } from '@navikt/ds-react'

import { BeregningContext } from '@/pages/Beregning/context'
import { paths } from '@/router/constants'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectAfpUtregningValg,
  selectCurrentSimulation,
  selectFoedselsdato,
  selectIsEndring,
  selectLoependeVedtak,
  selectSamtykkeOffentligAFP,
  selectSkalBeregneAfpKap19,
  selectUfoeregrad,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { formatAfp } from '@/utils/afp'
import {
  AFP_UFOERE_OPPSIGELSESALDER,
  isFoedselsdatoOverAlder,
  isFoedtFoer1963,
} from '@/utils/alder'
import { logger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

export const GrunnlagAFP: React.FC = () => {
  const intl = useIntl()

  const afp = useAppSelector(selectAfp) ?? 'vet_ikke' // Vi har fallback for å unngå "missing translation" error ved flush() i GoToStart
  const skalBeregneAfpKap19 = useAppSelector(selectSkalBeregneAfpKap19)
  const afpUtregningValg = useAppSelector(selectAfpUtregningValg)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const samtykkeOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const isEndring = useAppSelector(selectIsEndring)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const { beregningsvalg } = useAppSelector(selectCurrentSimulation)

  const hasAFP = afp === 'ja_offentlig' || afp === 'ja_privat'
  const hasOffentligAFP = afp === 'ja_offentlig'
  const isUfoerAndDontWantAfp = !!ufoeregrad && beregningsvalg !== 'med_afp'

  const formatertAfpHeader = React.useMemo(() => {
    const afpString = formatAfp(intl, afp ?? 'vet_ikke')

    if (afpUtregningValg === 'KUN_ALDERSPENSJON') {
      return formatAfp(intl, 'nei')
    }

    if (
      loependeVedtak &&
      loependeVedtak.pre2025OffentligAfp &&
      foedselsdato &&
      isFoedtFoer1963(foedselsdato)
    ) {
      return formatAfp(intl, 'ja_offentlig')
    }

    if (isEndring && loependeVedtak.afpPrivat) {
      return `${formatAfp(intl, 'ja_privat')} (${intl.formatMessage({ id: 'grunnlag.afp.endring' })})`
    }

    if (loependeVedtak && loependeVedtak.afpOffentlig) {
      return `${formatAfp(intl, 'ja_offentlig')} (${intl.formatMessage({ id: 'grunnlag.afp.endring' })})`
    }

    if (
      !skalBeregneAfpKap19 &&
      ((hasAFP && isUfoerAndDontWantAfp) ||
        (hasOffentligAFP && !samtykkeOffentligAFP && !isUfoerAndDontWantAfp))
    ) {
      return `${afpString} (${intl.formatMessage({ id: 'grunnlag.afp.ikke_beregnet' })})`
    }

    if (
      ufoeregrad === 100 ||
      (ufoeregrad > 0 && foedselsdato && isFoedtFoer1963(foedselsdato)) ||
      (ufoeregrad > 0 &&
        foedselsdato &&
        !isFoedtFoer1963(foedselsdato) &&
        isFoedselsdatoOverAlder(foedselsdato, AFP_UFOERE_OPPSIGELSESALDER))
    ) {
      return formatAfp(intl, 'nei')
    }

    return afpString
  }, [
    afp,
    hasAFP,
    hasOffentligAFP,
    samtykkeOffentligAFP,
    isEndring,
    isUfoerAndDontWantAfp,
    intl,
    loependeVedtak,
    ufoeregrad,
  ])

  const formatertAfpIngress = React.useMemo(() => {
    if (isEndring && loependeVedtak.afpPrivat) {
      return 'grunnlag.afp.ingress.ja_privat.endring'
    }

    if (afpUtregningValg === 'KUN_ALDERSPENSJON') {
      return 'grunnlag.afp.ingress.nei'
    }

    if (
      loependeVedtak &&
      loependeVedtak.pre2025OffentligAfp &&
      foedselsdato &&
      isFoedtFoer1963(foedselsdato)
    ) {
      return 'grunnlag.afp.ingress.overgangskull'
    }

    if (loependeVedtak && loependeVedtak.afpOffentlig) {
      return 'grunnlag.afp.ingress.ja_offentlig.endring'
    }

    if (ufoeregrad === 100 && foedselsdato && !isFoedtFoer1963(foedselsdato)) {
      return 'grunnlag.afp.ingress.ufoeretrygd'
    }

    if (
      ufoeregrad > 0 &&
      foedselsdato &&
      !isFoedtFoer1963(foedselsdato) &&
      isFoedselsdatoOverAlder(foedselsdato, AFP_UFOERE_OPPSIGELSESALDER)
    ) {
      return 'grunnlag.afp.ingress.ufoeretrygd'
    }

    if (ufoeregrad > 0 && foedselsdato && isFoedtFoer1963(foedselsdato)) {
      return 'grunnlag.afp.ingress.overgangskull.ufoeretrygd'
    }

    if (afp === 'nei') {
      return 'grunnlag.afp.ingress.nei'
    }

    if (
      afp === 'ja_privat' &&
      loependeVedtak &&
      loependeVedtak.alderspensjon &&
      foedselsdato &&
      isFoedtFoer1963(foedselsdato)
    ) {
      return 'grunnlag.afp.ingress.ja_privat'
    }

    if (
      loependeVedtak &&
      loependeVedtak.alderspensjon &&
      foedselsdato &&
      isFoedtFoer1963(foedselsdato)
    ) {
      return 'grunnlag.afp.ingress.nei'
    }

    if (hasOffentligAFP && samtykkeOffentligAFP === false) {
      return 'grunnlag.afp.ingress.ja_offentlig_utilgjengelig'
    }

    const ufoeregradString = isUfoerAndDontWantAfp ? '.ufoeretrygd' : ''

    return `grunnlag.afp.ingress.${afp}${ufoeregradString}`
  }, [
    afp,
    hasOffentligAFP,
    samtykkeOffentligAFP,
    isEndring,
    isUfoerAndDontWantAfp,
    loependeVedtak,
    ufoeregrad,
  ])

  return (
    <VStack gap="3">
      <Heading level="3" size="small">
        <FormattedMessage id="beregning.highcharts.serie.afp.name" />:{' '}
        <span style={{ fontWeight: 'normal' }}>{formatertAfpHeader}</span>
      </Heading>
      <BodyLong data-testid={formatertAfpIngress}>
        <FormattedMessage
          id={formatertAfpIngress}
          values={{
            ...getFormatMessageValues(),
            goToAFP: GoToAFP,
            goToAvansert: GoToAvansert,
            goToStart: GoToStart,
          }}
        />
      </BodyLong>
    </VStack>
  )
}

const GoToAFP = (chunks: React.ReactNode) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    logger('button klikk', {
      tekst: 'Grunnlag AFP: Gå til AFP',
    })
    dispatch(userInputActions.flushCurrentSimulation())
    navigate(paths.afp)
  }
  return (
    <Link href="#" onClick={onClick} data-testid="grunnlag.afp.afp_link">
      {chunks}
    </Link>
  )
}
const GoToAvansert = (chunks: React.ReactNode) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { avansertSkjemaModus, setAvansertSkjemaModus } =
    React.useContext(BeregningContext)

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    logger('button klikk', {
      tekst: 'Grunnlag AFP: Gå til avansert',
    })
    if (avansertSkjemaModus === 'resultat') {
      setAvansertSkjemaModus('redigering')
    } else {
      dispatch(userInputActions.flushCurrentSimulation())
      navigate(paths.beregningAvansert)
    }
  }
  return (
    <Link href="#" onClick={onClick} data-testid="grunnlag.afp.avansert_link">
      {chunks}
    </Link>
  )
}
const GoToStart = (chunks: React.ReactNode) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    logger('button klikk', {
      tekst: 'Grunnlag AFP: Gå til start',
    })
    dispatch(userInputActions.flush())
    navigate(paths.start)
  }
  return (
    <Link href="#" onClick={onClick} data-testid="grunnlag.afp.reset_link">
      {chunks}
    </Link>
  )
}
