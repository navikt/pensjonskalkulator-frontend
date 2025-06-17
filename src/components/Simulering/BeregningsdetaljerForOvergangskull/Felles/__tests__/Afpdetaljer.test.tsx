import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

import {
  userInputInitialState,
  userInputSlice,
} from '@/state/userInput/userInputSlice'

import { DetaljRad } from '../../hooks'
import { Afpdetaljer } from '../Afpdetaljer'

const mockMessages = {
  'beregning.detaljer.fom': 'Fra og med',
  'beregning.detaljer.tom': 'Til og med',
  'beregning.detaljer.maaneder': 'måneder',
  'beregning.detaljer.kr': 'kr',
  'beregning.detaljer.afp.privat.title': 'AFP privat',
  'beregning.detaljer.afp.privat.title.grad': 'AFP privat {grad}% uttaksgrad',
  'beregning.detaljer.afp.privat.title.alderOgGrad':
    'AFP privat fra {alderAar} {alderMd} med {grad}% uttaksgrad',
  'beregning.detaljer.afp.pre2025Offentlig.title': 'AFP offentlig',
  'beregning.detaljer.afpPrivat.heltUttak.title': 'AFP privat ved 67 år',
  'beregning.detaljer.afpPrivat.gradertUttak.title':
    'AFP privat ved uttaksalder',
  'beregning.detaljer.opptjeningsdetaljer.afpPrivat.table.title':
    'AFP privat beregning',
  'beregning.detaljer.opptjeningsdetaljer.pre2025OffentligAfp.table.title':
    'AFP offentlig beregning',
}

