import clsx from 'clsx'
import Highcharts, { SeriesColumnOptions, XAxisOptions } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { HandFingerIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Heading, HeadingProps } from '@navikt/ds-react'

import { TabellVisning } from '@/components/TabellVisning'
import { BeregningContext } from '@/pages/Beregning/context'
import {
  useGetAfpOffentligLivsvarigQuery,
  useGetOmstillingsstoenadOgGjenlevendeQuery,
  useGetPersonQuery,
  useGetShowDownloadPdfFeatureToggleQuery,
  usePensjonsavtalerQuery,
} from '@/state/api/apiSlice'
import { isOffentligTpFoer1963 } from '@/state/api/typeguards'
import { generatePensjonsavtalerRequestBody } from '@/state/api/utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectAarligInntektFoerUttakBeloepFraSkatt,
  selectAfp,
  selectAfpUtregningValg,
  selectCurrentSimulation,
  selectEpsHarInntektOver2G,
  selectEpsHarPensjon,
  selectErApoteker,
  selectFoedselsdato,
  selectIsEndring,
  selectLoependeVedtak,
  selectSamtykke,
  selectSamtykkeOffentligAFP,
  selectSivilstand,
  selectSkalBeregneAfpKap19,
  selectUfoeregrad,
} from '@/state/userInput/selectors'
import { formatUttaksalder, isAlderOver62 } from '@/utils/alder'
import {
  useTidligstMuligUttak,
  useTidligstMuligUttakConditions,
} from '@/utils/hooks/useTidligstMuligUttakData'

import { generateAfpContent } from '../Grunnlag/GrunnlagAFP/utils'
import { useTableData } from '../TabellVisning/hooks'
import { useBeregningsdetaljer } from './BeregningsdetaljerForOvergangskull/hooks'
import { MaanedsbeloepAvansertBeregning } from './MaanedsbeloepAvansertBeregning'
import { SimuleringAfpOffentligAlert } from './SimuleringAfpOffentligAlert/SimuleringAfpOffentligAlert'
import { SimuleringEndringBanner } from './SimuleringEndringBanner/SimuleringEndringBanner'
import { SimuleringGrafNavigation } from './SimuleringGrafNavigation/SimuleringGrafNavigation'
import { SimuleringPensjonsavtalerAlert } from './SimuleringPensjonsavtalerAlert/SimuleringPensjonsavtalerAlert'
import { useOffentligTpData, useSimuleringChartLocalState } from './hooks'
import {
  getChartTable,
  getCurrentDateTimeFormatted,
  getForbeholdAvsnitt,
  getGrunnlagIngress,
  getOmstillingsstoenadAlert,
  getPdfHeadingWithLogo,
  getTidligstMuligUttakIngressContent,
} from './pdf-utils'

import styles from './Simulering.module.scss'

interface Props {
  isLoading: boolean
  headingLevel: HeadingProps['level']
  aarligInntektFoerUttakBeloep: string
  alderspensjonListe?: AlderspensjonPensjonsberegning[]
  afpPrivatListe?: AfpPrivatPensjonsberegning[]
  pre2025OffentligAfp?: AfpEtterfulgtAvAlderspensjon
  afpOffentligListe?: AfpPensjonsberegning[]
  alderspensjonMaanedligVedEndring?: AlderspensjonMaanedligVedEndring
  showButtonsAndTable?: boolean
  detaljer?: {
    trygdetid?: number
    opptjeningsgrunnlag?: SimulertOpptjeningGrunnlag[]
  }
  visning?: BeregningVisning
}

