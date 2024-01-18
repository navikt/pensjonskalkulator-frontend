/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/api/v2/alderspensjon/simulering': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Simuler alderspensjon
     *
     * @description Lag en prognose for framtidig alderspensjon. Feltet 'epsHarInntektOver2G' brukes til å angi om ektefelle/partner/samboer har inntekt over 2 ganger grunnbeløpet eller ei.
     */
    post: operations['simulerAlderspensjon']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/tidligste-uttaksalder': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Første mulige uttaksalder
     *
     * @description Finn første mulige uttaksalder for innlogget bruker. Feltet 'harEps' brukes til å angi om brukeren har ektefelle/partner/samboer eller ei
     */
    post: operations['finnTidligsteUttaksalder']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/pensjonsavtaler': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Hent pensjonsavtaler
     *
     * @description Henter pensjonsavtalene til den innloggede brukeren. I request må verdi av 'maaneder' være 0..11.
     */
    post: operations['fetchAvtaler']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/alderspensjon/simulering': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Simuler hel alderspensjon
     *
     * @description Lag en prognose for framtidig alderspensjon med 100 % uttak. Feltet 'epsHarInntektOver2G' brukes til å angi om ektefelle/partner/samboer har inntekt over 2 ganger grunnbeløpet eller ei.
     */
    post: operations['simulerAlderspensjonV1']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/ufoerepensjon': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Har løpende uføretrygd
     *
     * @description Hvorvidt den innloggede brukeren har løpende uføretrygd
     */
    post: operations['harUfoeretrygd']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/person': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Hent personinformasjon
     *
     * @description Henter personinformasjon om den innloggede brukeren
     */
    get: operations['person']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/tpo-medlemskap': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Har offentlig tjenestepensjonsforhold
     *
     * @description Hvorvidt den innloggede brukeren har offentlig tjenestepensjonsforhold
     */
    get: operations['harTjenestepensjonsforhold']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Sjekk status
     *
     * @description Hent status for applikasjonens helsetilstand
     */
    get: operations['status']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/sak-status': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Har uføretrygd/gjenlevendeytelse
     *
     * @description Hvorvidt den innloggede brukeren har løpende uføretrygd eller gjenlevendeytelse
     */
    get: operations['harRelevantSak']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/inntekt': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Siste pensjonsgivende inntekt
     *
     * @description Henter den innloggede brukerens sist skattelignede pensjonsgivende inntekt
     */
    get: operations['sistePensjonsgivendeInntekt']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/grunnbeloep': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Hent grunnbeløp
     *
     * @description Hent grunnbeløpet i folketrygden (G) for nåværende tidspunkt
     */
    get: operations['getGrunnbeloep']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/feature/{name}': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Hvorvidt en gitt funksjonsbryter er skrudd på
     *
     * @description Hent status for en gitt funksjonsbryter (hvorvidt funksjonen er skrudd på)
     */
    get: operations['isEnabled']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    AlderIngressDto: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    SimuleringGradertUttakIngressDto: {
      /** Format: int32 */
      grad: number
      uttaksalder: components['schemas']['AlderIngressDto']
      /** Format: int32 */
      aarligInntekt?: number
    }
    SimuleringHeltUttakIngressDto: {
      uttaksalder: components['schemas']['AlderIngressDto']
      /** Format: int32 */
      aarligInntektVsaPensjon?: {
        beloep: number
        sluttAlder: components['schemas']['AlderIngressDto']
      }
    }
    SimuleringIngressSpecDto: {
      /** @enum {string} */
      simuleringstype: 'ALDERSPENSJON' | 'ALDERSPENSJON_MED_AFP_PRIVAT'
      /** Format: date */
      foedselsdato: string
      epsHarInntektOver2G: boolean
      /** Format: int32 */
      forventetInntekt?: number
      /** @enum {string} */
      sivilstand?:
        | 'UNKNOWN'
        | 'UOPPGITT'
        | 'UGIFT'
        | 'GIFT'
        | 'ENKE_ELLER_ENKEMANN'
        | 'SKILT'
        | 'SEPARERT'
        | 'REGISTRERT_PARTNER'
        | 'SEPARERT_PARTNER'
        | 'SKILT_PARTNER'
        | 'GJENLEVENDE_PARTNER'
        | 'SAMBOER'
      gradertUttak?: components['schemas']['SimuleringGradertUttakIngressDto']
      heltUttak: components['schemas']['SimuleringHeltUttakIngressDto']
    }
    PensjonsberegningDto: {
      /** Format: int32 */
      alder: number
      /** Format: int32 */
      beloep: number
    }
    SimuleringsresultatDto: {
      alderspensjon: components['schemas']['PensjonsberegningDto'][]
      afpPrivat: components['schemas']['PensjonsberegningDto'][]
      vilkaarErOppfylt: boolean
    }
    UttaksalderGradertUttakIngressDto: {
      /** Format: int32 */
      grad: number
      /** Format: int32 */
      aarligInntekt?: number
    }
    UttaksalderIngressSpecDto: {
      /** @enum {string} */
      sivilstand?:
        | 'UNKNOWN'
        | 'UOPPGITT'
        | 'UGIFT'
        | 'GIFT'
        | 'ENKE_ELLER_ENKEMANN'
        | 'SKILT'
        | 'SEPARERT'
        | 'REGISTRERT_PARTNER'
        | 'SEPARERT_PARTNER'
        | 'SKILT_PARTNER'
        | 'GJENLEVENDE_PARTNER'
        | 'SAMBOER'
      harEps?: boolean
      /** Format: int32 */
      aarligInntekt?: number
      /** @enum {string} */
      simuleringstype?: 'ALDERSPENSJON' | 'ALDERSPENSJON_MED_AFP_PRIVAT'
      gradertUttak?: components['schemas']['UttaksalderGradertUttakIngressDto']
      heltUttak?: components['schemas']['SimuleringHeltUttakIngressDto']
    }
    AlderDto: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    Alder: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    PensjonsavtaleIngressSpecDto: {
      /** Format: int32 */
      aarligInntektFoerUttak: number
      uttaksperioder: components['schemas']['UttaksperiodeIngressSpecDto'][]
      harAfp?: boolean
      harEpsPensjon?: boolean
      harEpsPensjonsgivendeInntektOver2G?: boolean
      /** Format: int32 */
      antallAarIUtlandetEtter16?: number
      /** @enum {string} */
      sivilstand?:
        | 'UNKNOWN'
        | 'UOPPGITT'
        | 'UGIFT'
        | 'GIFT'
        | 'ENKE_ELLER_ENKEMANN'
        | 'SKILT'
        | 'SEPARERT'
        | 'REGISTRERT_PARTNER'
        | 'SEPARERT_PARTNER'
        | 'SKILT_PARTNER'
        | 'GJENLEVENDE_PARTNER'
        | 'SAMBOER'
    }
    UttaksperiodeIngressSpecDto: {
      startAlder: components['schemas']['Alder']
      /** Format: int32 */
      grad: number
      /** Format: int32 */
      aarligInntektVsaPensjon?: {
        beloep: number
        sluttAlder: components['schemas']['AlderIngressDto']
      }
    }
    PensjonsavtaleDto: {
      produktbetegnelse: string
      /** @enum {string} */
      kategori:
        | 'NONE'
        | 'UNKNOWN'
        | 'INDIVIDUELL_ORDNING'
        | 'PRIVAT_AFP'
        | 'PRIVAT_TJENESTEPENSJON'
        | 'OFFENTLIG_TJENESTEPENSJON'
        | 'FOLKETRYGD'
      /** Format: int32 */
      startAar: number
      /** Format: int32 */
      sluttAar?: number
      utbetalingsperioder: components['schemas']['UtbetalingsperiodeDto'][]
    }
    PensjonsavtalerDto: {
      avtaler: components['schemas']['PensjonsavtaleDto'][]
      utilgjengeligeSelskap: components['schemas']['SelskapDto'][]
    }
    SelskapDto: {
      navn: string
      heltUtilgjengelig: boolean
    }
    UtbetalingsperiodeDto: {
      startAlder: components['schemas']['Alder']
      sluttAlder?: components['schemas']['Alder']
      /** Format: int32 */
      aarligUtbetaling: number
      /** Format: int32 */
      grad: number
    }
    SimuleringSpecDto: {
      /** @enum {string} */
      simuleringstype: 'ALDERSPENSJON' | 'ALDERSPENSJON_MED_AFP_PRIVAT'
      /** Format: int32 */
      uttaksgrad: number
      foersteUttaksalder: components['schemas']['AlderIngressDto']
      /** Format: date */
      foedselsdato: string
      epsHarInntektOver2G: boolean
      /** Format: int32 */
      forventetInntekt?: number
      /** @enum {string} */
      sivilstand?:
        | 'UNKNOWN'
        | 'UOPPGITT'
        | 'UGIFT'
        | 'GIFT'
        | 'ENKE_ELLER_ENKEMANN'
        | 'SKILT'
        | 'SEPARERT'
        | 'REGISTRERT_PARTNER'
        | 'SEPARERT_PARTNER'
        | 'SKILT_PARTNER'
        | 'GJENLEVENDE_PARTNER'
        | 'SAMBOER'
    }
    UfoerepensjonSpecDto: {
      /** Format: date */
      fom: string
    }
    UfoerepensjonDto: {
      harUfoerepensjon: boolean
    }
    ApiPersonDto: {
      fornavn: string
      /** Format: date */
      foedselsdato: string
      /** @enum {string} */
      sivilstand:
        | 'UNKNOWN'
        | 'UOPPGITT'
        | 'UGIFT'
        | 'GIFT'
        | 'ENKE_ELLER_ENKEMANN'
        | 'SKILT'
        | 'SEPARERT'
        | 'REGISTRERT_PARTNER'
        | 'SEPARERT_PARTNER'
        | 'SKILT_PARTNER'
        | 'GJENLEVENDE_PARTNER'
    }
    TjenestepensjonsforholdDto: {
      harTjenestepensjonsforhold: boolean
    }
    ApiStatusDto: {
      status: string
    }
    SakDto: {
      harUfoeretrygdEllerGjenlevendeytelse: boolean
    }
    InntektDto: {
      /** Format: int32 */
      beloep: number
      /** Format: int32 */
      aar: number
    }
    Grunnbeloep: {
      /** Format: int32 */
      value: number
    }
    EnablementDto: {
      enabled: boolean
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  simulerAlderspensjon: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['SimuleringIngressSpecDto']
      }
    }
    responses: {
      /** @description Simulering utført (men dersom vilkår ikke oppfylt vil responsen ikke inneholde pensjonsbeløp). */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['SimuleringsresultatDto']
        }
      }
      /** @description Simulering kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  finnTidligsteUttaksalder: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UttaksalderIngressSpecDto']
      }
    }
    responses: {
      /** @description Søk etter uttaksalder utført. I resultatet er verdi av 'maaneder' 0..11. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['AlderDto']
        }
      }
      /** @description Søk etter uttaksalder kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  fetchAvtaler: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['PensjonsavtaleIngressSpecDto']
      }
    }
    responses: {
      /** @description Henting av pensjonsavtaler utført. I respons er verdi av 'maaneder' 0..11. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['PensjonsavtalerDto']
        }
      }
      /** @description Henting av pensjonsavtaler kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  simulerAlderspensjonV1: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['SimuleringSpecDto']
      }
    }
    responses: {
      /** @description Simulering utført (men dersom vilkår ikke oppfylt vil responsen ikke inneholde pensjonsbeløp). */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['SimuleringsresultatDto']
        }
      }
      /** @description Simulering kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  harUfoeretrygd: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['UfoerepensjonSpecDto']
      }
    }
    responses: {
      /** @description Sjekking av uføretrygd utført */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['UfoerepensjonDto']
        }
      }
      /** @description Sjekking av uføretrygd kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  person: {
    parameters: {
      query?: {
        spec?: components['schemas']['UttaksalderIngressSpecDto']
      }
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Henting av personinformasjon utført. I resultatet er verdi av 'maaneder' 0..11. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['ApiPersonDto']
        }
      }
      /** @description Henting av personinformasjon kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  harTjenestepensjonsforhold: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['TjenestepensjonsforholdDto']
        }
      }
    }
  }
  status: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['ApiStatusDto']
        }
      }
    }
  }
  harRelevantSak: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Sjekking av saker utført */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['SakDto']
        }
      }
      /** @description Sjekking av saker kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  sistePensjonsgivendeInntekt: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Henting av inntekt utført. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['InntektDto']
        }
      }
      /** @description Henting av inntekt kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
  getGrunnbeloep: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['Grunnbeloep']
        }
      }
    }
  }
  isEnabled: {
    parameters: {
      query?: never
      header?: never
      path: {
        name: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Sjekking av funksjonsbryter-status */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['EnablementDto']
        }
      }
      /** @description Sjekking av funksjonsbryter-status kunne ikke utføres av tekniske årsaker */
      503: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': unknown
        }
      }
    }
  }
}
