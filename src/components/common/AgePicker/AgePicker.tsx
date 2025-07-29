import clsx from 'clsx'
import React from 'react'
import { useIntl } from 'react-intl'

import { BodyShort, ErrorMessage, Label, Select } from '@navikt/ds-react'

import { Alert as AlertDashBorder } from '@/components/common/Alert'
import { useGetPersonQuery } from '@/state/api/apiSlice'
import { useAppSelector } from '@/state/hooks'
import { selectNedreAldersgrense } from '@/state/userInput/selectors'
import {
  DEFAULT_SENEST_UTTAKSALDER,
  formatUttaksalder,
  transformMaanedToDate,
  transformUttaksalderToDate,
} from '@/utils/alder'

import styles from './AgePicker.module.scss'

export interface AgePickerProps {
  form?: string
  name: string
  label: string | React.JSX.Element
  description?: string | React.JSX.Element
  value?: Partial<Alder>
  minAlder?: Alder
  maxAlder?: Alder
  info?: string
  autoSelectFirstMonth?: boolean
  onChange?: (alder: Partial<Alder> | undefined) => void
  error?: string | React.JSX.Element
}

export const AgePicker = ({
  name,
  form,
  label,
  description,
  value,
  minAlder = { ...useAppSelector(selectNedreAldersgrense) },
  maxAlder = { ...DEFAULT_SENEST_UTTAKSALDER },
  info,
  autoSelectFirstMonth = true,
  onChange,
  error,
}: AgePickerProps) => {
  const intl = useIntl()

  const { data: person, isSuccess } = useGetPersonQuery()

  const [valgtAlder, setValgtAlder] = React.useState<Partial<Alder>>(
    value ? value : { aar: undefined, maaneder: undefined }
  )

  React.useEffect(() => {
    setValgtAlder(value ? value : { aar: undefined, maaneder: undefined })
  }, [value])

  const yearsArray = React.useMemo(() => {
    const arr = []
    for (let i = minAlder.aar; i <= maxAlder.aar; i++) {
      arr.push(i)
    }
    return arr
  }, [minAlder, maxAlder])

  const monthsArray = React.useMemo(() => {
    const arr = []
    for (let i = 0; i <= 11; i++) {
      arr.push(i)
    }
    return arr
  }, [])

  const hasError = React.useMemo(() => {
    if (error) {
      if (!valgtAlder.aar && valgtAlder.maaneder === undefined) {
        return { aar: true, maaneder: true }
      }
      if (valgtAlder.aar && valgtAlder.maaneder !== undefined) {
        return { aar: true, maaneder: true }
      }
      if (valgtAlder.aar && valgtAlder.maaneder === undefined) {
        return { aar: false, maaneder: true }
      }
      if (!valgtAlder.aar && valgtAlder.maaneder !== undefined) {
        return { aar: true, maaneder: false }
      }
    }
    return { aar: false, maaneder: false }
  }, [error, valgtAlder])

  const transformertDate = React.useMemo(() => {
    if (
      isSuccess &&
      person.foedselsdato &&
      valgtAlder.aar &&
      valgtAlder.maaneder !== undefined
    ) {
      return transformUttaksalderToDate(
        valgtAlder as Alder,
        person.foedselsdato
      )
    } else {
      return ''
    }
  }, [valgtAlder, isSuccess])

  return (
    <div data-testid={`age-picker-${name}`}>
      <Label className={!description ? styles.label : ''}>{label}</Label>

      {description && (
        <BodyShort
          className={styles.description}
          size="medium"
          textColor="subtle"
        >
          {description}
        </BodyShort>
      )}

      <div className={styles.selectWrapper}>
        <Select
          data-testid={`age-picker-${name}-aar`}
          form={form}
          name={`${name}-aar`}
          label="Velg år"
          className={clsx(styles.selectAar, {
            [styles.select__hasError]: hasError.aar,
          })}
          value={valgtAlder.aar ? valgtAlder.aar : ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const aar = e.target.value
              ? parseInt(e.target.value, 10)
              : undefined

            const shouldResetMonth =
              (aar === minAlder.aar &&
                valgtAlder?.maaneder !== undefined &&
                valgtAlder?.maaneder < minAlder.maaneder) ||
              (aar === maxAlder.aar &&
                valgtAlder?.maaneder !== undefined &&
                valgtAlder?.maaneder > maxAlder.maaneder)

            // Determine the first valid month for the selected year
            let firstValidMonth: number | undefined = undefined
            if (aar !== undefined && autoSelectFirstMonth) {
              if (minAlder?.aar === maxAlder?.aar && aar === minAlder?.aar) {
                // Same min and max year
                firstValidMonth = minAlder?.maaneder
              } else if (aar === minAlder?.aar) {
                // Selected year is the minimum year
                firstValidMonth = minAlder?.maaneder
              } else if (aar === maxAlder?.aar) {
                // Selected year is the maximum year
                firstValidMonth = 0
              } else if (aar > minAlder?.aar && aar < maxAlder?.aar) {
                // Selected year is between min and max
                firstValidMonth = 0
              }
            }

            setValgtAlder((prevState) => {
              return {
                aar,
                maaneder: shouldResetMonth
                  ? autoSelectFirstMonth
                    ? firstValidMonth
                    : undefined
                  : autoSelectFirstMonth
                    ? firstValidMonth
                    : prevState.maaneder,
              }
            })
            if (onChange) {
              onChange({
                aar,
                maaneder: shouldResetMonth
                  ? autoSelectFirstMonth
                    ? firstValidMonth
                    : undefined
                  : autoSelectFirstMonth
                    ? firstValidMonth
                    : valgtAlder.maaneder,
              })
            }
          }}
          aria-describedby={hasError.maaneder ? `${name}-error` : undefined}
          aria-invalid={hasError.aar}
        >
          <option disabled value="">
            {' '}
          </option>
          {yearsArray.map((year) => {
            return (
              <option key={year} value={year}>
                {formatUttaksalder(intl, { aar: year, maaneder: 0 })}
              </option>
            )
          })}
        </Select>

        <Select
          data-testid={`age-picker-${name}-maaneder`}
          form={form}
          name={`${name}-maaneder`}
          label="Velg måned"
          className={clsx(styles.selectMaaned, {
            [styles.select__hasError]: hasError.maaneder,
          })}
          value={valgtAlder.maaneder !== undefined ? valgtAlder.maaneder : ''}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const maaneder = e.target.value
              ? parseInt(e.target.value, 10)
              : undefined
            setValgtAlder((prevState) => {
              return {
                ...prevState,
                maaneder,
              }
            })
            if (onChange) {
              onChange({ aar: valgtAlder.aar, maaneder })
            }
          }}
          disabled={!valgtAlder.aar}
          aria-describedby={hasError.maaneder ? `${name}-error` : undefined}
          aria-invalid={hasError.maaneder}
        >
          {!autoSelectFirstMonth && (
            <option disabled value="">
              {' '}
            </option>
          )}

          {monthsArray.map((month) => {
            const isYearAboveMinAndBelowMax =
              valgtAlder?.aar &&
              valgtAlder?.aar > minAlder?.aar &&
              valgtAlder?.aar < maxAlder?.aar
            const isMinYearAndMonthAboveOrEqualMin =
              minAlder?.aar !== maxAlder?.aar &&
              valgtAlder?.aar === minAlder?.aar &&
              month >= minAlder?.maaneder
            const isMaxYearAndMonthBelowOrEqualMax =
              minAlder?.aar !== maxAlder?.aar &&
              valgtAlder?.aar === maxAlder?.aar &&
              month <= maxAlder?.maaneder
            const isMinAndMaxYearAndMonthBetween =
              minAlder?.aar === maxAlder?.aar &&
              month >= minAlder?.maaneder &&
              month <= maxAlder?.maaneder

            if (
              valgtAlder?.aar &&
              (isYearAboveMinAndBelowMax ||
                isMinYearAndMonthAboveOrEqualMin ||
                isMaxYearAndMonthBelowOrEqualMax ||
                isMinAndMaxYearAndMonthBetween)
            ) {
              return (
                <option key={month} value={month}>
                  {`${month} ${intl.formatMessage({ id: 'alder.md' })} (${person?.foedselsdato ? transformMaanedToDate(month, person?.foedselsdato, intl.locale as Locales) : ''})`}
                </option>
              )
            }
          })}
        </Select>

        <span className={styles.date}>{transformertDate}</span>
      </div>

      {error && (
        <div
          id={`${name}-error`}
          aria-relevant="additions removals"
          aria-live="polite"
        >
          <ErrorMessage showIcon className={styles.selectErrorMessage}>
            {error}
          </ErrorMessage>
        </div>
      )}

      {info && <AlertDashBorder>{info}</AlertDashBorder>}
    </div>
  )
}

export default AgePicker
