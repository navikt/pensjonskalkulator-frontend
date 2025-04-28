import { mockErrorResponse, mockResponse } from '@/mocks/server'
import { apiSlice } from '@/state/api/apiSlice'
import { setupStore } from '@/state/store'
import { swallowErrorsAsync } from '@/test-utils'

import alderspensjonResponse from '../../../mocks/data/alderspensjon/67.json' with { type: 'json' }
import ekskludertStatusResponse from '../../../mocks/data/ekskludert-status.json' with { type: 'json' }
import inntektResponse from '../../../mocks/data/inntekt.json' with { type: 'json' }
import loependeVedtakResponse from '../../../mocks/data/loepende-vedtak.json' with { type: 'json' }
import offentligTpResponse from '../../../mocks/data/offentlig-tp.json' with { type: 'json' }
import omstillingsstoenadOgGjenlevendeResponse from '../../../mocks/data/omstillingsstoenad-og-gjenlevende.json' with { type: 'json' }
import pensjonsavtalerResponse from '../../../mocks/data/pensjonsavtaler/67.json' with { type: 'json' }
import personResponse from '../../../mocks/data/person.json' with { type: 'json' }
import tidligstMuligHeltUttakResponse from '../../../mocks/data/tidligstMuligHeltUttak.json' with { type: 'json' }
import spraakvelgerToggleResponse from '../../../mocks/data/unleash-disable-spraakvelger.json' with { type: 'json' }
import enableSanityToggleResponse from '../../../mocks/data/unleash-enable-sanity.json' with { type: 'json' }
import enableOtpFraKlpToggleResponse from '../../../mocks/data/unleash-otp-fra-klp.json' with { type: 'json' }
import utvidetSimuleringsresultatToggleResponse from '../../../mocks/data/unleash-utvidet-simuleringsresultat.json' with { type: 'json' }

