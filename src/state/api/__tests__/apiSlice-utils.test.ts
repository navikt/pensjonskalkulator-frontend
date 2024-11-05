import {
  getSimuleringstypeFromRadio,
  transformUtenlandsperioderArray,
  generateTidligstMuligHeltUttakRequestBody,
  generateAlderspensjonEnkelRequestBody,
  generateAlderspensjonRequestBody,
  generatePensjonsavtalerRequestBody,
} from '../utils'

describe('apiSlice - utils', () => {
  const utenlandsperiode: Utenlandsperiode = {
    id: '12345',
    landkode: 'URY',
    arbeidetUtenlands: null,
    startdato: '01.01.2018',
    sluttdato: '28.01.2018',
  }

  describe('getSimuleringstypeFromRadio', () => {
    it('returnerer riktig simuleringstype', () => {
      expect(getSimuleringstypeFromRadio(false, 0, null)).toEqual(
        'ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(false, 0, 'nei')).toEqual(
        'ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(false, 0, 'vet_ikke')).toEqual(
        'ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(false, 0, 'ja_privat')).toEqual(
        'ALDERSPENSJON_MED_AFP_PRIVAT'
      )
      expect(getSimuleringstypeFromRadio(false, 0, 'ja_offentlig')).toEqual(
        'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG'
      )
      expect(getSimuleringstypeFromRadio(false, 50, 'ja_privat')).toEqual(
        'ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(false, 50, 'ja_offentlig')).toEqual(
        'ALDERSPENSJON'
      )

      expect(getSimuleringstypeFromRadio(true, 0, null)).toEqual(
        'ENDRING_ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(true, 0, 'nei')).toEqual(
        'ENDRING_ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(true, 0, 'vet_ikke')).toEqual(
        'ENDRING_ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(true, 0, 'ja_privat')).toEqual(
        'ENDRING_ALDERSPENSJON_MED_AFP_PRIVAT'
      )
      expect(getSimuleringstypeFromRadio(true, 0, 'ja_offentlig')).toEqual(
        'ENDRING_ALDERSPENSJON'
      )
      expect(getSimuleringstypeFromRadio(true, 50, 'ja_privat')).toEqual(
        'ENDRING_ALDERSPENSJON'
      )
    })
  })

  describe('transformUtenlandsperioderArray', () => {
    it('returnerer riktig array', () => {
      expect(transformUtenlandsperioderArray([])).toEqual([])
      expect(
        transformUtenlandsperioderArray([{ ...utenlandsperiode }])
      ).toStrictEqual([
        {
          landkode: 'URY',
          arbeidetUtenlands: false,
          fom: '2018-01-01',
          tom: '2018-01-28',
        },
      ])
      expect(
        transformUtenlandsperioderArray([
          { ...utenlandsperiode },
          {
            id: '98765',
            landkode: 'BFA',
            arbeidetUtenlands: true,
            startdato: '07.02.2005',
          },
        ])
      ).toStrictEqual([
        {
          landkode: 'URY',
          arbeidetUtenlands: false,
          fom: '2018-01-01',
          tom: '2018-01-28',
        },
        {
          landkode: 'BFA',
          arbeidetUtenlands: true,
          fom: '2005-02-07',
          tom: undefined,
        },
      ])
    })
  })

  describe('generateTidligstMuligHeltUttakRequestBody', () => {
    const requestBody = {
      loependeVedtak: {
        ufoeretrygd: {
          grad: 0,
        },
        harFremtidigLoependeVedtak: false,
      },
      afp: null,
      harSamboer: null,
      aarligInntektFoerUttakBeloep: '0',
      utenlandsperioder: [],
    }
    it('returnerer riktig simuleringstype', () => {
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')

      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          afp: 'nei',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')

      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          afp: 'ja_privat',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON_MED_AFP_PRIVAT')

      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          loependeVedtak: {
            ufoeretrygd: {
              grad: 50,
            },
            harFremtidigLoependeVedtak: false,
          },
          afp: 'ja_privat',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')

      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          loependeVedtak: {
            alderspensjon: {
              grad: 50,
              fom: '2012-12-12',
            },
            ufoeretrygd: {
              grad: 0,
            },
            harFremtidigLoependeVedtak: false,
          },
        })?.simuleringstype
      ).toEqual('ENDRING_ALDERSPENSJON')

      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          loependeVedtak: {
            alderspensjon: {
              grad: 50,
              fom: '2012-12-12',
            },
            ufoeretrygd: {
              grad: 0,
            },
            harFremtidigLoependeVedtak: false,
          },
          afp: 'ja_privat',
        })?.simuleringstype
      ).toEqual('ENDRING_ALDERSPENSJON_MED_AFP_PRIVAT')
    })

    it('returnerer riktig harEps', () => {
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
        })?.harEps
      ).toBeUndefined()
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          harSamboer: true,
        })?.simuleringstype
      ).toBeTruthy()
    })

    it('returnerer riktig aarligInntektFoerUttakBeloep', () => {
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
        })?.aarligInntektFoerUttakBeloep
      ).toBe(0)
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          aarligInntektFoerUttakBeloep: '123 456',
        })?.aarligInntektFoerUttakBeloep
      ).toBe(123456)
    })

    it('returnerer riktig sivilstand', () => {
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
        })?.sivilstand
      ).toBe('UGIFT')
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          sivilstand: 'UGIFT',
        })?.sivilstand
      ).toEqual('UGIFT')
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          sivilstand: 'GIFT',
        })?.sivilstand
      ).toBe('GIFT')
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          sivilstand: null,
          harSamboer: true,
        })?.sivilstand
      ).toEqual('SAMBOER')
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          sivilstand: 'UGIFT',
          harSamboer: true,
        })?.sivilstand
      ).toEqual('SAMBOER')
    })

    it('returnerer riktig aarligInntektVsaPensjon', () => {
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
        })?.aarligInntektVsaPensjon
      ).toBeUndefined()
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          aarligInntektVsaPensjon: {
            beloep: '99 000',
            sluttAlder: { aar: 75, maaneder: 0 },
          },
        })?.aarligInntektVsaPensjon
      ).toStrictEqual({
        beloep: 99000,
        sluttAlder: { aar: 75, maaneder: 0 },
      })
    })

    it('returnerer riktig utenlandsperioder', () => {
      expect(
        generateTidligstMuligHeltUttakRequestBody({
          ...requestBody,
          utenlandsperioder: [{ ...utenlandsperiode }],
        })?.utenlandsperiodeListe
      ).toStrictEqual([
        {
          landkode: 'URY',
          arbeidetUtenlands: false,
          fom: '2018-01-01',
          tom: '2018-01-28',
        },
      ])
    })
  })

  describe('generateAlderspensjonEnkelRequestBody', () => {
    const requestBody = {
      loependeVedtak: {
        ufoeretrygd: {
          grad: 0,
        },
        harFremtidigLoependeVedtak: false,
      },
      afp: 'ja_privat' as AfpRadio,
      sivilstand: 'GIFT' as Sivilstand,
      harSamboer: false,
      aarligInntektFoerUttakBeloep: '500 000',
      foedselsdato: '1963-04-30',
      uttaksalder: { aar: 68, maaneder: 3 },
      uttaksgrad: 100,
      utenlandsperioder: [],
    }
    it('returnerer undefined når foedselsdato, eller startAlder er null', () => {
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          foedselsdato: null,
        })
      ).toEqual(undefined)
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          foedselsdato: undefined,
        })
      ).toEqual(undefined)
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          uttaksalder: null,
        })
      ).toEqual(undefined)
    })
    it('returnerer riktig simuleringstype', () => {
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON_MED_AFP_PRIVAT')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          afp: 'ja_offentlig',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          afp: 'nei',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          afp: 'vet_ikke',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          afp: null,
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          loependeVedtak: {
            ufoeretrygd: {
              grad: 50,
            },
            harFremtidigLoependeVedtak: false,
          },
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          loependeVedtak: {
            alderspensjon: {
              grad: 50,
              fom: '2012-12-12',
            },
            ufoeretrygd: {
              grad: 0,
            },
            harFremtidigLoependeVedtak: false,
          },
        })?.simuleringstype
      ).toEqual('ENDRING_ALDERSPENSJON_MED_AFP_PRIVAT')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          loependeVedtak: {
            alderspensjon: {
              grad: 50,
              fom: '2012-12-12',
            },
            ufoeretrygd: {
              grad: 0,
            },
            harFremtidigLoependeVedtak: false,
          },
          afp: 'ja_offentlig',
        })?.simuleringstype
      ).toEqual('ENDRING_ALDERSPENSJON')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          loependeVedtak: {
            alderspensjon: {
              grad: 50,
              fom: '2012-12-12',
            },
            ufoeretrygd: {
              grad: 50,
            },
            harFremtidigLoependeVedtak: false,
          },
        })?.simuleringstype
      ).toEqual('ENDRING_ALDERSPENSJON')
    })

    it('returnerer riktig sivilstand', () => {
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
        })?.sivilstand
      ).toEqual('GIFT')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          sivilstand: null,
        })?.sivilstand
      ).toEqual('UGIFT')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          sivilstand: null,
          harSamboer: true,
        })?.sivilstand
      ).toEqual('SAMBOER')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          sivilstand: 'UGIFT' as Sivilstand,
        })?.sivilstand
      ).toEqual('UGIFT')
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          sivilstand: 'UGIFT' as Sivilstand,
          harSamboer: true,
        })?.sivilstand
      ).toEqual('SAMBOER')
    })

    it('returnerer riktig forventetInntekt', () => {
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
        })?.aarligInntektFoerUttakBeloep
      ).toEqual(500000)
    })

    it('returnerer riktig uttaksalder', () => {
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
        })?.heltUttak.uttaksalder
      ).toEqual({
        aar: 68,
        maaneder: 3,
      })
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          uttaksalder: { aar: 68, maaneder: 0 },
        })?.heltUttak.uttaksalder
      ).toEqual({
        aar: 68,
        maaneder: 0,
      })
    })

    it('formaterer streng dato korrekt', () => {
      expect(
        generateAlderspensjonEnkelRequestBody(requestBody)?.foedselsdato
      ).toBe('1963-04-30')
    })

    it('returnerer riktig utenlandsperioder', () => {
      expect(
        generateAlderspensjonEnkelRequestBody({
          ...requestBody,
          utenlandsperioder: [{ ...utenlandsperiode }],
        })?.utenlandsperiodeListe
      ).toStrictEqual([
        {
          landkode: 'URY',
          arbeidetUtenlands: false,
          fom: '2018-01-01',
          tom: '2018-01-28',
        },
      ])
    })
  })

  describe('generateAlderspensjonRequestBody', () => {
    const requestBody = {
      loependeVedtak: {
        ufoeretrygd: { grad: 0 },
        harFremtidigLoependeVedtak: false,
      },
      afp: 'ja_privat' as AfpRadio,
      sivilstand: 'GIFT' as Sivilstand,
      harSamboer: false,
      aarligInntektFoerUttakBeloep: '500 000',
      foedselsdato: '1963-04-30',
      heltUttak: {
        uttaksalder: { aar: 68, maaneder: 3 },
        aarligInntektVsaPensjon: {
          beloep: '99 000',
          sluttAlder: { aar: 75, maaneder: 0 },
        },
      },
      utenlandsperioder: [],
    }
    it('returnerer undefined når foedselsdato, eller heltUttak er null/undefined', () => {
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          foedselsdato: null,
        })
      ).toEqual(undefined)
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          foedselsdato: undefined,
        })
      ).toEqual(undefined)
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          heltUttak: undefined,
        })
      ).toEqual(undefined)
    })

    it('returnerer riktig simuleringstype', () => {
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON_MED_AFP_PRIVAT')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          afp: 'ja_offentlig',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          afp: 'nei',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          afp: 'vet_ikke',
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          afp: null,
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          afp: null,
          loependeVedtak: {
            ufoeretrygd: { grad: 60 },
            harFremtidigLoependeVedtak: false,
          },
        })?.simuleringstype
      ).toEqual('ALDERSPENSJON')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          loependeVedtak: {
            alderspensjon: { grad: 60, fom: '2010-10-10' },
            ufoeretrygd: { grad: 0 },
            harFremtidigLoependeVedtak: false,
          },
        })?.simuleringstype
      ).toEqual('ENDRING_ALDERSPENSJON_MED_AFP_PRIVAT')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          afp: null,
          loependeVedtak: {
            alderspensjon: { grad: 60, fom: '2010-10-10' },
            ufoeretrygd: { grad: 0 },
            harFremtidigLoependeVedtak: false,
          },
        })?.simuleringstype
      ).toEqual('ENDRING_ALDERSPENSJON')
    })

    it('returnerer riktig sivilstand', () => {
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
        })?.sivilstand
      ).toEqual('GIFT')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          sivilstand: null,
        })?.sivilstand
      ).toEqual('UGIFT')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          sivilstand: null,
          harSamboer: true,
        })?.sivilstand
      ).toEqual('SAMBOER')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          sivilstand: 'UGIFT' as Sivilstand,
        })?.sivilstand
      ).toEqual('UGIFT')
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          sivilstand: 'UGIFT' as Sivilstand,
          harSamboer: true,
        })?.sivilstand
      ).toEqual('SAMBOER')
    })

    it('returnerer riktig gradertUttak', () => {
      const gradertUttak = generateAlderspensjonRequestBody({
        ...requestBody,
        gradertUttak: {
          uttaksalder: { aar: 67, maaneder: 3 },
          grad: 20,
          aarligInntektVsaPensjonBeloep: '123 000',
        },
      })?.gradertUttak
      expect(gradertUttak?.grad).toEqual(20)
      expect(gradertUttak?.aarligInntektVsaPensjonBeloep).toEqual(123000)
      expect(gradertUttak?.uttaksalder.aar).toEqual(67)
      expect(gradertUttak?.uttaksalder.maaneder).toEqual(3)
    })

    it('returnerer riktig heltUttak', () => {
      const heltUttak = generateAlderspensjonRequestBody({
        ...requestBody,
      })?.heltUttak

      expect(heltUttak?.uttaksalder.aar).toEqual(68)
      expect(heltUttak?.uttaksalder.maaneder).toEqual(3)
      expect(heltUttak?.aarligInntektVsaPensjon?.beloep).toEqual(99000)
      expect(heltUttak?.aarligInntektVsaPensjon?.sluttAlder.aar).toEqual(75)
      expect(heltUttak?.aarligInntektVsaPensjon?.sluttAlder.maaneder).toEqual(0)
    })

    it('formaterer streng dato korrekt', () => {
      expect(generateAlderspensjonRequestBody(requestBody)?.foedselsdato).toBe(
        '1963-04-30'
      )
    })

    it('returnerer riktig utenlandsperioder', () => {
      expect(
        generateAlderspensjonRequestBody({
          ...requestBody,
          utenlandsperioder: [{ ...utenlandsperiode }],
        })?.utenlandsperiodeListe
      ).toStrictEqual([
        {
          landkode: 'URY',
          arbeidetUtenlands: false,
          fom: '2018-01-01',
          tom: '2018-01-28',
        },
      ])
    })
  })

  describe('generatePensjonsavtalerRequestBody', () => {
    it('returnerer riktig requestBody når maaneder er 0 og sivilstand undefined', () => {
      expect(
        generatePensjonsavtalerRequestBody({
          aarligInntektFoerUttakBeloep: '500 000',
          ufoeregrad: 0,
          afp: 'vet_ikke',
          heltUttak: { uttaksalder: { aar: 67, maaneder: 0 } },
          utenlandsperioder: [],
        })
      ).toEqual({
        aarligInntektFoerUttakBeloep: 500000,
        harAfp: false,
        sivilstand: undefined,
        uttaksperioder: [
          {
            startAlder: { aar: 67, maaneder: 0 },
            grad: 100,
            aarligInntektVsaPensjon: undefined,
          },
        ],
        utenlandsperioder: [],
      })
    })
    it('returnerer riktig requestBody når brukeren har uføretrygd og valgt afp privat', () => {
      expect(
        generatePensjonsavtalerRequestBody({
          aarligInntektFoerUttakBeloep: '500 000',
          ufoeregrad: 50,
          afp: 'ja_privat',
          heltUttak: { uttaksalder: { aar: 67, maaneder: 0 } },
          utenlandsperioder: [],
        })
      ).toEqual({
        aarligInntektFoerUttakBeloep: 500000,
        harAfp: false,
        sivilstand: undefined,
        uttaksperioder: [
          {
            startAlder: { aar: 67, maaneder: 0 },
            grad: 100,
            aarligInntektVsaPensjon: undefined,
          },
        ],
        utenlandsperioder: [],
      })
    })
    it('returnerer riktig requestBody når uttaksalder består av både år og måned', () => {
      expect(
        generatePensjonsavtalerRequestBody({
          aarligInntektFoerUttakBeloep: '500 000',
          ufoeregrad: 0,
          afp: 'ja_privat',
          sivilstand: 'GIFT',
          heltUttak: {
            uttaksalder: { aar: 62, maaneder: 4 },
            aarligInntektVsaPensjon: {
              beloep: '99 000',
              sluttAlder: { aar: 75, maaneder: 0 },
            },
          },
          utenlandsperioder: [],
        })
      ).toEqual({
        aarligInntektFoerUttakBeloep: 500000,
        harAfp: true,
        sivilstand: 'GIFT',
        uttaksperioder: [
          {
            startAlder: { aar: 62, maaneder: 4 },
            grad: 100,
            aarligInntektVsaPensjon: {
              beloep: 99000,
              sluttAlder: { aar: 75, maaneder: 0 },
            },
          },
        ],
        utenlandsperioder: [],
      })
    })
    it('returnerer riktig requestBody med gradert periode', () => {
      expect(
        generatePensjonsavtalerRequestBody({
          aarligInntektFoerUttakBeloep: '500 000',
          ufoeregrad: 0,
          afp: 'ja_privat',
          sivilstand: 'GIFT',
          heltUttak: {
            uttaksalder: { aar: 67, maaneder: 0 },
            aarligInntektVsaPensjon: {
              beloep: '99 000',
              sluttAlder: { aar: 75, maaneder: 0 },
            },
          },
          gradertUttak: {
            uttaksalder: { aar: 62, maaneder: 4 },
            grad: 20,
            aarligInntektVsaPensjonBeloep: '123 000',
          },
          utenlandsperioder: [],
        })
      ).toEqual({
        aarligInntektFoerUttakBeloep: 500000,
        harAfp: true,
        sivilstand: 'GIFT',
        uttaksperioder: [
          {
            startAlder: { aar: 62, maaneder: 4 },
            grad: 20,
            aarligInntektVsaPensjon: {
              beloep: 123000,
              sluttAlder: { aar: 67, maaneder: 0 },
            },
          },
          {
            startAlder: { aar: 67, maaneder: 0 },
            grad: 100,
            aarligInntektVsaPensjon: {
              beloep: 99000,
              sluttAlder: { aar: 75, maaneder: 0 },
            },
          },
        ],
        utenlandsperioder: [],
      })
    })
    it('returnerer riktig requestBody med utenlandsperioder', () => {
      expect(
        generatePensjonsavtalerRequestBody({
          aarligInntektFoerUttakBeloep: '500 000',
          ufoeregrad: 0,
          afp: 'ja_privat',
          sivilstand: 'GIFT',
          heltUttak: {
            uttaksalder: { aar: 62, maaneder: 0 },
          },
          utenlandsperioder: [
            {
              id: '1',
              landkode: 'URY',
              arbeidetUtenlands: false,
              startdato: '01.01.2018',
              sluttdato: '28.02.2018',
            },
            {
              id: '2',
              landkode: 'BEL',
              arbeidetUtenlands: true,
              startdato: '01.01.1990',
              sluttdato: '28.02.2020',
            },
          ],
        })
      ).toEqual({
        aarligInntektFoerUttakBeloep: 500000,
        harAfp: true,
        sivilstand: 'GIFT',
        uttaksperioder: [
          {
            startAlder: { aar: 62, maaneder: 0 },
            aarligInntektVsaPensjon: undefined,
            grad: 100,
          },
        ],
        utenlandsperioder: [
          {
            arbeidetUtenlands: false,
            fom: '2018-01-01',
            landkode: 'URY',
            tom: '2018-02-28',
          },
          {
            arbeidetUtenlands: true,
            fom: '1990-01-01',
            landkode: 'BEL',
            tom: '2020-02-28',
          },
        ],
      })
    })
  })
})
