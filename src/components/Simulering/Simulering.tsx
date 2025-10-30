import clsx from 'clsx'
import Highcharts, { SeriesColumnOptions, XAxisOptions } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useEffect, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { HandFingerIcon } from '@navikt/aksel-icons'
import {
  BodyLong,
  BodyShort,
  Button,
  Heading,
  HeadingProps,
} from '@navikt/ds-react'

import { TabellVisning } from '@/components/TabellVisning'
import {
  useGetPersonQuery,
  useOffentligTpQuery,
  usePensjonsavtalerQuery,
} from '@/state/api/apiSlice'
import {
  generateOffentligTpRequestBody,
  generatePensjonsavtalerRequestBody,
} from '@/state/api/utils'
import { useAppSelector } from '@/state/hooks'
import {
  selectAfp,
  selectCurrentSimulation,
  selectEpsHarInntektOver2G,
  selectEpsHarPensjon,
  selectErApoteker,
  selectFoedselsdato,
  selectIsEndring,
  selectSamtykke,
  selectSivilstand,
  selectSkalBeregneAfpKap19,
  selectUfoeregrad,
  selectUtenlandsperioder,
} from '@/state/userInput/selectors'
import { formatUttaksalder } from '@/utils/alder'
import { formatInntekt } from '@/utils/inntekt'

