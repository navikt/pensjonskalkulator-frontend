import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import alderspensjonResponse from '../../../mocks/data/alderspensjon/67.json' with { type: 'json' }
import ekskludertStatusResponse from '../../../mocks/data/ekskludert-status.json' with { type: 'json' }
import inntektResponse from '../../../mocks/data/inntekt.json' with { type: 'json' }
import loependeVedtakResponse from '../../../mocks/data/loepende-vedtak.json' with { type: 'json' }
import omstillingsstoenadOgGjenlevendeResponse from '../../../mocks/data/omstillingsstoenad-og-gjenlevende.json' with { type: 'json' }
import pensjonsavtalerResponse from '../../../mocks/data/pensjonsavtaler/67.json' with { type: 'json' }
import personResponse from '../../../mocks/data/person.json' with { type: 'json' }
import tidligstMuligHeltUttakResponse from '../../../mocks/data/tidligstMuligHeltUttak.json' with { type: 'json' }
import tpoMedlemskapResponse from '../../../mocks/data/tpo-medlemskap.json' with { type: 'json' }
import spraakvelgerToggleResponse from '../../../mocks/data/unleash-disable-spraakvelger.json' with { type: 'json' }
import endringToggleResponse from '../../../mocks/data/unleash-enable-endring.json' with { type: 'json' }
import highchartsAccessibilityPluginToggleResponse from '../../../mocks/data/unleash-enable-highcharts-accessibility-plugin.json' with { type: 'json' }
import utlandToggleResponse from '../../../mocks/data/unleash-enable-utland.json' with { type: 'json' }
import utvidetSimuleringsresultatToggleResponse from '../../../mocks/data/unleash-utvidet-simuleringsresultat.json' with { type: 'json' }
import { mockErrorResponse, mockResponse } from '@/mocks/server'
import { apiSlice } from '@/state/api/apiSlice'
import { setupStore } from '@/state/store'
import { swallowErrorsAsync } from '@/test-utils'

