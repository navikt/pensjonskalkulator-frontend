import { ExternalLink } from '@/components/common/ExternalLink'
import { externalUrls } from '@/router/constants'

const externalLinks = {
  detaljertKalkulatorLink: externalUrls.detaljertKalkulator,
  dinPensjonBeholdningLink: externalUrls.dinPensjonBeholdning,
  dinPensjonEndreSoeknadLink: externalUrls.dinPensjonEndreSoeknad,
  alderspensjonsreglerLink: externalUrls.alderspensjonsregler,
  garantiPensjonLink: externalUrls.garantipensjon,
  afpLink: externalUrls.afp,
  afpPrivatLink: externalUrls.afpPrivat,
  norskPensjonLink: externalUrls.norskPensjon,
  navPersonvernerklaeringLink: externalUrls.personvernerklaering,
  navPersonvernerklaeringKontaktOssLink:
    externalUrls.personvernerklaeringKontaktOss,
  kontaktOssLink: externalUrls.kontaktOss,
  planleggePensjonLink: externalUrls.planleggePensjon,
  trygdetidLink: externalUrls.trygdetid,
  kortBotidLink: externalUrls.kortBotid,
  personopplysningerLink: externalUrls.personopplysninger,
  spkLink: externalUrls.spk,
  klpLink: externalUrls.klp,
}

const externalLinkComponents = Object.fromEntries(
  Object.entries(externalLinks).map(([key, href]) => [
    key,
    (chunks: React.ReactNode) => (
      <ExternalLink href={href}>{chunks}</ExternalLink>
    ),
  ])
)

export const getFormatMessageValues = (): Record<
  string,
  React.ReactNode | ((chunks: React.ReactNode) => React.ReactNode)
> => {
  return {
    ...externalLinkComponents,
    br: <br />,
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    nowrap: (chunks: React.ReactNode) => (
      <span className="nowrap">{chunks}</span>
    ),
  }
}
