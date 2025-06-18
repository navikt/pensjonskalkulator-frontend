import { configureStore } from '@reduxjs/toolkit'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { Provider } from 'react-redux'

import {
  userInputInitialState,
  userInputSlice,
} from '@/state/userInput/userInputSlice'

import { DetaljRad } from '../../hooks'
import { AfpDetaljer } from '../AfpDetaljer'

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
  'beregning.detaljer.OpptjeningDetaljer.afpPrivat.table.title':
    'AFP privat beregning',
  'beregning.detaljer.OpptjeningDetaljer.pre2025OffentligAfp.table.title':
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

describe('Gitt at AfpDetaljer rendres', () => {
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
    const { container } = renderWithProviders(<AfpDetaljer />)

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })

  it('rendrer kun AFP privat ved 67 år når uttaksalder er 67 eller høyere', () => {
    const stateWith67 = {
      uttaksalder: { aar: 67, maaneder: 0 },
    }

    renderWithProviders(
      <AfpDetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />,
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
      <AfpDetaljer
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
      <AfpDetaljer
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
      <AfpDetaljer
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
      <AfpDetaljer
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
      <AfpDetaljer
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
      <AfpDetaljer opptjeningAfpPrivatListe={[objektMedUndefined]} />
    )

    expect(screen.getByText('Test AFP:')).toBeVisible()
    expect(screen.getByText('Test AFP 2:')).toBeVisible()
  })

  it('rendrer headings korrekt for AFP privat seksjoner', () => {
    const stateWith62 = {
      uttaksalder: { aar: 62, maaneder: 6 },
    }

    renderWithProviders(
      <AfpDetaljer
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
      <AfpDetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />
    )

    const strongElements = container.querySelectorAll('strong')
    expect(strongElements.length).toBeGreaterThan(0)
  })

  it('håndterer uttaksalder med måneder korrekt', () => {
    const stateWithMonths = {
      uttaksalder: { aar: 65, maaneder: 8 },
    }

    renderWithProviders(
      <AfpDetaljer
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
      <AfpDetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />
    )

    const vStack = container.querySelector('.navds-stack')
    expect(vStack).toBeVisible()
  })

  it('rendrer definition lists korrekt', () => {
    const { container } = renderWithProviders(
      <AfpDetaljer
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
      <AfpDetaljer opptjeningAfpPrivatListe={[mockAfpPrivatAt67Data]} />
    )

    // Skal bare vise AFP ved 67 (siden det kun er ett element)
    expect(screen.getByText('Sum månedlig AFP:')).toBeVisible()
    expect(screen.getByText('18 000 kr')).toBeVisible()
    expect(screen.queryByText('15 000 kr')).not.toBeInTheDocument() // Ikke uttaksalder data
  })

  describe('når gradertUttaksperiode er definert', () => {
    it('bruker gradertUttaksperiode alder når den er definert istedenfor uttaksalder', () => {
      const stateWithGradertUttak = {
        uttaksalder: { aar: 67, maaneder: 0 },
        gradertUttaksperiode: {
          uttaksalder: { aar: 62, maaneder: 6 },
          grad: 50,
        },
      }

      renderWithProviders(
        <AfpDetaljer
          opptjeningAfpPrivatListe={[
            mockAfpPrivatAtUttaksalderData,
            mockAfpPrivatAt67Data,
          ]}
        />,
        stateWithGradertUttak
      )

      // Skal vise begge seksjoner siden gradertUttak alder (62) er under 67
      expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(2)
      expect(screen.getByText('15 000 kr')).toBeVisible() // Ved gradert uttaksalder
      expect(screen.getByText('18 000 kr')).toBeVisible() // Ved 67
    })

    it('bruker gradertUttaksperiode når den er 67 eller høyere', () => {
      const stateWithGradertUttakAt67 = {
        uttaksalder: { aar: 68, maaneder: 0 }, // uttaksalder må være høyere enn gradert
        gradertUttaksperiode: {
          uttaksalder: { aar: 67, maaneder: 0 },
          grad: 50,
        },
      }

      renderWithProviders(
        <AfpDetaljer
          opptjeningAfpPrivatListe={[
            mockAfpPrivatAtUttaksalderData,
            mockAfpPrivatAt67Data,
          ]}
        />,
        stateWithGradertUttakAt67
      )

      // Skal ikke vise AFP ved uttaksalder siden gradertUttak alder er 67
      expect(screen.queryByText('15 000 kr')).not.toBeInTheDocument()
      expect(screen.getByText('18 000 kr')).toBeVisible() // Bare ved 67
    })

    it('viser korrekt alder i heading når gradertUttaksperiode har måneder', () => {
      const stateWithGradertUttakWithMonths = {
        uttaksalder: { aar: 68, maaneder: 0 }, // uttaksalder må være høyere enn gradert
        gradertUttaksperiode: {
          uttaksalder: { aar: 63, maaneder: 8 },
          grad: 75,
        },
      }

      renderWithProviders(
        <AfpDetaljer
          opptjeningAfpPrivatListe={[
            mockAfpPrivatAtUttaksalderData,
            mockAfpPrivatAt67Data,
          ]}
        />,
        stateWithGradertUttakWithMonths
      )

      // Begge seksjoner skal vises siden gradert alder (63) er under 67
      expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(2)
    })

    it('viser 67 år i "heltUttak" heading når gradertUttaksperiode alder er under 67', () => {
      const stateWithGradertUttakUnder67 = {
        uttaksalder: { aar: 68, maaneder: 0 }, // uttaksalder må være høyere enn gradert
        gradertUttaksperiode: {
          uttaksalder: { aar: 65, maaneder: 3 },
          grad: 40,
        },
      }

      renderWithProviders(
        <AfpDetaljer
          opptjeningAfpPrivatListe={[
            mockAfpPrivatAtUttaksalderData,
            mockAfpPrivatAt67Data,
          ]}
        />,
        stateWithGradertUttakUnder67
      )

      // Skal vise begge seksjoner
      expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(2)
    })

    it('viser gradertUttaksperiode alder i "heltUttak" heading når den er 67 eller høyere', () => {
      const stateWithGradertUttakOver67 = {
        uttaksalder: { aar: 69, maaneder: 0 }, // uttaksalder må være høyere enn gradert
        gradertUttaksperiode: {
          uttaksalder: { aar: 68, maaneder: 2 },
          grad: 80,
        },
      }

      renderWithProviders(
        <AfpDetaljer
          opptjeningAfpPrivatListe={[
            mockAfpPrivatAtUttaksalderData,
            mockAfpPrivatAt67Data,
          ]}
        />,
        stateWithGradertUttakOver67
      )

      // Skal bare vise AFP ved 67 seksjonen (siden gradert alder er over 67)
      expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(1)
      expect(screen.queryByText('15 000 kr')).not.toBeInTheDocument() // Ikke uttaksalder data
      expect(screen.getByText('18 000 kr')).toBeVisible() // Bare ved 67
    })

    it('håndterer gradertUttaksperiode uten måneder (0 måneder)', () => {
      const stateWithGradertUttakNoMonths = {
        uttaksalder: { aar: 68, maaneder: 6 }, // uttaksalder må være høyere enn gradert
        gradertUttaksperiode: {
          uttaksalder: { aar: 64, maaneder: 0 },
          grad: 60,
        },
      }

      renderWithProviders(
        <AfpDetaljer
          opptjeningAfpPrivatListe={[
            mockAfpPrivatAtUttaksalderData,
            mockAfpPrivatAt67Data,
          ]}
        />,
        stateWithGradertUttakNoMonths
      )

      // Skal vise begge seksjoner siden gradert alder (64) er under 67
      expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(2)
    })

    it('fallback til uttaksalder når gradertUttaksperiode mangler uttaksalder', () => {
      const stateWithIncompleteGradertUttak = {
        uttaksalder: { aar: 65, maaneder: 4 },
        gradertUttaksperiode: {
          grad: 100,
        },
      }

      renderWithProviders(
        <AfpDetaljer
          opptjeningAfpPrivatListe={[
            mockAfpPrivatAtUttaksalderData,
            mockAfpPrivatAt67Data,
          ]}
        />,
        stateWithIncompleteGradertUttak
      )

      // Skal falle tilbake til uttaksalder (65) og vise begge seksjoner
      expect(screen.getAllByText('Sum månedlig AFP:')).toHaveLength(2)
    })
  })
})
