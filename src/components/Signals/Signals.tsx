import clsx from 'clsx'

import useSignals from './hooks'

import styles from './Signals.module.scss'

interface Props {
  id: string
  ready?: boolean
  width?: string
  breakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
}

export const Signals = ({
  id,
  ready = true,
  width = '632px',
  breakpoint = 'xs',
}: Props) => {
  useSignals(ready)

  return (
    <section
      className={clsx(styles.section, {
        [styles[breakpoint]]: breakpoint,
      })}
    >
      <div data-uxsignals-embed={id} style={{ maxWidth: width }} />
    </section>
  )
}
