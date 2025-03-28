import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { BodyLong, Link } from '@navikt/ds-react'

import { GrunnlagSection } from '../GrunnlagSection'
import { AccordionItem } from '@/components/common/AccordionItem'
import { useGetGradertUfoereAfpFeatureToggleQuery } from '@/state/api/apiSlice'
import { useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectIsEndring,
  selectUfoeregrad,
  selectFoedselsdato,
  selectLoependeVedtak,
  selectSamtykkeOffentligAFP,
} from '@/state/userInput/selectors'
import { formatAfp } from '@/utils/afp'
import {
  AFP_UFOERE_OPPSIGELSESALDER,
  isFoedselsdatoOverAlder,
} from '@/utils/alder'
import { getFormatMessageValues } from '@/utils/translations'

interface Props {
  goToAFP: React.MouseEventHandler<HTMLAnchorElement>
  goToAvansert: React.MouseEventHandler<HTMLAnchorElement>
  goToStart: React.MouseEventHandler<HTMLAnchorElement>
}

export const GrunnlagAFP: React.FC<Props> = ({
  goToAFP,
  goToAvansert,
  goToStart,
}) => {
  const intl = useIntl()

  const afp = useAppSelector(selectAfp)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const harSamtykketOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const isEndring = useAppSelector(selectIsEndring)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const ufoeregrad = useAppSelector(selectUfoeregrad)

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

  const formatertAfpHeader = React.useMemo(() => {
    const afpString = formatAfp(intl, afp ?? 'vet_ikke')

    if (isEndring && loependeVedtak.afpPrivat) {
      return `${formatAfp(intl, 'ja_privat')} (${intl.formatMessage({ id: 'grunnlag.afp.endring' })})`
    }

    if (loependeVedtak.afpOffentlig) {
      return `${formatAfp(intl, 'ja_offentlig')} (${intl.formatMessage({ id: 'grunnlag.afp.endring' })})`
    }

    if (ufoeregrad && (afp === 'ja_offentlig' || afp === 'ja_privat')) {
      return `${afpString} (${intl.formatMessage({ id: 'grunnlag.afp.ikke_beregnet' })})`
    }

    if (!harSamtykketOffentligAFP && !ufoeregrad && afp === 'ja_offentlig') {
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

    const afpString =
      afp === 'ja_offentlig' && !harSamtykketOffentligAFP && !ufoeregrad
        ? 'ja_offentlig_utilgjengelig'
        : afp
    const ufoeregradString = ufoeregrad ? '.ufoeretrygd' : ''

    // TODO: Remove this once when feature toggle is enabled in production.
    if (!isGradertUfoereAfpToggleEnabled) {
      return `grunnlag.afp.ingress.${afpString}${ufoeregradString}.gammel`
    }
    return `grunnlag.afp.ingress.${afpString}${ufoeregradString}`
  }, [afp])

  return (
    <AccordionItem name="Grunnlag: AFP">
      <GrunnlagSection
        headerTitle={intl.formatMessage({
          id: 'grunnlag.afp.title',
        })}
        headerValue={formatertAfpHeader}
      >
        <BodyLong>
          <FormattedMessage
            id={formatertAfpIngress}
            values={{
              ...getFormatMessageValues(),
            }}
          />
          {!isEndring && !ufoeregrad && afp === 'nei' && (
            <>
              <Link href="#" onClick={goToStart}>
                <FormattedMessage id="grunnlag.afp.reset_link" />
              </Link>
              .
            </>
          )}
          {isGradertUfoereAfpToggleEnabled && (
            <>
              {(afp === 'ja_offentlig' || afp === 'ja_privat') && !!ufoeregrad && (
                  <>
                    <Link href="#" onClick={goToAvansert}>
                      <FormattedMessage id="grunnlag.afp.avansert_link" />
                    </Link>
                    <FormattedMessage id="grunnlag.afp.avansert_link_postfix" />
                  </>
                )}

              {afp === 'ja_offentlig' &&
                !harSamtykketOffentligAFP &&
                !ufoeregrad && (
                  <>
                    <Link href="#" onClick={goToAFP}>
                      <FormattedMessage id="grunnlag.afp.afp_link" />
                    </Link>
                    .
                  </>
                )}
            </>
          )}
        </BodyLong>
      </GrunnlagSection>
    </AccordionItem>
  )
}
