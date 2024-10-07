import { RouteObject, Navigate, Outlet } from 'react-router-dom'

import { PageFramework } from '@/components/common/PageFramework'
import { Beregning } from '@/pages/Beregning'
import { Forbehold } from '@/pages/Forbehold'
import { Henvisning } from '@/pages/Henvisning'
import { LandingPage } from '@/pages/LandingPage'
import { Personopplysninger } from '@/pages/Personopplysninger'
import { StepAFP } from '@/pages/StepAFP'
import { StepFeil } from '@/pages/StepFeil'
import { StepSamtykkeOffentligAFP } from '@/pages/StepSamtykkeOffentligAFP'
import { StepSamtykkePensjonsavtaler } from '@/pages/StepSamtykkePensjonsavtaler'
import { StepSivilstand } from '@/pages/StepSivilstand'
import { StepStart } from '@/pages/StepStart'
import { StepUfoeretrygdAFP } from '@/pages/StepUfoeretrygdAFP'
import { StepUtenlandsopphold } from '@/pages/StepUtenlandsopphold'
import { RouteErrorBoundary } from '@/router/RouteErrorBoundary'

import { paths } from './constants'
import {
  directAccessGuard,
  authenticationGuard,
  landingPageAccessGuard,
  stepStartAccessGuard,
  stepSivilstandAccessGuard,
  stepAFPAccessGuard,
  stepUfoeretrygdAFPAccessGuard,
  stepSamtykkeOffentligAFPAccessGuard,
} from './loaders'
import { IngenTilgang } from '@/pages/IngenTilgang'

export const routes: RouteObject[] = [
  {
    loader: authenticationGuard,
    element: (
      <PageFramework
        shouldShowLogo
        hasWhiteBg
        shouldRedirectNonAuthenticated={false}
      >
        <Outlet />
      </PageFramework>
    ),
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: paths.root,
        element: <Navigate to={paths.login} replace />,
      },
      {
        loader: landingPageAccessGuard,
        path: paths.login,
        element: <LandingPage />,
      },
      {
        path: paths.personopplysninger,
        element: <Personopplysninger />,
      },
    ],
  },
  {
    loader: authenticationGuard,
    element: (
      <PageFramework>
        <Outlet />
      </PageFramework>
    ),
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        loader: stepStartAccessGuard,
        path: paths.start,
        element: <StepStart />,
      },
      {
        path: `${paths.henvisning}/:id`,
        element: <Henvisning />,
      },
      {
        path: paths.forbehold,
        element: <Forbehold />,
      },
      {
        loader: stepSivilstandAccessGuard,
        path: paths.sivilstand,
        element: <StepSivilstand />,
      },
      {
        loader: directAccessGuard,
        path: paths.utenlandsopphold,
        element: <StepUtenlandsopphold />,
      },
      {
        loader: stepAFPAccessGuard,
        path: paths.afp,
        element: <StepAFP />,
      },
      {
        loader: stepUfoeretrygdAFPAccessGuard,
        path: paths.ufoeretrygdAFP,
        element: <StepUfoeretrygdAFP />,
      },
      {
        loader: stepSamtykkeOffentligAFPAccessGuard,
        path: paths.samtykkeOffentligAFP,
        element: <StepSamtykkeOffentligAFP />,
      },
      {
        loader: directAccessGuard,
        path: paths.samtykke,
        element: <StepSamtykkePensjonsavtaler />,
      },
      {
        loader: directAccessGuard,
        path: paths.uventetFeil,
        element: <StepFeil />,
      },
      {
        loader: directAccessGuard,
        path: paths.ingenTilgang,
        element: <IngenTilgang />,
      },
    ],
  },
  {
    loader: authenticationGuard,
    element: (
      <PageFramework isFullWidth hasWhiteBg>
        <Outlet />
      </PageFramework>
    ),
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        loader: directAccessGuard,
        path: paths.beregningEnkel,
        element: <Beregning visning="enkel" />,
      },
      {
        loader: directAccessGuard,
        path: paths.beregningAvansert,
        element: <Beregning visning="avansert" />,
      },
    ],
  },
]
