import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { describe } from 'vitest'

import { ROUTER_BASE_URL, routes } from '..'
import { render, screen, fireEvent, swallowErrors } from '@/test-utils'

describe('routes', () => {
  it('/pensjon/kalkulator viser landingssiden med lenke til stegvisning', async () => {
    const router = createMemoryRouter(routes, {
      basename: ROUTER_BASE_URL,
      initialEntries: ['/pensjon/kalkulator'],
    })
    await render(<RouterProvider router={router} />, {}, { hasRouter: false })

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Midlertidig landingsside'
    )

    await fireEvent.click(screen.getByText('Test kalkulatoren'))
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'stegvisning.stegvisning.start.title'
    )
  })

  it('/pensjon/kalkulator/start viser Steg 1', async () => {
    const router = createMemoryRouter(routes, {
      basename: ROUTER_BASE_URL,
      initialEntries: ['/pensjon/kalkulator/start'],
    })
    await render(<RouterProvider router={router} />, {}, { hasRouter: false })

    expect(
      screen.getByText('stegvisning.stegvisning.start.title')
    ).toBeInTheDocument()
  })

  it('/pensjon/kalkulator/samtykke viser Steg 2', async () => {
    const router = createMemoryRouter(routes, {
      basename: ROUTER_BASE_URL,
      initialEntries: ['/pensjon/kalkulator/samtykke'],
    })
    await render(<RouterProvider router={router} />, {}, { hasRouter: false })

    expect(
      screen.getByText('stegvisning.stegvisning.samtykke.title')
    ).toBeInTheDocument()
  })

  it('/pensjon/kalkulator/offentlig-tp viser Steg 3 (gitt at brukeren har samtykket)', async () => {
    const router = createMemoryRouter(routes, {
      basename: ROUTER_BASE_URL,
      initialEntries: ['/pensjon/kalkulator/offentlig-tp'],
    })
    await render(
      <RouterProvider router={router} />,
      {
        preloadedState: { userInput: { samtykke: true } },
      },
      { hasRouter: false }
    )

    expect(
      screen.getByText('stegvisning.stegvisning.offentligtp.title')
    ).toBeInTheDocument()
  })

  // it('/pensjon/kalkulator/afp viser Steg 4', async () => {
  //   const router = createMemoryRouter(routes, {
  //     basename: ROUTER_BASE_URL,
  //     initialEntries: ['/pensjon/kalkulator/afp'],
  //   })
  //   await render(<RouterProvider router={router} />, {}, { hasRouter: false })

  //   expect(
  //     screen.getByText('stegvisning.stegvisning.afp.title')
  //   ).toBeInTheDocument()
  // })

  it('/pensjon/kalkulator/beregning viser beregningen', async () => {
    const router = createMemoryRouter(routes, {
      basename: ROUTER_BASE_URL,
      initialEntries: ['/pensjon/kalkulator/beregning'],
    })
    await render(<RouterProvider router={router} />, {}, { hasRouter: false })

    expect(
      screen.getByText('Henter tidligste mulige uttaksalder')
    ).toBeInTheDocument()
  })

  it('Uregistrerte url med path /pensjon/kalkulator sender til 404 siden', async () => {
    const router = createMemoryRouter(routes, {
      basename: ROUTER_BASE_URL,
      initialEntries: ['/pensjon/kalkulator/abc'],
    })
    swallowErrors(async () => {
      await render(<RouterProvider router={router} />, {}, { hasRouter: false })

      expect(screen.getByText('Denne siden finnes ikke')).toBeInTheDocument()
    })
  })
})
