import { format } from 'date-fns'
import { IntlShape } from 'react-intl'

import { getSelectedLanguage } from '@/context/LanguageProvider/utils'
import {
  formatUttaksalder,
  formaterLivsvarigString,
  formaterSluttAlderString,
} from '@/utils/alder'
import { DATE_ENDUSER_FORMAT } from '@/utils/dates'
import { formatInntekt } from '@/utils/inntekt'
import {
  getTranslatedLandFromLandkode,
  harKravOmArbeidFromLandkode,
} from '@/utils/land'
import { capitalize } from '@/utils/string'

import { formatLeverandoerList } from '../Pensjonsavtaler/OffentligTjenestePensjon/utils'
import {
  OffentligTpAlert,
  privatePensjonsavtalerAlert,
} from '../Pensjonsavtaler/hooks'
import { TableDataRow } from '../TabellVisning/utils'
import { getAfpHeading } from './BeregningsdetaljerForOvergangskull/AfpDetaljerGrunnlag'
import { getAlderspensjonHeading } from './BeregningsdetaljerForOvergangskull/AlderspensjonDetaljerGrunnlag'
import {
  AfpSectionConfig,
  getAfpSectionsToRender,
} from './BeregningsdetaljerForOvergangskull/Felles/AfpDetaljer'
import {
  AfpDetaljerListe,
  AlderspensjonDetaljerListe,
} from './BeregningsdetaljerForOvergangskull/hooks'
import { OffentligTpResponse } from './hooks'
import { escapeHtml, getPdfLink, pdfFormatMessageValues } from '@/grunnlag-pdf/utils'
import { ALERT_TRIANGLE_ICON, DIN_PENSJON_OPPTJENING_URL, GARANTI_PENSJON_URL, INFO_SQUARE_ICON, NAV_LOGO, NORSK_PENSJON_URL } from '@/grunnlag-pdf/constants'

export const getCurrentDateTimeFormatted = (): string => {
  const now = new Date()

  const date = format(now, DATE_ENDUSER_FORMAT)
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')

  return `${date}, kl. ${hours}.${minutes}`
}

export const getPdfHeadingWithLogo = (isEnkel: boolean): string => {
  return `<table role='presentation' style='width: 100%; margin-bottom: 1em;'>
    <tr class="header-with-logo">
      <td style='width: 70%;'>
        <h1>Pensjonskalkulator: <span style='font-weight: 200;'>${isEnkel ? 'Enkel' : 'Avansert'} beregning</span></h1>
      </td>
      <td style='text-align: right; width: 30%;'>
        <span class='logoContainer'>
          ${NAV_LOGO}
        </span>
      </td>
    </tr>
  </table>`
}

function getAfpIngress(
  intl: IntlShape,
  title: string,
  content: string
): string {
  return `
  <h3>${intl.formatMessage({ id: 'grunnlag.afp.title' })}: ${title}</h3>
  <p>${intl.formatMessage(
    { id: content },
    {
      ...pdfFormatMessageValues,
      afpLink: (chunks: string[]) =>
        getPdfLink({
          url: 'https://www.afp.no',
          displayText: chunks.join('') || 'Fellesordningen for AFP',
        }),
      ufoeretrygdOgAfpLink: (chunks: string[]) =>
        getPdfLink({
          url: 'https://www.nav.no/ufor-til-pensjon#afp',
          displayText: chunks.join('') || 'Uføretrygd og AFP',
        }),
      goToAFP: (chunks: string[]) =>
        getPdfLink({
          displayText: chunks.join('') || 'AFP (avtalefestet pensjon)',
        }),
      goToAvansert: () => '',
    }
  )}
  </p>`
}

