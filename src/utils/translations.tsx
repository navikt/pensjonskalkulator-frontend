import { IntlShape } from 'react-intl'

import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { Link } from '@navikt/ds-react'

import { ExternalLink } from '@/components/common/ExternalLink'
import { externalUrls } from '@/router/constants'

import { logOpenLink } from './logging'

export const getFormatMessageValues = (
  intl: IntlShape
): Record<
  string,
  React.ReactNode | ((chunks: React.ReactNode) => React.ReactNode)
> => {
  return {
    detaljertKalkulatorLink: (chunks: React.ReactNode) => (
      <ExternalLink href={externalUrls.detaljertKalkulator}>
        {chunks}
      </ExternalLink>
    ),
    dinPensjonLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.dinPensjon}
        target="_blank"
        inlineText
      >
        {chunks}
        title={intl.formatMessage({ id: 'application.global.external_link' })}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    dinPensjonBeholdningLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.dinPensjonBeholdning}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    dinPensjonEndreSoeknadLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.dinPensjonEndreSoeknad}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    alderspensjonsreglerLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.alderspensjonsregler}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    garantiPensjonLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.garantipensjon}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    afpLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.afp}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    afpPrivatLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.afpPrivat}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    norskPensjonLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.norskPensjon}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    navPersonvernerklaeringLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.personvernerklaering}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    navPersonvernerklaeringKontaktOssLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.personvernerklaeringKontaktOss}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    kontaktOssLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.kontaktOss}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    planleggePensjonLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.planleggePensjon}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    trygdetidLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.trygdetid}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    kortBotidLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.kortBotid}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    personopplysningerLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.personopplysninger}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    spkLink: (chunks: React.ReactNode) => (
      <Link
        onClick={logOpenLink}
        href={externalUrls.spk}
        target="_blank"
        inlineText
      >
        {chunks}
        <ExternalLinkIcon
          title={intl.formatMessage({ id: 'application.global.external_link' })}
          width="1.25rem"
          height="1.25rem"
        />
      </Link>
    ),
    br: <br />,
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
    nowrap: (chunks: React.ReactNode) => (
      <span className="nowrap">{chunks}</span>
    ),
  }
}
