const translations = {
  'application.title': 'Pensjonskalkulator – Pensjon',
  'application.title.stegvisning.start': 'Start – Pensjonskalkulator',
  'application.title.stegvisning.sivilstand': 'Sivilstand – Pensjonskalkulator',
  'application.title.stegvisning.utenlandsopphold':
    'Utenlandsopphold – Pensjonskalkulator',
  'application.title.stegvisning.afp': 'AFP – Pensjonskalkulator',
  'application.title.stegvisning.ufoeretryg_AFP':
    'Uføretrygd og AFP – Pensjonskalkulator',
  'application.title.stegvisning.samtykke_offentlig_AFP':
    'Samtykke AFP offentlig – Pensjonskalkulator',
  'application.title.stegvisning.samtykke': 'Samtykke – Pensjonskalkulator',
  'application.title.stegvisning.uventet_feil':
    'Uventet feil – Pensjonskalkulator',
  'application.title.beregning': 'Beregning – Pensjonskalkulator',
  'application.title.forbehold': 'Forbehold – Pensjonskalkulator',
  'application.title.henvisning.apotekerne':
    'Henvisning apotekerne – Pensjonskalkulator',
  'application.title.personopplysninger':
    'Personopplysninger i enkel kalkulator – Pensjonskalkulator',
  'application.global.external_link': 'åpner i en ny fane',
  'application.global.retry': 'Prøv på nytt',
  'pageframework.title': 'Pensjonskalkulator',
  'pageframework.loading': 'Vent litt mens vi henter informasjon.',
  'error.fullmakt.title':
    'Du kan ikke bruke kalkulatoren på vegne av denne brukeren',
  'error.fullmakt.ingress':
    'Gå videre for å se hva du kan gjøre på vegne av denne brukeren eller bytte bruker.',
  'error.fullmakt.bytt_bruker': 'Gå videre til Bytt bruker',
  'error.global.title': 'Oops! Det har oppstått en uventet feil.',
  'error.global.ingress': 'Vi jobber med å rette feilen. Prøv igjen senere.',
  'error.global.button': 'Avbryt',
  'error.du_kan_ikke_bruke_enkel_kalkulator':
    'Du kan dessverre ikke bruke enkel kalkulator',
  'error.404.title': 'Oops! Siden du leter etter finnes ikke.',
  'error.404.list_item1':
    'Hvis du skrev inn adressen direkte i nettleseren kan du sjekke om den er stavet riktig.',
  'error.404.list_item2':
    'Hvis du klikket på en lenke er den feil eller utdatert.',
  'error.404.button.link_1': 'Gå til pensjonskalkulator',
  'error.404.button.link_2': 'Les om pensjon',
  'landingsside.for.deg.foedt.foer.1963': 'For deg født før 1963',
  'landingsside.du.maa.bruke.detaljert':
    'Du må bruke vår detaljerte kalkulator. Den gir deg et estimat på',
  'landingsside.for.deg.foedt.etter.1963': 'For deg født i 1963 eller senere',
  'landingsside.velge_mellom_detaljert_og_enkel':
    'I pensjonskalkulatoren kan du få et estimat på ',
  'landingsside.velge_mellom_detaljert_og_enkel_2':
    'Hvis du trenger å lagre beregningen din eller se detaljert beregning kan du bruke detaljert pensjonskalkulator. Den viser ikke livsvarig AFP eller tjenestepensjon i offentlig sektor.',
  'landingsside.button.detaljert_kalkulator_utlogget':
    'Logg inn i detaljert pensjonskalkulator',
  'landingsside.button.detaljert_kalkulator': 'Detaljert pensjonskalkulator',
  'landingsside.button.enkel_kalkulator_utlogget':
    'Logg inn i pensjonskalkulator',
  'landingsside.button.enkel_kalkulator': 'Pensjonskalkulator',
  'landingsside.text.uinnlogget_kalkulator': 'For deg som ikke kan logge inn',
  'landingsside.button.uinnlogget_kalkulator': 'Uinnlogget kalkulator',
  'landingsside.body.uinnlogget_kalkulator':
    'Du kan bruke vår uinnloggede kalkulator. Den henter ikke inn eller lagrer noen opplysninger om deg. Du må finne og oppgi alle opplysningene selv. Kalkulatoren gir deg et estimat på alderspensjon fra folketrygden (Nav) og AFP (avtalefestet pensjon) i privat sektor. Hvis du mottar uføretrygd eller andre ytelser, tar vi ikke hensyn til dette i kalkulatoren. Du bør derfor bruke den innloggede kalkulatoren.',
  'landingsside.link.personopplysninger':
    'Personopplysninger som brukes i pensjonskalkulator',
  'henvisning.detaljert_kalkulator': 'Detaljert pensjonskalkulator',
  'henvisning.apotekerne.body':
    'Siden du har apotekordningen, må du bruke detaljert pensjonskalkulator.',
  'stegvisning.radio_ja': 'Ja',
  'stegvisning.radio_nei': 'Nei',
  'stegvisning.neste': 'Neste',
  'stegvisning.tilbake': 'Tilbake',
  'stegvisning.avbryt': 'Avbryt',
  'stegvisning.tilbake_start': 'Tilbake til start',
  'stegvisning.tilbake_start.modal.title':
    'Hvis du går tilbake til start, mister du alle valgene dine.',
  'stegvisning.tilbake_start.modal.bekreft': 'Gå tilbake til start',
  'stegvisning.tilbake_start.modal.avbryt': 'Avbryt',
  'stegvisning.fremtidigvedtak.alert':
    'Du har vedtak om {grad} % alderspensjon fra {fom}. Du kan gjøre en ny beregning her frem til uttak.',
  'stegvisning.start.title': 'Hei',
  'stegvisning.start.endring.ingress_1a': `Du har nå <strong>{grad} % alderspensjon</strong>{
      ufoeretrygd,  select,     0 {} other { og <strong>{ufoeretrygd} % uføretrygd</strong>}}{
      afpPrivat,    select, false {} other { og <strong>AFP i privat sektor</strong>}}{
      afpOffentlig, select, false {} other { og <strong>AFP i offentlig sektor</strong>}}. `,
  'stegvisning.start.endring.ingress_1b.uten_fremtidig':
    'Her kan du sjekke hva du kan få hvis du vil endre alderspensjonen din.{br}{br}',
  'stegvisning.start.endring.ingress_1b.med_fremtidig':
    'Du har endret til <strong>{grad} % alderspensjon fra {fom}</strong>. Du kan ikke gjøre en ny beregning her før denne datoen.{br}{br}Har du spørsmål, kan du kontakte oss på telefon 55 55 33 34.',
  'stegvisning.start.ingress':
    'Velkommen til pensjonskalkulatoren som kan vise deg:',
  'stegvisning.start.list_item1': 'alderspensjon (Nav)',
  'stegvisning.start.list_item2': 'AFP (avtalefestet pensjon)',
  'stegvisning.start.list_item3': 'pensjonsavtaler (arbeidsgivere m.m.)',
  'stegvisning.start.endring.ingress_2':
    'Du må svare på alle spørsmålene som kommer.',
  'stegvisning.start.ingress_2':
    'For å få et estimat på pensjonen din, må du svare på alle spørsmålene som kommer.',
  'stegvisning.start.button': 'Kom i gang',
  'stegvisning.start.link':
    'Personopplysninger som brukes i pensjonskalkulator',
  'stegvisning.utenlandsopphold.title': 'Opphold utenfor Norge',
  'stegvisning.utenlandsopphold.ingress':
    'Har du bodd eller jobbet mer enn 5 år utenfor Norge mellom fylte 16 år og uttak av pensjon? Det kan påvirke alderspensjonen din.',
  'stegvisning.utenlandsopphold.readmore_1.title':
    'Hva som er opphold utenfor Norge',
  'stegvisning.utenlandsopphold.readmore_1.opphold.subtitle':
    'Som hovedregel er dette opphold utenfor Norge:',
  'stegvisning.utenlandsopphold.readmore_1.opphold.list_item1':
    'opphold i mer enn 12 måneder',
  'stegvisning.utenlandsopphold.readmore_1.opphold.list_item2':
    'opphold med jobb for utenlandsk arbeidsgiver uansett varighet',
  'stegvisning.utenlandsopphold.readmore_1.ikke_opphold.subtitle':
    'Som hovedregel er dette ikke opphold utenfor Norge:',
  'stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item1': 'ferier',
  'stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item2':
    'opphold uten jobb på under 12 måneder',
  'stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item3':
    'studier på under 12 måneder eller med støtte fra Lånekassen',
  'stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item4':
    'ansatt for norsk arbeidsgiver avhengig av hvilket land du jobber i',
  'stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item5':
    'ansatt i Forsvarets tjeneste',
  'stegvisning.utenlandsopphold.readmore_1.ikke_opphold.list_item6':
    'norsk statsborger og arbeidstaker på et norskregistrert skip eller i et norsk sivilt luftfartsselskap',
  'stegvisning.utenlandsopphold.readmore_1.ingress':
    'Er du usikker på hva som gjelder for deg, les om <trygdetidLink>medlemskap i folketrygden</trygdetidLink>.',
  'stegvisning.utenlandsopphold.readmore_2.title':
    'Betydning av opphold utenfor Norge for pensjon',
  'stegvisning.utenlandsopphold.readmore_2.ingress':
    'Hvis du er i utlandet i mer enn 12 måneder, er du som hovedregel ikke medlem av folketrygden i den perioden. Har du bodd eller jobbet i Norge kortere enn 40 år fra du fylte 16 år til du tar ut alderspensjon? Da kan du få lavere pensjon i Norge. <kortBotidLink>Mer om kort botid i Norge</kortBotidLink>.{br}{br}Det er flere faktorer som avgjør om opphold utenfor Norge påvirker pensjonen. Blant annet lengden på oppholdet, trygdeavtaler med landet, og årsak til oppholdet som arbeid, ferie og studier.{br}{br}For en mest mulig riktig beregning bør du derfor legge inn alle periodene du har oppholdt deg utenfor Norge. ',
  'stegvisning.utenlandsopphold.radio_label':
    'Har du bodd eller jobbet utenfor Norge i mer enn 5 år?',
  'stegvisning.utenlandsopphold.radio_label.description':
    'Fra du fylte 16 år til du tar ut pensjon',
  'stegvisning.utenlandsopphold.radio_ja': 'Ja',
  'stegvisning.utenlandsopphold.radio_nei': 'Nei',
  'stegvisning.utenlandsopphold.validation_error':
    'Du må svare på om du har bodd eller jobbet utenfor Norge i mer enn 5 år etter fylte 16 år.',
  'stegvisning.utenlandsopphold.mangler_opphold.validation_error':
    'Du må legge til minst ett opphold eller svare «Nei» på om du har bodd eller jobbet utenfor Norge i mer enn 5 år.',
  'stegvisning.utenlandsopphold.ingress.bottom':
    'Hvis du ikke skal bo i Norge når du mottar pensjon, bør du undersøke reglene for eksport. Kalkulatoren vurderer ikke om du har rett til å motta hele alderspensjonen hvis du er bosatt utenfor Norge.',
  'stegvisning.utenlandsopphold.oppholdene.title':
    'Oppholdene dine utenfor Norge',
  'stegvisning.utenlandsopphold.oppholdene.description':
    'Legg til gjennomførte og planlagte opphold',
  'stegvisning.utenlandsopphold.oppholdene.description.periode': 'Periode: ',
  'stegvisning.utenlandsopphold.oppholdene.description.periode.varig_opphold':
    '(Varig opphold)',
  'stegvisning.utenlandsopphold.oppholdene.description.har_jobbet': 'Jobbet: ',
  'stegvisning.utenlandsopphold.oppholdene.description.har_jobbet.ja': 'Ja',
  'stegvisning.utenlandsopphold.oppholdene.description.har_jobbet.nei': 'Nei',
  'stegvisning.utenlandsopphold.oppholdene.button.legg_til': 'Legg til opphold',
  'stegvisning.utenlandsopphold.oppholdene.button.legg_til_nytt':
    'Legg til nytt opphold',
  'stegvisning.utenlandsopphold.oppholdene.button.endre': 'Endre opphold',
  'stegvisning.utenlandsopphold.oppholdene.button.slette': 'Slett opphold',
  'utenlandsopphold.om_oppholdet_ditt_modal.title': 'Om oppholdet ditt',
  'utenlandsopphold.om_oppholdet_ditt_modal.button.legg_til':
    'Legg til opphold',
  'utenlandsopphold.om_oppholdet_ditt_modal.button.oppdater':
    'Oppdater opphold',
  'utenlandsopphold.om_oppholdet_ditt_modal.button.avbryt': 'Avbryt',
  'utenlandsopphold.om_oppholdet_ditt_modal.button.avbryt_endring':
    'Avbryt endring',
  'utenlandsopphold.om_oppholdet_ditt_modal.land.label': 'Velg land',
  'utenlandsopphold.om_oppholdet_ditt_modal.har_jobbet.label':
    'Jobbet du i {land}?',
  'utenlandsopphold.om_oppholdet_ditt_modal.har_jobbet.description':
    'Hvis du jobbet i deler av oppholdet, bør du legge til perioden du jobbet og perioden du ikke jobbet som to ulike opphold.',
  'utenlandsopphold.om_oppholdet_ditt_modal.har_jobbet.radio_ja': 'Ja',
  'utenlandsopphold.om_oppholdet_ditt_modal.har_jobbet.radio_nei': 'Nei',
  'utenlandsopphold.om_oppholdet_ditt_modal.startdato.label': 'Oppgi startdato',
  'utenlandsopphold.om_oppholdet_ditt_modal.startdato.description':
    'Hvis du ikke vet nøyaktige datoer, oppgi omtrentlige datoer.',
  'utenlandsopphold.om_oppholdet_ditt_modal.sluttdato.label': 'Oppgi sluttdato',
  'utenlandsopphold.om_oppholdet_ditt_modal.sluttdato.description':
    'Ved varig opphold, lar du feltet stå tomt.',
  'utenlandsopphold.om_oppholdet_ditt_modal.land.validation_error':
    'Du må velge land for oppholdet ditt.',
  'utenlandsopphold.om_oppholdet_ditt_modal.arbeidet_utenlands.validation_error':
    'Du må svare «Ja» eller «Nei» på om du jobbet under oppholdet.',
  'utenlandsopphold.om_oppholdet_ditt_modal.dato.validation_error.format':
    'Oppgi dag, måned og år som DD.MM.ÅÅÅÅ.',
  'utenlandsopphold.om_oppholdet_ditt_modal.dato.validation_error.after_max':
    'Sluttdato kan ikke være senere enn {maxDato}.',
  'utenlandsopphold.om_oppholdet_ditt_modal.startdato.validation_error.required':
    'Du må oppgi startdato for oppholdet ditt.',
  'utenlandsopphold.om_oppholdet_ditt_modal.startdato.validation_error.before_min':
    'Startdato kan ikke være før fødselsdatoen din.',
  'utenlandsopphold.om_oppholdet_ditt_modal.sluttdato.validation_error.before_min':
    'Sluttdato kan ikke være før startdato.',
  'utenlandsopphold.om_oppholdet_ditt_modal.sluttdato.validation_error.required':
    'Du kan bare ha ett varig opphold. Fyll ut sluttdato for oppholdet ditt.',
  'utenlandsopphold.om_oppholdet_ditt_modal.overlappende_perioder.validation_error.ikke_avtaleland':
    'Du har allerede registrert at du har bodd i {land} fra {periodestart} til {periodeslutt}. Du kan ikke ha overlappende opphold med landet {land}.',
  'utenlandsopphold.om_oppholdet_ditt_modal.overlappende_perioder.validation_error.ulike_land':
    'Du har allerede registrert at du har bodd i {land} fra {periodestart} til {periodeslutt}. Du kan ikke ha overlappende opphold i to ulike land.',
  'utenlandsopphold.om_oppholdet_ditt_modal.overlappende_perioder.validation_error.bostatus':
    'Du har allerede registrert at du har bodd i {land} fra {periodestart} til {periodeslutt}. Du kan ikke ha overlappende boopphold.',
  'utenlandsopphold.om_oppholdet_ditt_modal.overlappende_perioder.validation_error.jobbstatus':
    'Du har allerede registrert at du har jobbet i {land} fra {periodestart} til {periodeslutt}. Du kan ikke ha overlappende jobbperioder.',
  'utenlandsopphold.slette_modal.title':
    'Er du sikker på at du vil slette oppholdet ditt?',
  'utenlandsopphold.slette_modal.button.avbryt': 'Avbryt',
  'utenlandsopphold.slette_modal.button.slett': 'Slett opphold',
  'stegvisning.samtykke_pensjonsavtaler.title': 'Pensjonsavtaler',
  'stegvisning.samtykke_pensjonsavtaler.ingress':
    'Vil du se tjenestepensjon og andre pensjonsavtaler, må du samtykke til at Nav henter disse. Samtykket er frivillig.{br}{br} Hvis du svarer nei, får du beregnet alderspensjon (Nav) og eventuell AFP (avtalefestet pensjon).',
  'stegvisning.samtykke_pensjonsavtaler.radio_label':
    'Skal vi hente pensjonsavtalene dine?',
  'stegvisning.samtykke_pensjonsavtaler.radio_description':
    'Samtykket gjelder bare for beregninger i denne kalkulatoren, frem til du logger ut.',
  'stegvisning.samtykke_pensjonsavtaler.radio_ja': 'Ja',
  'stegvisning.samtykke_pensjonsavtaler.radio_nei': 'Nei, fortsett uten',
  'stegvisning.samtykke_pensjonsavtaler.validation_error':
    'Du må svare på om du vil at vi skal hente dine pensjonsavtaler.',
  'stegvisning.afp.title': 'AFP (avtalefestet pensjon)',
  'stegvisning.afpPrivat.title': 'AFP (avtalefestet pensjon) i privat sektor',
  'stegvisning.afp.ingress':
    'For å få AFP må arbeidsgiveren din ha en slik avtale og du må kvalifisere til å få den.',
  'stegvisning.afp.readmore_privat_title': 'Om AFP i privat sektor',
  'stegvisning.afp.readmore_privat_list_title': 'AFP i privat sektor:',
  'stegvisning.afp.readmore_privat_list_item1': 'er en livsvarig pensjon',
  'stegvisning.afp.readmore_privat_list_item2': 'kan tas ut sammen med arbeid',
  'stegvisning.afp.readmore_privat_list_item3':
    'må tas ut sammen med alderspensjon fra folketrygden (Nav)',
  'stegvisning.afp.readmore_privat_list_item4':
    'kan tas ut sammen med tjenestepensjon',
  'stegvisning.afp.readmore_privat_link':
    'Enkelte arbeidsgivere i privat sektor kan ha avtaler i offentlig sektor. Sjekk hos arbeidsgiveren din hva som gjelder for deg. Les om vilkårene til <afpLink>AFP i privat sektor på afp.no</afpLink>',
  'stegvisning.afp.readmore_offentlig_title':
    'Om livsvarig AFP i offentlig sektor',
  'stegvisning.afp.readmore_offentlig_list_title': 'AFP i offentlig sektor:',
  'stegvisning.afp.readmore_offentlig_list_item1': 'er en livsvarig pensjon',
  'stegvisning.afp.readmore_offentlig_list_item2':
    'kan tas ut sammen med arbeid',
  'stegvisning.afp.readmore_offentlig_list_item3':
    'kan tas ut sammen med alderspensjon fra folketrygden (Nav) og tjenestepensjon',
  'stegvisning.afp.readmore_offentlig_ingress':
    'De fleste statlige, fylkeskommunale og kommunale arbeidsgivere har avtale om livsvarig AFP. Enkelte arbeidsgivere i privat sektor kan ha avtaler i offentlig sektor. Hvis du er usikker på hva som gjelder for deg, sjekk hos arbeidsgiveren din.',
  'stegvisning.afpOvergangskull.readmore_offentlig_title':
    'Om AFP i offentlig sektor',
  'stegvisning.afpOvergangskull.readmore_offentlig_list_item1':
    'kan tas ut mellom 62 og 67 år',
  'stegvisning.afpOvergangskull.readmore_offentlig_list_item2':
    'reduseres mot inntekt',
  'stegvisning.afpOvergangskull.readmore_offentlig_list_item3':
    'kan ikke tas ut sammen med alderspensjon fra folketrygden (Nav)',
  'stegvisning.afpOvergangskull.readmore_offentlig_ingress':
    'De fleste statlige, fylkeskommunale og kommunale arbeidsgivere har avtale om AFP. Enkelte arbeidsgivere i privat sektor kan ha avtaler i offentlig sektor. Hvis du er usikker på hva som gjelder for deg, sjekk hos arbeidsgiveren din.',
  'stegvisning.afp.radio_label': 'Har du rett til AFP?',
  'stegvisning.afp.radio_ja_offentlig': 'Ja, i offentlig sektor',
  'stegvisning.afp.radio_ja_privat': 'Ja, i privat sektor',
  'stegvisning.afp.radio_nei': 'Nei',
  'stegvisning.afp.radio_vet_ikke': 'Vet ikke',
  'stegvisning.afpPrivat.radio_label': 'Har du rett til AFP i privat sektor?',
  'stegvisning.afp.overgangskullUtenAP.radio_label': 'Hva vil du beregne?',
  'stegvisning.afp.overgangskullUtenAP.radio_ja':
    'AFP etterfulgt av alderspensjon fra 67 år',
  'stegvisning.afp.overgangskullUtenAP.radio_nei': 'Kun alderspensjon',
  'stegvisning.afp.alert_vet_ikke':
    'Er du usikker, bør du sjekke med arbeidsgiveren din.',
  'stegvisning.afp.validation_error': 'Du må svare på om du har rett til AFP.',
  'stegvisning.afpPrivat.validation_error':
    'Du må svare på om du har rett til AFP i privat sektor.',
  'stegvisning.afpOverganskull.validation_error':
    'Du må svare på om du vil beregne AFP etterfulgt av alderspensjon fra 67 år eller kun alderspensjon.',
  'stegvisning.ufoere.title': 'Uføretrygd og AFP (avtalefestet pensjon)',
  'stegvisning.ufoere.info':
    'Før du fyller 62 år må du velge mellom å få AFP eller å beholde uføretrygden. {br}{br} AFP og uføretrygd kan ikke kombineres. Hvis du ikke gir oss beskjed, mister du retten til AFP (men beholder uføretrygden).',
  'stegvisning.ufoere.ingress':
    'Du kan få hjelp til å vurdere alternativene dine. Kontakt tjenestepensjonsordningen din hvis du jobber i offentlig sektor. <planleggePensjonLink>Kontakt Nav</planleggePensjonLink> hvis du jobber i privat sektor.',
  'stegvisning.ufoere.ingress-gammel':
    'Du kan få hjelp til å vurdere alternativene dine. Kontakt tjenestepensjonsordningen din hvis du jobber i offentlig sektor. <planleggePensjonLink>Kontakt Nav</planleggePensjonLink> hvis du jobber i privat sektor. {br}{br} Kalkulatoren beregner ikke AFP for deg som får uføretrygd.{br}{br} Gå videre for å se alderspensjon fra Nav og pensjonsavtaler.',
  'stegvisning.samtykke_offentlig_afp.title':
    'Samtykke til at Nav beregner AFP (avtalefestet pensjon)',
  'stegvisning.samtykke_offentlig_afp.ingress':
    'Tjenestepensjonsordningen din har ansvar for livsvarig AFP i offentlig sektor. De vil vurdere om du fyller vilkårene og gjør den endelige beregningen når du søker om AFP. Kontakt dem hvis du har spørsmål.{br}{br}Nav vurderer ikke om du har rett til AFP, men kan gi deg en foreløpig beregning på AFP i denne kalkulatoren. ',
  'stegvisning.samtykke_offentlig_afp.radio_label':
    'Vil du at Nav skal beregne AFP for deg?',
  'stegvisning.samtykke_offentlig_afp.radio_description':
    'Samtykket gjelder bare for beregninger i denne kalkulatoren, frem til du logger ut.',
  'stegvisning.samtykke_offentlig_afp.radio_ja': 'Ja',
  'stegvisning.samtykke_offentlig_afp.radio_nei': 'Nei, fortsett uten',
  'stegvisning.samtykke_offentlig_afp.validation_error':
    'Du må svare på om du vil at Nav skal beregne AFP for deg.',
  'stegvisning.sivilstand.title': 'Sivilstand',
  'stegvisning.sivilstand.ingress_ukjent':
    'Bor du sammen med noen? Det kan ha betydning for hva du får i pensjon.',
  'stegvisning.sivilstand.ingress_1':
    'Bor du sammen med noen? Det kan ha betydning for hva du får i pensjon. Du er registrert som ',
  'stegvisning.sivilstand.ingress_2': ' i Folkeregisteret.',
  'stegvisning.sivilstand.select_label':
    'Hva er sivilstanden din når du skal ta ut pensjon?',
  'stegvisning.sivilstand.select_description_ukjent':
    'Dette gjelder kun beregninger i kalkulatoren.',
  'stegvisning.sivilstand.select_description':
    'Hvis du endrer, gjelder det kun beregninger i kalkulatoren.',
  'stegvisning.sivilstand.radio_epsHarPensjon_label':
    'Vil {sivilstand} motta pensjon eller uføretrygd fra folketrygden, eller AFP?',
  'stegvisning.sivilstand.radio_epsHarPensjon_description':
    'Når du skal ta ut pensjon',
  'stegvisning.sivilstand.radio_epsHarInntektOver2G_label':
    'Vil {sivilstand} ha inntekt over 2G{grunnbelop}?',
  'stegvisning.sivilstand.radio_epsHarInntektOver2G_description':
    'Gjelder kalenderåret du tar ut pensjon. Alle inntekter skal regnes med, også kapitalinntekter og pensjon fra andre enn Nav.',
  'stegvisning.sivilstand.radio_label': 'Har du samboer eller ektefelle?',
  'stegvisning.sivilstand.radio_ja': 'Ja',
  'stegvisning.sivilstand.radio_nei': 'Nei',
  'stegvisning.sivilstand.select_validation_error':
    'Du må velge en sivilstand.',
  'stegvisning.sivilstand.epsHarPensjon.validation_error':
    'Du må svare på om {sivilstand} vil motta pensjon eller uføretrygd fra folketrygden, eller AFP.',
  'stegvisning.sivilstand.epsHarInntektOver2G.validation_error':
    'Du må svare på om {sivilstand} vil ha inntekt over 2G.',
  'stegvisning.sivilstand.ektefellen': 'ektefellen din',
  'stegvisning.sivilstand.samboeren': 'samboeren din',
  'stegvisning.sivilstand.partneren': 'partneren din',
  'agepicker.validation_error.aar': 'Du må velge år og måned',
  'agepicker.validation_error.maaneder': 'Du må velge måned',
  'string.og': 'og',
  'string.fra': 'fra',
  'string.til': 'til',
  'alder.md': 'md.',
  'alder.maaned': 'måned',
  'alder.maaneder': 'måneder',
  'alder.aar': 'år',
  'alder.aar_livsvarig': 'år (livsvarig)',
  'afp.offentlig': 'Offentlig',
  'afp.privat': 'Privat',
  'afp.nei': 'Nei',
  'afp.vet_ikke': 'Vet ikke',
  'sivilstand.GIFT': 'Gift',
  'sivilstand.UGIFT': 'Ugift',
  'sivilstand.REGISTRERT_PARTNER': 'Registrert partner',
  'sivilstand.ENKE_ELLER_ENKEMANN': 'Enke/enkemann',
  'sivilstand.SKILT': 'Skilt',
  'sivilstand.SEPARERT': 'Separert',
  'sivilstand.SEPARERT_PARTNER': 'Separert partner',
  'sivilstand.SAMBOER': 'Samboer',
  'sivilstand.SKILT_PARTNER': 'Skilt partner',
  'sivilstand.GJENLEVENDE_PARTNER': 'Gjenlevende partner',
  'sivilstand.med_samboer': 'med samboer',
  'sivilstand.uten_samboer': 'uten samboer',
  'tidligstmuliguttak.ingress_1':
    'Beregningen din viser at du kan ta ut <nowrap>100 %</nowrap> alderspensjon fra du er ',
  'tidligstmuliguttak.1963.ingress_2':
    ' Hvis du venter lenger med uttaket, vil den årlige pensjonen din øke.',
  'tidligstmuliguttak.1964.ingress_2':
    ' Det kan bli senere pga. økt pensjonsalder.',
  'tidligstmuliguttak.info_omstillingsstoenad_og_gjenlevende':
    'Alderspensjon kan ikke kombineres med gjenlevendepensjon eller omstillingsstønad. Ønsker du å ta ut alderspensjon før <nowrap>{normertPensjonsalder}</nowrap>, må du si fra deg gjenlevendepensjon eller omstillingsstønad når du tar ut alderspensjon. Har du spørsmål, kan du kontakte oss på telefon <nowrap>55 55 33 34</nowrap>.',
  'tidligstmuliguttak.error':
    'I Avansert kan du velge en mer nøyaktig pensjonsalder.',
  'beregning.read_more.pensjonsalder.label':
    'Om tidspunktet for tidligst uttak',
  'beregning.read_more.pensjonsalder.body':
    'Din opptjening i folketrygden bestemmer når du kan ta ut alderspensjon. Aldersgrensene vil øke gradvis fra 1964-kullet med én til to måneder per årskull, men dette tar ikke pensjonskalkulatoren høyde for.{br}{br}Hvis du har oppgitt AFP og/eller utenlandsopphold, er dette med i vurderingen av når du kan ta ut alderspensjon.{br}{br}Hvis du ikke kan ta ut hel <nowrap>(100 %)</nowrap> alderspensjon fra ønsket alder, kan du endre uttaksgraden for å se om du kan starte tidligere. Tar du ut gradert pensjon, kan tidspunktet du kan ta ut <nowrap>100 %</nowrap> forskyves.',
  'beregning.read_more.pensjonsalder.endring.body':
    'Opptjeningen din i folketrygden bestemmer hvor mye alderspensjon du kan ta ut. Ved {normertPensjonsalder} må pensjonen minst tilsvare garantipensjon. Uttak før {normertPensjonsalder} betyr at du fordeler pensjonen din over flere år, og dermed får du mindre hvert år.{br}{br}Hvis du har AFP, er AFP med i vurderingen av hvor mye alderspensjon du kan ta ut.',
  'beregning.alt_tekst': 'Årlig inntekt og pensjon etter uttak i kroner.',
  'omufoeretrygd.hel.ingress':
    'Du har <nowrap>100 %</nowrap> uføretrygd. Her kan du beregne <nowrap>100 %</nowrap> alderspensjon fra <nowrap>{normertPensjonsalder}</nowrap>. Kommende lovendringer vil gradvis øke pensjonsalderen fra 2027.',
  'omufoeretrygd.gradert.ingress':
    'Du har <nowrap>{grad} %</nowrap> uføretrygd. Her kan du beregne <nowrap>100 %</nowrap> alderspensjon fra <nowrap>{normertPensjonsalder}</nowrap>. Vil du beregne uttak før <nowrap>{normertPensjonsalder}</nowrap>, må du gå til {link}. {br}{br}Kommende lovendringer vil gradvis øke pensjonsalderen fra 2027.',
  'omufoeretrygd.readmore.title': 'Om pensjonsalder og uføretrygd',
  'omufoeretrygd.readmore.hel.ingress':
    '<nowrap>100 %</nowrap> uføretrygd kan ikke kombineres med alderspensjon. Det er derfor ikke mulig å beregne alderspensjon før <nowrap>{normertPensjonsalder}</nowrap> i kalkulatoren. Ved <nowrap>{normertPensjonsalder}</nowrap> går <nowrap>100 %</nowrap> uføretrygd automatisk over til <nowrap>100 %</nowrap> alderspensjon. Har du spørsmål, kan du kontakte oss på telefon <nowrap>55 55 33 34</nowrap>.',
  'omufoeretrygd.readmore.gradert.ingress':
    'Det er mulig å kombinere gradert uføretrygd og gradert alderspensjon fra <nowrap>{nedreAldersgrense}</nowrap>, så lenge du har høy nok opptjening til å ta ut alderspensjon. Graden av uføretrygd og alderspensjon kan ikke overstige <nowrap>100 %</nowrap>. Har du spørsmål, kan du kontakte oss på telefon <nowrap>55 55 33 34</nowrap>.',
  'omufoeretrygd.readmore.gradert.avansert.ingress':
    'Din opptjening i folketrygden bestemmer når du kan ta ut alderspensjon. Ved <nowrap>{normertPensjonsalder}</nowrap> må pensjonen minst tilsvare garantipensjon. Uttak før <nowrap>{normertPensjonsalder}</nowrap> betyr at du fordeler pensjonen din over flere år, og dermed får du mindre hvert år.{br}{br}Ved <nowrap>{normertPensjonsalder}</nowrap> går gradert uføretrygd automatisk over til gradert alderspensjon med nærmeste uttaksgrad. Hvis du vil ha <nowrap>100 %</nowrap> alderspensjon må du selv søke om dette.',
  'omufoeretrygd.readmore.endring.ingress':
    'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut. Grad av uføretrygd og alderspensjon kan til sammen ikke overstige <nowrap>100 %</nowrap>. Fra <nowrap>{normertPensjonsalder}</nowrap> kan du fritt velge gradert uttak (20, 40, 50, 60 eller <nowrap>80 %</nowrap>), eller hel alderspensjon (<nowrap>100 %</nowrap>).{br}{br}Hvis du vil endre gradering må det ha gått minimum 12 måneder siden du startet uttak av alderspensjon eller endret uttaksgrad. Du kan likevel endre til <nowrap>0 %</nowrap> når du vil.',
  'omufoeretrygd.avansert_link': 'Avansert',
  'velguttaksalder.title': 'Når vil du ta ut alderspensjon?',
  'velguttaksalder.endring.title': 'Når vil du endre alderspensjonen din?',
  'beregning.toggle.enkel': 'Enkel',
  'beregning.toggle.avansert': 'Avansert',
  'beregning.loading': 'Vent litt mens vi beregner pensjonen din.',
  'beregning.error':
    'Vi klarte dessverre ikke å beregne pensjonen din akkurat nå.',
  'beregning.fra': 'fra ',
  'beregning.til': ' til ',
  'beregning.tom': ' t.o.m. ',
  'beregning.livsvarig': 'livsvarig',
  'beregning.lav_opptjening.aar':
    'Du har ikke høy nok opptjening til å kunne starte uttak ved {startAar} år. Prøv en høyere alder.',
  'beregning.button.faerre_aar': 'Færre år',
  'beregning.button.flere_aar': 'Flere år',
  'beregning.pensjonsavtaler.alert.endring':
    'Pensjonsavtaler fra arbeidsgivere og egen sparing er ikke med i beregningen.',
  'beregning.pensjonsavtaler.alert.stoettes_ikke':
    'Beregningen viser kanskje ikke alt. Du kan ha rett til offentlig tjenestepensjon. Les mer under <scrollTo>pensjonsavtaler</scrollTo>.',
  'beregning.pensjonsavtaler.alert.privat.error':
    'Beregningen viser kanskje ikke alt. Noe gikk galt ved henting av pensjonsavtaler i privat sektor. Les mer under <scrollTo>pensjonsavtaler</scrollTo>.',
  'beregning.pensjonsavtaler.alert.offentlig.error':
    'Beregningen viser kanskje ikke alt. Noe gikk galt ved henting av pensjonsavtaler i offentlig sektor. Les mer under <scrollTo>pensjonsavtaler</scrollTo>.',
  'beregning.pensjonsavtaler.alert.privat_og_offentlig.error':
    'Beregningen viser kanskje ikke alt. Noe gikk galt ved henting av pensjonsavtaler i offentlig og privat sektor. Les mer under <scrollTo> pensjonsavtaler</scrollTo>.',
  'beregning.pensjonsavtaler.alert.avtaler_foer_alder':
    'Du har pensjonsavtaler som starter før valgt alder. Se perioder under <scrollTo>Pensjonsavtaler</scrollTo>.',
  'beregning.title': 'Beregning',
  'beregning.alert.inntekt':
    'Fordi du har endret inntekten din, endres pensjonsopptjeningen din.',
  'beregning.highcharts.informasjon_klikk': 'Klikk på søylene for detaljer',
  'beregning.highcharts.title': 'Beregning',
  'beregning.highcharts.xaxis': 'Årlig inntekt og pensjon etter uttak',
  'beregning.highcharts.yaxis': 'Kroner',
  'beregning.highcharts.yaxis.mobile': 'Tusen kroner',
  'beregning.highcharts.serie.inntekt.name': 'Pensjonsgivende inntekt',
  'beregning.highcharts.serie.tp.name': 'Pensjonsavtaler (arbeidsgivere m.m.)',
  'beregning.highcharts.serie.afp.name': 'AFP (avtalefestet pensjon)',
  'beregning.highcharts.serie.alderspensjon.name': 'Alderspensjon (Nav)',
  'beregning.highcharts.tooltip.inntekt': 'Inntekt når du er',
  'beregning.highcharts.tooltip.pensjon': 'Pensjon når du er',
  'beregning.highcharts.tooltip.inntekt_og_pensjon':
    'Inntekt og pensjon når du er',
  'beregning.tabell.lukk': 'Lukk tabell av beregningen',
  'beregning.tabell.vis': 'Vis tabell av beregningen',
  'beregning.tabell.sum': 'Sum',
  'beregning.avansert.link.endre_valgene_dine': 'Endre valgene dine',
  'beregning.avansert.link.endre_avanserte_valg': 'Endre avanserte valg',
  'beregning.avansert.endring_banner.title':
    'Alderspensjon før skatt når du er ',
  'beregning.avansert.endring_banner.kr_md': 'kr/md.',
  'beregning.avansert.resultatkort.tittel': 'Valgene dine',
  'beregning.avansert.resultatkort.description':
    'Inntekt, uttaksgrad og pensjonsalder',
  'beregning.avansert.resultatkort.button': 'Endre valgene dine',
  'beregning.avansert.resultatkort.frem_til_uttak': 'Frem til uttak av pensjon',
  'beregning.avansert.resultatkort.frem_til_endring':
    'Frem til endring av pensjon',
  'beregning.avansert.resultatkort.inntekt_1': 'Pensjonsgivende årsinntekt',
  'beregning.avansert.resultatkort.inntekt_2': ' kr før skatt',
  'beregning.avansert.resultatkort.alderspensjon': 'Alderspensjon: ',
  'beregning.avansert.rediger.inntekt_frem_til_uttak.label':
    'Pensjonsgivende årsinntekt frem til pensjon',
  'beregning.avansert.rediger.inntekt_frem_til_endring.label':
    'Pensjonsgivende årsinntekt frem til endring',
  'beregning.avansert.rediger.inntekt_frem_til_uttak.description_ufoere':
    'Uten uføretrygd og uførepensjon.',
  'beregning.avansert.rediger.inntekt_frem_til_uttak.description':
    'kr per år før skatt',
  'beregning.avansert.rediger.uttaksgrad.label':
    'Hvor mye alderspensjon vil du ta ut?',
  'beregning.avansert.rediger.uttaksgrad.description': 'Velg uttaksgrad',
  'beregning.avansert.rediger.uttaksgrad.endring.description':
    'Velg ny uttaksgrad',
  'beregning.avansert.rediger.read_more.uttaksgrad.label': 'Om uttaksgrad',
  'beregning.avansert.rediger.read_more.uttaksgrad.gradert_ufoeretrygd.label':
    'Om uttaksgrad og uføretrygd',
  'beregning.avansert.rediger.read_more.uttaksgrad.body':
    'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut. Du kan velge gradert uttak (20, 40, 50, 60 eller <nowrap>80 %</nowrap>), eller hel alderspensjon (<nowrap>100 %</nowrap>).',
  'beregning.avansert.rediger.read_more.uttaksgrad.endring.body':
    'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut. Hvis du vil endre gradering til 20, 40, 50, 60 eller 80 % må det ha gått minimum 12 måneder siden du startet uttak av alderspensjon eller endret uttaksgrad. Du kan endre til 0 % og 100 % så ofte du vil.',
  'beregning.avansert.rediger.read_more.uttaksgrad.gradert_ufoeretrygd.body':
    'Uttaksgrad angir hvor stor del av månedlig alderspensjon du ønsker å ta ut. Grad av uføretrygd og alderspensjon kan til sammen ikke overstige 100 %. Fra {normertPensjonsalder} kan du fritt velge gradert uttak (20, 40, 50, 60 eller 80 %), eller hel alderspensjon (100 %).',
  'beregning.avansert.rediger.radio.inntekt_vsa_helt_uttak':
    'Forventer du å ha inntekt samtidig som du tar ut <nowrap>100 %</nowrap> pensjon?',
  'beregning.avansert.rediger.radio.inntekt_vsa_helt_uttak.description':
    'Du kan tjene så mye du vil samtidig som du tar ut pensjon.',
  'beregning.avansert.rediger.radio.inntekt_vsa_helt_uttak.description.validation_error':
    'Du må svare på om du forventer å ha inntekt samtidig som du tar ut <nowrap>100 %</nowrap> pensjon.',
  'beregning.avansert.rediger.uttaksgrad.validation_error':
    'Du må velge hvor mye alderspensjon du vil ta ut.',
  'beregning.avansert.rediger.uttaksgrad.ufoeretrygd.validation_error':
    'Du må sette ned uttaksgraden slik at gradene av alderspensjon og uføretrygd ikke overstiger 100 % til sammen. Etter {normertPensjonsalder} kan du velge 100 % uttak.',
  'beregning.avansert.rediger.inntekt_vsa_helt_uttak.beloep.validation_error':
    'Du må fylle ut forventet inntekt samtidig som du tar ut <nowrap>100 %</nowrap> pensjon.',
  'beregning.avansert.rediger.radio.inntekt_vsa_gradert_uttak':
    'Forventer du å ha inntekt samtidig som du tar ut <nowrap>{grad} %</nowrap> pensjon?',
  'beregning.avansert.rediger.radio.inntekt_vsa_gradert_uttak.description':
    'Du kan tjene så mye du vil samtidig som du tar ut pensjon.',
  'beregning.avansert.rediger.radio.inntekt_vsa_gradert_uttak.ufoeretrygd.description':
    'Alderspensjonen påvirker ikke inntektsgrensen for uføretrygden din.',
  'beregning.avansert.rediger.radio.inntekt_vsa_gradert_uttak.description.validation_error':
    'Du må svare på om du forventer å ha inntekt samtidig som du tar ut <nowrap>{grad} %</nowrap> pensjon.',
  'beregning.avansert.rediger.inntekt_vsa_gradert_uttak.beloep.validation_error':
    'Du må fylle ut forventet inntekt samtidig som du tar ut <nowrap>{grad} %</nowrap> pensjon.',
  'beregning.avansert.rediger.inntekt_vsa_gradert_uttak.label':
    'Hva er din forventede årsinntekt samtidig som du tar ut <nowrap>{grad} %</nowrap> alderspensjon?',
  'beregning.avansert.rediger.inntekt_vsa_gradert_uttak.description':
    'Dagens kroneverdi før skatt',
  'beregning.avansert.rediger.inntekt.button': 'Endre inntekt',
  'beregning.avansert.rediger.agepicker.validation_error':
    ' for når du vil ta ut alderspensjon.',
  'beregning.avansert.rediger.agepicker.grad.validation_error':
    ' for når du vil ta ut <nowrap>{grad} %</nowrap> alderspensjon.',
  'beregning.avansert.rediger.agepicker.validation_error.maxAlder':
    'Uttaksalder for <nowrap>100 %</nowrap> alderspensjon må være senere enn alder for gradert pensjon.',
  'beregning.avansert.rediger.heltuttak.agepicker.label':
    'Når vil du ta ut <nowrap>100 %</nowrap> alderspensjon?',
  'beregning.avansert.rediger.beregningsvalg.description':
    'Du har <nowrap>{ufoeregrad} %</nowrap> uføretrygd. Før du blir <nowrap>62 år</nowrap> må du velge enten uføretrygd eller AFP.{br}',
  'beregning.avansert.rediger.beregningsvalg.om_valget_link':
    'Om valget mellom uføretrygd og AFP',
  'beregning.avansert.rediger.radio.beregningsvalg.label':
    'Hva vil du beregne?',
  'beregning.avansert.rediger.radio.beregningsvalg.uten_afp.label':
    'Alderspensjon og uføretrygd, uten AFP.',
  'beregning.avansert.rediger.radio.beregningsvalg.med_afp.label':
    'Alderspensjon og AFP, uten uføretrygd fra <nowrap>{nedreAldersgrense}</nowrap>',
  'beregning.avansert.rediger.beregningsvalg.med_afp.title':
    'Alderspensjon og AFP fra <nowrap>{nedreAldersgrense}</nowrap>',
  'beregning.avansert.rediger.beregningsvalg.med_afp.description':
    '<nowrap>{nedreAldersgrense}</nowrap> er laveste uttaksalder. Du må ha høy nok pensjonsopptjening for å kunne ta ut alderspensjon og AFP fra denne alderen.',
  'beregning.avansert.button.beregn': 'Beregn pensjon',
  'beregning.avansert.button.beregn.endring': 'Beregn ny pensjon',
  'beregning.avansert.button.oppdater': 'Oppdater pensjon',
  'beregning.avansert.button.nullstill': 'Nullstill valg',
  'beregning.avansert.button.avbryt': 'Avbryt endring',
  'beregning.vilkaarsproeving.intro':
    'Opptjeningen din er ikke høy nok til ønsket uttak. ',
  'beregning.vilkaarsproeving.intro.ikke_nok_opptjening':
    '{br}{br}Du kan tidligst ta ut alderspensjon ved {normertPensjonsalder}.',
  'beregning.vilkaarsproeving.intro.optional':
    'Du må øke alderen eller sette ned uttaksgraden.{br}{br}',
  'beregning.vilkaarsproeving.alternativer.heltUttak':
    'Et alternativ er at du ved {alternativtHeltStartAar} år og {alternativtHeltStartMaaned} måneder kan ta ut <nowrap>100 %</nowrap> alderspensjon. Prøv gjerne andre kombinasjoner.',
  'beregning.vilkaarsproeving.alternativer.gradertUttak':
    'Et alternativ er at du ved {alternativtGradertStartAar} år og {alternativtGradertStartMaaned} måneder kan ta ut <nowrap>{alternativtGrad} %</nowrap> alderspensjon. Prøv gjerne andre kombinasjoner.',
  'beregning.vilkaarsproeving.alternativer.heltOgGradertUttak':
    'Et alternativ er at du ved {alternativtGradertStartAar} år og {alternativtGradertStartMaaned} måneder kan ta ut <nowrap>{alternativtGrad} %</nowrap> alderspensjon hvis du tar ut <nowrap>100 %</nowrap> alderspensjon ved {alternativtHeltStartAar} år og {alternativtHeltStartMaaned} måneder eller senere. Prøv gjerne andre kombinasjoner.',
  'beregning.vilkaarsproeving.intro.medAFP.optional':
    'Du må sette ned uttaksgraden.{br}{br}',
  'beregning.vilkaarsproeving.alternativer.medAFP.heltUttak':
    'Et alternativ er at du ved {alternativtHeltStartAar} år og {alternativtHeltStartMaaned} måneder kan ta ut <nowrap>100 %</nowrap> alderspensjon. Prøv gjerne andre kombinasjoner.',
  'beregning.vilkaarsproeving.alternativer.medAFP.gradertUttak':
    'Et alternativ er at du ved {nedreAldersgrense} kan ta ut <nowrap>{alternativtGrad} %</nowrap> alderspensjon. Prøv gjerne andre kombinasjoner.',
  'beregning.vilkaarsproeving.alternativer.medAFP.heltOgGradertUttak':
    'Et alternativ er at du ved {nedreAldersgrense} kan ta ut <nowrap>{alternativtGrad} %</nowrap> alderspensjon hvis du tar ut <nowrap>100 %</nowrap> alderspensjon ved {alternativtHeltStartAar} år og {alternativtHeltStartMaaned} måneder eller senere. Prøv gjerne andre kombinasjoner.',
  'beregning.vilkaarsproeving.alternativer.medAFP.ikkeNokOpptjening':
    'Opptjeningen din er ikke høy nok til uttak av alderspensjon ved <nedreAldersgrense>. Kalkulatoren kan ikke beregne uttak etter <nedreAldersgrense>. Hvis du tar ut alderspensjon og AFP senere enn dette, vil du i perioden fra du er 62 år frem til uttak ikke få uføretrygd. Kontakt Nav for veiledning hvis du vurderer å si fra deg uføretrygden. Har du rett til livsvarig AFP i offentlig sektor kan du ta ut AFP før alderspensjon. Kontakt tjenestepensjonsordningen din for veiledning.',
  'grunnlag.title': 'Øvrig grunnlag for beregningen',
  'beregning.avansert.avbryt_modal.title':
    'Hvis du går ut av Avansert, mister du alle valgene dine.',
  'beregning.avansert.avbryt_modal.endring.title':
    'Hvis du går ut av beregningen, mister du alle valgene dine og går tilbake til start.',
  'beregning.avansert.avbryt_modal.button.avslutt': 'Gå ut av Avansert',
  'beregning.avansert.avbryt_modal.endring.button.avslutt':
    'Gå ut av beregning',
  'beregning.avansert.avbryt_modal.button.avbryt': 'Avbryt',
  'beregning.endring.alert.uttaksdato':
    'Du kan tidligst endre uttaksgrad til 20, 40, 50, 60 eller 80 % fra {dato}.',
  'beregning.endring.rediger.title': 'Beregn endring av alderspensjon',
  'beregning.endring.rediger.vedtak_status':
    'Fra {dato} har du mottatt {grad} % alderspensjon.',
  'beregning.endring.rediger.vedtak_grad_status':
    'Du har i dag <strong><nowrap>{grad} %</nowrap> alderspensjon</strong>. ',
  'beregning.endring.rediger.vedtak_betaling_status':
    'I {maaned} var dette <strong><nowrap>{beloep} kr</nowrap></strong> før skatt.',
  'grunnlag.ingress': 'Beløpene er vist i dagens kroneverdi før skatt.',
  'grunnlag.uttaksgrad.title': 'Uttaksgrad',
  'grunnlag.uttaksgrad.avansert_link': 'Gå til avansert kalkulator',
  'grunnlag.uttaksgrad.ingress':
    'Denne beregningen viser <nowrap>100 %</nowrap> uttak av alderspensjon. I avansert kalkulator kan du beregne alderspensjon med andre uttaksgrader (<nowrap>20 %</nowrap>, <nowrap>40 %</nowrap>, <nowrap>50 %</nowrap>, <nowrap>60 %</nowrap> og <nowrap>80 %</nowrap>). Du kan jobbe så mye du vil ved siden av pensjon selv om du har tatt ut <nowrap>100 %</nowrap>.',
  'grunnlag.inntekt.title': 'Inntekt frem til uttak',
  'grunnlag.inntekt.avansert_kalkulator':
    'Du kan legge til inntekt ved siden av pensjon i ',
  'grunnlag.inntekt.avansert_link': 'avansert kalkulator',
  'grunnlag.inntekt.ingress':
    'Din siste pensjonsgivende inntekt fra Skatteetaten er <nowrap>{beloep} kr</nowrap> fra {aar}. Se tidligere inntekter i <dinPensjonBeholdningLink>Din pensjonsopptjening</dinPensjonBeholdningLink>',
  'grunnlag.inntekt.info_om_inntekt': 'Hva er pensjonsgivende inntekt?',
  'grunnlag.inntekt.info_om_inntekt.lukk': 'Lukk',
  'grunnlag.sivilstand.title': 'Sivilstand',
  'grunnlag.sivilstand.title.error': 'Kunne ikke hentes',
  'grunnlag.sivilstand.ingress':
    'Hvis du bor sammen med noen kan inntekten til den du bor med ha betydning for hva du får i alderspensjon.{br}{br}Når du mottar alderspensjon må du derfor melde fra til Nav ved endring i sivilstand.{br}{br}<garantiPensjonLink>Om garantipensjon og satser</garantiPensjonLink>',
  'grunnlag.opphold.title.mindre_enn_5_aar': 'Opphold utenfor Norge',
  'grunnlag.opphold.title.mer_enn_5_aar': 'Opphold utenfor Norge',
  'grunnlag.opphold.title.for_lite_trygdetid': 'Opphold i Norge',
  'grunnlag.opphold.title.endring': 'Opphold utenfor Norge',
  'grunnlag.opphold.value.mindre_enn_5_aar': '5 år eller mindre',
  'grunnlag.opphold.value.mer_enn_5_aar': 'Mer enn 5 år',
  'grunnlag.opphold.value.for_lite_trygdetid': 'Mindre enn 5 år',
  'grunnlag.opphold.value.endring': 'Fra vedtak',
  'grunnlag.opphold.ingress.endre_opphold':
    'Du kan endre oppholdene dine ved å gå tilbake til {link}.',
  'grunnlag.opphold.ingress.endre_opphold.link': 'Opphold utenfor Norge',
  'grunnlag.opphold.ingress.mindre_enn_5_aar':
    'Beregningen forutsetter at du ikke har bodd eller jobbet utenfor Norge i mer enn 5 år fra fylte 16 år frem til du tar ut pensjon.',
  'grunnlag.opphold.ingress.for_lite_trygdetid':
    'Du har bodd mindre enn 5 år i Norge. Beregningen din kan være mangelfull.',
  'grunnlag.opphold.ingress.endring':
    'Beregningen bruker trygdetiden du har i Norge fra vedtaket ditt om alderspensjon.',
  'grunnlag.opphold.ingress.trygdetid':
    'Din trygdetid ved uttak: {aar} år{br}{br}<kortBotidLink>Om trygdetid</kortBotidLink>',
  'grunnlag.opphold.bunntekst':
    'Når du søker om alderspensjon vil opplysninger om opphold utenfor Norge sjekkes mot pensjonsmyndigheter i avtaleland. Den endelige pensjonen din kan derfor bli annerledes.',
  'grunnlag.opphold.avbryt_modal.title':
    'Hvis du går tilbake for å endre oppholdene dine, mister du alle valgene dine i beregningen.',
  'grunnlag.opphold.avbryt_modal.bekreft': 'Gå tilbake til opphold',
  'grunnlag.opphold.avbryt_modal.avbryt': 'Avbryt',
  'grunnlag.alderspensjon.title': 'Alderspensjon',
  'grunnlag.alderspensjon.value': 'Folketrygden (Nav)',
  'grunnlag.alderspensjon.ingress':
    'Alderspensjon beregnes ut ifra din pensjonsbeholdning i folketrygden. Hvis du fortsetter å ha inntekt samtidig som du tar ut pensjon, vil alderspensjonen din øke.',
  'grunnlag.alderspensjon.ingress.pensjonsbeholdning':
    '{br}{br}Din pensjonsbeholdning før uttak: {sum} kr',
  'grunnlag.alderspensjon.ingress.link':
    '{br}{br}<dinPensjonBeholdningLink>Din pensjonsopptjening</dinPensjonBeholdningLink> {br}{br}<alderspensjonsreglerLink>Om reglene for alderspensjon</alderspensjonsreglerLink>',
  'grunnlag.afp.title': 'AFP',
  'grunnlag.afp.ikke_beregnet': 'Ikke beregnet',
  'grunnlag.afp.endring': 'Uendret',
  'grunnlag.afp.ingress.null': '-',
  'grunnlag.afp.ingress.ja_offentlig':
    'Du har oppgitt AFP i offentlig sektor. Nav har ikke vurdert om du fyller vilkårene for AFP, men forutsetter at du gjør det. For mer informasjon om vilkårene, sjekk tjenestepensjonsordningen din.',
  'grunnlag.afp.ingress.ja_offentlig.ufoeretrygd':
    'Når du mottar uføretrygd, kan du ikke beregne AFP i kalkulatoren. AFP og uføretrygd kan ikke kombineres, og får du utbetalt uføretrygd etter du fyller 62 år mister du retten til AFP. Du må derfor velge mellom AFP og uføretrygd før du er 62 år.{br}{br}For mer informasjon om AFP, kontakt din tjenestepensjonsordning.',
  'grunnlag.afp.ingress.ja_offentlig_utilgjengelig':
    'Du har oppgitt AFP i offentlig sektor, men du har ikke samtykket til at Nav beregner den. Derfor vises ikke AFP i beregningen.',
  'grunnlag.afp.ingress.ja_privat':
    'Du har oppgitt AFP i privat sektor. Nav har ikke vurdert om du fyller vilkårene for AFP, men forutsetter at du gjør det. Les mer om vilkårene for AFP og hvordan du søker hos <afpLink>Fellesordningen for AFP</afpLink>.',
  'grunnlag.afp.ingress.ja_privat.ufoeretrygd':
    'Når du mottar uføretrygd, kan du ikke beregne AFP i kalkulatoren. AFP og uføretrygd kan ikke kombineres, og får du utbetalt uføretrygd etter du fyller 62 år mister du retten til AFP. Du må derfor velge mellom AFP og uføretrygd før du er 62 år.{br}{br}Du kan lese mer om dette på <afpPrivatLink>nav.no</afpPrivatLink>. Ønsker du hjelp til å vurdere alternativene dine, <planleggePensjonLink>kontakt Nav</planleggePensjonLink>.',
  'grunnlag.afp.ingress.vet_ikke':
    'Hvis du er usikker på om du har AFP bør du spørre arbeidsgiveren din. AFP kan påvirke når du kan ta ut alderspensjon.',
  'grunnlag.afp.ingress.vet_ikke.ufoeretrygd':
    'Hvis du er usikker på om du har AFP bør du spørre arbeidsgiveren din. AFP og uføretrygd kan ikke kombineres, og får du utbetalt uføretrygd etter fylte 62 år mister du retten til AFP. Du må derfor undersøke om du har rett til AFP, og velge mellom AFP og uføretrygd før du er 62 år.',
  'grunnlag.afp.ingress.nei':
    'Hvis du starter i jobb hos en arbeidsgiver som har avtale om AFP, anbefaler vi at du gjør en ',
  'grunnlag.afp.ingress.nei.ufoeretrygd':
    'Starter du i jobb hos en arbeidsgiver som har avtale om AFP, må du være oppmerksom på at AFP og uføretrygd ikke kan kombineres. Du må velge mellom AFP og uføretrygd før du er 62 år.',
  'grunnlag.afp.ingress.ja_offentlig.endring':
    'Du har AFP i offentlig sektor. Din AFP er ikke påvirket av endringen din av alderspensjon. Den fortsetter som før.',
  'grunnlag.afp.ingress.ja_privat.endring':
    'Du har AFP i privat sektor. Din AFP er ikke påvirket av endringen din av alderspensjon. Den fortsetter som før.',
  'grunnlag.afp.ingress.nei.endring':
    'Du har oppgitt at du ikke har rett til AFP. Hvis du er usikker på om du har AFP bør du spørre arbeidsgiveren din. AFP kan påvirke når du kan ta ut alderspensjon.',
  'grunnlag.afp.ingress.full_ufoeretrygd':
    'For å ha rett til AFP, må du være ansatt i offentlig sektor eller i en bedrift med AFP-ordning i privat sektor. Det gjelder de siste årene og helt fram til du tar ut AFP. Hvis du mottar full uføretrygd, har du derfor normalt ikke rett til AFP.{br}{br}Du kan ikke kombinere AFP og uføretrygd. Får du utbetalt uføretrygd etter du fyller 62 år mister du retten til AFP.{br}{br}Vil du vite mer? Les mer om <ufoeretrygdOgAfpLink>Uføretrygd og AFP</ufoeretrygdOgAfpLink>.',
  'grunnlag.afp.reset_link': 'ny beregning',
  'grunnlag.forbehold.ingress_1':
    'Pensjonen er beregnet med opplysningene vi har om deg og opplysningene du har oppgitt. Beregningen er gjort med gjeldende regelverk. Dette er et foreløpig estimat på hva du kan forvente deg i pensjon. Nav er ikke ansvarlig for beløpene som er hentet inn fra andre. ',
  'grunnlag.forbehold.link': 'Alle forbehold',
  'grunnlag.forbehold.title': 'Forbehold',
  'savnerdunoe.title': 'Savner du noe?',
  'savnerdunoe.title.endring': 'Klar til å søke om endring?',
  'savnerdunoe.ingress':
    'Flere valg for uttaksgrad, pensjonsalder og inntekt finner du i Avansert.',
  'savnerdunoe.button': 'Gå til Avansert',
  'savnerdunoe.body':
    'Denne kalkulatoren er under utvikling. Har du behov for å lagre beregninger og se flere detaljer, kan du gjøre det i <detaljertKalkulatorLink>detaljert pensjonskalkulator</detaljertKalkulatorLink>',
  'savnerdunoe.body.endring':
    'Send søknad om endring av alderspensjon i <dinPensjonEndreSoeknadLink>Din pensjon</dinPensjonEndreSoeknadLink>',
  'pensjonsavtaler.fra_og_med_forklaring':
    '«Fra» betyr «fra og med». «Til» betyr «til og med».',
  'pensjonsavtaler.private.title.ingen': 'Private pensjonsavtaler',
  'pensjonsavtaler.private.ingress.norsk_pensjon':
    'Avtaler fra privat sektor hentes fra <norskPensjonLink>Norsk Pensjon</norskPensjonLink>. Du kan ha andre avtaler enn det som finnes i Norsk Pensjon. Kontakt aktuell pensjonsordning.',
  'pensjonsavtaler.private.ingress.error.pensjonsavtaler':
    'Vi klarte ikke å hente dine private pensjonsavtaler. Prøv igjen senere.',
  'pensjonsavtaler.private.ingress.error.pensjonsavtaler.partial':
    'Vi klarte ikke å hente alle dine private pensjonsavtaler. Prøv igjen senere.',
  'pensjonsavtaler.ingress.error.samtykke_ingress':
    'Du har ikke samtykket til å hente inn pensjonsavtaler. ',
  'pensjonsavtaler.ingress.error.samtykke_link_1': 'Start en ny beregning',
  'pensjonsavtaler.ingress.error.samtykke_link_2':
    'hvis du ønsker å få dette i beregningen.',
  'pensjonsavtaler.ingress.ingen': 'Vi fant ingen pensjonsavtaler.',
  'pensjonsavtaler.kr_pr_aar': 'kr per år',
  'alder.livsvarig': 'Livsvarig fra',
  'pensjonsavtaler.md': 'md.',
  'pensjonsavtaler.tabell.title.left': 'Avtaler',
  'pensjonsavtaler.tabell.title.middle': 'Perioder',
  'pensjonsavtaler.tabell.title.right': 'Årlig beløp',
  'pensjonsavtaler.til': 'til',
  'pensjonsavtaler.title': 'Pensjonsavtaler',
  'pensjonsavtaler.offentligtp.title': 'Offentlig tjenestepensjon',
  'pensjonsavtaler.offentligtp.er_medlem_annen_ordning':
    'Du er eller har vært ansatt i offentlig sektor, men vi kan dessverre ikke hente inn offentlige pensjonsavtaler. Sjekk tjenestepensjonsavtalene dine hos aktuell tjenestepensjonsordning ({chunk}).',
  'pensjonsavtaler.offentligtp.error':
    'Vi klarte ikke å sjekke om du har offentlige pensjonsavtaler. Har du vært eller er ansatt i offentlig sektor, kan du sjekke tjenestepensjonsavtalene dine hos aktuell tjenestepensjonsordning (f.eks. Statens Pensjonskasse, Kommunal Landspensjonskasse, Oslo Pensjonsforsikring).',
  'pensjonsavtaler.offentligtp.teknisk_feil':
    'Vi klarte ikke å hente din offentlige tjenestepensjon. Prøv igjen senere eller kontakt tjenestepensjonsordningen din ({chunk}).',
  'pensjonsavtaler.offentligtp.empty':
    'Vi fikk ikke svar fra din offentlige tjenestepensjonsordning.',
  'pensjonsavtaler.offentligtp.subtitle.spk':
    'Alderspensjon fra Statens pensjonskasse (SPK)',
  'pensjonsavtaler.offentligtp.subtitle.klp':
    'Alderspensjon fra Kommunal Landspensjonskasse (KLP)',
  'pensjonsavtaler.offentligtp.spk.afp_ja':
    'Livsvarig AFP er ikke inkludert i dette beløpet. Sjekk <spkLink>SPK</spkLink> for detaljer om pensjonsavtalen din.',
  'pensjonsavtaler.offentligtp.spk.afp_nei.med_betinget':
    'Du har oppgitt at du ikke har rett til livsvarig AFP. Betinget tjenestepensjon er derfor inkludert i beløpet. Sjekk <spkLink>SPK</spkLink> for detaljer.',
  'pensjonsavtaler.offentligtp.spk.afp_nei.uten_betinget':
    'Du har oppgitt at du ikke har rett til livsvarig AFP. Sjekk <spkLink>SPK</spkLink> for detaljer.',
  'pensjonsavtaler.offentligtp.spk.afp_vet_ikke':
    'Du har oppgitt at du ikke vet om du har rett til livsvarig AFP. Beløpet kan derfor inkludere betinget tjenestepensjon. Sjekk <spkLink>SPK</spkLink> for detaljer.',
  'pensjonsavtaler.offentligtp.klp.afp_ja':
    'Livsvarig AFP eller eventuell betinget tjenestepensjon er ikke inkludert i dette beløpet. Sjekk <klpLink>KLP</klpLink> for detaljer om pensjonsavtalen din.',
  'pensjonsavtaler.offentligtp.klp.afp_nei+vetikke':
    'Du har ikke oppgitt at du har rett til livsvarig AFP. Eventuell livsvarig AFP eller betinget tjenestepensjon er ikke inkludert i dette beløpet. Sjekk <klpLink>KLP</klpLink> for detaljer om pensjonsavtalen din.',
  'inntekt.endre_inntekt_modal.open.button': 'Endre inntekt',
  'inntekt.endre_inntekt_modal.title': 'Pensjonsgivende inntekt',
  'inntekt.endre_inntekt_modal.textfield.label':
    'Hva er din forventede årsinntekt frem til du tar ut pensjon?',
  'inntekt.endre_inntekt_modal.textfield.description':
    'Dagens kroneverdi før skatt',
  'inntekt.endre_inntekt_modal.textfield.description.ufoere':
    'Ikke uføretrygd og uførepensjon. Dagens kroneverdi før skatt',
  'inntekt.endre_inntekt_modal.paragraph':
    'Når du oppdaterer inntekten, må du velge alder på nytt.',
  'inntekt.endre_inntekt_modal.textfield.validation_error.required':
    'Du må fylle ut inntekt.',
  'inntekt.endre_inntekt_modal.textfield.validation_error.type':
    'Du må skrive hele tall for å oppgi inntekt.',
  'inntekt.endre_inntekt_modal.textfield.validation_error.max':
    'Inntekten kan ikke overskride 100 000 000 kroner.',
  'inntekt.endre_inntekt_modal.button': 'Oppdater inntekt',
  'inntekt.endre_inntekt_vsa_pensjon_modal.label':
    'Forventet årsinntekt mens du tar ut <nowrap>100 %</nowrap> alderspensjon',
  'inntekt.endre_inntekt_vsa_pensjon_modal.ingress_2':
    'Du kan tjene så mye du vil samtidig som du tar ut <nowrap>100 %</nowrap> alderspensjon.',
  'inntekt.endre_inntekt_vsa_pensjon_modal.open.button.legg_til':
    'Legg til inntekt',
  'inntekt.endre_inntekt_vsa_pensjon_modal.open.button.endre': 'Endre inntekt',
  'inntekt.endre_inntekt_vsa_pensjon_modal.button.slette': 'Slett inntekt',
  'inntekt.endre_inntekt_vsa_pensjon_modal.title': 'Pensjonsgivende inntekt',
  'inntekt.endre_inntekt_vsa_pensjon_modal.textfield.label':
    'Hva er din forventede årsinntekt samtidig som du tar ut <nowrap>100 %</nowrap> alderspensjon?',
  'inntekt.endre_inntekt_vsa_pensjon_modal.textfield.description':
    'Dagens kroneverdi før skatt',
  'inntekt.endre_inntekt_vsa_pensjon_modal.agepicker.label':
    'Til hvilken alder forventer du å ha inntekten?',
  'inntekt.endre_inntekt_vsa_pensjon_modal.button.legg_til': 'Legg til inntekt',
  'inntekt.endre_inntekt_vsa_pensjon_modal.button.endre': 'Oppdater inntekt',
  'inntekt.info_om_inntekt.read_more.label': 'Om pensjonsgivende inntekt',
  'inntekt.info_om_inntekt.ufoeretrygd.read_more.label':
    'Om alderspensjon og inntektsgrensen for uføretrygd',
  'inntekt.info_om_inntekt.ufoeretrygd.read_more.body':
    'Alderspensjon er ikke pensjonsgivende inntekt og påvirker ikke inntektsgrensen for uføretrygden din. Du beholder inntektsgrensen din ved kombinasjon av uføretrygd og alderspensjon fra folketrygden.',
  'inntekt.info_om_inntekt.open.link': 'Hva er pensjonsgivende inntekt?',
  'inntekt.info_om_inntekt.intro':
    'Vi bruker siste tilgjengelige årsinntekt fra Skatteetaten som fremtidig inntekt. Hvis du endrer den i kalkulatoren, bruker vi den i stedet.{br}{br}',
  'inntekt.info_om_inntekt.subtitle_1': 'Dette er pensjonsgivende inntekt:',
  'inntekt.info_om_inntekt.list_item1': 'all lønnsinntekt for lønnstakere',
  'inntekt.info_om_inntekt.list_item2':
    'personinntekt fra næring for selvstendige',
  'inntekt.info_om_inntekt.list_item3': 'foreldrepenger',
  'inntekt.info_om_inntekt.list_item4': 'sykepenger',
  'inntekt.info_om_inntekt.list_item5': 'dagpenger',
  'inntekt.info_om_inntekt.list_item6': 'arbeidsavklaringspenger',
  'inntekt.info_om_inntekt.list_item7': 'omstillingsstønad',
  'inntekt.info_om_inntekt.list_item8': 'omsorgsstønad',
  'inntekt.info_om_inntekt.list_item9':
    'fosterhjemsgodtgjørelse (den delen som utgjør arbeidsgodtgjørelse)',
  'inntekt.info_om_inntekt.subtitle_2':
    'Dette er ikke pensjonsgivende inntekt:',
  'inntekt.info_om_inntekt.ikke_inntekt.list_item1':
    'uføretrygd fra Nav gir opptjening til alderspensjon, men er ikke pensjonsgivende inntekt',
  'inntekt.info_om_inntekt.ikke_inntekt.list_item2':
    'uførepensjon og annen pensjon fra tjenestepensjonsordning',
  'inntekt.info_om_inntekt.ikke_inntekt.list_item3':
    'inntekt og pensjon fra utlandet',
  'inntekt.info_om_inntekt.ikke_inntekt.list_item4':
    'førstegangstjeneste (hvis påbegynt tidligst i 2010) gir opptjening til alderspensjon, men er ikke pensjonsgivende inntekt',
  'inntekt.info_om_inntekt.ingress':
    'Listen er ikke uttømmende.{br}{br}Pensjonsgivende inntekt har betydning for retten til og størrelsen på alderspensjon og andre pensjonsytelser.',
  'forbehold.title': 'Forbehold',
  'personopplysninger.header':
    'Personopplysninger som brukes i pensjonskalkulator',
  'personopplysninger.section.formaal.header':
    'Hva er formålet med personopplysningene?',
  'personopplysninger.section.formaal.1':
    'Nav henter inn personopplysninger i kalkulatoren for at du skal kunne planlegge pensjonen din, og få et estimat på fremtidig pensjon.',
  'personopplysninger.section.formaal.2':
    'Du må logge inn for å bruke kalkulatoren. For å beregne alderspensjon bruker vi opplysninger du oppgir i kalkulatoren, opplysninger Nav har om deg, og nødvendige opplysninger fra andre offentlige instanser. Hvis du samtykker, henter vi inn pensjonsavtaler fra andre pensjonsleverandører, for å gi deg en samlet oversikt over pensjonen din.',
  'personopplysninger.section.hvordan_brukes.header':
    'Hvordan behandler vi personopplysninger?',
  'personopplysninger.section.hvordan_brukes.1':
    'Nav henter inn og utleverer kun personopplysninger når vi har lovhjemmel til det. Hvis vi trenger flere opplysninger, ber vi om et samtykke fra deg til å innhente eller utlevere opplysningene. Vi bruker kun opplysningene til det du samtykker til. Samtykket er frivillig. Du får informasjon underveis om hvilke opplysninger vi henter inn fra andre, som f.eks. Folkeregisteret og pensjonsleverandører.',
  'personopplysninger.section.hvordan_brukes.2':
    'Vi lagrer ikke beregningene du gjør, eller personopplysningene brukt i behandlingen.',
  'personopplysninger.section.hvordan_brukes.3':
    'Behandlingsgrunnlaget for behandlingen simulering av pensjon er Art. 6 (1) c Rettslig forpliktelse, Forvaltningsloven § 11, Folketrygdlovens kapittel 20 Alderspensjon og Art 6 (1) a, Samtykke. Nav er behandlingsansvarlig for behandlingen som gjøres i pensjonskalkulatoren.',
  'personopplysninger.section.hvilke_opplysninger.header':
    'Hvilke personopplysninger bruker vi?',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.header':
    'Opplysninger som vi henter for å oppfylle Nav sin veiledningsplikt etter Art. 6 (1) c Rettslig forpliktelse, Forvaltningsloven § 11.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.1':
    'Fødselsnummeret ditt henter vi fra ID-porten for å identifisere deg.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.2':
    'Navnet ditt henter vi fra Folkeregisteret for å tydeliggjøre at beregningen gjelder deg.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.3':
    'Fødselsdatoen din henter vi fra Folkeregisteret for at vi skal kunne beregne alderspensjonen din.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.4':
    'Ønsket alder (år og ev. måned) for uttak av pensjon oppgir du for at vi skal kunne beregne alderspensjonen din.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.5':
    'Din pensjonsopptjening hentes fra pensjonsopptjeningsregisteret hos Nav, som er basert på innrapporterte inntekter fra Skatteetaten, og ev. opptjening fra dagpenger, førstegangstjeneste, omsorgsopptjening og opptjening fra uføretrygd.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.6':
    'Din siste pensjonsgivende årsinntekt (og årstall) fra Skatteetaten brukes som inntekt frem til uttak av pensjon. Den inngår i pensjonsbeholdningen for beregning av alderspensjonen din. Endrer du fremtidig inntekt, blir din fremtidige pensjonsbeholdning basert på den.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.7':
    'Din sivilstand kan påvirke pensjonens størrelse. Opplysninger om sivilstanden din hentes fra Folkeregisteret. Hvis du er registrert som ugift, separert, skilt eller enke/enkemann, spør vi deg om du har samboer. Endringer du gjør, gjelder kun for den beregningen og lagres ikke hos Nav eller Folkeregisteret.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.8':
    'Hvis du har uføretrygd, bruker vi din uførehistorikk, uføregrad, antatt inntekt og eventuell yrkesskadehistorikk. Dette gjør vi for å kunne beregne alderspensjonen din. Vi bruker også uføregraden til å vise mulige graderinger av alderspensjon som du kan ta ut i kombinasjon med uføretrygd. Vi henter ikke inn medisinske opplysninger fra saken din.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.9':
    'Hvis du har gjenlevendepensjon eller omstillingsstønad, bruker vi opplysningen til å informere deg om at gjenlevendepensjon og omstillingsstønad ikke kan kombineres med alderspensjon.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.10':
    'Vi spør deg om opphold utenfor Norge. Vi bruker opplysningen til å beregne alderspensjon med riktig trygdetid i Norge. Vi spør om hvilket land oppholdet gjelder og om arbeid i landet, for å legge riktig trygdeavtale til grunn.',
  'personopplysninger.section.hvilke_opplysninger.veiledningsplikt.list.11':
    'Vi spør deg om du har rett til AFP i enten offentlig eller privat sektor. Vi bruker opplysningen til å identifisere om vi skal beregne alderspensjonen din med AFP. Opplysningen brukes også til å informere om når du kan ta ut alderspensjon. Videre bruker vi opplysningen til å beregne AFP i privat sektor.',
  'personopplysninger.section.hvilke_opplysninger.gpdr.list.header':
    'Opplysninger som vi bruker hvis du samtykker (GDPR Art 6 (1) a, Samtykke).',
  'personopplysninger.section.hvilke_opplysninger.gpdr.list.1':
    'Fra Norsk Pensjon henter vi pensjonsavtaler fra privat sektor, som tjenestepensjon fra arbeidsgiver (innskudds-, ytelses- eller hybridpensjon), fripoliser og enkelte avtaler om pensjonssparing.',
  'personopplysninger.section.hvilke_opplysninger.gpdr.list.2':
    'Vi sjekker også om du er eller har vært medlem i en offentlig tjenestepensjonsordning. Hvis du er eller har vært medlem, informerer vi deg om at du kan ha rettigheter, men henter ikke inn avtalene.',
  'personopplysninger.section.hvilke_opplysninger.gpdr.list.3':
    'Vi beregner AFP i offentlig sektor ut i fra din AFP-beholdning, hvis du samtykker.',
  'personopplysninger.section.hvilke_opplysninger.gpdr.list.subtext':
    'Vi henter inn disse opplysningene for at du skal få oversikt over din samlede pensjon.',
  'personopplysninger.section.lagring.heading': 'Lagring',
  'personopplysninger.section.lagring.text':
    'Det er mellomlagring i pensjonskalkulatoren for å gjøre en beregning av pensjonen din. Når du avslutter beregningen eller logger ut, slettes mellomlagringen. Beregningen din blir ikke lagret eller arkivert hos Nav.',
  'personopplysninger.section.informasjon_om_rettighetene.heading':
    'Informasjon om rettighetene dine',
  'personopplysninger.section.informasjon_om_rettighetene.text':
    'Se <navPersonvernerklaeringLink>personvernerklæringen</navPersonvernerklaeringLink> for Nav.',
  'personopplysninger.section.spoersmaal.heading':
    'Spørsmål til Nav eller datatilsynet om personvern',
  'personopplysninger.section.spoersmaal.text':
    'Se kontaktinformasjon i <navPersonvernerklaeringKontaktOssLink>personvernerklæringen</navPersonvernerklaeringKontaktOssLink> for Nav.',
  'showmore.vis_mindre': 'Vis mindre',
  'showmore.vis_mer': 'Vis mer',
}
export const getTranslation_nb = () => translations
export type Translations = typeof translations
