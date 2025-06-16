import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

import {
  userInputInitialState,
  userInputSlice,
} from '@/state/userInput/userInputSlice'

import { DetaljRad } from '../../hooks'
import { Grunnpensjonsdetaljer } from '../Grunnpensjonsdetaljer'

const mockMessages = {
  'beregning.detaljer.fom': 'Fra og med',
  'beregning.detaljer.tom': 'Til og med',
  'beregning.detaljer.maaneder': 'måneder',
  'beregning.detaljer.kr': 'kr',
  'beregning.detaljer.grunnpensjon.heltUttak.title': 'Helt uttak',
  'beregning.detaljer.grunnpensjon.gradertUttak.title': 'Gradert uttak',
  'beregning.detaljer.grunnpensjon.table.title': 'Grunnpensjon (kr)',
}

const createMockStore = (customState = {}) => {
  const baseState = {
    ...userInputInitialState,
    currentSimulation: {
      ...userInputInitialState.currentSimulation,
      uttaksalder: { aar: 67, maaneder: 0 },
      gradertUttaksperiode: null,
      ...customState,
    },
  }

  return configureStore({
    reducer: {
      userInput: userInputSlice.reducer,
    },
    preloadedState: {
      userInput: baseState,
    },
  })
}

const renderWithProviders = (
  component: React.ReactElement,
  initialState = {}
) => {
  const store = createMockStore(initialState)
  return render(
    <Provider store={store}>
      <IntlProvider locale="nb" messages={mockMessages}>
        {component}
      </IntlProvider>
    </Provider>
  )
}