export function getAfpDetaljerHtmlTable({
  afpDetaljerListe,
  intl,
  uttaksalder,
  gradertUttaksperiode,
  shouldHideAfpHeading,
}: {
  afpDetaljerListe: AfpDetaljerListe[] | undefined
  intl: IntlShape
  uttaksalder: Alder | null
  gradertUttaksperiode: GradertUttak | null
  shouldHideAfpHeading: boolean
}): string {
  if (!afpDetaljerListe) {
    return ''
  }

  // For each AfpDetaljer entry, render its sections and concatenate HTML
  return afpDetaljerListe
    .map((afpDetaljForValgtUttak, index) => {
      const afpHeading =
        !shouldHideAfpHeading &&
        getAfpHeading({
          afpDetaljForValgtUttak,
          index,
          uttaksalder,
          gradertUttaksperiode,
        })

      const headingHtml = afpHeading
        ? `<h4>${intl.formatMessage(
            { id: afpHeading.messageId },
            {
              alderAar: `${afpHeading.age} år`,
              alderMd:
                afpHeading.months && afpHeading.months > 0
                  ? `og ${afpHeading.months} måneder`
                  : '',
            }
          )}</h4>`
        : ''
      const sections = getAfpSectionsToRender(afpDetaljForValgtUttak)
      const sectionHtml = sections
        .map((afpSection) => {
          const sectionWithTitle: AfpSectionConfig = {
            ...afpSection,
            titleId: afpSection.titleId
              ? intl.formatMessage({ id: afpSection.titleId })
              : '',
          }
          return getAfpTable(sectionWithTitle)
        })
        .join('')

      return `${headingHtml}${sectionHtml}`
    })
    .join('')
}

function getAfpTable(afpSection: AfpSectionConfig): string {
  if (!Array.isArray(afpSection.data) || afpSection.data.length === 0) return ''

  const { titleId, boldLastItem, data, noBorderBottom, allItemsBold } =
    afpSection
  const rows = afpSection.data
    .map((detalj) => {
      const lastItem = detalj === data[data.length - 1]
      const label = detalj?.tekst ?? ''
      const value = detalj?.verdi ?? ''
      const boldStyle =
        allItemsBold || (boldLastItem && lastItem) ? 'font-weight: bold;' : ''
      const noBorderBottomStyle =
        noBorderBottom || lastItem ? 'border-bottom: none;' : ''
      return `<tr style='${noBorderBottomStyle}'><td style='text-align:left; ${boldStyle}'>${escapeHtml(String(label))}:</td><td style='text-align:right; ${boldStyle}'>${escapeHtml(
        String(value)
      )}</td></tr>`
    })
    .join('\n')

  return `<div style='margin:0; width: 33%;'>
        ${titleId ? `<h4 class="afp-grunnlag-title">${titleId}</h4>` : ''}
      <table role='presentation'>${rows}</table>
    </div>`
}

export function getAldersPensjonDetaljerHtmlTable(
  alderspensjonListe: AlderspensjonDetaljerListe | undefined
): string {
  if (!alderspensjonListe) {
    return ''
  }
  const alderspensjon = alderspensjonListe.alderspensjon ?? []
  const opptjeningKap19 = alderspensjonListe.opptjeningKap19 ?? []
  const opptjeningKap20 = alderspensjonListe.opptjeningKap20 ?? []

  const getTableRows = (arr: { tekst?: string; verdi?: string | number }[]) =>
    arr
      .map((item) => {
        const label = item?.tekst ?? ''
        const value = item?.verdi != null ? String(item.verdi) : ''
        return `<tr><td style='text-align: left;'>${escapeHtml(label)}:</td><td style="text-align: right;">${escapeHtml(value)}</td></tr>`
      })
      .join('\n')

  const tableARows = getTableRows(alderspensjon)
  const tableBRows = getTableRows(opptjeningKap19)
  const tableCRows = getTableRows(opptjeningKap20)

  const tableA = tableARows
    ? `<table class="pdf-table-type2"><thead><tr><th colspan="2" style='text-align: left;'>Månedlig alderspensjon (Nav)</th></tr></thead><tbody>${tableARows}</tbody></table>`
    : null

  const tableB = tableBRows
    ? `<table><thead><tr><th colspan="2" style='text-align: left;'>Opptjening etter gamle regler</th></tr></thead><tbody>${tableBRows}</tbody></table>`
    : null

  const tableC = tableCRows
    ? `<table><thead><tr><th colspan="2" style='text-align: left;'>Opptjening etter nye regler</th></tr></thead><tbody>${tableCRows}</tbody></table>`
    : null

  // If none of the tables have rows, return an empty string
  if (!tableA && !tableB && !tableC) return ''

  // Build an array of non-empty table cells so we only render columns that exist
  const cells: string[] = []
  if (tableA) cells.push(`<td class="pdf-td-type2">${tableA}</td>`)
  if (tableB)
    cells.push(
      `<td class="pdf-td-type2" style='padding-left: 8px;'>${tableB}</td>`
    )
  if (tableC) cells.push(`<td class="pdf-td-type2">${tableC}</td>`)

  return `<table role='presentation' style='width:100%;'>
      <tr class="pdf-table-wrapper-row">
        ${cells.join('\n')}
      </tr>
    </table>`
}