const createMockStore = (customState = {}) => {
  const baseState = {
    ...userInputInitialState,
    currentSimulation: {
      ...userInputInitialState.currentSimulation,
      uttaksalder: { aar: 67, maaneder: 0 },
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

describe('Gitt at Afpdetaljer rendres', () => {
  const mockAfpPrivatAtUttaksalderData: DetaljRad[] = [
    { tekst: 'Kompensasjonstillegg', verdi: '8 000 kr' },
    { tekst: 'Kronetillegg', verdi: '5 000 kr' },
    { tekst: 'Livsvarig del', verdi: '2 000 kr' },
    { tekst: 'Sum månedlig AFP', verdi: '15 000 kr' },
  ]

  const mockAfpPrivatAt67Data: DetaljRad[] = [
    { tekst: 'Kompensasjonstillegg', verdi: '9 000 kr' },
    { tekst: 'Kronetillegg', verdi: '6 000 kr' },
    { tekst: 'Livsvarig del', verdi: '3 000 kr' },
    { tekst: 'Sum månedlig AFP', verdi: '18 000 kr' },
  ]

  const mockPre2025OffentligAfpData: DetaljRad[] = [
    { tekst: 'AFP grad', verdi: 100 },
    { tekst: 'Sluttpoengtall', verdi: 6.5 },
    { tekst: 'Poengår', verdi: 35 },
    { tekst: 'Trygdetid', verdi: 40 },
  ]

  it('rendrer komponenten uten data', () => {
    const { container } = renderWithProviders(<Afpdetaljer />)

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('rendrer kun AFP privat ved 67 år når uttaksalder er 67 eller høyere', () => {
    const stateWith67 = {
      uttaksalder: { aar: 67, maaneder: 0 },
    }

    renderWithProviders(
      <Afpdetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />,
      stateWith67
    )

    expect(screen.getByText('Kompensasjonstillegg:')).toBeVisible()
    expect(screen.getByText('9 000 kr')).toBeVisible()
    expect(screen.getByText('Kronetillegg:')).toBeVisible()
    expect(screen.getByText('6 000 kr')).toBeVisible()
    expect(screen.getByText('Livsvarig del:')).toBeVisible()
    expect(screen.getByText('3 000 kr')).toBeVisible()
    expect(screen.getByText('Sum månedlig AFP:')).toBeVisible()
    expect(screen.getByText('18 000 kr')).toBeVisible()
  })

  it('rendrer både AFP privat ved uttaksalder og ved 67 når uttaksalder er under 67', () => {
    const stateWith62 = {
      uttaksalder: { aar: 62, maaneder: 0 },
    }

    renderWithProviders(
      <Afpdetaljer
        opptjeningAfpPrivatListe={[
          mockAfpPrivatAtUttaksalderData,
          mockAfpPrivatAt67Data,
        ]}
      />,
      stateWith62
    )

    // AFP ved uttaksalder and ved 67 - use getAllByText for duplicate elements
    expect(screen.getAllByText('Kompensasjonstillegg:')).toHaveLength(2)
    expect(screen.getAllByText('Kronetillegg:')).toHaveLength(2)
    expect(screen.getAllByText('Livsvarig del:')).toHaveLength(2)
    expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(2)

    // Sjekker unike verdier for å verifisere at begge seksjoner er tilstede
    expect(screen.getByText('8 000 kr')).toBeVisible() // Kompensasjonstillegg ved uttaksalder
    expect(screen.getByText('5 000 kr')).toBeVisible() // Kronetillegg ved uttaksalder
    expect(screen.getByText('2 000 kr')).toBeVisible() // Livsvarig del ved uttaksalder
    expect(screen.getByText('15 000 kr')).toBeVisible() // Sum ved uttaksalder

    expect(screen.getByText('9 000 kr')).toBeVisible() // Kompensasjonstillegg ved 67
    expect(screen.getByText('6 000 kr')).toBeVisible() // Kronetillegg ved 67
    expect(screen.getByText('3 000 kr')).toBeVisible() // Livsvarig del ved 67
    expect(screen.getByText('18 000 kr')).toBeVisible() // Sum månedlig AFP ved 67
  })

  it('rendrer ikke AFP privat ved uttaksalder når uttaksalder er 67 eller høyere', () => {
    const stateWith67 = {
      uttaksalder: { aar: 67, maaneder: 0 },
    }

    renderWithProviders(
      <Afpdetaljer
        opptjeningAfpPrivatListe={[
          mockAfpPrivatAtUttaksalderData,
          mockAfpPrivatAt67Data,
        ]}
      />,
      stateWith67
    )

    // Skal ikke vise AFP ved uttaksalder siden uttaksalder er 67
    expect(screen.queryByText('8 000 kr')).not.toBeInTheDocument()
    expect(screen.queryByText('15 000 kr')).not.toBeInTheDocument()

    // Men skal vise AFP ved 67
    expect(screen.getByText('Sum månedlig AFP:')).toBeVisible()
    expect(screen.getByText('18 000 kr')).toBeVisible()
  })

  it('rendrer pre-2025 offentlig AFP når data er tilgjengelig', () => {
    renderWithProviders(
      <Afpdetaljer
        opptjeningPre2025OffentligAfpListe={mockPre2025OffentligAfpData}
      />
    )

    expect(screen.getByText('AFP grad:')).toBeVisible()
    expect(screen.getByText('100')).toBeVisible()
    expect(screen.getByText('Sluttpoengtall:')).toBeVisible()
    expect(screen.getByText('6.5')).toBeVisible()
    expect(screen.getByText('Poengår:')).toBeVisible()
    expect(screen.getByText('35')).toBeVisible()
    expect(screen.getByText('Trygdetid:')).toBeVisible()
    expect(screen.getByText('40')).toBeVisible()
  })

  it('rendrer både AFP privat og pre-2025 offentlig AFP samtidig', () => {
    renderWithProviders(
      <Afpdetaljer
        opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]}
        opptjeningPre2025OffentligAfpListe={mockPre2025OffentligAfpData}
      />
    )

    // AFP privat
    expect(screen.getByText('Kompensasjonstillegg:')).toBeVisible()
    expect(screen.getByText('Sum månedlig AFP:')).toBeVisible()

    // Pre-2025 offentlig AFP
    expect(screen.getByText('AFP grad:')).toBeVisible()
    expect(screen.getByText('Trygdetid:')).toBeVisible()
  })

  it('rendrer ikke noe når alle data er tomme eller undefined', () => {
    const { container } = renderWithProviders(
      <Afpdetaljer
        opptjeningAfpPrivatListe={[]}
        opptjeningPre2025OffentligAfpListe={[]}
      />
    )

    // Kun section elementet skal være tilstede
    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
    expect(screen.queryByText('Kompensasjonstillegg:')).not.toBeInTheDocument()
    expect(screen.queryByText('AFP grad:')).not.toBeInTheDocument()
  })

  it('håndterer undefined verdier i DetaljRad objekter', () => {
    const objektMedUndefined: DetaljRad[] = [
      { tekst: 'Test AFP', verdi: undefined },
      { tekst: 'Test AFP 2' },
    ]

    renderWithProviders(
      <Afpdetaljer opptjeningAfpPrivatListe={[objektMedUndefined]} />
    )

    expect(screen.getByText('Test AFP:')).toBeVisible()
    expect(screen.getByText('Test AFP 2:')).toBeVisible()
  })

  it('rendrer headings korrekt for AFP privat seksjoner', () => {
    const stateWith62 = {
      uttaksalder: { aar: 62, maaneder: 6 },
    }

    renderWithProviders(
      <Afpdetaljer
        opptjeningAfpPrivatListe={[
          mockAfpPrivatAtUttaksalderData,
          mockAfpPrivatAt67Data,
        ]}
      />,
      stateWith62
    )

    const headings = screen.getAllByRole('heading', { level: 3 })
    expect(headings).toHaveLength(2) // En for AFP ved uttaksalder og en for AFP ved 67
  })

  it('rendrer siste element i hver array med strong styling', () => {
    const { container } = renderWithProviders(
      <Afpdetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />
    )

    const strongElements = container.querySelectorAll('strong')
    expect(strongElements.length).toBeGreaterThan(0)
  })

  it('håndterer uttaksalder med måneder korrekt', () => {
    const stateWithMonths = {
      uttaksalder: { aar: 65, maaneder: 8 },
    }

    renderWithProviders(
      <Afpdetaljer
        opptjeningAfpPrivatListe={[
          mockAfpPrivatAtUttaksalderData,
          mockAfpPrivatAt67Data,
        ]}
      />,
      stateWithMonths
    )

    // Skal vise begge seksjoner siden uttaksalder er under 67
    expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(2)
    expect(screen.getByText('15 000 kr')).toBeVisible() // Ved uttaksalder
    expect(screen.getByText('18 000 kr')).toBeVisible() // Ved 67
  })

  it('rendrer VStack med korrekt gap for AFP privat', () => {
    const { container } = renderWithProviders(
      <Afpdetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />
    )

    const vStack = container.querySelector('.navds-stack')
    expect(vStack).toBeVisible()
  })

  it('rendrer definition lists korrekt', () => {
    const { container } = renderWithProviders(
      <Afpdetaljer
        opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]}
        opptjeningPre2025OffentligAfpListe={mockPre2025OffentligAfpData}
      />
    )

    const definitionLists = container.querySelectorAll('dl')
    expect(definitionLists).toHaveLength(2) // En for AFP privat og en for pre-2025 offentlig

    const terms = container.querySelectorAll('dt')
    const definitions = container.querySelectorAll('dd')
    expect(terms.length).toBeGreaterThan(0)
    expect(definitions.length).toBeGreaterThan(0)
  })

  it('håndterer kun ett element i opptjeningAfpPrivatListe array', () => {
    renderWithProviders(
      <Afpdetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />
    )

    // Skal bare vise AFP ved 67 (siden det kun er ett element)
    expect(screen.getByText('Sum månedlig AFP:')).toBeVisible()
    expect(screen.getByText('18 000 kr')).toBeVisible()
    expect(screen.queryByText('15 000 kr')).not.toBeInTheDocument() // Ikke uttaksalder data
  })
})
