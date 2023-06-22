import { Outlet, RouteObject } from 'react-router-dom'

import { Pensjonsberegning } from '@/containers/Pensjonsberegning'
import { LandingPage } from '@/routes/LandingPage'
import { PageFramework } from '@/routes/PageFramework'
import { RouteErrorBoundary } from '@/routes/RouteErrorBoundary'
import { Step1 } from '@/routes/stegvisning/Step1'
import { Step2 } from '@/routes/stegvisning/Step2'
import { Step3 } from '@/routes/stegvisning/Step3'
import { Step4 } from '@/routes/stegvisning/Step4'
import { Step5 } from '@/routes/stegvisning/Step5'

export const ROUTER_BASE_URL = '/pensjon/kalkulator'

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
        element: <LandingPage />,
      },
      {
        path: '/start',
        element: <Step1 />,
      },
      {
        path: '/samtykke',
        element: <Step2 />,
      },
      {
        path: '/offentlig-tp',
        element: <Step3 />,
      },
      {
        path: '/afp',
        element: <Step4 />,
      },
      {
        path: '/sivilstand',
        element: <Step5 />,
      },
      {
        path: '/beregning',
        element: <Pensjonsberegning />,
      },
    ],
  },
]
