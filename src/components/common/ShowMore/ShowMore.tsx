/* c8 ignore start */
import React, { forwardRef, useMemo, useRef, useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Button, Heading, HeadingProps, useId } from '@navikt/ds-react'
import cl from 'clsx'

import './ShowMore.styles.css'
import { logger } from '@/utils/logging'

type PossibleRef<T> = React.Ref<T> | undefined
export function mergeRefs<T>(refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref !== null && ref !== undefined) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}
export interface ShowMoreProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /**
   * Override what element to render the wrapper as.
   *
   * @default aside
   */
  as?: 'aside' | 'section'
  /**
   * Content. Is [inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert) when collapsed.
   */
  children: React.ReactNode
  /**
   * Changes button size
   *
   * @default medium
   */
  size?: 'medium' | 'small'
  /**
   * Changes background color
   *
   * @default default
   */
  variant?: 'default' | 'subtle' | 'info'
  /**
   * Custom height of content when collapsed.
   *
   * @default 10rem
   */
  collapsedHeight?: `${number}${string}` | number
  /**
   * Heading text. Always available to screen readers.
   * Used as accessible label unless you define `aria-label` or `aria-labelledby`.
   */
  heading?: string
  /**
   * Heading size
   *
   * @default medium
   */
  headingSize?: HeadingProps['size']
  /**
   * Heading level
   *
   * @default "1"
   */
  headingLevel?: HeadingProps['level']
  /**
   * Scroll back up to the component after collapsing.
   *
   * @default true
   */
  scrollBackOnCollapse?: boolean
  /**
   * Navn på på innhold.
   * Brukes til logging i amplitude
   */
  name: string
}

/**
 * A component for partially hiding less important content.
 *
 * @see [📝 Documentation](https://aksel.nav.no/komponenter/core/show-more)
 * @see 🏷️ {@link ShowMoreProps}
 *
 * @example
 * <ShowMore heading="Facts about toads">
 *   Toads have dry, leathery skin, short legs, and large bumps covering the parotoid glands.
 * </ShowMore>
 */
export const ShowMore = forwardRef<HTMLElement, ShowMoreProps>(
  (
    {
      as: Component = 'aside',
      children,
      size = 'medium',
      variant = 'default',
      collapsedHeight = '10rem',
      heading,
      headingSize = 'medium',
      headingLevel = '1',
      scrollBackOnCollapse = true,
      className,
      name,
      'aria-labelledby': ariaLabelledby,
      ...rest
    },
    ref
  ) => {
    const localRef = useRef<HTMLElement>(null)
    const mergedRef = useMemo(() => mergeRefs([localRef, ref]), [ref])
    const [isOpen, setIsOpen] = useState(false)
    const ariaLabelId = useId()

    const ChevronIcon = isOpen ? ChevronUpIcon : ChevronDownIcon

    const toggleOpen = () => {
      if (isOpen) {
        logger('show more lukket', { tekst: name })
        setIsOpen(false)
        if (scrollBackOnCollapse) {
          localRef.current?.scrollIntoView()
        }
      } else {
        logger('show more åpnet', { tekst: name })
        setIsOpen(true)
      }
    }

    return (
      <Component
        ref={mergedRef}
        className={cl(
          'navds-show-more',
          `navds-show-more--${variant}`,
          className,
          { 'navds-show-more--closed': !isOpen }
        )}
        aria-labelledby={
          !ariaLabelledby && !rest['aria-label'] ? ariaLabelId : ariaLabelledby
        }
        {...rest}
      >
        {heading && (
          <Heading size={headingSize} level={headingLevel} id={ariaLabelId}>
            {heading}
          </Heading>
        )}

        <div className="navds-show-more__button-section">
          <div className="navds-show-more__button-wrapper">
            <Button
              data-testid="showmore-button"
              type="button"
              variant="secondary-neutral"
              className="navds-show-more__button"
              icon={<ChevronIcon aria-hidden />}
              iconPosition="right"
              size={size}
              onClick={toggleOpen}
            >
              {isOpen ? 'Vis mindre' : 'Vis mer'}
            </Button>
          </div>
        </div>

        <div
          className="navds-show-more__content"
          style={isOpen ? {} : { height: collapsedHeight }}
          // @ts-expect-error https://github.com/DefinitelyTyped/DefinitelyTyped/pull/60822
          inert={isOpen ? undefined : ''}
        >
          {children}
        </div>
      </Component>
    )
  }
)

export default ShowMore
/* c8 ignore end */
