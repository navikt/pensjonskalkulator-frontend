import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { PencilIcon } from '@navikt/aksel-icons'
import {
  BodyLong,
  BodyShort,
  Button,
  Modal,
  TextField,
  VStack,
} from '@navikt/ds-react'

import { useAppSelector } from '@/state/hooks'
import { selectAarligInntektFoerUttakBeloepFraSkatt } from '@/state/userInput/selectors'
import { formatWithoutDecimal, validateInntekt } from '@/utils/inntekt'
import { logger } from '@/utils/logging'
import { getFormatMessageValues } from '@/utils/translations'

import styles from './EndreInntekt.module.scss'

interface Props {
  visning: BeregningVisning
  className?: string
  buttonLabel?: string
  value: number | null
  onSubmit: (inntekt: number) => void
}
export const EndreInntekt: React.FC<Props> = ({
  visning,
  className,
  buttonLabel,
  value,
  onSubmit: onSubmitCallback,
}) => {
  const intl = useIntl()

  const inntektModalRef = React.useRef<HTMLDialogElement>(null)

  const aarligInntektFoerUttakBeloepFraSkatt = useAppSelector(
    selectAarligInntektFoerUttakBeloepFraSkatt
  )

  const [validationError, setValidationError] = React.useState<string>('')
  const [oppdatertInntekt, setOppdatertInntekt] = React.useState<string>(
    value ? value.toString() : ''
  )

  React.useEffect(() => {
    setOppdatertInntekt(value ? value.toString() : '')
  }, [value])

  const handleTextfieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setOppdatertInntekt(e.target.value)
    setValidationError('')
  }

  const openInntektModal = () => {
    logger('modal åpnet', {
      tekst: `Modal: Endring av pensjonsgivende inntekt ${visning}`,
    })
    inntektModalRef.current?.showModal()
  }

  const updateValidationErrorMessage = (id: string) => {
    setValidationError(
      intl.formatMessage({
        id,
      })
    )
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const inntektData = data.get('inntekt') as string | undefined

    if (validateInntekt(inntektData, updateValidationErrorMessage)) {
      logger('button klikk', {
        tekst: `endrer pensjonsgivende inntekt ${visning}`,
      })
      window.scrollTo(0, 0)
      /* c8 ignore next 3 */
      if (inntektModalRef.current?.open) {
        setOppdatertInntekt('')
        inntektModalRef.current?.close()
      }
      onSubmitCallback(parseInt((inntektData as string).replace(/ /g, ''), 10))
    }
  }

  const onCancel = (): void => {
    setOppdatertInntekt('')
    setValidationError('')
    if (inntektModalRef.current?.open) {
      inntektModalRef.current?.close()
    }
  }

  return (
    <>
      <Modal
        ref={inntektModalRef}
        header={{
          heading: intl.formatMessage({
            id: 'inntekt.endre_inntekt_modal.title',
          }),
        }}
        onClose={onCancel}
        width="small"
      >
        <Modal.Body>
          {visning === 'avansert' && (
            <BodyLong>
              <FormattedMessage
                id="grunnlag.inntekt.ingress"
                values={{
                  ...getFormatMessageValues(intl),
                  beloep: formatWithoutDecimal(
                    aarligInntektFoerUttakBeloepFraSkatt?.beloep
                  ),
                  aar: aarligInntektFoerUttakBeloepFraSkatt?.aar,
                }}
              />
              <br />
              <br />
            </BodyLong>
          )}
          <form id="oppdatere-inntekt" method="dialog" onSubmit={onSubmit}>
            <VStack gap="4">
              <TextField
                data-testid="inntekt-textfield"
                type="text"
                inputMode="numeric"
                name="inntekt"
                className={styles.textfield}
                label={intl.formatMessage({
                  id: 'inntekt.endre_inntekt_modal.textfield.label',
                })}
                description={intl.formatMessage({
                  id: 'inntekt.endre_inntekt_modal.textfield.description',
                })}
                error={validationError}
                onChange={handleTextfieldChange}
                value={oppdatertInntekt}
                max={5}
              />
              {visning === 'enkel' && (
                <BodyShort>
                  <FormattedMessage id="inntekt.endre_inntekt_modal.paragraph" />
                </BodyShort>
              )}
            </VStack>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button form="oppdatere-inntekt">
            {intl.formatMessage({
              id: 'inntekt.endre_inntekt_modal.button',
            })}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {intl.formatMessage({
              id: 'stegvisning.avbryt',
            })}
          </Button>
        </Modal.Footer>
      </Modal>

      <Button
        className={className ? className : ''}
        variant="tertiary"
        size="small"
        icon={<PencilIcon aria-hidden />}
        onClick={openInntektModal}
      >
        {intl.formatMessage({
          id: buttonLabel ?? 'inntekt.endre_inntekt_modal.open.button',
        })}
      </Button>
    </>
  )
}
