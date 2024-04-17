/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/api/v4/alderspensjon/simulering': {
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
     * @description Lag en prognose for framtidig alderspensjon med støtte til Afp Offentlig. Feltet 'epsHarInntektOver2G' brukes til å angi hvorvidt ektefelle/partner/samboer har inntekt over 2 ganger grunnbeløpet. Dersom simulering med de angitte parametre resulterer i avslag i vilkårsprøvingen, vil responsen inneholde alternative parametre som vil gi et innvilget simuleringsresultat
     */
    post: operations['simulerAlderspensjonV4']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v3/alderspensjon/simulering': {
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
     * @description Lag en prognose for framtidig alderspensjon. Feltet 'epsHarInntektOver2G' brukes til å angi hvorvidt ektefelle/partner/samboer har inntekt over 2 ganger grunnbeløpet. Dersom simulering med de angitte parametre resulterer i avslag i vilkårsprøvingen, vil responsen inneholde alternative parametre som vil gi et innvilget simuleringsresultat
     */
    post: operations['simulerAlderspensjonV3']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v2/pensjonsavtaler': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Hent pensjonsavtaler (versjon 2)
     *
     * @description Henter pensjonsavtalene til den innloggede brukeren. I request må verdi av 'maaneder' være 0..11.
     */
    post: operations['fetchAvtalerV2']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
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
    post: operations['simulerAlderspensjonV2']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/tidligste-hel-uttaksalder': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Første mulige uttaksalder ved helt uttak
     *
     * @description Finn første mulige uttaksalder for innlogget bruker ved helt (100 %) uttak. Feltet 'harEps' brukes til å angi om brukeren har ektefelle/partner/samboer eller ei
     */
    post: operations['finnTidligsteHelUttaksalderV1']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/tidligste-gradert-uttaksalder': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get?: never
    put?: never
    /**
     * Første mulige uttaksalder ved gradert uttak
     *
     * @description Finn første mulige uttaksalder for innlogget bruker ved gradert (20–80 %) uttak. Feltet 'harEps' brukes til å angi om brukeren har ektefelle/partner/samboer eller ei
     */
    post: operations['finnTidligsteGradertUttaksalderV1']
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v2/person': {
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
    get: operations['personV2']
    put?: never
    post?: never
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
  '/api/v1/ekskludert': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Om personen er ekskludert fra å bruke kalkulatoren
     *
     * @description Eksludering kan skyldes løpende uføretrygd, gjenlevendeytelse eller medlemskap i Apotekerforeningen
     */
    get: operations['erEkskludertV1']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
  '/api/v1/ansatt-id': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    /**
     * Hent ansatt-ID
     *
     * @description Henter informasjon som identifiserer den innloggede ansatte.
     */
    get: operations['ansattId']
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
    IngressSimuleringAlderV4: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    IngressSimuleringGradertUttakV4: {
      /** Format: int32 */
      grad: number
      uttaksalder: components['schemas']['IngressSimuleringAlderV4']
      /** Format: int32 */
      aarligInntektVsaPensjonBeloep?: number
    }
    IngressSimuleringHeltUttakV4: {
      uttaksalder: components['schemas']['IngressSimuleringAlderV4']
      aarligInntektVsaPensjon?: components['schemas']['IngressSimuleringInntektV4']
    }
    IngressSimuleringInntektV4: {
      /** Format: int32 */
      beloep: number
      sluttAlder: components['schemas']['IngressSimuleringAlderV4']
    }
    IngressSimuleringSpecV4: {
      /** @enum {string} */
      simuleringstype:
        | 'ALDERSPENSJON'
        | 'ALDERSPENSJON_MED_AFP_PRIVAT'
        | 'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG'
      /** Format: date */
      foedselsdato: string
      epsHarInntektOver2G: boolean
      /** Format: int32 */
      aarligInntektFoerUttakBeloep?: number
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
      gradertUttak?: components['schemas']['IngressSimuleringGradertUttakV4']
      heltUttak: components['schemas']['IngressSimuleringHeltUttakV4']
    }
    AfpOffentligV4: {
      afpLeverandoer: string
      afpOffentligListe: components['schemas']['PensjonsberegningAfpOffentligV4'][]
    }
    AlderV4: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    AlternativV4: {
      gradertUttaksalder?: components['schemas']['AlderV4']
      /** Format: int32 */
      uttaksgrad?: number
      heltUttaksalder: components['schemas']['AlderV4']
    }
    PensjonsberegningAfpOffentligV4: {
      /** Format: int32 */
      alder: number
      /** Format: int32 */
      beloep: number
    }
    PensjonsberegningV4: {
      /** Format: int32 */
      alder: number
      /** Format: int32 */
      beloep: number
    }
    SimuleringResultatV4: {
      alderspensjon: components['schemas']['PensjonsberegningV4'][]
      afpPrivat: components['schemas']['PensjonsberegningV4'][]
      afpOffentlig?: components['schemas']['AfpOffentligV4']
      vilkaarsproeving: components['schemas']['VilkaarsproevingV4']
    }
    VilkaarsproevingV4: {
      vilkaarErOppfylt: boolean
      alternativ?: components['schemas']['AlternativV4']
    }
    IngressSimuleringAlderV3: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    IngressSimuleringGradertUttakV3: {
      /** Format: int32 */
      grad: number
      uttaksalder: components['schemas']['IngressSimuleringAlderV3']
      /** Format: int32 */
      aarligInntektVsaPensjonBeloep?: number
    }
    IngressSimuleringHeltUttakV3: {
      uttaksalder: components['schemas']['IngressSimuleringAlderV3']
      aarligInntektVsaPensjon?: components['schemas']['IngressSimuleringInntektV3']
    }
    IngressSimuleringInntektV3: {
      /** Format: int32 */
      beloep: number
      sluttAlder: components['schemas']['IngressSimuleringAlderV3']
    }
    IngressSimuleringSpecV3: {
      /** @enum {string} */
      simuleringstype:
        | 'ALDERSPENSJON'
        | 'ALDERSPENSJON_MED_AFP_PRIVAT'
        | 'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG'
      /** Format: date */
      foedselsdato: string
      epsHarInntektOver2G: boolean
      /** Format: int32 */
      aarligInntektFoerUttakBeloep?: number
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
      gradertUttak?: components['schemas']['IngressSimuleringGradertUttakV3']
      heltUttak: components['schemas']['IngressSimuleringHeltUttakV3']
    }
    AlderV3: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    AlternativV3: {
      gradertUttaksalder?: components['schemas']['AlderV3']
      /** Format: int32 */
      uttaksgrad?: number
      heltUttaksalder: components['schemas']['AlderV3']
    }
    PensjonsberegningV3: {
      /** Format: int32 */
      alder: number
      /** Format: int32 */
      beloep: number
    }
    SimuleringResultatV3: {
      alderspensjon: components['schemas']['PensjonsberegningV3'][]
      afpPrivat: components['schemas']['PensjonsberegningV3'][]
      vilkaarsproeving: components['schemas']['VilkaarsproevingV3']
    }
    VilkaarsproevingV3: {
      vilkaarErOppfylt: boolean
      alternativ?: components['schemas']['AlternativV3']
    }
    IngressPensjonsavtaleAlderV2: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    IngressPensjonsavtaleInntektV2: {
      /** Format: int32 */
      beloep: number
      sluttAlder?: components['schemas']['IngressPensjonsavtaleAlderV2']
    }
    IngressPensjonsavtaleSpecV2: {
      /** Format: int32 */
      aarligInntektFoerUttakBeloep: number
      uttaksperioder: components['schemas']['IngressPensjonsavtaleUttaksperiodeV2'][]
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
    IngressPensjonsavtaleUttaksperiodeV2: {
      startAlder: components['schemas']['IngressPensjonsavtaleAlderV2']
      /** Format: int32 */
      grad: number
      aarligInntektVsaPensjon?: components['schemas']['IngressPensjonsavtaleInntektV2']
    }
    Alder: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
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
    IngressSimuleringAlderV2: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    IngressSimuleringGradertUttakV2: {
      /** Format: int32 */
      grad: number
      uttaksalder: components['schemas']['IngressSimuleringAlderV2']
      /** Format: int32 */
      aarligInntektVsaPensjonBeloep?: number
    }
    IngressSimuleringHeltUttakV2: {
      uttaksalder: components['schemas']['IngressSimuleringAlderV2']
      aarligInntektVsaPensjon?: components['schemas']['IngressSimuleringInntektV2']
    }
    IngressSimuleringInntektV2: {
      /** Format: int32 */
      beloep: number
      sluttAlder: components['schemas']['IngressSimuleringAlderV2']
    }
    IngressSimuleringSpecV2: {
      /** @enum {string} */
      simuleringstype:
        | 'ALDERSPENSJON'
        | 'ALDERSPENSJON_MED_AFP_PRIVAT'
        | 'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG'
      /** Format: date */
      foedselsdato: string
      epsHarInntektOver2G: boolean
      /** Format: int32 */
      aarligInntektFoerUttakBeloep?: number
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
      gradertUttak?: components['schemas']['IngressSimuleringGradertUttakV2']
      heltUttak: components['schemas']['IngressSimuleringHeltUttakV2']
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
    IngressUttaksalderAlderV1: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    IngressUttaksalderInntektV1: {
      /** Format: int32 */
      beloep: number
      sluttAlder?: components['schemas']['IngressUttaksalderAlderV1']
    }
    IngressUttaksalderSpecForHeltUttakV1: {
      /** @enum {string} */
      simuleringstype?:
        | 'ALDERSPENSJON'
        | 'ALDERSPENSJON_MED_AFP_PRIVAT'
        | 'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG'
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
      aarligInntektFoerUttakBeloep?: number
      aarligInntektVsaPensjon?: components['schemas']['IngressUttaksalderInntektV1']
    }
    AlderDto: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    IngressUttaksalderGradertUttakV1: {
      /** Format: int32 */
      grad: number
      /** Format: int32 */
      aarligInntektVsaPensjonBeloep?: number
    }
    IngressUttaksalderHeltUttakV1: {
      uttaksalder: components['schemas']['IngressUttaksalderAlderV1']
      aarligInntektVsaPensjon?: components['schemas']['IngressUttaksalderInntektV1']
    }
    IngressUttaksalderSpecForGradertUttakV1: {
      /** @enum {string} */
      simuleringstype?:
        | 'ALDERSPENSJON'
        | 'ALDERSPENSJON_MED_AFP_PRIVAT'
        | 'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG'
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
      aarligInntektFoerUttakBeloep?: number
      gradertUttak: components['schemas']['IngressUttaksalderGradertUttakV1']
      heltUttak: components['schemas']['IngressUttaksalderHeltUttakV1']
    }
    UttaksalderAlderDto: {
      /** Format: int32 */
      aar: number
      /** Format: int32 */
      maaneder: number
    }
    UttaksalderGradertUttakIngressDto: {
      /** Format: int32 */
      grad: number
      /** Format: int32 */
      aarligInntektVsaPensjon?: number
      heltUttakAlder: components['schemas']['UttaksalderAlderDto']
      /** Format: date */
      foedselsdato: string
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
      sisteInntekt?: number
      /** @enum {string} */
      simuleringstype?:
        | 'ALDERSPENSJON'
        | 'ALDERSPENSJON_MED_AFP_PRIVAT'
        | 'ALDERSPENSJON_MED_AFP_OFFENTLIG_LIVSVARIG'
      gradertUttak?: components['schemas']['UttaksalderGradertUttakIngressDto']
    }
    PersonV2: {
      navn: string
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
    EkskluderingStatusV1: {
      ekskludert: boolean
      /** @enum {string} */
      aarsak:
        | 'NONE'
        | 'HAR_LOEPENDE_UFOERETRYGD'
        | 'HAR_GJENLEVENDEYTELSE'
        | 'ER_APOTEKER'
    }
    AnsattV1: {
      id: string
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
  simulerAlderspensjonV4: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['IngressSimuleringSpecV4']
      }
    }
    responses: {
      /** @description Simulering utført */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['SimuleringResultatV4']
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
  simulerAlderspensjonV3: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['IngressSimuleringSpecV3']
      }
    }
    responses: {
      /** @description Simulering utført */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['SimuleringResultatV3']
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
  fetchAvtalerV2: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['IngressPensjonsavtaleSpecV2']
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
  simulerAlderspensjonV2: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['IngressSimuleringSpecV2']
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
  finnTidligsteHelUttaksalderV1: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['IngressUttaksalderSpecForHeltUttakV1']
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
  finnTidligsteGradertUttaksalderV1: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody: {
      content: {
        'application/json': components['schemas']['IngressUttaksalderSpecForGradertUttakV1']
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
  personV2: {
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
          '*/*': components['schemas']['PersonV2']
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
  erEkskludertV1: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Sjekking av ekskludering utført */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['EkskluderingStatusV1']
        }
      }
      /** @description Sjekking av ekskludering kunne ikke utføres av tekniske årsaker */
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
  ansattId: {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description Henting av ansatt-ID utført. */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['AnsattV1']
        }
      }
      /** @description Henting av ansatt-ID kunne ikke utføres av tekniske årsaker. */
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