export function getForbeholdAvsnitt(intl: IntlShape): string {
  const forbeholdUrl = 'https://nav.no/pensjon/kalkulator/forbehold'
  const kalkulatorUrl = 'https://nav.no/pensjon/kalkulator'

  return `<div>
    <p class="pdf-metadata">
      <b>${intl.formatMessage({ id: 'grunnlag.forbehold.title' })}: </b>
      ${intl.formatMessage({ id: 'grunnlag.forbehold.ingress_1' })}
      <br/>${getPdfLink({ url: forbeholdUrl, displayText: intl.formatMessage({ id: 'grunnlag.forbehold.link' }) })}
    </p>
    <p>
      <b>NB: </b>
      ${intl.formatMessage({ id: 'grunnlag.forbehold.ingress_2' })}
      ${getPdfLink({ url: kalkulatorUrl, displayText: 'Gå til pensjonskalkulator' })}
    </p>
  </div>`
}

export function getChartTable({
  tableData,
  intl,
}: {
  tableData: TableDataRow[]
  intl: IntlShape
}): string {
  const tableHeading = `<h3>Årlig inntekt og pensjon</h3><div class="pdf-metadata">${intl.formatMessage({ id: 'beregning.intro.description_1.endring' })}</div>`

  let tableHtml = `<table><thead><tr><th>Alder</th><th>Sum (kr)</th>`

  const detailNames = Array.from(
    new Set(tableData.flatMap((row) => row.detaljer.map((d) => d.name)))
  )
  detailNames.forEach((name) => {
    tableHtml += `<th>${name}</th>`
  })
  tableHtml += '</tr></thead><tbody>'

  tableData.forEach((row) => {
    tableHtml += `<tr><th>${row.alder}</th><td style="text-align: right;">${formatInntekt(row.sum).replace(/\u00A0/g, ' ')}</td>`
    detailNames.forEach((name) => {
      const detail = row.detaljer.find((d) => d.name === name)
      const amount =
        detail && detail.subSum
          ? `${formatInntekt(detail.subSum).replace(/\u00A0/g, ' ')} kr`
          : ''

      tableHtml += `<td>${amount.replace(/\u00A0/g, ' ')}</td>`
    })
    tableHtml += '</tr>'
  })

  tableHtml += '</tbody></table>'
  return tableHeading + tableHtml
}

