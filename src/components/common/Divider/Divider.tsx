import clsx from 'clsx'

import styles from './Divider.module.scss'

interface Props {
  smallMargin?: boolean
  noMargin?: boolean
}

export const Divider = ({ smallMargin, noMargin }: Props) => (
  <hr
    className={clsx(styles.divider, {
      [styles.divider__smallMargin]: smallMargin,
      [styles.divider__noMargin]: noMargin,
    })}
  />
)
