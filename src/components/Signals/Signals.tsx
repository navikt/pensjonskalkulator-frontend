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

    // Function to check if the element is hidden
    const checkIfHidden = () => {
      const embedElement =
        embedRef.current?.querySelector(`[data-uxsignals-embed="${id}"]`) ||
        embedRef.current

      if (!embedElement) return

      const computedStyle = window.getComputedStyle(embedElement)
      const inlineStyle = embedElement.getAttribute('style')

      const isCurrentlyHidden = !!(
        computedStyle.display === 'none' ||
        inlineStyle?.includes('display: none')
      )

      setIsHidden(isCurrentlyHidden)
    }

    // Check immediately
    checkIfHidden()

    // Set up a MutationObserver to detect style changes
    const observer = new MutationObserver((mutations) => {
      // Only check if we have style attribute changes
      const hasStyleChanges = mutations.some(
        (mutation) =>
          mutation.type === 'attributes' && mutation.attributeName === 'style'
      )

      if (hasStyleChanges) {
        checkIfHidden()
      }
    })

    // We need to observe the parent container as well since UX Signals might
    // create new elements or modify the DOM structure
    if (embedRef.current) {
      observer.observe(embedRef.current, {
        attributes: true,
        attributeFilter: ['style'],
        childList: true, // Watch for added/removed children
        subtree: true, // Watch all descendants
      })
    }

    // Clean up
    return () => {
      observer.disconnect()
    }
  }, [id]) // Run when id changes

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
