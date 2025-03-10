import { useRef, useEffect, useState } from 'react'

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
  const embedRef = useRef<HTMLDivElement>(null)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    if (!embedRef.current) return

    const embedElement =
      embedRef.current.querySelector(`[data-uxsignals-embed="${id}"]`) ||
      embedRef.current

    const computedStyle = window.getComputedStyle(embedElement)

    if (
      computedStyle.display === 'none' ||
      embedElement.getAttribute('style')?.includes('display: none')
    ) {
      setIsHidden(true)
    }
  }, []) // Runs only once on mount

  if (!ready) return null

  return (
    <div
      className={styles.container}
      style={isHidden ? { display: 'none' } : undefined}
    >
      <section className={clsx(styles.section, styles[breakpoint])}>
        <div
          ref={embedRef}
          data-uxsignals-embed={id}
          style={{ maxWidth: width }}
        />
      </section>
    </div>
  )
}