export function getTidligstMuligUttakIngressContent({
  intl,
  normertPensjonsalder,
  nedreAldersgrense,
  loependeVedtakPre2025OffentligAfp,
  isOver75AndNoLoependeVedtak,
  show1963Text,
  ufoeregrad,
  hasAFP,
  tidligstMuligUttak,
}: {
  intl: IntlShape
  normertPensjonsalder: Alder
  nedreAldersgrense: Alder
  loependeVedtakPre2025OffentligAfp: boolean
  isOver75AndNoLoependeVedtak: boolean
  show1963Text: boolean
  ufoeregrad: number
  hasAFP: boolean
  tidligstMuligUttak?: Alder
}): string {
  if (ufoeregrad) {
    const gradertIngress = hasAFP
      ? 'omufoeretrygd.gradert.ingress.afp'
      : 'omufoeretrygd.gradert.ingress'
    const formatertNedreAldersgrense = formatUttaksalder(
      intl,
      nedreAldersgrense
    )
    const formatertNormertPensjonsalder = formatUttaksalder(
      intl,
      normertPensjonsalder
    )

    const ingressId =
      ufoeregrad === 100 ? 'omufoeretrygd.hel.ingress' : gradertIngress

    const formattedGradertIngress = intl.formatMessage(
      { id: ingressId },
      {
        ...pdfFormatMessageValues,
        grad: ufoeregrad,
        nedreAldersgrense: formatertNedreAldersgrense,
        normertPensjonsalder: formatertNormertPensjonsalder,
        link: getPdfLink({
          displayText: 'Avansert',
        }),
      }
    )
    return `<p>${formattedGradertIngress}</p>`
  }

  if (loependeVedtakPre2025OffentligAfp && !tidligstMuligUttak) {
    tidligstMuligUttak = {
      aar: 67,
      maaneder: 0,
    }
  }

  if (tidligstMuligUttak) {
    if (loependeVedtakPre2025OffentligAfp) {
      return `<p>
      ${intl.formatMessage(
        { id: 'tidligstmuliguttak.pre2025OffentligAfp.ingress' },
        {
          ...pdfFormatMessageValues,
          link: getPdfLink({
            displayText: intl.formatMessage({
              id: 'tidligstmuliguttak.pre2025OffentligAfp.avansert_link',
            }),
          }),
        }
      )}</p>`
    } else {
      const messageId = `tidligstmuliguttak.${show1963Text ? '1963' : '1964'}.ingress_2`
      const under75Ingress = !isOver75AndNoLoependeVedtak
        ? intl.formatMessage({ id: messageId })
        : ''
      return `<p>${intl.formatMessage({
        id: 'tidligstmuliguttak.ingress_1',
      })}<b>${formatUttaksalder(intl, tidligstMuligUttak)}.</b>${under75Ingress}</p>`
    }
  }

  return ''
}

export function getOmstillingsstoenadAlert(
  intl: IntlShape,
  normertPensjonsalder: Alder
): string {
  const formatertNormertPensjonsalder = formatUttaksalder(
    intl,
    normertPensjonsalder
  )
  const telefonNummer = intl.formatMessage({ id: 'link.telefon_pensjon' })
  const linkHtml = `<span>${telefonNummer}</span>`

  const alertMessage = intl.formatMessage(
    { id: 'tidligstmuliguttak.info_omstillingsstoenad_og_gjenlevende' },
    {
      ...pdfFormatMessageValues,
      normertPensjonsalder: formatertNormertPensjonsalder,
      link: linkHtml,
    }
  )

  return `<table role='presentation' class='alert-box' style='width: 100%; margin-bottom: 1em;'>
    <tr>
      <td style='width: 20px; vertical-align: top; padding: 16px 8px 16px 16px; margin: 0; border: none;'>
        <span class='infoIconContainer'>
          ${INFO_SQUARE_ICON}
        </span>
      </td>
      <td style='vertical-align: top; padding: 16px 16px 16px 8px; margin: 0; text-align: left; border: none;'>
        <p style='margin: 0; padding: 0;'>${alertMessage}</p>
      </td>
    </tr>
  </table>`
}

