import { redirect } from 'react-router'
import { RouteObject, Navigate, Outlet } from 'react-router-dom'

import { Pensjonsberegning } from '@/containers/Pensjonsberegning'
import { LandingPage } from '@/routes/LandingPage'
import { PageFramework } from '@/routes/PageFramework'
import { RouteErrorBoundary } from '@/routes/RouteErrorBoundary'
import { Step1 } from '@/routes/stegvisning/Step1'
import { Step2 } from '@/routes/stegvisning/Step2'
import { Step3 } from '@/routes/stegvisning/Step3'
import { step3loader } from '@/routes/stegvisning/Step3/utils'
import { Step4 } from '@/routes/stegvisning/Step4'
import { Step5 } from '@/routes/stegvisning/Step5'
import { store } from '@/state/store'

export const ROUTER_BASE_URL = '/pensjon/kalkulator'

const directAccessGuard = async () => {
  // Dersom ingen kall er registrert i store betyr det at brukeren prøver å aksessere en url direkte
  if (
    store.getState().api.queries === undefined ||
    Object.keys(store.getState().api.queries).length === 0
  ) {
    return redirect('/start')
  }
  return null
}

export const routes: RouteObject[] = [
  {
    element: (
      <PageFramework>
        <Outlet />
      </PageFramework>
    ),
    ErrorBoundary: RouteErrorBoundary,
    children: [
      {
        path: '/',
        element: <Navigate to="/start" replace />,
      },
      {
        path: '/login',
        element: <LandingPage />,
      },
      {
        path: '/start',
        element: <Step1 />,
      },
      {
        path: '/samtykke',
        loader: directAccessGuard,
        element: <Step2 />,
      },
      {
        path: '/offentlig-tp',
        loader: step3loader,
        element: <Step3 />,
      },
      {
        path: '/afp',
        loader: directAccessGuard,
        element: <Step4 />,
      },
      {
        path: '/sivilstand',
        loader: directAccessGuard,
        element: <Step5 />,
      },
      {
        path: '/beregning',
        loader: directAccessGuard,
        element: <Pensjonsberegning />,
      },
    ],
  },
]
