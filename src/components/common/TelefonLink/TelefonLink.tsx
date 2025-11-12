import { FormattedMessage, useIntl } from 'react-intl'

export const TelefonLink = () => {
  const intl = useIntl()
  return (
    <a href={`tel:${intl.formatMessage({ id: 'link.telefon_pensjon' })}`}>
      <FormattedMessage id="link.telefon_pensjon" />
    </a>
  )
}
