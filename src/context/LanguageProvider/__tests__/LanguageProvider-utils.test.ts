import * as enMessagesModule from '../../../translations/en'
import * as nbMessagesModule from '../../../translations/nb'
import * as nnMessagesModule from '../../../translations/nn'
import { getCookie, setCookie, getTranslations, updateLanguage } from '../utils'

describe('LanguageProvider-utils', () => {
  afterEach(() => {
    document.cookie.split(';').forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
  })
  describe('getCookie', () => {
    it('returnerer undefined når cookie ikke finnes', () => {
      const cookie = getCookie('my-cookie')
      expect(cookie).toBe('')
    })

    it('returnerer riktig cookie når den finnes', () => {
      document.cookie = 'my-cookie=value'
      const cookie = getCookie('my-cookie')
      expect(cookie).toBe('value')
    })
  })

  describe('setCookie', () => {
    it('setter cookie med riktig value', () => {
      expect(getCookie('my-cookie')).toBe(';expires')
      setCookie('my-cookie', 'updatedValue')

      const cookie = getCookie('my-cookie')
      expect(cookie).toBe('updatedValue')
    })
  })

  describe('getTranslations', () => {
    it('returnerer alle keys og tekst i riktig språk for alle lokalene', () => {
      // Foreløpig er norsk bokmål vår referanse
      const forventetLength = Object.keys(
        nbMessagesModule.getTranslation_nb()
      ).length

      const nbTranslations = getTranslations('nb')
      expect(nbTranslations['pageframework.title']).toBe('Pensjonskalkulator')
      const nbTranslationsKeys = Object.keys(nbTranslations)
      expect(nbTranslationsKeys).toHaveLength(forventetLength)

      const enTranslations = getTranslations('en')
      expect(enTranslations['pageframework.title']).toBe('MANGLER_TEKST')
      const enTranslationsKeys = Object.keys(enTranslations)
      expect(enTranslationsKeys).toHaveLength(forventetLength)

      const nnTranslations = getTranslations('nn')
      expect(nnTranslations['pageframework.title']).toBe('Pensjonskalkulator')
      const nnTranslationsKeys = Object.keys(nnTranslations)
      expect(nnTranslationsKeys).toHaveLength(forventetLength)
    })

    it('returnerer sammensatte tekster med fallback på bokmål for key som ikke finnes, når locale=en', () => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      vi.spyOn(nbMessagesModule, 'getTranslation_nb').mockReturnValueOnce({
        commonKey: 'norsk tittel',
        uniqueNOKey: 'unik norsk key',
      } as Record<string, string>)

      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      vi.spyOn(enMessagesModule, 'getTranslation_en').mockReturnValueOnce({
        commonKey: 'english title',
        uniqueENKey: 'unique english key',
      } as Record<string, string>)
      const enTranslations = getTranslations('en')
      expect(enTranslations.commonKey).toBe('english title')
      expect(enTranslations.uniqueNOKey).toBe('unik norsk key')
      expect(enTranslations.uniqueENKey).toBe('unique english key')
    })

    it('returnerer sammensatte tekster med fallback på bokmål for key som ikke finnes, når locale=nn', () => {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      vi.spyOn(nbMessagesModule, 'getTranslation_nb').mockReturnValueOnce({
        commonKey: 'norsk tittel',
        uniqueNOKey: 'unik norsk key',
      } as Record<string, string>)

      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      vi.spyOn(nnMessagesModule, 'getTranslation_nn').mockReturnValueOnce({
        commonKey: 'nynorsk tittel',
        uniqueNNKey: 'unik nynorsk key',
      } as Record<string, string>)
      const nnTranslations = getTranslations('nn')
      expect(nnTranslations.commonKey).toBe('nynorsk tittel')
      expect(nnTranslations.uniqueNOKey).toBe('unik norsk key')
      expect(nnTranslations.uniqueNNKey).toBe('unik nynorsk key')
    })

    it('returnerer nb som default når locale er ukjent', () => {
      const defaultTranslations = getTranslations('' as unknown as Locales)
      expect(defaultTranslations['application.title']).toBe(
        'Pensjonskalkulator – Pensjon'
      )
      const unknownTranslations = getTranslations('abc' as unknown as Locales)
      expect(unknownTranslations['application.title']).toBe(
        'Pensjonskalkulator – Pensjon'
      )
    })
  })

  describe('updateLanguage', () => {
    it('setter cookie med riktig value', () => {
      const setLanguageCookieMock = vi.fn()
      expect(document.documentElement.lang).toBe('')
      updateLanguage('en', setLanguageCookieMock)
      expect(setLanguageCookieMock).toHaveBeenCalledWith('en')
      expect(document.documentElement.lang).toBe('en')
    })
  })
})
