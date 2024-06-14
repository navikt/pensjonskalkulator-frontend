import { describe, expect, it } from 'vitest'

import {
  formatInntekt,
  formatInntektToNumber,
  updateAndFormatInntektFromInputField,
  validateInntekt,
} from '../inntekt'
import { waitFor } from '@/test-utils'

describe('inntekt-utils', () => {
  describe('formatInntekt', () => {
    it('returnerer tom string når amount er null eller undefined', () => {
      expect(formatInntekt(null)).toBe('')
      expect(formatInntekt(undefined)).toBe('')
      expect(formatInntekt('')).toBe('')
    })

    it('returnerer tom string når amount er ugyldig', () => {
      expect(formatInntekt('ytr')).toBe('')
    })

    it('returnerer string uten komma når amount er 0', () => {
      expect(formatInntekt(0)).toBe('0')
    })

    it('returnerer string uten komma når amount er integer', () => {
      expect(formatInntekt(1)).toBe('1')
      expect(formatInntekt(25)).toBe('25')
      expect(formatInntekt(-4)).toBe('−4')
    })

    it('returnerer nærmeste tall når amount har ugyldige karakter', () => {
      expect(formatInntekt('100.000')).toBe('100 000')
      expect(formatInntekt('100-000')).toBe('100 000')
      expect(formatInntekt('100/000')).toBe('100 000')
    })

    it('returnerer formatert string med heltall rundet opp eller ned når amount er float', () => {
      expect(formatInntekt(100123.95)).toBe('100 124')
      expect(formatInntekt(100123.5)).toBe('100 124')
      expect(formatInntekt(100123.49)).toBe('100 123')
      expect(formatInntekt(-15.2)).toBe('−15')
    })

    it('returnerer string med mellomrom mellom hvert tredje siffer', () => {
      expect(formatInntekt(100_000)).toBe('100 000')
      expect(formatInntekt(9_999_999)).toBe('9 999 999')
    })

    it('returnerer riktig string når amount kommer som string', () => {
      expect(formatInntekt('')).toBe('')
      expect(formatInntekt('0')).toBe('0')
      expect(formatInntekt('123000')).toBe('123 000')
    })
  })

  describe('formatInntektToNumber', () => {
    it('returnerer 0 når amount er tom eller undefined', () => {
      expect(formatInntektToNumber(undefined)).toBe(0)
      expect(formatInntektToNumber('')).toBe(0)
    })

    it('returnerer 0 når amount er ugyldig', () => {
      expect(formatInntektToNumber('ytr')).toBe(0)
    })

    it('returnerer 0 når amount er 0', () => {
      expect(formatInntektToNumber('0')).toBe(0)
    })

    it('returnerer riktig tall når amount er integer', () => {
      expect(formatInntektToNumber('1')).toBe(1)
      expect(formatInntektToNumber('25')).toBe(25)
      expect(formatInntektToNumber('-4')).toBe(-4)
    })

    it('returnerer nærmeste tall når amount inneholder ugyldige tegn', () => {
      expect(formatInntektToNumber('100 000')).toBe(100000)
      expect(formatInntektToNumber('100 000')).toBe(100000)
      expect(formatInntektToNumber('100.000')).toBe(100000)
      expect(formatInntektToNumber('100/000')).toBe(100000)
      expect(formatInntektToNumber('9_999_999')).toBe(9999999)
    })
  })

  describe('updateAndFormatInntektFromInputField', () => {
    it('når input elementet er null feiler ikke funksjonen og inntekt og valideringsfeil oppdateres', () => {
      const updateInntektMock = vi.fn()
      const updateValideringsfeilMock = vi.fn()
      updateAndFormatInntektFromInputField(
        null,
        '123000',
        updateInntektMock,
        updateValideringsfeilMock
      )
      expect(updateInntektMock).toHaveBeenCalled()
      expect(updateValideringsfeilMock).toHaveBeenCalled()
    })

    it('når input elementet er funnet og at input er ugyldig , formateres den ikke, og inntekt og valideringsfeil oppdateres', async () => {
      const setSelectionRangeMock = vi.fn()
      const updateInntektMock = vi.fn()
      const updateValideringsfeilMock = vi.fn()
      const inputHtmlElement = {
        selectionStart: 3,
        setSelectionRange: setSelectionRangeMock,
      } as unknown as HTMLInputElement

      updateAndFormatInntektFromInputField(
        inputHtmlElement,
        'abc', // denne strenges skal ikke formateres
        updateInntektMock,
        updateValideringsfeilMock
      )

      expect(updateInntektMock).toHaveBeenCalledWith('abc')
      expect(updateValideringsfeilMock).toHaveBeenCalled()

      expect(setSelectionRangeMock).not.toHaveBeenCalled()
    })
    it('når input elementet er funnet og at input strengen inneholder bare 0 og whitespace, formateres den ikke, og inntekt og valideringsfeil oppdateres', async () => {
      const setSelectionRangeMock = vi.fn()
      const updateInntektMock = vi.fn()
      const updateValideringsfeilMock = vi.fn()
      const inputHtmlElement = {
        selectionStart: 3,
        setSelectionRange: setSelectionRangeMock,
      } as unknown as HTMLInputElement

      updateAndFormatInntektFromInputField(
        inputHtmlElement,
        '00 000', // denne strenges skal ikke formateres
        updateInntektMock,
        updateValideringsfeilMock
      )

      expect(updateInntektMock).toHaveBeenCalledWith('00 000')
      expect(updateValideringsfeilMock).toHaveBeenCalled()

      expect(setSelectionRangeMock).not.toHaveBeenCalled()
    })

    it('når input elementet er funnet og at input strengen blir lik etter formatering, plasseres caret tilbake til sin opprinnelig posisjon, og inntekt og valideringsfeil oppdateres', async () => {
      const setSelectionRangeMock = vi.fn()
      const updateInntektMock = vi.fn()
      const updateValideringsfeilMock = vi.fn()
      const inputHtmlElement = {
        selectionStart: 3,
        setSelectionRange: setSelectionRangeMock,
      } as unknown as HTMLInputElement

      updateAndFormatInntektFromInputField(
        inputHtmlElement,
        '100', // denne strenges skal formateres til 100, altså med samme antakk karakter
        updateInntektMock,
        updateValideringsfeilMock
      )

      expect(updateInntektMock).toHaveBeenCalled()
      expect(updateValideringsfeilMock).toHaveBeenCalled()
      await waitFor(() => {
        expect(setSelectionRangeMock).toHaveBeenCalledWith(3, 3)
      })
    })

    it('når input elementet er funnet og at input strengen blir mindre etter formatering, plasseres caret et hakk nærmere fra sin opprinnelig posisjon, og inntekt og valideringsfeil oppdateres', async () => {
      const setSelectionRangeMock = vi.fn()
      const updateInntektMock = vi.fn()
      const updateValideringsfeilMock = vi.fn()
      const inputHtmlElement = {
        selectionStart: 3,
        setSelectionRange: setSelectionRangeMock,
      } as unknown as HTMLInputElement

      updateAndFormatInntektFromInputField(
        inputHtmlElement,
        '1 00', // denne strenges skal formateres til 100, altså ett karakter mindre
        updateInntektMock,
        updateValideringsfeilMock
      )

      expect(updateInntektMock).toHaveBeenCalled()
      expect(updateValideringsfeilMock).toHaveBeenCalled()
      await waitFor(() => {
        expect(setSelectionRangeMock).toHaveBeenCalledWith(2, 2)
      })
    })

    it('når input elementet er funnet og at input strengen blir større etter formatering, plasseres caret et hakk videre fra sin opprinnelig posisjon, og inntekt og valideringsfeil oppdateres', async () => {
      const setSelectionRangeMock = vi.fn()
      const updateInntektMock = vi.fn()
      const updateValideringsfeilMock = vi.fn()
      const inputHtmlElement = {
        selectionStart: 3,
        setSelectionRange: setSelectionRangeMock,
      } as unknown as HTMLInputElement

      updateAndFormatInntektFromInputField(
        inputHtmlElement,
        '123000', // denne strenges skal formateres til 123 000, altså ett karakter mer
        updateInntektMock,
        updateValideringsfeilMock
      )

      expect(updateInntektMock).toHaveBeenCalled()
      expect(updateValideringsfeilMock).toHaveBeenCalled()
      await waitFor(() => {
        expect(setSelectionRangeMock).toHaveBeenCalledWith(4, 4)
      })
    })
  })

  describe('validateInntekt', () => {
    afterEach(() => {
      vi.clearAllMocks()
    })

    const updateValidationErrorMessageMock = vi.fn()

    it('Gitt at input er required (default), returnerer false med riktig feilmelding når input er tomt', async () => {
      expect(
        validateInntekt(undefined, updateValidationErrorMessageMock)
      ).toBeFalsy()
      expect(validateInntekt('', updateValidationErrorMessageMock)).toBeFalsy()
      expect(
        validateInntekt(null, updateValidationErrorMessageMock)
      ).toBeFalsy()
      expect(updateValidationErrorMessageMock).toHaveBeenNthCalledWith(
        3,
        'inntekt.endre_inntekt_modal.textfield.validation_error.required'
      )
    })

    it('Gitt at input ikke er required, returnerer true med riktig feilmelding når input er tomt', async () => {
      expect(
        validateInntekt(undefined, updateValidationErrorMessageMock, false)
      ).toBeTruthy()
      expect(
        validateInntekt('', updateValidationErrorMessageMock, false)
      ).toBeTruthy()
      expect(
        validateInntekt(undefined, updateValidationErrorMessageMock, false)
      ).toBeTruthy()
    })

    it('returnerer false med riktig feilmelding når input er noe annet enn tall mellom 0-9 med/uten mellomrom, bindestrekk eller punktum', async () => {
      expect(
        validateInntekt('qwerty', updateValidationErrorMessageMock)
      ).toBeFalsy()
      expect(
        validateInntekt('123,45', updateValidationErrorMessageMock)
      ).toBeFalsy()
      expect(
        validateInntekt('123/45', updateValidationErrorMessageMock)
      ).toBeFalsy()
      expect(
        validateInntekt('-25', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(
        validateInntekt('-', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(
        validateInntekt('123.43', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(updateValidationErrorMessageMock).toHaveBeenNthCalledWith(
        1,
        'inntekt.endre_inntekt_modal.textfield.validation_error.type'
      )
    })

    it('returnerer false med riktig feilmelding når input oversiger maks beløpet', async () => {
      expect(
        validateInntekt('100000001', updateValidationErrorMessageMock)
      ).toBeFalsy()
      expect(updateValidationErrorMessageMock).toHaveBeenNthCalledWith(
        1,
        'inntekt.endre_inntekt_modal.textfield.validation_error.max'
      )
    })

    it('returnerer true uten feilmelding når input er riktig', async () => {
      expect(
        validateInntekt('500000', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(
        validateInntekt('500 000', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(
        validateInntekt('0', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(
        validateInntekt('100000000', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(
        validateInntekt('100 000 000', updateValidationErrorMessageMock)
      ).toBeTruthy()
      expect(updateValidationErrorMessageMock).not.toHaveBeenCalled()
    })
  })
})
