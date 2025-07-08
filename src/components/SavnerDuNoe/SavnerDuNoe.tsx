import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router'

import { LinkCard } from '@navikt/ds-react'

import { BASE_PATH, externalUrls, paths } from '@/router/constants'
import { useAppDispatch } from '@/state/hooks'
import { userInputActions } from '@/state/userInput/userInputSlice'
import { wrapLogger } from '@/utils/logging'

import styles from './SavnerDuNoe.module.scss'

interface Props {
  isEndring: boolean
}

export const SavnerDuNoe = ({ isEndring }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const href = isEndring
    ? externalUrls.dinPensjonEndreSoeknad
    : `${BASE_PATH}${paths.beregningAvansert}`

  const onClick = (): void => {
    if (isEndring) {
      window.location.href = href
    } else {
      dispatch(userInputActions.flushCurrentSimulation())
      navigate(paths.beregningAvansert)
    }
  }

  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault()
    wrapLogger('button klikk', {
      tekst: 'Savner du noe?',
    })(onClick)()
  }

  return (
    <section className={styles.section}>
      <LinkCard>
        <LinkCard.Title>
          <LinkCard.Anchor href={href} onClick={handleClick}>
            <FormattedMessage
              id={isEndring ? 'savnerdunoe.title.endring' : 'savnerdunoe.title'}
            />
          </LinkCard.Anchor>
        </LinkCard.Title>

        <LinkCard.Description>
          {isEndring ? (
            <FormattedMessage id="savnerdunoe.ingress.endring" />
          ) : (
            <FormattedMessage id="savnerdunoe.ingress" />
          )}
        </LinkCard.Description>
      </LinkCard>
    </section>
  )
}
