import { describe, expect, it } from 'vitest'

import {
  validateAvansertBeregningSkjema,
  onAvansertBeregningSubmit,
} from '../utils'
import * as alderUtils from '@/utils/alder'
import * as inntektUtils from '@/utils/inntekt'

describe('RedigerAvansertBeregning-utils', () => {
  describe('onAvansertBeregningSubmit', () => {
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
          localHeltUttak: undefined,
          localInntektFremTilUttak: null,
          hasVilkaarIkkeOppfylt: undefined,
          harAvansertSkjemaUnsavedChanges: false,
        }
      )
      expect(getMock).toHaveBeenCalledTimes(6)
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
      expect(getMock).toHaveBeenNthCalledWith(6, 'inntekt-vsa-gradert-uttak')
      expect(dispatchMock).not.toHaveBeenCalled()
      expect(gaaTilResultatMock).not.toHaveBeenCalled()
      expect(setValidationErrorsMock).toHaveBeenCalledTimes(3)
    })

    describe('Gitt at onAvansertBeregningSubmit kalles, og at validering er vellykket', () => {
      it('Når alle feltene er fylt ut lagres det data og validationErrors kalles ikke', () => {
        const dispatchMock = vi.fn()
        const setValidationErrorsMock = vi.fn()
        const gaaTilResultatMock = vi.fn()
        const getMock = vi.fn().mockImplementation((s: string) => {
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
            case 'inntekt-vsa-gradert-uttak':
              return '100000'
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
            localHeltUttak: undefined,
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
            aarligInntektVsaPensjonBeloep: 100000,
            grad: 80,
            uttaksalder: {
              aar: 62,
              maaneder: 2,
            },
          },
          type: 'userInputSlice/setCurrentSimulationGradertuttaksperiode',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {
          payload: undefined,
          type: 'userInputSlice/setCurrentSimulationAarligInntektVsaHelPensjon',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(4, {
          payload: null,
          type: 'userInputSlice/setCurrentSimulationaarligInntektFoerUttakBeloep',
        })

        expect(gaaTilResultatMock).toHaveBeenCalled()
        expect(setValidationErrorsMock).not.toHaveBeenCalled()
      })

      it('Når brukeren har endret inntekt og lagt til inntekt vsa 100 % alderspensjon og at alle feltene er fylt ut lagres det data og validationErrors kalles ikke', () => {
        const dispatchMock = vi.fn()
        const setValidationErrorsMock = vi.fn()
        const gaaTilResultatMock = vi.fn()
        const getMock = vi.fn().mockImplementation((s: string) => {
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
            case 'inntekt-vsa-gradert-uttak':
              return '100000'
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
            localHeltUttak: {
              aarligInntektVsaPensjon: {
                beloep: '300 000',
                sluttAlder: {
                  aar: 75,
                  maaneder: 0,
                },
              },
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
            aarligInntektVsaPensjonBeloep: 100000,
            grad: 80,
            uttaksalder: {
              aar: 62,
              maaneder: 2,
            },
          },
          type: 'userInputSlice/setCurrentSimulationGradertuttaksperiode',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {
          payload: {
            beloep: '300 000',
            sluttAlder: {
              aar: 75,
              maaneder: 0,
            },
          },
          type: 'userInputSlice/setCurrentSimulationAarligInntektVsaHelPensjon',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(4, {
          payload: '500 000',
          type: 'userInputSlice/setCurrentSimulationaarligInntektFoerUttakBeloep',
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
            localHeltUttak: {
              aarligInntektVsaPensjon: {
                beloep: '300 000',
                sluttAlder: {
                  aar: 75,
                  maaneder: 0,
                },
              },
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
          type: 'userInputSlice/setCurrentSimulationGradertuttaksperiode',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(3, {
          payload: {
            beloep: '300 000',
            sluttAlder: {
              aar: 75,
              maaneder: 0,
            },
          },
          type: 'userInputSlice/setCurrentSimulationAarligInntektVsaHelPensjon',
        })
        expect(dispatchMock).toHaveBeenNthCalledWith(4, {
          payload: '500 000',
          type: 'userInputSlice/setCurrentSimulationaarligInntektFoerUttakBeloep',
        })

        expect(gaaTilResultatMock).toHaveBeenCalled()
        expect(setValidationErrorsMock).not.toHaveBeenCalled()
      })

      it('Når hasVilkaarIkkeOppfylt er true og harAvansertSkjemaUnsavedChanges er false lagres det data men brukeren blir ikke sendt til resultatssiden', () => {
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
            localHeltUttak: {
              aarligInntektVsaPensjon: {
                beloep: '300 000',
                sluttAlder: {
                  aar: 75,
                  maaneder: 0,
                },
              },
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
            localHeltUttak: {
              aarligInntektVsaPensjon: {
                beloep: '300 000',
                sluttAlder: {
                  aar: 75,
                  maaneder: 0,
                },
              },
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
      inntektVsaGradertPensjonFormData: '99000',
    }

    it('returnerer true uten å oppdatere feilmeldingsteksten når input er korrekt', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          correctInputData,
          updateErrorMessageMock
        )
      ).toBeTruthy()
      expect(updateErrorMessageMock).not.toHaveBeenCalled()
    })

    it('returnerer false når uttaksgrad er noe annet enn et tall', () => {
      const updateErrorMessageMock = vi.fn()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, uttaksgradFormData: 'abc' },
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, uttaksgradFormData: '400' },
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, uttaksgradFormData: '4000' },
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(updateErrorMessageMock).not.toHaveBeenCalled()
    })

    it('returnerer false når inntekt ikke er gyldig (alle cases allerede videre i validateInntekt) ', () => {
      const updateErrorMessageMock = vi.fn()
      const validateInntektMock = vi.spyOn(inntektUtils, 'validateInntekt')
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, inntektVsaGradertPensjonFormData: 'abc' },
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(validateInntektMock).toHaveBeenCalled()
      expect(updateErrorMessageMock).toHaveBeenCalled()
    })

    it('returnerer false når heltUttakAar eller heltUttakMaaneder ikke er gyldig (alle cases allerede dekket i validateAlderFromForm) ', () => {
      const updateErrorMessageMock = vi.fn()
      const validateAlderFromFormMock = vi.spyOn(
        alderUtils,
        'validateAlderFromForm'
      )
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, heltUttakAarFormData: 'abc' },
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, heltUttakMaanederFormData: null },
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(validateAlderFromFormMock).toHaveBeenCalledTimes(4)
      expect(updateErrorMessageMock).toHaveBeenCalledTimes(3)
    })

    it('returnerer false når gradertUttakAar eller gradertUttakMaaneder ikke er gyldig (alle cases allerede dekket i validateAlderFromForm) ', () => {
      const updateErrorMessageMock = vi.fn()
      const validateAlderFromFormMock = vi.spyOn(
        alderUtils,
        'validateAlderFromForm'
      )
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, gradertUttakAarFormData: 'abc' },
          updateErrorMessageMock
        )
      ).toBeFalsy()
      expect(
        validateAvansertBeregningSkjema(
          { ...correctInputData, gradertUttakMaanederFormData: null },
          updateErrorMessageMock
        )
      ).toBeFalsy()

      expect(validateAlderFromFormMock).toHaveBeenCalledTimes(4)
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
          updateErrorMessageMock
        )
      ).toBeTruthy()

      expect(validateAlderFromFormMock).toHaveBeenCalledTimes(6)
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
          updateErrorMessageMock
        )
      ).toBeTruthy()

      expect(validateAlderFromFormMock).toHaveBeenCalled()
      expect(updateErrorMessageMock).not.toHaveBeenCalled()
    })
  })
})
