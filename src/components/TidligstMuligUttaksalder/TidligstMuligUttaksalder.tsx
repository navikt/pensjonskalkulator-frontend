import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import { Alert, BodyLong, Link } from '@navikt/ds-react'
import { PortableText } from '@portabletext/react'

import { ReadMore } from '@/components/common/ReadMore'
import { SanityContext } from '@/context/SanityContext'
import { paths } from '@/router/constants'
import {
  useGetOmstillingsstoenadOgGjenlevendeQuery,
  useGetSanityFeatureToggleQuery,
} from '@/state/api/apiSlice'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import {
  selectNedreAldersgrense,
  selectNormertPensjonsalder,
} from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { formatUttaksalder } from '@/utils/alder'
import { getSanityPortableTextComponents } from '@/utils/sanity'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './TidligstMuligUttaksalder.module.scss'

interface Props {
  tidligstMuligUttak?: Alder
  ufoeregrad?: number
  show1963Text: boolean
}

export const TidligstMuligUttaksalder: React.FC<Props> = ({
  tidligstMuligUttak,
  ufoeregrad,
  show1963Text,
}) => {
  const intl = useIntl()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { readMoreData } = React.useContext(SanityContext)
  const readMore1Hel = readMoreData['om_ufoeretrygd_og_alderspensjon_hel']
  const readMore1Gradert =
    readMoreData['om_ufoeretrygd_og_alderspensjon_gradert']
  const readMore2Optional = readMoreData['om_pensjonsalder_enkelt_optional']
  const readMore2 = readMoreData['om_pensjonsalder_enkelt']

  const { data: sanityFeatureToggle } = useGetSanityFeatureToggleQuery()
  const { data: omstillingsstoenadOgGjenlevende } =
    useGetOmstillingsstoenadOgGjenlevendeQuery()
  const nedreAldersgrense = useAppSelector(selectNedreAldersgrense)
  const normertPensjonsalder = useAppSelector(selectNormertPensjonsalder)
  const formatertNormertPensjonsalder = formatUttaksalder(
    intl,
    normertPensjonsalder
  )

  const goToAvansert: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault()
    dispatch(userInputActions.flushCurrentSimulation())
    navigate(paths.beregningAvansert)
  }

  return (
    <div className={styles.wrapper} data-testid="tidligst-mulig-uttak">
      <div className={styles.wrapperCard} aria-live="polite">
        {!ufoeregrad && !tidligstMuligUttak && (
          <BodyLong size="medium" className={`${styles.ingress}`}>
            <FormattedMessage
              id="tidligstmuliguttak.error"
              values={{
                ...getFormatMessageValues(),
              }}
            />
          </BodyLong>
        )}

        {!!ufoeregrad && (
          <BodyLong size="medium" className={`${styles.ingress}`}>
            <FormattedMessage
              id={
                ufoeregrad === 100
                  ? 'omufoeretrygd.hel.ingress'
                  : 'omufoeretrygd.gradert.ingress'
              }
              values={{
                ...getFormatMessageValues(),
                normertPensjonsalder: formatertNormertPensjonsalder,
                grad: ufoeregrad,
                link: (
                  <Link href="#" onClick={goToAvansert}>
                    <FormattedMessage id="omufoeretrygd.avansert_link" />
                  </Link>
                ),
              }}
            />
          </BodyLong>
        )}

        {tidligstMuligUttak && (
          <>
            <BodyLong size="medium" className={`${styles.ingress}`}>
              <FormattedMessage
                id="tidligstmuliguttak.ingress_1"
                values={{
                  ...getFormatMessageValues(),
                }}
              />
            </BodyLong>
            <BodyLong size="medium" className={styles.highlighted}>
              {formatUttaksalder(intl, tidligstMuligUttak)}.
            </BodyLong>
            <BodyLong size="medium" className={`${styles.ingress}`}>
              <FormattedMessage
                id={`tidligstmuliguttak.${
                  show1963Text ? '1963' : '1964'
                }.ingress_2`}
                values={{
                  ...getFormatMessageValues(),
                }}
              />
            </BodyLong>
          </>
        )}

        {omstillingsstoenadOgGjenlevende?.harLoependeSak && (
          <Alert className={styles.alert} variant="info" aria-live="polite">
            <FormattedMessage
              id="tidligstmuliguttak.info_omstillingsstoenad_og_gjenlevende"
              values={{
                ...getFormatMessageValues(),
                normertPensjonsalder: formatertNormertPensjonsalder,
              }}
            />
          </Alert>
        )}

        {ufoeregrad ? (
          <>
            {sanityFeatureToggle?.enabled &&
            readMore1Hel &&
            readMore1Gradert ? (
              <ReadMore
                data-testid={
                  ufoeregrad === 100 ? readMore1Hel.name : readMore1Gradert.name
                }
                name={
                  ufoeregrad === 100 ? readMore1Hel.name : readMore1Gradert.name
                }
                header={
                  ufoeregrad === 100
                    ? readMore1Hel.overskrift
                    : readMore1Gradert.overskrift
                }
                className={styles.readmore}
              >
                <PortableText
                  value={
                    ufoeregrad === 100
                      ? readMore1Hel.innhold
                      : readMore1Gradert.innhold
                  }
                  components={getSanityPortableTextComponents(intl)}
                />
              </ReadMore>
            ) : (
              <ReadMore
                name="Om ufoeretrygd og alderspensjon"
                className={styles.readmore}
                header={<FormattedMessage id="omufoeretrygd.readmore.title" />}
              >
                <FormattedMessage
                  id={
                    ufoeregrad === 100
                      ? 'omufoeretrygd.readmore.hel.ingress'
                      : 'omufoeretrygd.readmore.gradert.ingress'
                  }
                  values={{
                    ...getFormatMessageValues(),
                    nedreAldersgrense: formatUttaksalder(
                      intl,
                      nedreAldersgrense
                    ),
                    normertPensjonsalder: formatertNormertPensjonsalder,
                  }}
                />
              </ReadMore>
            )}
          </>
        ) : (
          <>
            {sanityFeatureToggle?.enabled && readMore2Optional && readMore2 ? (
              <ReadMore
                data-testid={
                  tidligstMuligUttak !== undefined
                    ? readMore2Optional.name
                    : readMore2.name
                }
                name={
                  tidligstMuligUttak !== undefined
                    ? readMore2Optional.name
                    : readMore2.name
                }
                header={
                  tidligstMuligUttak !== undefined
                    ? readMore2Optional.overskrift
                    : readMore2.overskrift
                }
                className={styles.readmore}
              >
                <PortableText
                  value={
                    tidligstMuligUttak !== undefined
                      ? readMore2Optional.innhold
                      : readMore2.innhold
                  }
                  components={getSanityPortableTextComponents(intl)}
                />
              </ReadMore>
            ) : (
              <ReadMore
                name="Om pensjonsalder enkelt"
                className={styles.readmore}
                header={
                  <FormattedMessage id="beregning.read_more.pensjonsalder.label" />
                }
              >
                {tidligstMuligUttak !== undefined && (
                  <FormattedMessage
                    id="beregning.read_more.pensjonsalder.body.optional"
                    values={{
                      ...getFormatMessageValues(),
                    }}
                  />
                )}
                <FormattedMessage
                  id="beregning.read_more.pensjonsalder.body"
                  values={{
                    ...getFormatMessageValues(),
                  }}
                />
              </ReadMore>
            )}
          </>
        )}
      </div>
    </div>
  )
}