export const Simulering = ({
  isLoading,
  headingLevel,
  aarligInntektFoerUttakBeloep,
  alderspensjonListe,
  pre2025OffentligAfp,
  afpPrivatListe,
  afpOffentligListe,
  alderspensjonMaanedligVedEndring,
  showButtonsAndTable,
  visning,
}: Props) => {
  const { showPDFRef, setIsPdfReady } = useContext(BeregningContext)
  const harSamtykket = useAppSelector(selectSamtykke)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const afp = useAppSelector(selectAfp)
  const sivilstand = useAppSelector(selectSivilstand)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const isEndring = useAppSelector(selectIsEndring)
  const epsHarPensjon = useAppSelector(selectEpsHarPensjon)
  const epsHarInntektOver2G = useAppSelector(selectEpsHarInntektOver2G)
  const { uttaksalder, aarligInntektVsaHelPensjon, gradertUttaksperiode } =
    useAppSelector(selectCurrentSimulation)
  const erApoteker = useAppSelector(selectErApoteker)
  const skalBeregneAfpKap19 = useAppSelector(selectSkalBeregneAfpKap19)
  const chartRef = useRef<HighchartsReact.RefObject>(null)
  const samtykkeOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const afpUtregningValg = useAppSelector(selectAfpUtregningValg)
  const { beregningsvalg } = useAppSelector(selectCurrentSimulation)

  const [pensjonsavtalerRequestBody, setPensjonsavtalerRequestBody] = useState<
    PensjonsavtalerRequestBody | undefined
  >(undefined)

  const {
    data: offentligTp,
    isLoading: isOffentligTpLoading,
    isError: isOffentligTpError,
    afpPerioder,
    erOffentligTpFoer1963,
  } = useOffentligTpData()

  const {
    data: pensjonsavtalerData,
    isFetching: isPensjonsavtalerLoading,
    isSuccess: isPensjonsavtalerSuccess,
    isError: isPensjonsavtalerError,
  } = usePensjonsavtalerQuery(
    pensjonsavtalerRequestBody as PensjonsavtalerRequestBody,
    {
      skip: !pensjonsavtalerRequestBody || !harSamtykket || !uttaksalder,
    }
  )
  const { data: showPDF } = useGetShowDownloadPdfFeatureToggleQuery()

  const harSamtykketOffentligAFP = useAppSelector(selectSamtykkeOffentligAFP)
  const {
    isSuccess: isAfpOffentligLivsvarigSuccess,
    data: loependeLivsvarigAfpOffentlig,
  } = useGetAfpOffentligLivsvarigQuery(undefined, {
    skip:
      !harSamtykketOffentligAFP ||
      !foedselsdato ||
      !isAlderOver62(foedselsdato),
  })

  useEffect(() => {
    if (harSamtykket && uttaksalder) {
      setPensjonsavtalerRequestBody(
        generatePensjonsavtalerRequestBody({
          ufoeregrad,
          afp,
          sivilstand,
          epsHarPensjon,
          epsHarInntektOver2G,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ?? undefined,
          heltUttak: {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
          skalBeregneAfpKap19,
        })
      )
    }
  }, [harSamtykket, uttaksalder])

  const [
    chartOptions,
    showVisFaerreAarButton,
    showVisFlereAarButton,
    isPensjonsavtaleFlagVisible,
  ] = useSimuleringChartLocalState({
    styles,
    chartRef,
    foedselsdato,
    isEndring,
    uttaksalder,
    gradertUttaksperiode,
    aarligInntektFoerUttakBeloep,
    aarligInntektVsaHelPensjon,
    isLoading,
    alderspensjonListe,
    pre2025OffentligAfp,
    afpPrivatListe,
    afpOffentligListe,
    afpPerioderFom65aar: afpPerioder,
    loependeLivsvarigAfpOffentlig,
    pensjonsavtaler: {
      isLoading: isPensjonsavtalerLoading,
      data: pensjonsavtalerData,
    },
    offentligTp: {
      isLoading: isOffentligTpLoading,
      data: offentligTp,
    },
  })

  const { data: person } = useGetPersonQuery()
  const isEnkel = visning === 'enkel'
  const series = chartOptions.series as SeriesColumnOptions[]
  const aarArray = (chartOptions?.xAxis as XAxisOptions).categories
  const tableData = useTableData(series, aarArray)
  const loependeVedtak = useAppSelector(selectLoependeVedtak)
  const intl = useIntl()

  const { alderspensjonDetaljerListe, afpDetaljerListe } =
    useBeregningsdetaljer(
      alderspensjonListe,
      afpPrivatListe,
      afpOffentligListe,
      pre2025OffentligAfp,
      loependeLivsvarigAfpOffentlig
    )

  const { data: tidligstMuligUttak } = useTidligstMuligUttak(ufoeregrad)
  const { data: omstillingsstoenadOgGjenlevende } =
    useGetOmstillingsstoenadOgGjenlevendeQuery()

  const handlePDFRef = useRef<(() => void) | null>(null)
  const isPrintingRef = useRef(false)

  const isSafari = (): boolean => {
    return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
  }

  const {
    normertPensjonsalder,
    nedreAldersgrense,
    loependeVedtakPre2025OffentligAfp,
    isOver75AndNoLoependeVedtak,
    show1963Text,
    hasAFP,
  } = useTidligstMuligUttakConditions()

  const { title, content } = React.useMemo(() => {
    return generateAfpContent(intl)({
      afpUtregning: afpUtregningValg,
      erApoteker: erApoteker ?? false,
      loependeVedtak: loependeVedtak,
      afpValg: afp,
      foedselsdato: foedselsdato!,
      samtykkeOffentligAFP: samtykkeOffentligAFP,
      beregningsvalg: beregningsvalg,
      loependeLivsvarigAfpOffentlig: loependeLivsvarigAfpOffentlig,
    })
  }, [
    intl,
    afp,
    afpUtregningValg,
    erApoteker,
    loependeVedtak,
    ufoeregrad,
    beregningsvalg,
    foedselsdato,
  ])

  const aarligInntektFoerUttakBeloepFraSkatt = useAppSelector(
    selectAarligInntektFoerUttakBeloepFraSkatt
  )

  const handlePDF = () => {
    // Prevent double printing
    if (isPrintingRef.current) {
      return
    }
    isPrintingRef.current = true

    const forbeholdAvsnitt = getForbeholdAvsnitt(intl)

    const uttakstidspunkt = uttaksalder && formatUttaksalder(intl, uttaksalder)
    const helUttaksAlder = `<h2>Beregning av 100 % alderspensjon ved ${uttakstidspunkt} </h2>`
    const chartTableWithHeading = getChartTable({ tableData, intl })

    const tidligstMuligUttakIngress = isEnkel
      ? getTidligstMuligUttakIngressContent({
          intl,
          normertPensjonsalder,
          nedreAldersgrense,
          loependeVedtakPre2025OffentligAfp,
          isOver75AndNoLoependeVedtak,
          show1963Text,
          ufoeregrad,
          hasAFP,
          tidligstMuligUttak,
        })
      : ''

    const omstillingsstoenadAlert =
      omstillingsstoenadOgGjenlevende?.harLoependeSak
        ? getOmstillingsstoenadAlert(intl, normertPensjonsalder)
        : ''
    const shouldHideAfpHeading = Boolean(
      afpDetaljerListe.length > 0 &&
      loependeLivsvarigAfpOffentlig?.afpStatus &&
      loependeLivsvarigAfpOffentlig?.maanedligBeloep
    )
    const grunnlagIngress = getGrunnlagIngress({
      intl,
      alderspensjonDetaljerListe: alderspensjonDetaljerListe,
      aarligInntektFoerUttakBeloepFraSkatt,
      afpDetaljerListe,
      title,
      content,
      hasPre2025OffentligAfpUttaksalder: Boolean(pre2025OffentligAfp),
      uttaksalder,
      gradertUttaksperiode,
      shouldHideAfpHeading,
    })

    const finalPdfContent =
      forbeholdAvsnitt +
      tidligstMuligUttakIngress +
      omstillingsstoenadAlert +
      helUttaksAlder +
      chartTableWithHeading +
      grunnlagIngress

    // Use hidden iframe approach to avoid mc-ref artifacts and double print dialogs
    const printStyles = `
      <style>
        @page { margin: 1cm; }
        body { font-family: 'Source Sans 3', 'Source Sans Pro', Arial, sans-serif; font-size: 12pt; line-height: 1.4; margin: 0; padding: 20px; }
        h1 { margin: 0; padding-left: 0; text-align: left; }
        h2 { margin-top: 1em; }
        h4 { padding: 1.5em 0 0.5em; }
        h4.utenlandsopphold-title { padding: 0; }
        table { width: 100%; border-collapse: collapse; table-layout: auto; margin: 0; }
        th, tr, .afp-grunnlag-title { border-bottom: 1px solid rgb(128 128 128); }
        thead th { border-bottom: 2px solid rgb(128 128 128); font-weight: bold; text-align: center; white-space: nowrap; }
        th, td { padding: 12px 8px; }
        tr td { margin-right: 10px; text-align: center; }
        tr.header-with-logo { border: none; margin: 0; }
        tr.header-with-logo td { padding: 0; }
        .pdf-table-wrapper-row, .pdf-table-type2 tbody > tr:last-child { border-bottom: none; }
        .pdf-table-type2 tbody > tr:last-child { font-weight: bold; }
        td.pdf-td-type2 { vertical-align: top; width: 33%; padding-top: 0; padding-right: 8px; }
        table.alert-box { border: 2px solid #0214317d; border-radius: 8px; }
        div.pdf-metadata { margin-top: -1em; }
        div.utenlandsopphold-land-item { border: 1px solid rgb(2 20 49 / 49%); border-radius: 8px; padding: 8px; margin-bottom: 1em; }
        .display-inline { display: inline; }
        .nowrap { white-space: nowrap; }
        .logoContainer svg { width: 72px; height: auto; padding: 0; margin: 0; }
        .infoIconContainer svg { width: 16px; height: 16px; }
      </style>
    `

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="nb">
        <head>
          <meta charset="UTF-8">
          <title>Pensjonskalkulator beregning</title>
          ${printStyles}
        </head>
        <body>
          ${finalPdfContent}
        </body>
      </html>
    `

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe')
    iframe.style.position = 'absolute'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = 'none'
    iframe.style.left = '-9999px'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
    if (!iframeDoc) {
      console.error('Could not access iframe document')
      document.body.removeChild(iframe)
      return
    }

    iframeDoc.open()
    iframeDoc.write(htmlContent)
    iframeDoc.close()

    // Wait for content to render then print
    const triggerPrint = () => {
      iframe.contentWindow?.focus()
      iframe.contentWindow?.print()
    }

    const cleanup = () => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe)
      }
      isPrintingRef.current = false
    }

    if (isSafari()) {
      setTimeout(() => {
        triggerPrint()
        setTimeout(cleanup, 1000)
      }, 100)
    } else {
      iframe.onload = () => {
        triggerPrint()
        // Use onafterprint on iframe's window to detect when print dialog closes
        if (iframe.contentWindow) {
          iframe.contentWindow.onafterprint = cleanup
        }
        // Fallback: reset flag after short delay in case onafterprint doesn't fire
        setTimeout(() => {
          isPrintingRef.current = false
        }, 1000)
      }
      // Fallback if onload doesn't fire
      setTimeout(() => {
        if (!iframe.contentWindow) {
          cleanup()
        }
      }, 2000)
    }
  }

  useEffect(() => {
    handlePDFRef.current = handlePDF
  })

  useEffect(() => {
    const locationUrl = window.location.href
    if (!locationUrl.includes('beregning') || !showPDF?.enabled) {
      return
    }

    // Intercept Cmd+P / Ctrl+P to use our custom print
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        if (!isPrintingRef.current) {
          handlePDFRef.current?.()
        }
      }
    }

    // Block any beforeprint on the main window while we're printing via iframe
    const handleBeforePrint = (e: Event) => {
      if (isPrintingRef.current) {
        // We're already printing via iframe, block any main window print
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true) // Use capture phase
    window.addEventListener('beforeprint', handleBeforePrint, true)

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
      window.removeEventListener('beforeprint', handleBeforePrint, true)
    }
  }, [showPDF?.enabled])

  // Set up the context ref connection
  useEffect(() => {
    if (showPDFRef) {
      showPDFRef.current = {
        handlePDF: () => handlePDFRef.current?.(),
      }
      setIsPdfReady?.(true)
    }
    return () => {
      setIsPdfReady?.(false)
    }
  }, [showPDFRef, setIsPdfReady])

  const hideAFP =
    loependeLivsvarigAfpOffentlig?.afpStatus &&
    (loependeLivsvarigAfpOffentlig?.maanedligBeloep === null ||
      loependeLivsvarigAfpOffentlig?.maanedligBeloep === undefined)

  return (
    <section className={styles.section}>
      {!isEndring && (
        <div className={clsx({ [styles.intro]: isEnkel })}>
          <Heading
            className={clsx({ [styles.introTitle]: isEnkel })}
            level={headingLevel}
            size={headingLevel === '2' ? 'medium' : 'small'}
            data-testid="beregning-title"
          >
            <FormattedMessage id="beregning.highcharts.title" />
          </Heading>

          {isEnkel && (
            <BodyLong>
              <FormattedMessage id="beregning.highcharts.ingress" />
            </BodyLong>
          )}
        </div>
      )}

      {showButtonsAndTable && (
        <SimuleringEndringBanner
          isLoading={isLoading}
          heltUttaksalder={uttaksalder}
          gradertUttaksperiode={gradertUttaksperiode ?? undefined}
          alderspensjonMaanedligVedEndring={alderspensjonMaanedligVedEndring}
        />
      )}

      <div role="img" aria-labelledby="alt-chart-title">
        <div id="alt-chart-title" hidden>
          <FormattedMessage id="beregning.highcharts.alt_tekst" />
        </div>

        <div
          className={styles.highchartsWrapper}
          data-testid="highcharts-aria-wrapper"
          aria-hidden={true}
        >
          <HighchartsReact
            ref={chartRef}
            highcharts={Highcharts}
            options={chartOptions}
          />

          {showButtonsAndTable && (
            <BodyShort
              size="small"
              textColor="subtle"
              className={styles.infoClick}
            >
              <HandFingerIcon />
              <FormattedMessage id="beregning.highcharts.informasjon_klikk" />
            </BodyShort>
          )}
        </div>
      </div>

      {showButtonsAndTable && (
        <SimuleringGrafNavigation
          showVisFaerreAarButton={showVisFaerreAarButton}
          showVisFlereAarButton={showVisFlereAarButton}
        />
      )}

      <SimuleringPensjonsavtalerAlert
        isPensjonsavtaleFlagVisible={isPensjonsavtaleFlagVisible}
        pensjonsavtaler={{
          isLoading: isPensjonsavtalerLoading,
          isError: isPensjonsavtalerError,
          isSuccess: isPensjonsavtalerSuccess,
          data: pensjonsavtalerData,
        }}
        offentligTp={{
          isError: isOffentligTpError,
          data: offentligTp,
        }}
        erOffentligTpFoer1963={erOffentligTpFoer1963}
      />

      <SimuleringAfpOffentligAlert
        harSamtykketOffentligAFP={harSamtykketOffentligAFP}
        isAfpOffentligLivsvarigSuccess={isAfpOffentligLivsvarigSuccess}
        loependeLivsvarigAfpOffentlig={loependeLivsvarigAfpOffentlig}
      />

      {showButtonsAndTable && (
        <TabellVisning
          series={chartOptions.series as SeriesColumnOptions[]}
          aarArray={(chartOptions?.xAxis as XAxisOptions).categories}
        />
      )}

      {/* c8 ignore next 6 - detaljer skal kun vises i dev for test formål */}
      {/* {utvidetSimuleringsresultatFeatureToggle?.enabled && detaljer && (
        <Simuleringsdetaljer
          alderspensjonListe={alderspensjonListe}
          detaljer={detaljer}
          pre2025OffentligAfp={pre2025OffentligAfp}
        />
      )} */}

      {!isOffentligTpLoading &&
        !isLoading &&
        !isPensjonsavtalerLoading &&
        !isEndring &&
        visning === 'avansert' && (
          <MaanedsbeloepAvansertBeregning
            alderspensjonMaanedligVedEndring={alderspensjonMaanedligVedEndring}
            afpPrivatListe={afpPrivatListe}
            afpOffentligListe={hideAFP ? undefined : afpOffentligListe}
            pre2025OffentligAfp={pre2025OffentligAfp}
            offentligAfpFraTpOrdning={afpPerioder}
            pensjonsavtaler={pensjonsavtalerData?.avtaler}
            simulertTjenestepensjon={offentligTp?.simulertTjenestepensjon}
            erTpFoer1963={
              offentligTp &&
              erOffentligTpFoer1963 &&
              isOffentligTpFoer1963(offentligTp)
            }
            skalViseNullOffentligTjenestepensjon={
              isOffentligTpFoer1963(offentligTp) &&
              offentligTp?.feilkode === 'BEREGNING_GIR_NULL_UTBETALING'
            }
          />
        )}
    </section>
  )
}