describe('Gitt at Grunnpensjonsdetaljer rendres', () => {
  const mockHeltUttakData: DetaljRad[] = [
    { tekst: 'Grunnpensjon (kap. 19)', verdi: '12 000 kr' },
    { tekst: 'Tilleggspensjon (kap. 19)', verdi: '8 000 kr' },
    { tekst: 'Skjermingstillegg (kap. 19)', verdi: '2 000 kr' },
    { tekst: 'Pensjonstillegg (kap. 19)', verdi: '1 000 kr' },
    { tekst: 'Inntektspensjon (kap. 20)', verdi: '15 000 kr' },
    { tekst: 'Garantipensjon (kap. 20)', verdi: '3 000 kr' },
    { tekst: 'Sum månedlig alderspensjon', verdi: '41 000 kr' },
  ]

  const mockGradertUttakData: DetaljRad[] = [
    { tekst: 'Grunnpensjon (kap. 19)', verdi: '6 000 kr' },
    { tekst: 'Tilleggspensjon (kap. 19)', verdi: '4 000 kr' },
    { tekst: 'Skjermingstillegg (kap. 19)', verdi: '1 000 kr' },
    { tekst: 'Inntektspensjon (kap. 20)', verdi: '7 500 kr' },
    { tekst: 'Garantipensjon (kap. 20)', verdi: '1 500 kr' },
    { tekst: 'Sum månedlig alderspensjon', verdi: '20 000 kr' },
  ]

  it('rendrer komponenten med kun helt uttak', () => {
    renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />
    )

    expect(screen.getByText('Grunnpensjon (kap. 19):')).toBeInTheDocument()
    expect(screen.getByText('12 000 kr')).toBeInTheDocument()
    expect(screen.getByText('Tilleggspensjon (kap. 19):')).toBeInTheDocument()
    expect(screen.getByText('8 000 kr')).toBeInTheDocument()
    expect(screen.getByText('Inntektspensjon (kap. 20):')).toBeInTheDocument()
    expect(screen.getByText('15 000 kr')).toBeInTheDocument()
    expect(screen.getByText('Sum månedlig alderspensjon:')).toBeInTheDocument()
    expect(screen.getByText('41 000 kr')).toBeInTheDocument()
  })

  it('rendrer både gradert og helt uttak når begge er tilgjengelige', () => {
    const stateWithGradertUttak = {
      gradertUttaksperiode: {
        uttaksalder: { aar: 62, maaneder: 6 },
        grad: 50,
      },
    }

    renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockGradertUttakData, mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />,
      stateWithGradertUttak
    )

    // Gradert uttak - check unique values to distinguish from helt uttak
    expect(screen.getByText('6 000 kr')).toBeInTheDocument() // Gradert uttak amount (unique)
    expect(screen.getByText('4 000 kr')).toBeInTheDocument() // Tilleggspensjon gradert (unique)
    expect(screen.getByText('20 000 kr')).toBeInTheDocument() // Sum gradert (unique)

    // Helt uttak - check unique values
    expect(screen.getByText('12 000 kr')).toBeInTheDocument() // Helt uttak amount (unique)
    expect(screen.getByText('8 000 kr')).toBeInTheDocument() // Tilleggspensjon helt (unique)
    expect(screen.getByText('41 000 kr')).toBeInTheDocument() // Sum helt (unique)

    // Check that both sections exist
    expect(screen.getAllByText('Grunnpensjon (kap. 19):')).toHaveLength(2)
    expect(screen.getAllByText('Sum månedlig alderspensjon:')).toHaveLength(2)
  })

  it('rendrer kun helt uttak når gradertUttaksperiode er null', () => {
    renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />
    )

    expect(screen.getByText('Grunnpensjon (kap. 19):')).toBeInTheDocument()
    expect(screen.queryByText('6 000 kr')).not.toBeInTheDocument() // Gradert amount should not be visible
  })

  it('håndterer tom grunnpensjonObjekter array', () => {
    const { container } = renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[]}
        hasPre2025OffentligAfpUttaksalder={false}
      />
    )

    // Komponenten skal fortsatt rendre, men uten data
    const vStack = container.querySelector('.navds-stack')
    expect(vStack).toBeInTheDocument()
  })

  it('rendrer headings korrekt for gradert og helt uttak', () => {
    const stateWithGradertUttak = {
      uttaksalder: { aar: 67, maaneder: 3 },
      gradertUttaksperiode: {
        uttaksalder: { aar: 62, maaneder: 0 },
        grad: 75,
      },
    }

    renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockGradertUttakData, mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />,
      stateWithGradertUttak
    )

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(2) // En for gradert og en for helt uttak
  })

  it('rendrer siste element i hver array med strong styling', () => {
    const { container } = renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />
    )

    const strongElements = container.querySelectorAll('strong')
    expect(strongElements.length).toBeGreaterThan(0)
  })

  it('håndterer undefined verdier i DetaljRad objekter', () => {
    const objektMedUndefined: DetaljRad[] = [
      { tekst: 'Test grunnpensjon', verdi: undefined },
      { tekst: 'Test tilleggspensjon' },
    ]

    renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[objektMedUndefined]}
        hasPre2025OffentligAfpUttaksalder={false}
      />
    )

    expect(screen.getByText('Test grunnpensjon:')).toBeInTheDocument()
    expect(screen.getByText('Test tilleggspensjon:')).toBeInTheDocument()
  })

  it('rendrer VStack med korrekt gap', () => {
    const { container } = renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />
    )

    const vStack = container.querySelector('.navds-stack')
    expect(vStack).toBeInTheDocument()
  })

  it('rendrer definition lists korrekt', () => {
    const { container } = renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />
    )

    const definitionLists = container.querySelectorAll('dl')
    expect(definitionLists).toHaveLength(1)

    // Check that dt and dd elements exist
    const terms = container.querySelectorAll('dt')
    const definitions = container.querySelectorAll('dd')
    expect(terms.length).toBeGreaterThan(0)
    expect(definitions.length).toBeGreaterThan(0)
  })

  it('håndterer uttaksalder med måneder korrekt', () => {
    const stateWithMonths = {
      uttaksalder: { aar: 67, maaneder: 6 },
    }

    renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />,
      stateWithMonths
    )

    expect(screen.getByText('Grunnpensjon (kap. 19):')).toBeInTheDocument()
  })

  it('håndterer når grunnpensjonObjekter har nøyaktig 2 arrays', () => {
    const stateWithGradertUttak = {
      gradertUttaksperiode: {
        uttaksalder: { aar: 62, maaneder: 0 },
        grad: 50,
      },
    }

    renderWithProviders(
      <Grunnpensjonsdetaljer
        grunnpensjonObjekter={[mockGradertUttakData, mockHeltUttakData]}
        hasPre2025OffentligAfpUttaksalder={false}
      />,
      stateWithGradertUttak
    )

    // Skal fungere korrekt med 2 arrays - gradert og helt uttak
    expect(screen.getAllByText('Grunnpensjon (kap. 19):')).toHaveLength(2)
    expect(screen.getAllByText('Sum månedlig alderspensjon:')).toHaveLength(2)
    expect(screen.getByText('6 000 kr')).toBeInTheDocument() // Gradert uttak
    expect(screen.getByText('12 000 kr')).toBeInTheDocument() // Helt uttak
  })
})
