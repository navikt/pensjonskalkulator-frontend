import clsx from 'clsx'
import { format, parseISO } from 'date-fns'
import { FormattedMessage } from 'react-intl'

import { LocalAlert } from '@navikt/ds-react'

import { DATE_ENDUSER_FORMAT } from '@/utils/dates'
import { ALERT_VIST } from '@/utils/loggerConstants'
import { logger } from '@/utils/logging'

import styles from './InfoOmFremtidigVedtak.module.scss'

interface Props {
  loependeVedtak: LoependeVedtak
  isCentered?: boolean
}

export const InfoOmFremtidigVedtak = ({
  loependeVedtak,
  isCentered,
}: Props) => {
  // Vis hvis fremtidig vedtak uten gjeldende vedtak
  if (!loependeVedtak.fremtidigAlderspensjon || loependeVedtak.alderspensjon)
    return null

  logger(ALERT_VIST, {
    tekst: 'Bruker har fremtidig vedtak uten gjeldende vedtak',
    variant: 'info',
  })

  return (
    <LocalAlert
      className={clsx(styles.alert, { [styles.alert__centered]: isCentered })}
      status="announcement"
      data-intl="stegvisning.fremtidigvedtak.alert"
    >
      <LocalAlert.Content>
        <FormattedMessage
          id="stegvisning.fremtidigvedtak.alert"
          values={{
            grad: loependeVedtak.fremtidigAlderspensjon.grad,
            fom: format(
              parseISO(loependeVedtak.fremtidigAlderspensjon.fom),
              DATE_ENDUSER_FORMAT
            ),
          }}
        />
      </LocalAlert.Content>
    </LocalAlert>
  )
}
