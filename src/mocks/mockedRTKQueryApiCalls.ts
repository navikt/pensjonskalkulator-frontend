export const personMock: Person = {
  navn: 'Aprikos',
  sivilstand: 'UGIFT',
  foedselsdato: '1963-04-30',
  pensjoneringAldre: {
    normertPensjoneringsalder: {
      aar: 67,
      maaneder: 0,
    },
    nedreAldersgrense: {
      aar: 62,
      maaneder: 0,
    },
  },
}
export const fulfilledGetPerson = {
  ['getPerson(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getPerson',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: personMock,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledPre1963GetPerson = {
  ['getPerson(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getPerson',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      navn: 'Aprikos',
      sivilstand: 'UGIFT',
      foedselsdato: '1960-04-30',
      pensjoneringAldre: {
        normertPensjoneringsalder: {
          aar: 67,
          maaneder: 0,
        },
        nedreAldersgrense: {
          aar: 62,
          maaneder: 0,
        },
      },
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetPersonEldreEnnAfpUfoereOppsigelsesalder = {
  ['getPerson(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getPerson',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      navn: 'Aprikos',
      sivilstand: 'UGIFT',
      foedselsdato: '1963-01-30',
      pensjoneringAldre: {
        normertPensjoneringsalder: {
          aar: 67,
          maaneder: 0,
        },
        nedreAldersgrense: {
          aar: 62,
          maaneder: 0,
        },
      },
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetPersonYngreEnnAfpUfoereOppsigelsesalder = {
  ['getPerson(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getPerson',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      navn: 'Aprikos',
      sivilstand: 'UGIFT',
      foedselsdato: '1990-01-30',
      pensjoneringAldre: {
        normertPensjoneringsalder: {
          aar: 67,
          maaneder: 0,
        },
        nedreAldersgrense: {
          aar: 62,
          maaneder: 0,
        },
      },
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetPersonMedOekteAldersgrenser = {
  ['getPerson(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getPerson',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      navn: 'Aprikos',
      sivilstand: 'UGIFT',
      foedselsdato: '1963-04-30',
      pensjoneringAldre: {
        normertPensjoneringsalder: {
          aar: 70,
          maaneder: 0,
        },
        nedreAldersgrense: {
          aar: 65,
          maaneder: 0,
        },
      },
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetGrunnbeloep = {
  'getGrunnbeloep(undefined)': {
    status: 'fulfilled',
    endpointName: 'getGrunnbeloep',
    requestId: 'mockedRequestId',
    startedTimeStamp: Date.now(),
    data: 100000,
    fulfilledTimeStamp: Date.now(),
  },
}

export const fulfilledGetPersonMedSamboer = {
  ['getPerson(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getPerson',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      navn: 'Aprikos',
      sivilstand: 'GIFT',
      foedselsdato: '1963-04-30',
      pensjoneringAldre: {
        normertPensjoneringsalder: {
          aar: 67,
          maaneder: 0,
        },
        nedreAldersgrense: {
          aar: 62,
          maaneder: 0,
        },
      },
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetInntekt = {
  ['getInntekt(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getInntekt',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      beloep: 521338,
      aar: 2021,
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetEkskludertStatus = {
  ['getEkskludertStatus(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getEkskludertStatus',
    requestId: 't1wLPiRKrfe_vchftk8s8',
    data: { ekskludert: false, aarsak: 'NONE' },
    startedTimeStamp: 1714725797072,
    fulfilledTimeStamp: 1714725797669,
  },
}

export const fulfilledGetOmstillingsstoenadOgGjenlevendeUtenSak = {
  ['getOmstillingsstoenadOgGjenlevende(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getOmstillingsstoenadOgGjenlevende',
    requestId: 't1wLPiRKrfe_vchftk8s8',
    data: { harLoependeSak: false },
    startedTimeStamp: 1714725797072,
    fulfilledTimeStamp: 1714725797669,
  },
}
export const fulfilledGetOmstillingsstoenadOgGjenlevende = {
  ['getOmstillingsstoenadOgGjenlevende(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getOmstillingsstoenadOgGjenlevende',
    requestId: 't1wLPiRKrfe_vchftk8s8',
    data: { harLoependeSak: true },
    startedTimeStamp: 1714725797072,
    fulfilledTimeStamp: 1714725797669,
  },
}

export const loependeVedtak0UfoeregradMock: LoependeVedtak = {
  ufoeretrygd: {
    grad: 0,
  },
}
export const fulfilledGetLoependeVedtak0Ufoeregrad = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: loependeVedtak0UfoeregradMock,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtak100Ufoeregrad = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      ufoeretrygd: {
        grad: 100,
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtak75Ufoeregrad = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      ufoeretrygd: {
        grad: 75,
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakLoependeAlderspensjon = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      alderspensjon: {
        grad: 100,
        fom: '2020-10-02',
        sivilstand: 'UGIFT',
      },
      ufoeretrygd: {
        grad: 0,
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakLoependeAlderspensjonMedSisteUtbetaling =
  {
    ['getLoependeVedtak(undefined)']: {
      status: 'fulfilled',
      endpointName: 'getLoependeVedtak',
      requestId: 'xTaE6mOydr5ZI75UXq4Wi',
      startedTimeStamp: 1688046411971,
      data: {
        alderspensjon: {
          grad: 100,
          fom: '2020-10-02',
          sisteUtbetaling: {
            beloep: 34000,
            utbetalingsdato: '2024-10-12',
          },
          sivilstand: 'UGIFT',
        },
        ufoeretrygd: {
          grad: 0,
        },
      } satisfies LoependeVedtak,
      fulfilledTimeStamp: 1688046412103,
    },
  }

export const fulfilledGetLoependeVedtakLoepende50Alderspensjon = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      alderspensjon: {
        grad: 50,
        fom: '2020-10-02',
        sivilstand: 'UGIFT',
      },
      ufoeretrygd: {
        grad: 0,
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakLoependeAlderspensjonOg40Ufoeretrygd = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      alderspensjon: {
        grad: 100,
        fom: '2020-10-02',
        sivilstand: 'UGIFT',
      },
      ufoeretrygd: {
        grad: 40,
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakLoependeAFPprivat = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      alderspensjon: {
        grad: 0,
        fom: '2020-10-02',
        sivilstand: 'UGIFT',
      },
      ufoeretrygd: {
        grad: 0,
      },
      afpPrivat: {
        fom: '2020-10-02',
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakLoependeAFPoffentlig = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      ufoeretrygd: {
        grad: 0,
      },
      afpOffentlig: {
        fom: '2020-10-02',
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakLoepende0Alderspensjon100Ufoeretrygd = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      alderspensjon: {
        grad: 0,
        fom: '2020-10-02',
        sivilstand: 'UGIFT',
      },
      ufoeretrygd: {
        grad: 100,
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakFremtidig = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      ufoeretrygd: {
        grad: 0,
      },
      fremtidigAlderspensjon: {
        grad: 100,
        fom: '2099-01-01',
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledGetLoependeVedtakFremtidigMedAlderspensjon = {
  ['getLoependeVedtak(undefined)']: {
    status: 'fulfilled',
    endpointName: 'getLoependeVedtak',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      alderspensjon: {
        grad: 100,
        fom: '2020-10-02',
        sivilstand: 'UGIFT',
      },
      ufoeretrygd: {
        grad: 0,
      },
      fremtidigAlderspensjon: {
        grad: 100,
        fom: '2099-01-01',
      },
    } satisfies LoependeVedtak,
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledsimulerOffentligTp = {
  ['offentligTp(undefined)']: {
    status: 'fulfilled',
    endpointName: 'offentligTp',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      simuleringsresultatStatus: 'OK',
      muligeTpLeverandoerListe: [
        'Statens pensjonskasse',
        'Kommunal Landspensjonskasse',
        'Oslo Pensjonsforsikring',
      ],
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledPensjonsavtaler = {
  ['pensjonsavtaler(undefined)']: {
    status: 'fulfilled',
    endpointName: 'pensjonsavtaler',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      avtaler: [],
      partialResponse: false,
    },
    fulfilledTimeStamp: 1688046412103,
  },
}

export const fulfilledAlderspensjonForLiteTrygdetid = {
  ['alderspensjon(undefined)']: {
    status: 'fulfilled',
    endpointName: 'alderspensjon',
    requestId: 'xTaE6mOydr5ZI75UXq4Wi',
    startedTimeStamp: 1688046411971,
    data: {
      alderspensjon: [
        {
          alder: 75,
          beloep: 384120,
        },
        {
          alder: 76,
          beloep: 384440,
        },
        {
          alder: 77,
          beloep: 384492,
        },
      ],
      vilkaarsproeving: {
        vilkaarErOppfylt: true,
      },
      harForLiteTrygdetid: true,
    },

    fulfilledTimeStamp: 1688046412103,
  },
}