export function getGrunnlagIngress({
  intl,
  alderspensjonDetaljerListe,
  aarligInntektFoerUttakBeloepFraSkatt,
  afpDetaljerListe,
  title,
  content,
  hasPre2025OffentligAfpUttaksalder,
  uttaksalder,
  gradertUttaksperiode,
  shouldHideAfpHeading,
}: {
  intl: IntlShape
  alderspensjonDetaljerListe: AlderspensjonDetaljerListe[]
  afpDetaljerListe: AfpDetaljerListe[]
  aarligInntektFoerUttakBeloepFraSkatt?: {
    beloep: string
    aar: number
  }
  title?: string
  content?: string
  hasPre2025OffentligAfpUttaksalder: boolean
  uttaksalder: Alder | null
  gradertUttaksperiode: GradertUttak | null
  shouldHideAfpHeading: boolean
}): string {
  const beloepRaw = aarligInntektFoerUttakBeloepFraSkatt?.beloep
  const aarRaw = aarligInntektFoerUttakBeloepFraSkatt?.aar

  const beloepFormatted = beloepRaw
    ? formatInntekt(String(beloepRaw)).replace(/\u00A0/g, ' ')
    : ''
  const aarFormatted = aarRaw != null ? String(aarRaw) : ''

  const inntektBeloepOgÅr = intl.formatMessage(
    { id: 'grunnlag.inntekt.ingress' },
    {
      ...pdfFormatMessageValues,
      beloep: beloepFormatted,
      aar: aarFormatted,
      dinPensjonBeholdningLink: (chunks: string[]) =>
        getPdfLink({
          url: DIN_PENSJON_OPPTJENING_URL,
          displayText: chunks.join('') || 'Din pensjonsopptjening',
        }),
    }
  )
  return `<h2>${intl.formatMessage({ id: 'grunnlag.title' })}</h2>
  <h3>${intl.formatMessage({ id: 'grunnlag2.endre_inntekt.title' })}</h3>
  <p>${inntektBeloepOgÅr} avansert kalkulator.</p>
  <h3>Alderspensjon (Nav)</h3>
  <p>
    ${intl.formatMessage(
      { id: 'grunnlag.alderspensjon.ingress' },
      {
        avansert: '',
      }
    )}
  </p>
  
  ${alderspensjonDetaljerListe
    .map((alderspensjonVedUttaksValg, index) => {
      const apHeading = getAlderspensjonHeading({
        index,
        hasPre2025OffentligAfpUttaksalder,
        uttaksalder,
        gradertUttaksperiode,
      })
      const headingHtml = `<h4>${intl.formatMessage(
        {
          id: apHeading.messageId,
        },
        {
          alderAar: apHeading.age,
          alderMd: apHeading.months,
          grad: apHeading.grad,
        }
      )}
    </h4>`
      return `${headingHtml}${getAldersPensjonDetaljerHtmlTable(alderspensjonVedUttaksValg)}`
    })
    .join('')}
  <div>${getPdfLink({
    url: DIN_PENSJON_OPPTJENING_URL,
    displayText: 'Din pensjonsopptjening',
  })}</div>
  <div>${getPdfLink({
    url: 'https://www.nav.no/alderspensjon#beregning',
    displayText: 'Om reglene for alderspensjon ',
  })}
  </div>
  ${getAfpIngress(intl, title || '', content || '')}
  ${getAfpDetaljerHtmlTable({ afpDetaljerListe, intl, uttaksalder, gradertUttaksperiode, shouldHideAfpHeading })}
  `
}

function getPensjonsAvtalerTableRows({
  utbetalingsperioder,
  pensjonsleverandor,
  intl,
}: {
  utbetalingsperioder: Utbetalingsperiode[]
  pensjonsleverandor: string
  intl: IntlShape
}): string {
  let rows = ''
  utbetalingsperioder.forEach((periode: Utbetalingsperiode, index: number) => {
    const isFirst = index === 0
    const isLast = index === utbetalingsperioder.length - 1
    const lastRowStyle =
      isLast || utbetalingsperioder.length > 1
        ? 'border-bottom: none; font-weight: normal'
        : ''

    const produktCell = isFirst
      ? `<td style='text-align:left; vertical-align: top; ${lastRowStyle}' rowspan='${utbetalingsperioder.length}'>${escapeHtml(
          String(pensjonsleverandor)
        )}</td>`
      : ''
    const periodText = periode.sluttAlder
      ? formaterSluttAlderString(intl, periode.startAlder, periode.sluttAlder)
      : formaterLivsvarigString(intl, periode.startAlder)

    const amount = periode.aarligUtbetaling
      ? `${formatInntekt(String(periode.aarligUtbetaling)).replace(/\u00A0/g, ' ')} kr`
      : ''

    rows += `<tr style='${lastRowStyle}'>${produktCell}<td style='text-align:left;'>${escapeHtml(
      periodText
    )}</td><td style='text-align:right;'>${escapeHtml(String(amount))}</td></tr>`
  })

  return rows
}

