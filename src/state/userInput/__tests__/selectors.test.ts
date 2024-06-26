import {
  selectUtenlandsopphold,
  selectSamtykke,
  selectSamtykkeOffentligAFP,
  selectAfp,
  selectSivilstand,
  selectSamboerFraBrukerInput,
  selectSamboerFraSivilstand,
  selectSamboer,
  selectAarligInntektFoerUttakBeloepFraBrukerInput,
  selectAarligInntektFoerUttakBeloepFraSkatt,
  selectAarligInntektFoerUttakBeloep,
  selectFormatertUttaksalderReadOnly,
  selectCurrentSimulation,
  selectHarHentetTpoMedlemskap,
  selectIsVeileder,
  selectVeilederBorgerFnr,
  selectUfoeregrad,
} from '../selectors'
import {
  fulfilledGetInntekt,
  fulfilledGetPerson,
  fulfilledGetTpoMedlemskap,
  fulfilledGetUfoeregrad,
} from '@/mocks/mockedRTKQueryApiCalls'
import { store, RootState } from '@/state/store'
import { Simulation } from '@/state/userInput/userInputReducer'

describe('userInput selectors', () => {
  const initialState = store.getState()

  const currentSimulation: Simulation = {
    formatertUttaksalderReadOnly: '62 alder.aar string.og 5 alder.maaneder',
    uttaksalder: { aar: 62, maaneder: 5 },
    aarligInntektFoerUttakBeloep: '0',
    gradertUttaksperiode: null,
  }

  it('selectUtenlandsopphold', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        utenlandsopphold: true,
      },
    }
    expect(selectUtenlandsopphold(state)).toBe(true)
  })

  it('selectSamtykke', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        samtykke: true,
      },
    }
    expect(selectSamtykke(state)).toBe(true)
  })

  it('selectSamtykkeOffentligAFP', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        samtykkeOffentligAFP: true,
      },
    }
    expect(selectSamtykkeOffentligAFP(state)).toBe(true)
  })

  it('selectAfp', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        afp: 'nei',
      },
    }
    expect(selectAfp(state)).toBe('nei')
  })

  it('selectSamboerFraBrukerInput', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        samboer: true,
      },
    }
    expect(selectSamboerFraBrukerInput(state)).toBe(true)
  })

  describe('selectSivilstand', () => {
    it('returnerer undefined sivilstand når /person har ikke blitt kalt eller har feilet', () => {
      const state: RootState = {
        ...initialState,
      }
      expect(selectSivilstand(state)).toBe(undefined)
    })
    it('returnerer riktig sivilstand når queryen er vellykket', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetPerson },
        },
      }
      expect(selectSivilstand(state)).toBe('UGIFT')
    })
  })

  describe('selectSamboerFraSivilstand', () => {
    it('returnerer false når sivilstanden medfører at personen ikke har samboer', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetPerson },
        },
      }
      expect(selectSamboerFraSivilstand(state)).toBe(false)
    })
    it('returnerer true når sivilstanden medfører at personen har samboer', () => {
      const state: RootState = {
        ...initialState,
        api: {
          queries: {
            ['getPerson(undefined)']: {
              /* eslint-disable @typescript-eslint/ban-ts-comment */
              // @ts-ignore
              status: 'fulfilled',
              endpointName: 'getPerson',
              requestId: 'xTaE6mOydr5ZI75UXq4Wi',
              startedTimeStamp: 1688046411971,
              data: {
                navn: 'Aprikos',
                sivilstand: 'GIFT',
                foedselsdato: '1963-04-30',
              },
              fulfilledTimeStamp: 1688046412103,
            },
          },
        },
      }
      expect(selectSamboerFraSivilstand(state)).toBe(true)
    })
  })

  describe('selectSamboer', () => {
    it('returnerer samboerskap basert på svaret som brukeren har oppgitt, til tross for at sivilstanden sier noe annet', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetPerson },
        },
        userInput: {
          ...initialState.userInput,
          samboer: true,
        },
      }
      expect(selectSamboer(state)).toBe(true)
    })

    it('returnerer samboerskap basert på sivilstand, og at brukeren ikke svarte spørsmålet om samboer', () => {
      const state: RootState = {
        ...initialState,
        api: {
          queries: {
            ['getPerson(undefined)']: {
              /* eslint-disable @typescript-eslint/ban-ts-comment */
              // @ts-ignore
              status: 'fulfilled',
              endpointName: 'getPerson',
              requestId: 'xTaE6mOydr5ZI75UXq4Wi',
              startedTimeStamp: 1688046411971,
              data: {
                navn: 'Aprikos',
                sivilstand: 'GIFT',
                foedselsdato: '1963-04-30',
              },
              fulfilledTimeStamp: 1688046412103,
            },
          },
        },
        userInput: {
          ...initialState.userInput,
          samboer: null,
        },
      }
      expect(selectSamboer(state)).toBe(true)
    })
  })

  it('selectAarligInntektFoerUttakBeloepFraBrukerInput', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        currentSimulation: {
          ...currentSimulation,
          aarligInntektFoerUttakBeloep: '512 000',
        },
      },
    }
    expect(selectAarligInntektFoerUttakBeloepFraBrukerInput(state)).toBe(
      '512 000'
    )
  })

  describe('selectAarligInntektFoerUttakBeloepFraSkatt', () => {
    it('returnerer tomt streng når /inntekt har ikke blitt kalt eller har feilet', () => {
      const state: RootState = {
        ...initialState,
      }
      expect(selectAarligInntektFoerUttakBeloepFraSkatt(state)).toBe(undefined)
    })
    it('returnerer riktig beløp når queryen er vellykket', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetInntekt },
        },
      }
      const inntekt = selectAarligInntektFoerUttakBeloepFraSkatt(state)
      expect(inntekt?.beloep).toBe('521 338')
      expect(inntekt?.aar).toBe(2021)
    })
  })

  describe('selectAarligInntektFoerUttakBeloep', () => {
    it('returnerer inntekt basert på svaret som brukeren har oppgitt, som overskriver opprinnelig inntekt hentet fra Skatteetaten', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetInntekt },
        },
        userInput: {
          ...initialState.userInput,
          currentSimulation: {
            ...currentSimulation,
            aarligInntektFoerUttakBeloep: '350 000',
          },
        },
      }
      expect(selectAarligInntektFoerUttakBeloep(state)).toBe('350 000')
    })

    it('returnerer formatert inntekt fra Skatteetaten, når brukeren ikke har overskrevet den', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetInntekt },
        },
        userInput: {
          ...initialState.userInput,
          currentSimulation: {
            ...currentSimulation,
            aarligInntektFoerUttakBeloep: null,
          },
        },
      }
      expect(selectAarligInntektFoerUttakBeloep(state)).toBe('521 338')
    })
  })

  it('selectFormatertUttaksalder', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        currentSimulation: {
          ...currentSimulation,
        },
      },
    }
    expect(selectFormatertUttaksalderReadOnly(state)).toBe(
      '62 alder.aar string.og 5 alder.maaneder'
    )
  })

  it('selectCurrentSimulation', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        currentSimulation: { ...currentSimulation },
      },
    }
    expect(selectCurrentSimulation(state)).toEqual(currentSimulation)
  })

  describe('selectHarHentetTpoMedlemskap', () => {
    it('returnerer false når /tpo-medlemskap har ikke blitt hentet', () => {
      const state: RootState = {
        ...initialState,
      }
      expect(selectHarHentetTpoMedlemskap(state)).toBeFalsy()
    })
    it('returnerer true når /tpo-medlemskap har blitt hentet', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetTpoMedlemskap },
        },
      }
      expect(selectHarHentetTpoMedlemskap(state)).toBeTruthy()
    })
  })
  describe('selectIsVeileder', () => {
    it('er false når veilederBorgerFnr ikke er satt', () => {
      const state: RootState = initialState
      expect(selectIsVeileder(state)).toBe(false)
    })

    it('er true når veilederBorgerFnr er satt', () => {
      const state: RootState = {
        ...initialState,
        userInput: {
          ...initialState.userInput,
          veilederBorgerFnr: '81549300',
        },
      }
      expect(selectIsVeileder(state)).toBe(true)
    })
  })

  describe('selectVeilederBorgerFnr', () => {
    it('er undefined når veilederBorgerFnr ikke er satt', () => {
      const state: RootState = initialState
      expect(selectVeilederBorgerFnr(state)).toBeUndefined()
    })

    it('er fnr når veilederBorgerFnr er satt', () => {
      const testFnr = '81549300'
      const state: RootState = {
        ...initialState,
        userInput: {
          ...initialState.userInput,
          veilederBorgerFnr: testFnr,
        },
      }
      expect(selectVeilederBorgerFnr(state)).toBe(testFnr)
    })
  })

  describe('selectUfoeregrad', () => {
    it('er undefined når ufoeregrad ikke er kalt enda', () => {
      const state: RootState = initialState
      expect(selectUfoeregrad(state)).toBeUndefined()
    })

    it('er number når kallet er vellykket', () => {
      const state: RootState = {
        ...initialState,
        api: {
          /* eslint-disable @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          queries: { ...fulfilledGetUfoeregrad },
        },
      }
      expect(selectUfoeregrad(state)).toBe(75)
    })
  })
})