describe('apiSlice', () => {
  it('eksponerer riktig endepunkter', async () => {
    expect(apiSlice.endpoints).toHaveProperty('getInntekt')
    expect(apiSlice.endpoints).toHaveProperty('getPerson')
    expect(apiSlice.endpoints).toHaveProperty('offentligTp')
    expect(apiSlice.endpoints).toHaveProperty('pensjonsavtaler')
    expect(apiSlice.endpoints).toHaveProperty('tidligstMuligHeltUttak')
    expect(apiSlice.endpoints).toHaveProperty('alderspensjon')
    expect(apiSlice.endpoints).toHaveProperty('getSpraakvelgerFeatureToggle')
  })

  describe('getInntekt', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getInntekt.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(inntektResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/inntekt')
      return storeRef
        .dispatch(apiSlice.endpoints.getInntekt.initiate())
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/inntekt', {
        status: 200,
        json: { aar: '532' },
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getInntekt.initiate())
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getPerson', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getPerson.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject({
            ...personResponse,
            foedselsdato: '1963-04-30',
          })
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v4/person')
      return storeRef
        .dispatch(apiSlice.endpoints.getPerson.initiate())
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v4/person', {
        status: 200,
        json: { sivilstand: 'SIRKUSKLOVN' },
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getPerson.initiate())
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getEkskludertStatus', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getEkskludertStatus.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(ekskludertStatusResponse)
        })
    })

    it('kaster feil ved uforventet format på data', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/v2/ekskludert', {
        json: {
          feil: 'format',
        },
      })
      await swallowErrorsAsync(async () => {
        return storeRef
          .dispatch(apiSlice.endpoints.getEkskludertStatus.initiate())
          .then((result) => {
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getOmstillingsstoenadOgGjenlevende', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(
          apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.initiate()
        )
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(
            omstillingsstoenadOgGjenlevendeResponse
          )
        })
    })

    it('kaster feil ved uforventet format på data', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/v1/loepende-omstillingsstoenad-eller-gjenlevendeytelse', {
        json: {
          feil: 'format',
        },
      })
      await swallowErrorsAsync(async () => {
        return storeRef
          .dispatch(
            apiSlice.endpoints.getOmstillingsstoenadOgGjenlevende.initiate()
          )
          .then((result) => {
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getLoependeVedtak', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(loependeVedtakResponse)
        })
    })

    it('returnerer samboer som sivilstand', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/v4/vedtak/loepende-vedtak', {
        json: {
          alderspensjon: {
            grad: 1000,
            fom: '2020-10-02',
            sivilstand: 'SAMBOER',
          },
          ufoeretrygd: { grad: 0 },
        } satisfies LoependeVedtak,
      })

      const actual = await storeRef
        .dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
        .unwrap()
      expect(actual.alderspensjon?.sivilstand).toBe('SAMBOER')
    })

    it('kaster feil ved uforventet format på data', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/v4/vedtak/loepende-vedtak', {
        json: {
          feil: 'format',
        },
      })
      await swallowErrorsAsync(async () => {
        return storeRef
          .dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
          .then((result) => {
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('simulerOffentligTp', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.offentligTp.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(offentligTpResponse)
        })
    })

    it('fjerner simulert TP fra responsen hvis leverandør er KLP og feature-toggle er av', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v2/simuler-oftp', {
        status: 200,
        method: 'post',
        json: {
          ...offentligTpResponse,
          simulertTjenestepensjon: {
            ...offentligTpResponse.simulertTjenestepensjon,
            tpLeverandoer: 'Kommunal Landspensjonskasse',
            tpNummer: '4080',
          },
        },
      })
      mockResponse('/feature/pensjonskalkulator.vis-otp-fra-klp', {
        status: 200,
        json: { enabled: false },
      })
      return storeRef
        .dispatch(apiSlice.endpoints.offentligTp.initiate())
        .then((result) => {
          expect(result.data?.simuleringsresultatStatus).toBe(
            'TP_ORDNING_STOETTES_IKKE'
          )
          expect(result.data?.simulertTjenestepensjon).toBeUndefined()
        })
    })

    it('fjerner IKKE simulert TP fra responsen hvis leverandør er KLP og feature-toggle er PÅ', async () => {
      const storeRef = setupStore(undefined, true)
      const json = {
        ...offentligTpResponse,
        simulertTjenestepensjon: {
          ...offentligTpResponse.simulertTjenestepensjon,
          tpLeverandoer: 'Kommunal Landspensjonskasse',
          tpNummer: '4080',
        },
      }
      mockResponse('/v2/simuler-oftp', {
        status: 200,
        method: 'post',
        json,
      })
      mockResponse('/feature/pensjonskalkulator.vis-otp-fra-klp', {
        status: 200,
        json: { enabled: true },
      })
      return storeRef
        .dispatch(apiSlice.endpoints.offentligTp.initiate())
        .then((result) => {
          expect(result.data).toMatchObject(json)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v2/simuler-oftp', {
        method: 'post',
      })
      return storeRef
        .dispatch(apiSlice.endpoints.offentligTp.initiate())
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v2/simuler-oftp', {
        status: 200,
        json: { lorem: 'ipsum' },
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.offentligTp.initiate())
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('pensjonsavtaler', () => {
    const dummyRequestBody: PensjonsavtalerRequestBody = {
      epsHarInntektOver2G: false,
      epsHarPensjon: false,
      aarligInntektFoerUttakBeloep: 500000,
      uttaksperioder: [
        {
          startAlder: { aar: 67, maaneder: 0 },
          grad: 100,
          aarligInntektVsaPensjon: {
            beloep: 500000,
            sluttAlder: { aar: 75, maaneder: 0 },
          },
        },
      ],
    }

    it('returnerer riktig data og flag ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.pensjonsavtaler.initiate(dummyRequestBody))
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          const obj = result.data as {
            avtaler: Pensjonsavtale[]
            partialResponse: boolean
          }
          expect(obj.avtaler).toMatchObject(pensjonsavtalerResponse.avtaler)
          expect(obj.partialResponse).toBeFalsy()
        })
    })

    it('returnerer riktig data og flagg ved delvis vellykket query', async () => {
      const avtale = {
        produktbetegnelse: 'IPS',
        kategori: 'INDIVIDUELL_ORDNING',
        startAar: 70,
        sluttAar: 75,
        utbetalingsperioder: [
          {
            startAlder: { aar: 70, maaneder: 6 },
            sluttAlder: { aar: 75, maaneder: 6 },
            aarligUtbetaling: 41802,
            grad: 100,
          },
        ],
      }
      mockResponse('/v3/pensjonsavtaler', {
        status: 200,
        json: {
          avtaler: [{ ...avtale }],
          utilgjengeligeSelskap: ['Something'],
        },
        method: 'post',
      })
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.pensjonsavtaler.initiate(dummyRequestBody))
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          const obj = result.data as {
            avtaler: Pensjonsavtale[]
            partialResponse: boolean
          }
          expect(obj.avtaler).toMatchObject([{ ...avtale }])
          expect(obj.partialResponse).toBeTruthy()
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v3/pensjonsavtaler', {
        method: 'post',
      })
      return storeRef
        .dispatch(apiSlice.endpoints.pensjonsavtaler.initiate(dummyRequestBody))
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v3/pensjonsavtaler', {
        status: 200,
        json: { 'tullete svar': 'lorem' },
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(
            apiSlice.endpoints.pensjonsavtaler.initiate(dummyRequestBody)
          )
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('tidligstMuligHeltUttak', () => {
    it('returnerer data ved successfull query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.tidligstMuligHeltUttak.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(tidligstMuligHeltUttakResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v2/tidligste-hel-uttaksalder', {
        status: 500,
        method: 'post',
      })
      return storeRef
        .dispatch(apiSlice.endpoints.tidligstMuligHeltUttak.initiate())
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v2/tidligste-hel-uttaksalder', {
        status: 200,
        json: { 'tullete svar': 'lorem' },
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.tidligstMuligHeltUttak.initiate())
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('alderspensjon', () => {
    const body: AlderspensjonRequestBody = {
      simuleringstype: 'ALDERSPENSJON',
      foedselsdato: '1963-04-30',
      sivilstand: 'UGIFT',
      epsHarInntektOver2G: false,
      epsHarPensjon: false,
      heltUttak: {
        uttaksalder: { aar: 67, maaneder: 8 },
        aarligInntektVsaPensjon: {
          beloep: 0,
          sluttAlder: { aar: 75, maaneder: 0 },
        },
      },
    }
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.alderspensjon.initiate(body))
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(alderspensjonResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v8/alderspensjon/simulering', {
        method: 'post',
      })
      return storeRef
        .dispatch(apiSlice.endpoints.alderspensjon.initiate(body))
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v8/alderspensjon/simulering', {
        status: 200,
        json: { 'tullete svar': 'lorem' },
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.alderspensjon.initiate(body))
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
    it('kaster feil ved uventet format på responsen under afpPrivat', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v8/alderspensjon/simulering', {
        status: 200,
        json: {
          alderspensjon: [],
          afpPrivat: [
            {
              alder: '77 år - should be number',
              beloep: 234756,
            },
          ],
          vilkaarsproeving: {
            vilkaarErOppfylt: true,
          },
          harForLiteTrygdetid: false,
        },
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.alderspensjon.initiate(body))
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
    it('kaster feil ved uventet format på responsen under afpOffentlig', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v8/alderspensjon/simulering', {
        status: 200,
        json: {
          alderspensjon: [],
          afpOffentlig: [
            {
              alder: 62,
              beloep: 'abc',
            },
          ],
          vilkaarsproeving: {
            vilkaarErOppfylt: true,
          },
          harForLiteTrygdetid: false,
        },
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.alderspensjon.initiate(body))
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getSpraakvelgerFeatureToggle', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getSpraakvelgerFeatureToggle.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(spraakvelgerToggleResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/feature/pensjonskalkulator.disable-spraakvelger')
      return storeRef
        .dispatch(apiSlice.endpoints.getSpraakvelgerFeatureToggle.initiate())
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/feature/pensjonskalkulator.disable-spraakvelger', {
        status: 200,
        json: { lorem: 'ipsum' },
      })

      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getSpraakvelgerFeatureToggle.initiate())
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getSanityFeatureToggle', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getSanityFeatureToggle.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(enableSanityToggleResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/feature/pensjonskalkulator.hent-tekster-fra-sanity')
      return storeRef
        .dispatch(apiSlice.endpoints.getSanityFeatureToggle.initiate())
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/feature/pensjonskalkulator.hent-tekster-fra-sanity', {
        status: 200,
        json: { lorem: 'ipsum' },
      })

      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getSanityFeatureToggle.initiate())
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getUtvidetSimuleringsresultatFeatureToggle', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(
          apiSlice.endpoints.getUtvidetSimuleringsresultatFeatureToggle.initiate()
        )
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(
            utvidetSimuleringsresultatToggleResponse
          )
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/feature/utvidet-simuleringsresultat')
      return storeRef
        .dispatch(
          apiSlice.endpoints.getUtvidetSimuleringsresultatFeatureToggle.initiate()
        )
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/feature/utvidet-simuleringsresultat', {
        status: 200,
        json: { lorem: 'ipsum' },
      })

      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(
            apiSlice.endpoints.getUtvidetSimuleringsresultatFeatureToggle.initiate()
          )
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })

  describe('getOtpKlpFeatureToggle', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getOtpKlpFeatureToggle.initiate())
        .then((result) => {
          expect(result.status).toBe('fulfilled')
          expect(result.data).toMatchObject(enableOtpFraKlpToggleResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/feature/pensjonskalkulator.vis-otp-fra-klp')
      return storeRef
        .dispatch(apiSlice.endpoints.getOtpKlpFeatureToggle.initiate())
        .then((result) => {
          expect(result.status).toBe('rejected')
          expect(result.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/feature/pensjonskalkulator.vis-otp-fra-klp', {
        status: 200,
        json: { lorem: 'ipsum' },
      })

      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getOtpKlpFeatureToggle.initiate())
          .then((result) => {
            expect(result).toThrow(Error)
            expect(result.status).toBe('rejected')
            expect(result.data).toBe(undefined)
          })
      })
    })
  })
})