function getOffentligTpTable({
  offentligTp,
  intl,
}: {
  offentligTp?: OffentligTpResponse
  intl: IntlShape
}): string {
  if (!offentligTp || !offentligTp.data?.simulertTjenestepensjon) {
    return ''
  }

  const { simuleringsresultat, tpLeverandoer } =
    offentligTp.data.simulertTjenestepensjon
  const { utbetalingsperioder } = simuleringsresultat
  let rows = ''
  let html = '<h3>Offentlig tjenestepensjon</h3>'
  simuleringsresultat.utbetalingsperioder.forEach((periode, index: number) => {
    const isFirst = index === 0
    const isLast = index === utbetalingsperioder.length - 1
    const lastRowStyle =
      isLast || utbetalingsperioder.length > 1
        ? 'border-bottom: none; font-weight: normal'
        : ''

    const produktCell = isFirst
      ? `<td style='text-align:left; vertical-align: top; ${lastRowStyle}' rowspan='${utbetalingsperioder.length}'>${escapeHtml(
          String(tpLeverandoer)
        )}</td>`
      : ''
    const periodText = periode.sluttAlder
      ? formaterSluttAlderString(intl, periode.startAlder, periode.sluttAlder)
      : formaterLivsvarigString(intl, periode.startAlder)

    const amount = periode.aarligUtbetaling
      ? `${formatInntekt(String(periode.aarligUtbetaling)).replace(/\u00A0/g, ' ')} kr`
      : ''

    rows += `<tr style='${lastRowStyle}'>${produktCell}<td style='text-align:left;'>${escapeHtml(
      periodText
    )}</td><td style='text-align:right;'>${escapeHtml(String(amount))}</td></tr>`
  })

  html += `<table class="pdf-table-type2" style="width: 60%"><thead><tr><th style='text-align:left;'>Avtale</th><th style='text-align:left;'>Perioder</th><th style='text-align:right;'>Årlig Beløp</th></tr></thead><tbody>${rows}</tbody></table>`
  return html
}

function getPrivatePensjonsAvtaler(
  privatePensjonsAvtaler:
    | Record<
        'andre avtaler' | 'privat tjenestepensjon' | 'individuelle ordninger',
        Pensjonsavtale[]
      >
    | undefined,
  intl: IntlShape
): string {
  if (!privatePensjonsAvtaler) return ''

  const groupOrder = [
    'individuelle ordninger',
    'privat tjenestepensjon',
    'andre avtaler',
  ] as const

  let html = ''

  groupOrder.forEach((groupKey) => {
    const pensjonsAvtalerGruppe = privatePensjonsAvtaler[groupKey]
    if (
      !Array.isArray(pensjonsAvtalerGruppe) ||
      pensjonsAvtalerGruppe.length === 0
    ) {
      html += ''
    } else {
      html += `<h3>${escapeHtml(capitalize(groupKey))}</h3>`
      let rows = ''
      pensjonsAvtalerGruppe.forEach((pensjonsavtale: Pensjonsavtale) => {
        rows += getPensjonsAvtalerTableRows({
          utbetalingsperioder: pensjonsavtale.utbetalingsperioder ?? [],
          pensjonsleverandor: pensjonsavtale.produktbetegnelse,
          intl,
        })
      })

      html += `<table class="pdf-table-type2" style="width: 60%"><thead><tr><th style='text-align:left;'>Avtale</th><th style='text-align:left;'>Perioder</th><th style='text-align:right;'>Årlig Beløp</th></tr></thead><tbody>${rows}</tbody></table>`
    }
  })

  html += `<p>${intl.formatMessage(
    { id: 'pensjonsavtaler.private.ingress.norsk_pensjon' },
    {
      ...pdfFormatMessageValues,
      norskPensjonLink: (chunks: string[]) =>
        getPdfLink({
          url: NORSK_PENSJON_URL,
          displayText: chunks.join('') || 'Norsk Pensjon',
        }),
    }
  )}</p>
  <p>${intl.formatMessage({ id: 'pensjonsavtaler.fra_og_med_forklaring' })}</p>`
  return html
}

