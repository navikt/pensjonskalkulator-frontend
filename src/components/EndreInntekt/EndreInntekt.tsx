import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { PencilIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Modal, TextField, VStack } from '@navikt/ds-react'

import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectaarligInntektFoerUttakBeloepFraBrukerInput } from '@/state/userInput/selectors'
import { userInputActions } from '@/state/userInput/userInputReducer'
import { validateInntekt } from '@/utils/inntekt'
import { logger } from '@/utils/logging'

interface Props {
  className?: string
  buttonLabel?: string
}
export const EndreInntekt: React.FC<Props> = ({ className, buttonLabel }) => {
  const intl = useIntl()
  const dispatch = useAppDispatch()

  const inntektModalRef = React.useRef<HTMLDialogElement>(null)
  const aarligInntektFoerUttakBeloepFraBrukerInput = useAppSelector(
    selectaarligInntektFoerUttakBeloepFraBrukerInput
  )

  const [validationError, setValidationError] = React.useState<string>('')
  const [oppdatertInntekt, setOppdatertInntekt] = React.useState<string>(
    aarligInntektFoerUttakBeloepFraBrukerInput?.toString() ?? ''
  )

  const handleTextfieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setOppdatertInntekt(e.target.value)
    setValidationError('')
  }

  const openInntektModal = () => {
    logger('modal åpnet', {
      tekst: 'Modal: Endring av pensjonsgivende inntekt',
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
      dispatch(
        userInputActions.setCurrentSimulationaarligInntektFoerUttakBeloep(
          parseInt((inntektData as string).replace(/ /g, ''), 10)
        )
      )
      dispatch(userInputActions.setCurrentSimulationUttaksalder(null))
      logger('button klikk', {
        tekst: 'endrer pensjonsgivende inntekt',
      })
      window.scrollTo(0, 0)
      /* c8 ignore next 3 */
      if (inntektModalRef.current?.open) {
        setOppdatertInntekt('')
        inntektModalRef.current?.close()
      }
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
          <form id="oppdatere-inntekt" method="dialog" onSubmit={onSubmit}>
            <VStack gap="4">
              <TextField
                data-testid="inntekt-textfield"
                type="text"
                inputMode="numeric"
                name="inntekt"
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
              <BodyShort>
                <FormattedMessage id="inntekt.endre_inntekt_modal.paragraph" />
              </BodyShort>
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
        variant="secondary"
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
