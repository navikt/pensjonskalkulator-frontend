import React from 'react'

import { isAnchorTag } from '@/state/api/typeguards'
import { logger } from '@/utils/logging'

interface IProps {
  rootEl: HTMLElement
  children: React.ReactNode
}

export const GlobalLogWrapper: React.FC<IProps> = ({ rootEl, children }) => {
  // Logg til amplitude når man trykker på lenker
  React.useEffect(() => {
    const handleNewWindow = (e: MouseEvent) => {
      if (isAnchorTag(e.target) && e.target.href) {
        const { href, target } = e.target
        logger('link åpnet', {
          href,
          target,
        })
      }
    }

    rootEl.addEventListener('click', handleNewWindow)

    return () => rootEl.removeEventListener('click', handleNewWindow)
  }, [])

  return children
}
