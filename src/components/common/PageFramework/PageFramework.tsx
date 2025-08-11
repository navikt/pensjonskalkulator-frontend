import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { useLocation, useNavigation } from 'react-router'

import { Loader } from '@/components/common/Loader'
import { HOST_BASEURL } from '@/paths'
import { RootState } from '@/state/store'

import { CheckLoginOnFocus } from './CheckLoginOnFocus'
import { FrameComponent } from './FrameComponent'

function RedirectElement() {
  useEffect(() => {
    window.open(
      `${HOST_BASEURL}/oauth2/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      '_self'
    )
  }, [])

  return <div />
}

export const PageFramework: React.FC<{
  isFullWidth?: boolean
  hasWhiteBg?: boolean
  hasToggleBg?: boolean
  shouldShowLogo?: boolean
  shouldRedirectNonAuthenticated?: boolean
  showLoader?: boolean
  children?: React.JSX.Element
}> = ({
  shouldRedirectNonAuthenticated = true,
  showLoader = true,
  children,
  ...rest
}) => {
  const intl = useIntl()
  const { pathname } = useLocation()
  const { state } = useNavigation()
  const isLoggedIn = useSelector(
    (rootState: RootState) => rootState.session.isLoggedIn
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (!isLoggedIn && shouldRedirectNonAuthenticated) {
    return <RedirectElement />
  }

  if (state === 'loading' && showLoader) {
    return (
      <FrameComponent {...rest}>
        <Loader
          data-testid="pageframework-loader"
          size="3xlarge"
          title={intl.formatMessage({ id: 'pageframework.loading' })}
        />
      </FrameComponent>
    )
  }

  return (
    <CheckLoginOnFocus
      shouldRedirectNonAuthenticated={shouldRedirectNonAuthenticated}
    >
      <FrameComponent {...rest}>{children}</FrameComponent>
    </CheckLoginOnFocus>
  )
}

export default PageFramework
