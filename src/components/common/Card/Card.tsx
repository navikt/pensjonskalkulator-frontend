import clsx from 'clsx'
import React from 'react'

import styles from './Card.module.scss'
import { CardContent, CardContentProps } from './CardContent'

export interface CardComponent extends React.FC<CardProps> {
  Content: React.FC<CardContentProps>
}

type CardProps = React.HTMLAttributes<HTMLElement> & {
  hasLargePadding?: boolean
  hasMargin?: boolean
}

export const Card = (({
  className,
  children,
  hasLargePadding,
  hasMargin,
  ...elementProps
}) => {
  return (
    <section
      className={clsx(
        styles.section,
        {
          [styles.section__largePadding]: hasLargePadding,
          [styles.section__marginBotton]: hasMargin,
        },
        className
      )}
      {...elementProps}
    >
      {children}
    </section>
  )
}) as CardComponent

Card.Content = CardContent
