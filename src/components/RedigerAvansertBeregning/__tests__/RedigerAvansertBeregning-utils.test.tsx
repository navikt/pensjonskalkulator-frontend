import { describe, expect, it } from 'vitest'

import {
  validateAvansertBeregningSkjema,
  onAvansertBeregningSubmit,
} from '../utils'
import * as alderUtils from '@/utils/alder'
import * as inntektUtils from '@/utils/inntekt'

describe('RedigerAvansertBeregning-utils', () => {
  describe('onAvansertBeregningSubmit', () => {
    const formDataAllFieldsSwitch = (s: string) => {
      switch (s) {
        case 'uttaksalder-gradert-uttak-aar':
          return '62'
        case 'uttaksalder-gradert-uttak-maaneder':
          return '2'
        case 'uttaksalder-helt-uttak-aar':
          return '67'
        case 'uttaksalder-helt-uttak-maaneder':
          return '0'
        case 'uttaksgrad':
          return '80 %'
        case 'inntekt-vsa-helt-uttak-radio':
          return 'ja'
        case 'inntekt-vsa-gradert-uttak-radio':
          return 'ja'
        case 'inntekt-vsa-helt-uttak':
          return '300000'
        case 'inntekt-vsa-helt-uttak-slutt-alder-aar':
          return '75'
        case 'inntekt-vsa-helt-uttak-slutt-alder-maaneder':
          return '0'
        case 'inntekt-vsa-gradert-uttak':
          return '100000'
        default:
          return ''
      }
    }
    it('Når onAvansertBeregningSubmit kalles, hentes det riktig data fra formen. Dersom validering feiler lagres det ikke data og validationErrors vises', () => {
      const dispatchMock = vi.fn()
      const setValidationErrorsMock = vi.fn()
      const gaaTilResultatMock = vi.fn()
      const getMock = vi.fn().mockImplementation((s: string) => {
        return s
      })
      const dataMock: FormData = { get: getMock } as unknown as FormData
      onAvansertBeregningSubmit(
        dataMock,
        dispatchMock,
        setValidationErrorsMock,
        gaaTilResultatMock,
        {
          foedselsdato: '1963-04-30',
          loependeVedtak: {
            ufoeretrygd: {
              grad: 0,
            },
            harFremtidigLoependeVedtak: false,
          },
          localInntektFremTilUttak: null,
          hasVilkaarIkkeOppfylt: undefined,
          harAvansertSkjemaUnsavedChanges: false,
        }
      )
      expect(getMock).toHaveBeenCalledTimes(11)
      expect(getMock).toHaveBeenNthCalledWith(
        1,
        'uttaksalder-gradert-uttak-aar'
      )
      expect(getMock).toHaveBeenNthCalledWith(
        2,
        'uttaksalder-gradert-uttak-maaneder'
      )
      expect(getMock).toHaveBeenNthCalledWith(3, 'uttaksalder-helt-uttak-aar')
      expect(getMock).toHaveBeenNthCalledWith(
        4,
        'uttaksalder-helt-uttak-maaneder'
      )
      expect(getMock).toHaveBeenNthCalledWith(5, 'uttaksgrad')
      expect(getMock).toHaveBeenNthCalledWith(6, 'inntekt-vsa-helt-uttak-radio')
      expect(getMock).toHaveBeenNthCalledWith(
        7,
        'inntekt-vsa-gradert-uttak-radio'
      )
      expect(getMock).toHaveBeenNthCalledWith(8, 'inntekt-vsa-helt-uttak')
      expect(getMock).toHaveBeenNthCalledWith(
        9,
        'inntekt-vsa-helt-uttak-slutt-alder-aar'
      )
      expect(getMock).toHaveBeenNthCalledWith(
        10,
        'inntekt-vsa-helt-uttak-slutt-alder-maaneder'
      )
      expect(getMock).toHaveBeenNthCalledWith(11, 'inntekt-vsa-gradert-uttak')
      expect(dispatchMock).not.toHaveBeenCalled()
      expect(gaaTilResultatMock).not.toHaveBeenCalled()
      expect(setValidationErrorsMock).toHaveBeenCalledTimes(3)
    })

    describe('Gitt at onAvansertBeregningSubmit kalles, og at validering er vellykket', () => {
      it('Når alle feltene er fylt ut lagres det data og validationErrors kalles ikke', () => {
        const dispatchMock = vi.fn()
        const setValidationErrorsMock = vi.fn()
        const gaaTilResultatMock = vi.fn()
        const getMock = vi.fn().mockImplementation(formDataAllFieldsSwitch)
        const dataMock: FormData = { get: getMock } as unknown as FormData
        onAvansertBeregningSubmit(
          dataMock,
          dispatchMock,
          setValidationErrorsMock,
          gaaTilResultatMock,
          {
            foedselsdato: '1963-04-30',
            loependeVedtak: {
              ufoeretrygd: {
                grad: 0,
              },
              harFremtidigLoependeVedtak: false,
            },
            localInntektFremTilUttak: null,
            hasVilkaarIkkeOppfylt: undefined,
            harAvansertSkjemaUnsavedChanges: false,
          }
        )

        expect(dispatchMock).toHaveBeenCalledTimes(4)
        expect(dispatchMock).toHaveBeenNthCalledWith(1, {
          payload: {
            aar: 67,
            maaneder: 0,
          },
          type: 'userInputSlice/setCurrentSimulationUttaksalder',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
          payload: {
            aarligInntektVsaPensjonBeloep: '100000',
            grad: 80,
            uttaksalder: {
              aar: 62,
              maaneder: 2,
            },
          },
          type: 'userInputSlice/setCurrentSimulationGradertUttaksperiode',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {
          payload: {
            beloep: '300000',
            sluttAlder: {
              aar: 75,
              maaneder: 0,
            },
          },
          type: 'userInputSlice/setCurrentSimulationAarligInntektVsaHelPensjon',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(4, {
          payload: null,
          type: 'userInputSlice/setCurrentSimulationAarligInntektFoerUttakBeloep',
        })

        expect(gaaTilResultatMock).toHaveBeenCalled()
        expect(setValidationErrorsMock).not.toHaveBeenCalled()
      })

      it('Når brukeren har endret inntekt og lagt til inntekt vsa 100 % alderspensjon og at alle feltene er fylt ut lagres det data og validationErrors kalles ikke', () => {
        const dispatchMock = vi.fn()
        const setValidationErrorsMock = vi.fn()
        const gaaTilResultatMock = vi.fn()

        const getMock = vi.fn().mockImplementation(formDataAllFieldsSwitch)
        const dataMock: FormData = { get: getMock } as unknown as FormData
        onAvansertBeregningSubmit(
          dataMock,
          dispatchMock,
          setValidationErrorsMock,
          gaaTilResultatMock,
          {
            foedselsdato: '1963-04-30',
            loependeVedtak: {
              ufoeretrygd: {
                grad: 0,
              },
              harFremtidigLoependeVedtak: false,
            },
            localInntektFremTilUttak: '500 000',
            hasVilkaarIkkeOppfylt: undefined,
            harAvansertSkjemaUnsavedChanges: false,
          }
        )

        expect(dispatchMock).toHaveBeenCalledTimes(4)
        expect(dispatchMock).toHaveBeenNthCalledWith(1, {
          payload: {
            aar: 67,
            maaneder: 0,
          },
          type: 'userInputSlice/setCurrentSimulationUttaksalder',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
          payload: {
            aarligInntektVsaPensjonBeloep: '100000',
            grad: 80,
            uttaksalder: {
              aar: 62,
              maaneder: 2,
            },
          },
          type: 'userInputSlice/setCurrentSimulationGradertUttaksperiode',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {
          payload: {
            beloep: '300000',
            sluttAlder: {
              aar: 75,
              maaneder: 0,
            },
          },
          type: 'userInputSlice/setCurrentSimulationAarligInntektVsaHelPensjon',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(4, {
          payload: '500 000',
          type: 'userInputSlice/setCurrentSimulationAarligInntektFoerUttakBeloep',
        })

        expect(gaaTilResultatMock).toHaveBeenCalled()
        expect(setValidationErrorsMock).not.toHaveBeenCalled()
      })

      it('Når brukeren har endret inntekt og lagt til inntekt vsa 100 % alderspensjon og at alle feltene er fylt ut utenom gradert uttak lagres det data og validationErrors kalles ikke', () => {
        const dispatchMock = vi.fn()
        const setValidationErrorsMock = vi.fn()
        const gaaTilResultatMock = vi.fn()

        const getMock = vi.fn().mockImplementation((s: string) => {
          switch (s) {
            case 'uttaksalder-gradert-uttak-aar':
              return null
            case 'uttaksalder-gradert-uttak-maaneder':
              return null
            case 'uttaksalder-helt-uttak-aar':
              return '67'
            case 'uttaksalder-helt-uttak-maaneder':
              return '0'
            case 'uttaksgrad':
              return '100 %'
            case 'inntekt-vsa-helt-uttak-radio':
              return 'ja'
            case 'inntekt-vsa-gradert-uttak-radio':
              return null
            case 'inntekt-vsa-helt-uttak':
              return '300000'
            case 'inntekt-vsa-helt-uttak-slutt-alder-aar':
              return '75'
            case 'inntekt-vsa-helt-uttak-slutt-alder-maaneder':
              return '0'
            case 'inntekt-vsa-gradert-uttak':
              return null
            default:
              return ''
          }
        })
        const dataMock: FormData = { get: getMock } as unknown as FormData
        onAvansertBeregningSubmit(
          dataMock,
          dispatchMock,
          setValidationErrorsMock,
          gaaTilResultatMock,
          {
            foedselsdato: '1963-04-30',
            loependeVedtak: {
              ufoeretrygd: {
                grad: 0,
              },
              harFremtidigLoependeVedtak: false,
            },
            localInntektFremTilUttak: '500 000',
            hasVilkaarIkkeOppfylt: undefined,
            harAvansertSkjemaUnsavedChanges: false,
          }
        )

        expect(dispatchMock).toHaveBeenCalledTimes(4)
        expect(dispatchMock).toHaveBeenNthCalledWith(1, {
          payload: {
            aar: 67,
            maaneder: 0,
          },
          type: 'userInputSlice/setCurrentSimulationUttaksalder',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(2, {
          payload: null,
          type: 'userInputSlice/setCurrentSimulationGradertUttaksperiode',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {
          payload: {
            beloep: '300000',
            sluttAlder: {
              aar: 75,
              maaneder: 0,
            },
          },
          type: 'userInputSlice/setCurrentSimulationAarligInntektVsaHelPensjon',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(4, {
          payload: '500 000',
          type: 'userInputSlice/setCurrentSimulationAarligInntektFoerUttakBeloep',
        })

        expect(gaaTilResultatMock).toHaveBeenCalled()
        expect(setValidationErrorsMock).not.toHaveBeenCalled()
      })

      it('Når hasVilkaarIkkeOppfylt er true og harAvansertSkjemaUnsavedChanges er false lagres det data men brukeren blir ikke sendt til resultatssiden', () => {
        const dispatchMock = vi.fn()
        const setValidationErrorsMock = vi.fn()
        const gaaTilResultatMock = vi.fn()

        const getMock = vi.fn().mockImplementation(formDataAllFieldsSwitch)
        const dataMock: FormData = { get: getMock } as unknown as FormData
        onAvansertBeregningSubmit(
          dataMock,
          dispatchMock,
          setValidationErrorsMock,
          gaaTilResultatMock,
          {
            foedselsdato: '1963-04-30',
            loependeVedtak: {
              ufoeretrygd: {
                grad: 0,
              },
              harFremtidigLoependeVedtak: false,
            },
            localInntektFremTilUttak: '500 000',
            hasVilkaarIkkeOppfylt: true,
            harAvansertSkjemaUnsavedChanges: false,
          }
        )

        expect(dispatchMock).toHaveBeenCalledTimes(4)
        expect(gaaTilResultatMock).not.toHaveBeenCalled()
        expect(setValidationErrorsMock).not.toHaveBeenCalled()
      })

      it('Når hasVilkaarIkkeOppfylt er true og harAvansertSkjemaUnsavedChanges er true lagres det data og brukeren blir sendt til resultatssiden', () => {
        const dispatchMock = vi.fn()
        const setValidationErrorsMock = vi.fn()
        const gaaTilResultatMock = vi.fn()

        const getMock = vi.fn().mockImplementation(formDataAllFieldsSwitch)
        const dataMock: FormData = { get: getMock } as unknown as FormData
        onAvansertBeregningSubmit(
          dataMock,
          dispatchMock,
          setValidationErrorsMock,
          gaaTilResultatMock,
          {
            foedselsdato: '1963-04-30',
            loependeVedtak: {
              ufoeretrygd: {
                grad: 0,
              },
              harFremtidigLoependeVedtak: false,
            },
            localInntektFremTilUttak: '500 000',
            hasVilkaarIkkeOppfylt: true,
            harAvansertSkjemaUnsavedChanges: true,
          }
        )

        expect(dispatchMock).toHaveBeenCalledTimes(4)
        expect(gaaTilResultatMock).toHaveBeenCalled()
        expect(setValidationErrorsMock).not.toHaveBeenCalled()
      })
    })
  })

  describe('validateAvansertBeregningSkjema', () => {
    const correctInputData = {
      gradertUttakAarFormData: '62',
      gradertUttakMaanederFormData: '5',
      heltUttakAarFormData: '67',
      heltUttakMaanederFormData: '0',
      uttaksgradFormData: '40 %',
      inntektVsaHeltUttakRadioFormData: 'ja',
      inntektVsaGradertUttakRadioFormData: 'ja',
      inntektVsaHeltUttakFormData: '300000',
      inntektVsaHeltUttakSluttAlderAarFormData: '75',
      inntektVsaHeltUttakSluttAlderMaanederFormData: '0',
      inntektVsaGradertUttakFormData: '99000',
    }

    const mockedFoedselsdato = '1963-04-30'
    const mockedLoependeVedtak = {
      ufoeretrygd: {
        grad: 0,
      },
      harFremtidigLoependeVedtak: false,
    }
    const mockedLoependeVedtak100 = {
      ufoeretrygd: {
        grad: 100,
      },
      harFremtidigLoependeVedtak: false,
    }
    const mockedLoependeVedtak60 = {
      ufoeretrygd: {
        grad: 60,
      },
      harFremtidigLoependeVedtak: false,
    }

    it('returnerer true uten å oppdatere feilmeldingsteksten når input er korrekt', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          correctInputData,
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeTruthy()
      expect(updateErrorMessageMock).not.toHaveBeenCalled()
    })

    it('returnerer false når heltUttakAar eller heltUttakMaaneder ikke er gyldig (alle cases allerede dekket i validateAlderFromForm)', () => {
      const updateErrorMessageMock = vi.fn()
      const validateAlderFromFormMock = vi.spyOn(
        alderUtils,
        'validateAlderFromForm'
      )
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, heltUttakAarFormData: 'abc' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, heltUttakMaanederFormData: null },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(validateAlderFromFormMock).toHaveBeenCalledTimes(8)
      expect(updateErrorMessageMock).toHaveBeenCalledTimes(4)
    })

    it('returnerer false når uttaksgrad er fylt ut med noe annet enn et tall med prosent', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, uttaksgradFormData: '' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, uttaksgradFormData: 'abc' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, uttaksgradFormData: '400' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, uttaksgradFormData: '4000' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
    })

    it('returnerer false når gradertUttakAar eller gradertUttakMaaneder ikke er gyldig (alle cases allerede dekket i validateAlderFromForm)', () => {
      const updateErrorMessageMock = vi.fn()
      const validateAlderFromFormMock = vi.spyOn(
        alderUtils,
        'validateAlderFromForm'
      )
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, gradertUttakAarFormData: 'abc' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, gradertUttakMaanederFormData: null },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(validateAlderFromFormMock).toHaveBeenCalledTimes(6)
      expect(updateErrorMessageMock).toHaveBeenCalledTimes(2)
    })

    it('returnerer false når gradertUttaksalder er lik eller etter heltuttak', () => {
      const updateErrorMessageMock = vi.fn()
      const validateAlderFromFormMock = vi.spyOn(
        alderUtils,
        'validateAlderFromForm'
      )
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            gradertUttakAarFormData: '67',
            gradertUttakMaanederFormData: '0',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            gradertUttakAarFormData: '70',
            gradertUttakMaanederFormData: '0',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            gradertUttakAarFormData: '66',
            gradertUttakMaanederFormData: '11',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeTruthy()

      expect(validateAlderFromFormMock).toHaveBeenCalledTimes(12)
      expect(updateErrorMessageMock).toHaveBeenCalledTimes(2)
    })

    it('returnerer true når gradertUttakAar eller gradertUttakMaaneder ikke er gyldig så lenge uttaksgradFormData er på 100 %', () => {
      const updateErrorMessageMock = vi.fn()
      const validateAlderFromFormMock = vi.spyOn(
        alderUtils,
        'validateAlderFromForm'
      )
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '100 %',
            gradertUttakAarFormData: 'abc',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeTruthy()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '100 %',
            gradertUttakMaanederFormData: null,
          },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeTruthy()

      expect(validateAlderFromFormMock).toHaveBeenCalled()
      expect(updateErrorMessageMock).not.toHaveBeenCalled()
    })

    it('returnerer false når gradertUttaksalder eller heltUttaksalder er før ubetinget uttaksalder for en bruker med 100 % uføretrygd', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            heltUttakAarFormData: '63',
            heltUttakMaanederFormData: '0',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak100,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '100 %',
            gradertUttakAarFormData: null,
            gradertUttakMaanederFormData: null,
          },
          mockedFoedselsdato,
          mockedLoependeVedtak100,
          updateErrorMessageMock
        )
      ).toBeTruthy()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '100 %',
            gradertUttakAarFormData: '68',
            gradertUttakMaanederFormData: '3',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak100,
          updateErrorMessageMock
        )
      ).toBeTruthy()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            gradertUttakAarFormData: '63',
            gradertUttakMaanederFormData: '0',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak100,
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(updateErrorMessageMock).toHaveBeenCalledTimes(0)
    })

    it('returnerer false når heltUttaksalder eller gradertUttaksalder er før ubetinget uttaksalder med et ugyldig uttaksgrad for en bruker med gradert uføretrygd', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '100 %',
            heltUttakAarFormData: '63',
            heltUttakMaanederFormData: '0',
            gradertUttakAarFormData: null,
            gradertUttakMaanederFormData: null,
          },
          mockedFoedselsdato,
          mockedLoependeVedtak60,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '50 %',
            gradertUttakAarFormData: '63',
            gradertUttakMaanederFormData: '0',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak60,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '40 %',
            gradertUttakAarFormData: '63',
            gradertUttakMaanederFormData: '0',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak60,
          updateErrorMessageMock
        )
      ).toBeTruthy()

      // Denne skal returnere true fordi alderen er etter ubetinget uttaksgrad
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '40 %',
            gradertUttakAarFormData: '67',
            gradertUttakMaanederFormData: '0',
            heltUttakAarFormData: '67',
            heltUttakMaanederFormData: '6',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak60,
          updateErrorMessageMock
        )
      ).toBeTruthy()

      expect(updateErrorMessageMock).toHaveBeenCalledTimes(2)
    })

    it('returnerer false når radio knapp for inntekt vsa. 100 % uttaksalder ikke er fylt ut', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, inntektVsaHeltUttakRadioFormData: null },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(updateErrorMessageMock).toHaveBeenCalled()
    })

    it('returnerer false når brukeren har valgt inntekt vsa. 100 % uttaksalder uten å fylle ut input feltet for beløp', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, inntektVsaHeltUttakFormData: null },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(updateErrorMessageMock).toHaveBeenCalled()
    })

    it('returnerer false når brukeren har valgt inntekt vsa. 100 % uttaksalder og inntekt er ugyldig (alle cases allerede videre i validateInntekt)', () => {
      const validateInntektMock = vi.spyOn(inntektUtils, 'validateInntekt')
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, inntektVsaHeltUttakFormData: 'abc' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(validateInntektMock).toHaveBeenCalled()
      expect(updateErrorMessageMock).toHaveBeenCalled()
    })

    it('returnerer false når brukeren har valgt inntekt vsa. 100 % uttaksalder med ugyldig sluttalder for inntekten (alle cases allerede dekket i validateAlderFromForm)', () => {
      const validateAlderFromFormMock = vi.spyOn(
        alderUtils,
        'validateAlderFromForm'
      )
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            inntektVsaHeltUttakSluttAlderAarFormData: 'abc',
          },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(validateAlderFromFormMock).toHaveBeenCalledTimes(4)
      expect(updateErrorMessageMock).toHaveBeenCalled()
    })

    it('returnerer false når brukeren har valgt en gradering og radio knapp for inntekt vsa. 100 % uttaksalder ikke er fylt ut', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, inntektVsaGradertUttakRadioFormData: null },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(updateErrorMessageMock).toHaveBeenCalled()
    })

    it('returnerer true når brukeren ikke har valgt gradering og radio knapp for inntekt vsa. 100 % uttaksalder ikke er fylt ut', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          {
            ...correctInputData,
            uttaksgradFormData: '100 %',
            inntektVsaGradertUttakRadioFormData: null,
          },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeTruthy()
      expect(updateErrorMessageMock).not.toHaveBeenCalled()
    })

    it('returnerer false når brukeren har valgt en gradering og valgt ja til inntekt vsa. gradert uttak, men inntekt ikke er gyldig (alle cases allerede videre i validateInntekt)', () => {
      const updateErrorMessageMock = vi.fn()
      const validateInntektMock = vi.spyOn(inntektUtils, 'validateInntekt')
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, inntektVsaGradertUttakFormData: 'abc' },
          mockedFoedselsdato,
          mockedLoependeVedtak,
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(validateInntektMock).toHaveBeenCalled()
      expect(updateErrorMessageMock).toHaveBeenCalled()
    })
  })
})
