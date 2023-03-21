import React from 'react'

import { Heading, Alert, BodyLong, Loader } from '@navikt/ds-react'

import { useGetPensjonsberegningQuery } from '../state/api/apiSlice'

import styles from './Pensjonsberegning.module.scss'

export function Pensjonsberegning() {
  const { data, isLoading, isSuccess, isError, error } =
    useGetPensjonsberegningQuery()

  let content
  if (isError || data === undefined || (isSuccess && data.length === 0)) {
    content = (
      <Alert variant="error">
        <Heading spacing size="small" level="1">
          {`Vi klarte ikke å kalkulere pensjonen din. Prøv igjen senere.`}
        </Heading>
      </Alert>
    )
  } else if (isLoading) {
    content = <Loader data-testid="loader" size="3xlarge" title="venter..." />
  } else {
    content = (
      <>
        <BodyLong>
          Hvis du fortsetter å ha samme inntekt som du har i dag kan du tidligst
          gå av med pensjon ved <b>{data[0].alder} år</b> hvor du vil få
          utbetalt <b>{data[0].pensjonsbeloep} kroner</b> i året
        </BodyLong>
        {data[1] && (
          <BodyLong>
            Dersom du jobber frem til du er <b>{data[1].alder} år</b>, vil du få{' '}
            <b>{data[1].pensjonsbeloep} kroner</b> utbetalt
          </BodyLong>
        )}
        {data[2] && (
          <BodyLong>
            Dersom du jobber frem til du er <b>{data[2].alder} år</b>, vil du få{' '}
            <b>{data[2].pensjonsbeloep} kroner</b> utbetalt
          </BodyLong>
        )}
      </>
    )
  }

  return <section className={styles.sammenligning}>{content}</section>
}