export function getPensjonsavtaler({
  intl,
  privatePensjonsAvtaler,
  offentligTp,
}: {
  intl: IntlShape
  privatePensjonsAvtaler:
    | Record<
        'andre avtaler' | 'privat tjenestepensjon' | 'individuelle ordninger',
        Pensjonsavtale[]
      >
    | undefined
  offentligTp: OffentligTpResponse
}): string {
  const privatePensjonsAvtalerTable = getPrivatePensjonsAvtaler(
    privatePensjonsAvtaler,
    intl
  )
  const offentligTpTable = getOffentligTpTable({
    offentligTp,
    intl,
  })
  return `<h3>Pensjonsavtaler (arbeidsgivere m.m.)</h3>
        ${privatePensjonsAvtalerTable}
        ${offentligTpTable}`
}

export function getPrivatePensjonsavtalerAlertsText({
  pensjonsavtalerAlertsList,
  intl,
}: {
  pensjonsavtalerAlertsList: privatePensjonsavtalerAlert[]
  intl: IntlShape
}): string {
  const html = pensjonsavtalerAlertsList.length
    ? pensjonsavtalerAlertsList.map((alert) => {
        return `${alert.headingId ? `<h4>${intl.formatMessage({ id: alert.headingId })}</h4>` : ''}
        <table role='presentation' class='alert-box' style='width: 100%; margin-bottom: 1em;'>
    <tr>
      <td style='width: 20px; vertical-align: top; padding: 16px 8px 16px 16px; margin: 0; border: none;'>
        <span class='infoIconContainer'>
          ${ALERT_TRIANGLE_ICON}
        </span>
      </td>
      <td style='vertical-align: top; padding: 16px 16px 16px 8px; margin: 0; text-align: left; border: none;'>
        <p style='margin: 0; padding: 0;'>${intl.formatMessage(
          { id: alert.alertTextId },
          {
            ...pdfFormatMessageValues,
          }
        )}</p>
      </td>
    </tr>
  </table>`
      })
    : []

  return html.join('')
}

export function getOffentligTjenestePensjonAlertsText({
  offentligTpAlertsList,
  offentligTp,
  intl,
}: {
  offentligTpAlertsList: OffentligTpAlert[]
  offentligTp?: OffentligTpResponse
  intl: IntlShape
}): string {
  const html = offentligTpAlertsList.length
    ? offentligTpAlertsList.map((alert) => {
        const leverandoerList = offentligTp?.data?.muligeTpLeverandoerListe
        const chunk =
          alert.hasLeverandoerList && leverandoerList
            ? formatLeverandoerList(intl.locale, leverandoerList)
            : undefined
        return `<h4>${intl.formatMessage({ id: 'pensjonsavtaler.offentligtp.title' }, { chunk: chunk ? chunk : undefined })}</h4>
        <table role='presentation' class='alert-box' style='width: 100%; margin-bottom: 1em;'>
    <tr>
      <td style='width: 20px; vertical-align: top; padding: 16px 8px 16px 16px; margin: 0; border: none;'>
        <span class='infoIconContainer'>
          ${ALERT_TRIANGLE_ICON}
        </span>
      </td>
      <td style='vertical-align: top; padding: 16px 16px 16px 8px; margin: 0; text-align: left; border: none;'>
        <p style='margin: 0; padding: 0;'>${intl.formatMessage(
          { id: alert.alertTextId },
          {
            ...pdfFormatMessageValues,
          }
        )}</p>
      </td>
    </tr>
  </table>`
      })
    : []

  return html.join('')
}

