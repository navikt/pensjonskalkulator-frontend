import { AfpDetaljerListe } from './hooks'

export const shouldHideAfpDetaljer = ({
  afpDetaljerListe,
  loependeLivsvarigAfpOffentlig,
}: {
  afpDetaljerListe: AfpDetaljerListe[]
  loependeLivsvarigAfpOffentlig:
    | {
        afpStatus?: boolean | undefined
        virkningFom?: string | undefined
        maanedligBeloep?: number | undefined
        sistBenyttetGrunnbeloep?: number | undefined
      }
    | undefined
}) => {
  return Boolean(
    afpDetaljerListe.length === 0 ||
    afpDetaljerListe.every(
      (afpDetaljer) =>
        afpDetaljer.afpPrivat.length === 0 &&
        afpDetaljer.afpOffentlig.length === 0 &&
        afpDetaljer.afpOffentligSpk.length === 0 &&
        afpDetaljer.pre2025OffentligAfp.length === 0
    ) ||
    (loependeLivsvarigAfpOffentlig?.afpStatus &&
      (loependeLivsvarigAfpOffentlig?.maanedligBeloep === undefined ||
        loependeLivsvarigAfpOffentlig?.maanedligBeloep === null))
  )
}