import { useTableData } from '../TabellVisning/hooks'
import { MaanedsbeloepAvansertBeregning } from './MaanedsbeloepAvansertBeregning'
import { SimuleringEndringBanner } from './SimuleringEndringBanner/SimuleringEndringBanner'
import { SimuleringGrafNavigation } from './SimuleringGrafNavigation/SimuleringGrafNavigation'
import { SimuleringPensjonsavtalerAlert } from './SimuleringPensjonsavtalerAlert/SimuleringPensjonsavtalerAlert'
import { useSimuleringChartLocalState } from './hooks'
import { navLogo } from './utils'

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
  const harSamtykket = useAppSelector(selectSamtykke)
  const ufoeregrad = useAppSelector(selectUfoeregrad)
  const afp = useAppSelector(selectAfp)
  const sivilstand = useAppSelector(selectSivilstand)
  const foedselsdato = useAppSelector(selectFoedselsdato)
  const isEndring = useAppSelector(selectIsEndring)
  const epsHarPensjon = useAppSelector(selectEpsHarPensjon)
  const epsHarInntektOver2G = useAppSelector(selectEpsHarInntektOver2G)
  const erApoteker = useAppSelector(selectErApoteker)
  const utenlandsperioder = useAppSelector(selectUtenlandsperioder)
  const { uttaksalder, aarligInntektVsaHelPensjon, gradertUttaksperiode } =
    useAppSelector(selectCurrentSimulation)
  const skalBeregneAfpKap19 = useAppSelector(selectSkalBeregneAfpKap19)
  const chartRef = useRef<HighchartsReact.RefObject>(null)

  const [offentligTpRequestBody, setOffentligTpRequestBody] = useState<
    OffentligTpRequestBody | undefined
  >(undefined)

  const [pensjonsavtalerRequestBody, setPensjonsavtalerRequestBody] = useState<
    PensjonsavtalerRequestBody | undefined
  >(undefined)

  const {
    data: offentligTpData,
    isFetching: isOffentligTpLoading,
    isError: isOffentligTpError,
  } = useOffentligTpQuery(offentligTpRequestBody as OffentligTpRequestBody, {
    skip: !offentligTpRequestBody || !harSamtykket || !uttaksalder,
  })

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

  useEffect(() => {
    if (harSamtykket && uttaksalder) {
      setOffentligTpRequestBody(
        generateOffentligTpRequestBody({
          afp,
          foedselsdato,
          sivilstand,
          epsHarPensjon,
          epsHarInntektOver2G,
          aarligInntektFoerUttakBeloep: aarligInntektFoerUttakBeloep ?? '0',
          gradertUttak: gradertUttaksperiode ?? undefined,
          heltUttak: {
            uttaksalder,
            aarligInntektVsaPensjon: aarligInntektVsaHelPensjon,
          },
          utenlandsperioder,
          erApoteker,
        })
      )

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
    pensjonsavtaler: {
      isLoading: isPensjonsavtalerLoading,
      data: pensjonsavtalerData,
    },
    offentligTp: {
      isLoading: isOffentligTpLoading,
      data: offentligTpData,
    },
  })

  const { data: person } = useGetPersonQuery()
  const isEnkel = visning === 'enkel'
  const series = chartOptions.series as SeriesColumnOptions[]
  const aarArray = (chartOptions?.xAxis as XAxisOptions).categories
  const tableData = useTableData(series, aarArray)
  const intl = useIntl()

  function generateHtmlTable(): string {
    const uttakstidspunkt = uttaksalder && formatUttaksalder(intl, uttaksalder)
    let html = `<h2>Uttakstidspunkt: ${uttakstidspunkt} </h2>
    <h3>Årlig inntekt og pensjon</h3>
    <div class="pdf-metadata">Estimert verdi i dagens verdi før skatt</div>
    <table><thead><tr>`
    html += '<th>Alder</th><th>Sum (kr)</th>'
    // Get all unique detail names for header
    const detailNames = Array.from(
      new Set(tableData.flatMap((row) => row.detaljer.map((d) => d.name)))
    )
    detailNames.forEach((name) => {
      html += `<th>${name}</th>`
    })
    html += '</tr></thead><tbody>'

    tableData.forEach((row) => {
      html += `<tr><th>${row.alder}</th><td style="text-align: right;">${formatInntekt(row.sum)}</td>`
      detailNames.forEach((name) => {
        const detail = row.detaljer.find((d) => d.name === name)
        const amount =
          detail && detail.subSum
            ? `${formatInntekt(detail.subSum).replace(/\u00A0/g, ' ')} kr`
            : ''

        html += `<td>${amount}</td>`
      })
      html += '</tr>'
    })

    html += '</tbody></table>'
    return html
  }

  useEffect(() => {
    window.addEventListener('beforeprint', () => {
      handlePDF()
    })
    return () => {
      window.removeEventListener('beforeprint', handlePDF)
    }
  })

  const isSafari = (): boolean => {
    return /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)
  }

  const handlePDF = () => {
    const header = `
  <table role='presentation' style='width: 100%; margin-bottom: 1em;'>
    <tr class="header-with-logo">
      <td style='width: 70%;'>
        <h1>Pensjonskalkulator, <span style='font-weight: 200;'>${isEnkel ? 'Enkel' : 'Avansert'} beregning</span></h1>
      </td>
      <td style='text-align: right; width: 30%;'>
        <span class='logoContainer' aria-label='NAV Logo'>
          ${navLogo}
        </span>
      </td>
    </tr>
  </table>
`

    const personalInfo = `<div class="pdf-metadata">${person?.navn}, ${foedselsdato}</div>`

    const forbeholdUrl = 'https://nav.no/pensjon/kalkulator/forbehold'
    const strippedUrl = forbeholdUrl.replace(/^https?:\/\//, '')
    const forbehold = `<div>
      <p class="pdf-metadata">
        <span style="font-weight: 200">Forbehold: </span> 
        Pensjonen er beregnet med opplysningene vi har om deg og opplysningene du har oppgitt. Beregningen er gjort med gjeldende regelverk. Dette er et foreløpig estimat av hva du kan forvente deg i pensjon. Nav er ikke ansvarlig for beløpene som er hentet inn fra andre. 
        <a class="pdfLink" data-href-stripped='${strippedUrl}' href='${forbeholdUrl}'
        aria-label="${strippedUrl}">
          Alle forbehold
        </a>
      </p>
    </div>`
    // Generate the HTML table as a string
    const tableContent = generateHtmlTable()

    const htmlContent = header + personalInfo + forbehold + tableContent

    const documentTitle = document.title
    // Set the print content in the hidden div
    const pdfContentDiv = document.getElementById('print-content')
    if (pdfContentDiv) {
      pdfContentDiv.innerHTML = htmlContent
    }

    document.title = ''
    window.onafterprint = () => {
      if (pdfContentDiv) {
        pdfContentDiv.innerHTML = ''
        document.title = documentTitle
      }
    }

    if (isSafari()) {
      setTimeout(() => window.print(), 100)
    } else {
      window.print()
    }
  }

  return (
    <section className={styles.section}>
      {!isEndring && (
        <div className={clsx({ [styles.intro]: isEnkel })}>
          <Heading
            className={clsx({ [styles.introTitle]: isEnkel })}
            level={headingLevel}
            size={headingLevel === '2' ? 'medium' : 'small'}
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

          <Button onClick={handlePDF}>Last ned PDF</Button>
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
          data: offentligTpData,
        }}
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
            afpOffentligListe={afpOffentligListe}
            pre2025OffentligAfp={pre2025OffentligAfp}
            pensjonsavtaler={pensjonsavtalerData?.avtaler}
            simulertTjenestepensjon={offentligTpData?.simulertTjenestepensjon}
          />
        )}
    </section>
  )
}
