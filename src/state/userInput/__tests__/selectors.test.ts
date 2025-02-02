import {
  selectHarUtenlandsopphold,
  selectSamtykke,
  selectSamtykkeOffentligAFP,
  selectAfp,
  selectFoedselsdato,
  selectSivilstand,
  selectSamboerFraBrukerInput,
  selectSamboerFraSivilstand,
  selectSamboerFraVedtak,
  selectSamboer,
  selectAarligInntektFoerUttakBeloepFraBrukerInput,
  selectAarligInntektFoerUttakBeloepFraSkatt,
  selectAarligInntektFoerUttakBeloep,
  selectCurrentSimulationUtenlandsperioder,
  selectFormatertUttaksalderReadOnly,
  selectCurrentSimulation,
  selectHarHentetOffentligTp,
  selectIsVeileder,
  selectVeilederBorgerFnr,
  selectVeilederBorgerEncryptedFnr,
  selectLoependeVedtak,
  selectUfoeregrad,
  selectIsEndring,
} from '../selectors'
import {
  fulfilledGetInntekt,
  fulfilledGetPerson,
  fulfilledsimulerOffentligTp,
  fulfilledGetLoependeVedtak75Ufoeregrad,
  fulfilledGetLoependeVedtakLoependeAlderspensjon,
  fulfilledGetLoependeVedtakLoependeAFPprivat,
  fulfilledGetLoependeVedtakLoependeAFPoffentlig,
  fulfilledGetLoependeVedtakLoepende0Alderspensjon100Ufoeretrygd,
} from '@/mocks/mockedRTKQueryApiCalls'
import { store, RootState } from '@/state/store'
import { Simulation } from '@/state/userInput/userInputReducer'