describe('apiSlice', () => {
  it('eksponerer riktig endepunkter', async () => {
    expect(apiSlice.endpoints).toHaveProperty('getInntekt')
    expect(apiSlice.endpoints).toHaveProperty('getPerson')
    expect(apiSlice.endpoints).toHaveProperty('getTpoMedlemskap')
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(inntektResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/inntekt')
      return storeRef
        .dispatch(apiSlice.endpoints.getInntekt.initiate())
        .then((result) => {
          const fetchBaseQueryResult =
            result as unknown as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject({
            ...personResponse,
            foedselsdato: '1963-04-30',
          })
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v2/person')
      return storeRef
        .dispatch(apiSlice.endpoints.getPerson.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v2/person', {
        status: 200,
        json: { sivilstand: 'SIRKUSKLOVN' },
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getPerson.initiate())
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(
            ekskludertStatusResponse
          )
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(
            loependeVedtakResponse
          )
        })
    })

    it('kaster feil ved uforventet format på data', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/v1/vedtak/loepende-vedtak', {
        json: {
          feil: 'format',
        },
      })
      await swallowErrorsAsync(async () => {
        return storeRef
          .dispatch(apiSlice.endpoints.getLoependeVedtak.initiate())
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
  })

  describe('getTpoMedlemskap', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getTpoMedlemskap.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(tpoMedlemskapResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v1/tpo-medlemskap')
      return storeRef
        .dispatch(apiSlice.endpoints.getTpoMedlemskap.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v1/tpo-medlemskap', {
        status: 200,
        json: { lorem: 'ipsum' },
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getTpoMedlemskap.initiate())
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
  })

  describe('pensjonsavtaler', () => {
    const dummyRequestBody = {
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          const obj = fetchBaseQueryResult.data as {
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
      mockResponse('/v2/pensjonsavtaler', {
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          const obj = fetchBaseQueryResult.data as {
            avtaler: Pensjonsavtale[]
            partialResponse: boolean
          }
          expect(obj.avtaler).toMatchObject([{ ...avtale }])
          expect(obj.partialResponse).toBeTruthy()
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v2/pensjonsavtaler', {
        method: 'post',
      })
      return storeRef
        .dispatch(apiSlice.endpoints.pensjonsavtaler.initiate(dummyRequestBody))
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v2/pensjonsavtaler', {
        status: 200,
        json: [{ 'tullete svar': 'lorem' }],
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(
            apiSlice.endpoints.pensjonsavtaler.initiate(dummyRequestBody)
          )
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(
            tidligstMuligHeltUttakResponse
          )
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v1/tidligste-hel-uttaksalder', {
        status: 500,
        method: 'post',
      })
      return storeRef
        .dispatch(apiSlice.endpoints.tidligstMuligHeltUttak.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v1/tidligste-hel-uttaksalder', {
        status: 200,
        json: [{ 'tullete svar': 'lorem' }],
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.tidligstMuligHeltUttak.initiate())
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
  })

  describe('alderspensjon', () => {
    const body: AlderspensjonRequestBody = {
      simuleringstype: 'ALDERSPENSJON',
      foedselsdato: '1963-04-30',
      sivilstand: 'UGIFT',
      epsHarInntektOver2G: true,
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(alderspensjonResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/v6/alderspensjon/simulering', {
        method: 'post',
      })
      return storeRef
        .dispatch(apiSlice.endpoints.alderspensjon.initiate(body))
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v6/alderspensjon/simulering', {
        status: 200,
        json: [{ 'tullete svar': 'lorem' }],
        method: 'post',
      })
      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.alderspensjon.initiate(body))
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
    it('kaster feil ved uventet format på responsen under afpPrivat', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v6/alderspensjon/simulering', {
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
    it('kaster feil ved uventet format på responsen under afpOffentlig', async () => {
      const storeRef = setupStore(undefined, true)
      mockResponse('/v6/alderspensjon/simulering', {
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(
            spraakvelgerToggleResponse
          )
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/feature/pensjonskalkulator.disable-spraakvelger')
      return storeRef
        .dispatch(apiSlice.endpoints.getSpraakvelgerFeatureToggle.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
  })

  describe('getHighchartsAccessibilityPluginFeatureToggle', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(
          apiSlice.endpoints.getHighchartsAccessibilityPluginFeatureToggle.initiate()
        )
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(
            highchartsAccessibilityPluginToggleResponse
          )
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse(
        '/feature/pensjonskalkulator.enable-highcharts-accessibility-plugin'
      )
      return storeRef
        .dispatch(
          apiSlice.endpoints.getHighchartsAccessibilityPluginFeatureToggle.initiate()
        )
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse(
        '/feature/pensjonskalkulator.enable-highcharts-accessibility-plugin',
        {
          status: 200,
          json: { lorem: 'ipsum' },
        }
      )

      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(
            apiSlice.endpoints.getHighchartsAccessibilityPluginFeatureToggle.initiate()
          )
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
  })

  describe('getUtlandFeatureToggle', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getUtlandFeatureToggle.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(utlandToggleResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/feature/pensjonskalkulator.enable-utland')
      return storeRef
        .dispatch(apiSlice.endpoints.getUtlandFeatureToggle.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/feature/pensjonskalkulator.enable-utland', {
        status: 200,
        json: { lorem: 'ipsum' },
      })

      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getUtlandFeatureToggle.initiate())
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
          })
      })
    })
  })

  describe('getEndringFeatureToggle', () => {
    it('returnerer data ved vellykket query', async () => {
      const storeRef = setupStore(undefined, true)
      return storeRef
        .dispatch(apiSlice.endpoints.getEndringFeatureToggle.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('fulfilled')
          expect(fetchBaseQueryResult.data).toMatchObject(endringToggleResponse)
        })
    })

    it('returnerer undefined ved feilende query', async () => {
      const storeRef = setupStore(undefined, true)
      mockErrorResponse('/feature/pensjonskalkulator.enable-endring')
      return storeRef
        .dispatch(apiSlice.endpoints.getEndringFeatureToggle.initiate())
        .then((result) => {
          const fetchBaseQueryResult = result as unknown as FetchBaseQueryError
          expect(fetchBaseQueryResult.status).toBe('rejected')
          expect(fetchBaseQueryResult.data).toBe(undefined)
        })
    })

    it('kaster feil ved uventet format på responsen', async () => {
      const storeRef = setupStore(undefined, true)

      mockResponse('/feature/pensjonskalkulator.enable-endring', {
        status: 200,
        json: { lorem: 'ipsum' },
      })

      await swallowErrorsAsync(async () => {
        await storeRef
          .dispatch(apiSlice.endpoints.getEndringFeatureToggle.initiate())
          .then((result) => {
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult).toThrow(Error)
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult.status).toBe('fulfilled')
            expect(fetchBaseQueryResult.data).toMatchObject(
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
            const fetchBaseQueryResult =
              result as unknown as FetchBaseQueryError
            expect(fetchBaseQueryResult.status).toBe('rejected')
            expect(fetchBaseQueryResult.data).toBe(undefined)
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
              const fetchBaseQueryResult =
                result as unknown as FetchBaseQueryError
              expect(fetchBaseQueryResult).toThrow(Error)
              expect(fetchBaseQueryResult.status).toBe('rejected')
              expect(fetchBaseQueryResult.data).toBe(undefined)
            })
        })
      })
    })
  })
})
