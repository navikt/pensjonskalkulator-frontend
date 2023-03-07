import React from 'react'

import cx from 'classnames'

import styles from './Frame.module.scss'

type FrameProps = React.HTMLAttributes<HTMLElement> & {
  tag?: 'div' | 'main'
  padded?: boolean
  flex?: boolean
}

export function Frame({
  tag = 'div',
  padded,
  flex,
  children,
  className,
  ...elementProps
}: FrameProps) {
  return React.createElement(
    tag,
    {
      className: cx(
        styles.frame,
        padded && styles.padded,
        flex && styles.flex,
        className
      ),
      ...elementProps,
    },
    children
  )
}