describe('userInput selectors', () => {
  const initialState = store.getState()

  const currentSimulation: Simulation = {
    utenlandsperioder: [],
    formatertUttaksalderReadOnly: '62 alder.aar string.og 5 alder.maaneder',
    uttaksalder: { aar: 62, maaneder: 5 },
    aarligInntektFoerUttakBeloep: '0',
    gradertUttaksperiode: null,
  }

  it('selectHarUtenlandsopphold', () => {
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        harUtenlandsopphold: true,
      },
    }
    expect(selectHarUtenlandsopphold(state)).toBe(true)
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

  describe('selectFoedselsdato', () => {
    it('returnerer undefined fødselsdato når /person har ikke blitt kalt eller har feilet', () => {
      const state: RootState = {
        ...initialState,
      }
      expect(selectFoedselsdato(state)).toBe(undefined)
    })
    it('returnerer riktig fødselsdato når queryen er vellykket', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetPerson },
        },
      }
      expect(selectFoedselsdato(state)).toBe('1963-04-30')
    })
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
    describe('Gitt at brukeren har vedtak om alderspensjon, ', () => {
      it('returnerer sivilstand fra vedtaket.', () => {
        const state: RootState = {
          ...initialState,
          api: {
            // @ts-ignore
            queries: { ...fulfilledGetLoependeVedtakLoependeAlderspensjon },
          },
        }
        expect(selectSivilstand(state)).toBe('UGIFT')
      })
    })
    describe('Gitt at brukeren ikker har vedtak om alderspensjon, ', () => {
      it('returnerer sivilstand fra /person.', () => {
        const state: RootState = {
          ...initialState,
          api: {
            // @ts-ignore
            queries: { ...fulfilledGetPerson },
          },
        }
        expect(selectSivilstand(state)).toBe('UGIFT')
      })
      it('Når /person ikke er blitt kalt eller har feilet, returnerer undefined.', () => {
        const state: RootState = {
          ...initialState,
        }
        expect(selectSivilstand(state)).toBe(undefined)
      })
    })
  })

  describe('selectSamboerFraSivilstand', () => {
    it('returnerer false når sivilstanden medfører at personen ikke har samboer', () => {
      const state: RootState = {
        ...initialState,
        api: {
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

  describe('selectSamboerFraVedtak', () => {
    it('returnerer false når sivilstanden medfører at personen ikke har samboer', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetLoependeVedtakLoependeAlderspensjon },
        },
      }
      expect(selectSamboerFraVedtak(state)).toBe(false)
    })
    it('returnerer true når sivilstanden medfører at personen har samboer', () => {
      const state: RootState = {
        ...initialState,
        api: {
          queries: {
            ['getLoependeVedtak(undefined)']: {
              // @ts-ignore
              status: 'fulfilled',
              endpointName: 'getLoependeVedtak',
              requestId: 'xTaE6mOydr5ZI75UXq4Wi',
              startedTimeStamp: 1688046411971,
              data: {
                alderspensjon: {
                  grad: 100,
                  fom: '2020-10-02',
                  sivilstand: 'GIFT' as Sivilstand,
                },
                ufoeretrygd: {
                  grad: 0,
                },
                harFremtidigLoependeVedtak: false,
              },
              fulfilledTimeStamp: 1688046412103,
            },
          },
        },
      }
      expect(selectSamboerFraVedtak(state)).toBe(true)
    })
  })

  describe('selectSamboer', () => {
    describe('Gitt at brukeren har vedtak om alderspensjon', () => {
      it('returnerer samboerskap basert på sivilstanden fra vedtaket', () => {
        const stateMedVedtakMedSivilstandUgift: RootState = {
          ...initialState,
          api: {
            // @ts-ignore
            queries: { ...fulfilledGetLoependeVedtakLoependeAlderspensjon },
          },
          userInput: {
            ...initialState.userInput,
          },
        }
        expect(selectSamboer(stateMedVedtakMedSivilstandUgift)).toBe(false)

        const stateMedVedtakMedSivilstandGift: RootState = {
          ...initialState,
          api: {
            queries: {
              ['getLoependeVedtak(undefined)']: {
                // @ts-ignore
                status: 'fulfilled',
                endpointName: 'getLoependeVedtak',
                requestId: 'xTaE6mOydr5ZI75UXq4Wi',
                startedTimeStamp: 1688046411971,
                data: {
                  alderspensjon: {
                    grad: 100,
                    fom: '2020-10-02',
                    sivilstand: 'GIFT' as Sivilstand,
                  },
                  ufoeretrygd: {
                    grad: 0,
                  },
                  harFremtidigLoependeVedtak: false,
                },
                fulfilledTimeStamp: 1688046412103,
              },
            },
          },
          userInput: {
            ...initialState.userInput,
          },
        }
        expect(selectSamboer(stateMedVedtakMedSivilstandGift)).toBe(true)
      })
    })

    describe('Gitt at brukeren ikke har vedtak om alderspensjon', () => {
      it('returnerer samboerskap basert på svaret som brukeren har oppgitt, til tross for at sivilstanden fra person sier noe annet', () => {
        const state: RootState = {
          ...initialState,
          api: {
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

  it('selectCurrentSimulationUtenlandsperioder', () => {
    const utenlandsperiode: Utenlandsperiode = {
      id: '123',
      landkode: 'URY',
      arbeidetUtenlands: null,
      startdato: '01.01.2018',
      sluttdato: '31.02.2021',
    }
    const state: RootState = {
      ...initialState,
      userInput: {
        ...initialState.userInput,
        currentSimulation: {
          ...currentSimulation,
          utenlandsperioder: [
            {
              ...utenlandsperiode,
            },
          ],
        },
      },
    }
    expect(selectCurrentSimulationUtenlandsperioder(state)).toStrictEqual([
      utenlandsperiode,
    ])
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

  describe('selectHarHentetOffentligTp', () => {
    it('returnerer false når /simuler-oftp har ikke blitt hentet', () => {
      const state: RootState = {
        ...initialState,
      }
      expect(selectHarHentetOffentligTp(state)).toBeFalsy()
    })
    it('returnerer true når /simuler-oftp har blitt hentet', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledsimulerOffentligTp },
        },
      }
      expect(selectHarHentetOffentligTp(state)).toBeTruthy()
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
          veilederBorgerEncryptedFnr: 'dette-er-kryptert-fnr',
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
      expect(selectVeilederBorgerFnr(state)).toStrictEqual(testFnr)
    })
  })

  describe('selectVeilederBorgerEncryptedFnr', () => {
    it('er undefined når selectVeilederBorgerEncryptedFnr ikke er satt', () => {
      const state: RootState = initialState
      expect(selectVeilederBorgerEncryptedFnr(state)).toBeUndefined()
    })

    it('er fnr når veilederBorgerEncryptedFnr er satt', () => {
      const encryptetFnr = 'dette-er-kryptert-fnr'
      const state: RootState = {
        ...initialState,
        userInput: {
          ...initialState.userInput,
          veilederBorgerEncryptedFnr: encryptetFnr,
        },
      }
      expect(selectVeilederBorgerEncryptedFnr(state)).toStrictEqual(
        encryptetFnr
      )
    })
  })

  describe('selectLoependeVedtak', () => {
    it('er undefined når loepende vedtak ikke er kalt enda', () => {
      const state: RootState = initialState
      expect(selectLoependeVedtak(state)).toBeUndefined()
    })

    it('returnerer vedtaket når kallet er vellykket', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetLoependeVedtak75Ufoeregrad },
        },
      }
      expect(selectLoependeVedtak(state)).toMatchInlineSnapshot(`
        {
          "harFremtidigLoependeVedtak": false,
          "ufoeretrygd": {
            "grad": 75,
          },
        }
      `)
    })
  })

  describe('selectUfoeregrad', () => {
    it('er undefined når loepende vedtak ikke er kalt enda', () => {
      const state: RootState = initialState
      expect(selectUfoeregrad(state)).toBeUndefined()
    })

    it('er number når kallet er vellykket', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetLoependeVedtak75Ufoeregrad },
        },
      }
      expect(selectUfoeregrad(state)).toBe(75)
    })
  })

  describe('selectIsEndring', () => {
    it('er false når løpende vedtak ikke er kalt enda', () => {
      const state: RootState = initialState
      expect(selectIsEndring(state)).toBeFalsy()
    })

    it('er false når kallet er vellykket og brukeren ikke har noe løpende alderspensjon', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetLoependeVedtak75Ufoeregrad },
        },
      }
      expect(selectIsEndring(state)).toBeFalsy()
    })

    it('er false når kallet er vellykket og brukeren har løpende AFP-offentlig uten alderspensjon', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetLoependeVedtakLoependeAFPoffentlig },
        },
      }
      expect(selectIsEndring(state)).toBeFalsy()
    })

    it('er true når kallet er vellykket og brukeren har 0 % løpende alderspensjon og 100 % uføretrygd', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: {
            ...fulfilledGetLoependeVedtakLoepende0Alderspensjon100Ufoeretrygd,
          },
        },
      }
      expect(selectIsEndring(state)).toBeTruthy()
    })

    it('er true når kallet er vellykket og brukeren har vedtak om løpende alderspensjon', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetLoependeVedtakLoependeAlderspensjon },
        },
      }

      expect(selectIsEndring(state)).toBeTruthy()
    })

    it('er true når kallet er vellykket og brukeren har 0 % alderspensjon og løpende AFP-privat', () => {
      const state: RootState = {
        ...initialState,
        api: {
          // @ts-ignore
          queries: { ...fulfilledGetLoependeVedtakLoependeAFPprivat },
        },
      }
      expect(selectIsEndring(state)).toBeTruthy()
    })
  })
})
