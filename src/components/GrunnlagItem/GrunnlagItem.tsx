import clsx from 'clsx'
import React, { ReactNode } from 'react'

import { Box } from '@navikt/ds-react'

import styles from './GrunnlagItem.module.scss'

export interface GrunnlagItemProps {
  children: ReactNode
  color: 'purple' | 'blue' | 'green' | 'gray'
}

export const GrunnlagItem: React.FC<GrunnlagItemProps> = ({
  children,
  color,
}) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    <Box className={clsx(styles.border, styles[color])}>
      <Box paddingInline="3 0" paddingBlock="4">
        {children}
      </Box>
    </Box>
  )
}
