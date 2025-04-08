import clsx from 'clsx'

import styles from './Divider.module.scss'

interface Props {
  smallMargin?: boolean
  smallMarginMobile?: boolean
  noMargin?: boolean
  noMarginBottom?: boolean
  withMarginBottom?: boolean
}

export const Divider = ({
  smallMargin,
  smallMarginMobile,
  noMargin,
  noMarginBottom,
  withMarginBottom,
}: Props) => (
  <hr
    className={clsx(styles.divider, {
      [styles.divider__smallMargin]: smallMargin,
      [styles.divider__smallMarginMobile]: smallMarginMobile,
      [styles.divider__noMargin]: noMargin,
      [styles.divider__noMarginBottom]: noMarginBottom,
      [styles.divider__withMarginBottom]: withMarginBottom,
    })}
  />
)
