import React from 'react'
import { useIntl } from 'react-intl'
import { useLoaderData, useLocation, useNavigation } from 'react-router'

import { Loader } from '@/components/common/Loader'
import { HOST_BASEURL } from '@/paths'
import { LoginContext, authenticationGuard } from '@/router/loaders'

import { CheckLoginOnFocus } from './CheckLoginOnFocus'
import { FrameComponent } from './FrameComponent'

function RedirectElement() {
  React.useEffect(() => {
    window.open(
      `${HOST_BASEURL}/oauth2/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      '_self'
    )
  }, [])

  React.useEffect(() => {
    // Håndter tilbakeknapp i browser, bfcache - https://web.dev/articles/bfcache
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [])

  return <span data-testid="redirect-element" />
}

export const PageFramework: React.FC<{
  isFullWidth?: boolean
  hasWhiteBg?: boolean
  hasToggleBg?: boolean
  shouldShowLogo?: boolean
  shouldRedirectNonAuthenticated?: boolean
  children?: React.JSX.Element
}> = (props) => {
  const { shouldRedirectNonAuthenticated = true, children, ...rest } = props
  const intl = useIntl()
  const { pathname } = useLocation()
  const { state } = useNavigation()
  const { authResponse } = useLoaderData<typeof authenticationGuard>()

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (state === 'loading')
    return (
      <FrameComponent {...rest}>
        <Loader
          data-testid="pageframework-loader"
          size="3xlarge"
          title={intl.formatMessage({ id: 'pageframework.loading' })}
        />
      </FrameComponent>
    )

  // Når det oppstår en feil ved fetch: Hvis det er påkrevd å være pålogget rediriger til login,
  // hvis ikke "fail silently", vis siden som vanlig og sett isLoggedIn til false.
  if (!authResponse.ok) {
    if (shouldRedirectNonAuthenticated) {
      return <RedirectElement />
    }
    return (
      <FrameComponent {...rest}>
        {children &&
          React.cloneElement(children, {
            context: {
              isLoggedIn: false,
            } satisfies LoginContext,
          })}
      </FrameComponent>
    )
  }

  return (
    <CheckLoginOnFocus
      shouldRedirectNonAuthenticated={shouldRedirectNonAuthenticated}
    >
      <FrameComponent {...rest}>
        {children &&
          React.cloneElement(children, {
            context: {
              isLoggedIn: authResponse.ok,
            } satisfies LoginContext,
          })}
      </FrameComponent>
    </CheckLoginOnFocus>
  )
}

export default PageFramework
