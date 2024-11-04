import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  ChevronLeftCircleIcon,
  ChevronRightCircleIcon,
} from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import clsx from 'clsx'

import { onVisFaerreAarClick, onVisFlereAarClick } from '../utils'
import { wrapLogger } from '@/utils/logging'

import styles from './SimuleringGrafNavigation.module.scss'

interface Props {
  showVisFaerreAarButton: boolean
  showVisFlereAarButton: boolean
}

export const SimuleringGrafNavigation: React.FC<Props> = ({
  showVisFaerreAarButton,
  showVisFlereAarButton,
}) => {
  return (
    <div
      className={clsx(styles.grafNavigation, {
        [styles.grafNavigation__visible]:
          showVisFaerreAarButton || showVisFlereAarButton,
      })}
    >
      <div className={styles.grafNavigationElement}>
        {showVisFaerreAarButton && (
          <Button
            icon={<ChevronLeftCircleIcon aria-hidden />}
            iconPosition="left"
            size="xsmall"
            variant="tertiary"
            onClick={wrapLogger('button klikk', { tekst: 'Vis færre år' })(
              onVisFaerreAarClick
            )}
          >
            <FormattedMessage id="beregning.button.faerre_aar" />
          </Button>
        )}
      </div>
      <div
        className={`${styles.grafNavigationElement} ${styles.grafNavigationElement__Right}`}
      >
        {showVisFlereAarButton && (
          <Button
            icon={<ChevronRightCircleIcon aria-hidden />}
            iconPosition="right"
            size="xsmall"
            variant="tertiary"
            onClick={wrapLogger('button klikk', { tekst: 'Vis flere år' })(
              onVisFlereAarClick
            )}
          >
            <FormattedMessage id="beregning.button.flere_aar" />
          </Button>
        )}
      </div>
    </div>
  )
}