export const getSivilstandIngress = ({
  intl,
  formatertSivilstand,
}: {
  intl: IntlShape
  formatertSivilstand: string
}): string => {
  return `<div>
    <div><b>${intl.formatMessage({ id: 'grunnlag.sivilstand.title' })}: </b>${formatertSivilstand}</div>
    <p>${intl.formatMessage(
      { id: 'grunnlag.sivilstand.ingress' },
      {
        ...pdfFormatMessageValues,
        garantiPensjonLink: (chunks: string[]) =>
          getPdfLink({
            url: GARANTI_PENSJON_URL,
            displayText: chunks.join('') || 'Om garantipensjon og satser',
          }),
      }
    )}
    </p>
  </div>`
}

export const getUtenlandsOppholdIngress = ({
  intl,
  oppholdUtenforNorge,
  sortedUtenlandsperioder,
}: {
  intl: IntlShape
  oppholdUtenforNorge:
    | 'mindre_enn_5_aar'
    | 'mer_enn_5_aar'
    | 'for_lite_trygdetid'
    | 'endring'
  sortedUtenlandsperioder?: Utenlandsperiode[]
}): string => {
  return `<h3>
      ${intl.formatMessage({
        id: `grunnlag.opphold.title.${oppholdUtenforNorge}`,
      })}: ${intl.formatMessage({
        id: `grunnlag.opphold.value.${oppholdUtenforNorge}`,
      })}
    </h3>
    <h4 class="utenlandsopphold-title">${intl.formatMessage({ id: 'stegvisning.utenlandsopphold.oppholdene.title' })}</h4>
    <div>${getLandList(intl, sortedUtenlandsperioder)}</div>
    <p>${intl.formatMessage({ id: 'grunnlag.opphold.bunntekst' })}</p>`
}

function getLandList(
  intl: IntlShape,
  sortedUtenlandsperioder?: Utenlandsperiode[]
): string {
  const locale = getSelectedLanguage()
  if (!sortedUtenlandsperioder || sortedUtenlandsperioder.length === 0) {
    return ''
  }
  const html = sortedUtenlandsperioder.map((utenlandsperiode) => {
    const harLocalLandKravOmArbeid = harKravOmArbeidFromLandkode(
      utenlandsperiode.landkode
    )
    return `<div class="utenlandsopphold-land-item">
      <div><b>
        ${getTranslatedLandFromLandkode(utenlandsperiode.landkode, locale)}</b>
      </div>
      <div>
       ${intl.formatMessage({ id: 'stegvisning.utenlandsopphold.oppholdene.description.periode' })}
          ${utenlandsperiode.startdato}
          ${
            utenlandsperiode.sluttdato
              ? `–${utenlandsperiode.sluttdato}`
              : ` ${intl.formatMessage({ id: 'stegvisning.utenlandsopphold.oppholdene.description.periode.varig_opphold' })}`
          }
                  
      </div>
      ${
        harLocalLandKravOmArbeid
          ? `<div>
          ${intl.formatMessage({ id: 'stegvisning.utenlandsopphold.oppholdene.description.har_jobbet' })}
          ${intl.formatMessage({
            id: utenlandsperiode.arbeidetUtenlands
              ? 'stegvisning.utenlandsopphold.oppholdene.description.har_jobbet.ja'
              : 'stegvisning.utenlandsopphold.oppholdene.description.har_jobbet.nei',
          })}
        </div>`
          : ''
      }
    </div>`
  })

  return html.join('')
}
