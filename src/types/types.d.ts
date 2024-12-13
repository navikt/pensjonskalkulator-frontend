import { paths } from './router/constants'
import { components } from './schema'

declare global {
  type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
  }

  type Locales = 'nb' | 'nn' | 'en'

  type Path = (typeof paths)[number]

  type BooleanRadio = 'ja' | 'nei'
  type AfpRadio = 'ja_offentlig' | 'ja_privat' | 'nei' | 'vet_ikke'
  type BeregningVisning = 'enkel' | 'avansert'
  type Alder = components['schemas']['Alder']

  type UnleashToggle = components['schemas']['EnablementDto']

  // fetching av landliste
  type Land = components['schemas']['LandInfo']
  type Utenlandsperiode = {
    id: string
    landkode: string
    arbeidetUtenlands: boolean | null
    startdato: string
    sluttdato?: string
  }
  // /ansatt-id
  type Ansatt = components['schemas']['AnsattV1']

  // /person
  export type GetPersonQuery = TypedUseQueryStateResult<
    Person,
    void,
    BaseQueryFn<Record<string, unknown>, Person>
  >
  type Person = components['schemas']['PersonV2']
  type Sivilstand = components['schemas']['PersonV2']['sivilstand']
  type UtvidetSivilstand = Sivilstand | 'SAMBOER'

  // /inntekt
  export type GetInntektQuery = TypedUseQueryStateResult<
    Inntekt,
    void,
    BaseQueryFn<Record<string, unknown>, Inntekt>
  >
  type Inntekt = components['schemas']['InntektDto']

  // /ekskludert-status
  export type GetEkskludertStatusQuery = TypedUseQueryStateResult<
    EkskludertStatus,
    void,
    BaseQueryFn<Record<string, unknown>, Person>
  >
  type EkskludertStatus = components['schemas']['EkskluderingStatusV1']

  // /loepende-omstillingsstoenad-eller-gjenlevendeytelse
  type OmstillingsstoenadOgGjenlevende =
    components['schemas']['BrukerHarLoependeOmstillingsstoenadEllerGjenlevendeYtelse']

  // /v2/vedtak/loepende-vedtak
  export type GetLoependeVedtakQuery = TypedUseQueryStateResult<
    LoependeVedtak,
    void,
    BaseQueryFn<Record<string, unknown>, LoependeVedtak>
  >
  type LoependeVedtak = components['schemas']['LoependeVedtakV2']

  // /tidligste-uttaksalder
  type TidligstMuligHeltUttakRequestBody =
    components['schemas']['UttaksalderSpecV2']
  type TidligstMuligGradertUttakRequestBody =
    components['schemas']['UttaksalderResultV2']

  // /simulering/alderspensjon
  type AlderspensjonRequestBody =
    components['schemas']['PersonligSimuleringSpecV8']
  type AlderspensjonSimuleringstype =
    components['schemas']['PersonligSimuleringSpecV8']['simuleringstype']
  type AlderspensjonResponseBody =
    components['schemas']['PersonligSimuleringResultV8']
  type Vilkaarsproeving =
    components['schemas']['PersonligSimuleringVilkaarsproevingResultV8']
  type VilkaarsproevingAlternativ =
    components['schemas']['PersonligSimuleringAlternativResultV8']
  type SimulertOpptjeningGrunnlag =
    components['schemas']['PersonligSimuleringAarligInntektResultV8']
  type AlderspensjonMaanedligVedEndring =
    components['schemas']['PersonligSimuleringMaanedligPensjonResultV8']
  type AarligInntektVsaPensjon = {
    beloep: string
    sluttAlder: Alder
  }
  type HeltUttak = Omit<
    components['schemas']['PersonligSimuleringHeltUttakSpecV8'],
    'aarligInntektVsaPensjon'
  > & {
    aarligInntektVsaPensjon?: AarligInntektVsaPensjon
  }

  type GradertUttak = Omit<
    components['schemas']['PersonligSimuleringGradertUttakSpecV8'],
    'aarligInntektVsaPensjonBeloep'
  > & {
    aarligInntektVsaPensjonBeloep?: string
  }
  type AfpPrivatPensjonsberegning =
    components['schemas']['PersonligSimuleringAarligPensjonResultV8']
  type AlderspensjonPensjonsberegning =
    components['schemas']['PersonligSimuleringAlderspensjonResultV8']

  // /pensjonsavtaler
  type PensjonsavtalerRequestBody =
    components['schemas']['PensjonsavtaleSpecV3']
  type PensjonsavtalerResponseBody =
    components['schemas']['PensjonsavtaleResultV3']
  type Utbetalingsperiode = components['schemas']['UtbetalingsperiodeV3']
  type UtbetalingsperiodeWithoutGrad = Omit<Utbetalingsperiode, 'grad'>
  type Pensjonsavtale = components['schemas']['PensjonsavtaleV3'] & {
    key?: number
  }
  type PensjonsavtaleKategori =
    components['schemas']['PensjonsavtaleV3']['kategori']
  type UtilgjengeligeSelskap = components['schemas']['SelskapV3']

  // /simuler-oftp
  export type SimulerOffentligTpQuery = TypedUseQueryStateResult<
    OffentligTp,
    void,
    BaseQueryFn<Record<string, unknown>, OffentligTp>
  >
  type OffentligTpRequestBody =
    components['schemas']['IngressSimuleringOffentligTjenestepensjonSpecV2']
  type OffentligTp =
    components['schemas']['OffentligTjenestepensjonSimuleringsresultatDtoV2']
}
