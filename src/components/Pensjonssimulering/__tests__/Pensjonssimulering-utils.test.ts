import { describe, expect, it } from 'vitest'

import {
  findSenesteAlder,
  findTidligsteAlder,
  generateXAxis,
  getSeriesData,
} from '../utils'

describe('Pensjonssimulering-utils', () => {
  describe('findTidligsteAlder', () => {
    it('finner tidligste alder blant simulerte pensjonsberegninger', () => {
      const simulering: Simulering = {
        alderspensjon: [
          { alder: 67, belop: 100_000 },
          { alder: 68, belop: 100_000 },
          { alder: 69, belop: 100_000 },
          { alder: 70, belop: 100_000 },
          { alder: 71, belop: 100_000 },
          { alder: 72, belop: 100_000 },
        ],
        afpPrivat: [
          { alder: 62, belop: 50_000 },
          { alder: 63, belop: 50_000 },
          { alder: 64, belop: 50_000 },
        ],
      }

      expect(findTidligsteAlder(simulering)).toEqual(62)
    })
  })

  describe('findSenesteAlder', () => {
    it('finner seneste alder blant simulerte pensjonsberegninger', () => {
      const simulering: Simulering = {
        alderspensjon: [
          { alder: 67, belop: 100_000 },
          { alder: 68, belop: 100_000 },
          { alder: 69, belop: 100_000 },
          { alder: 70, belop: 100_000 },
          { alder: 71, belop: 100_000 },
          { alder: 72, belop: 100_000 },
        ],
        afpPrivat: [
          { alder: 62, belop: 50_000 },
          { alder: 63, belop: 50_000 },
          { alder: 64, belop: 50_000 },
        ],
      }

      expect(findSenesteAlder(simulering)).toEqual(72)
    })
  })

  describe('generateXAxis', () => {
    it('returnerer array med to verdier når start og slutt er like', () => {
      const alderArray = generateXAxis(0, 0)
      expect(alderArray).toHaveLength(2)

      const alderArray2 = generateXAxis(62, 62)
      expect(alderArray2).toHaveLength(2)
      expect(alderArray2[0]).toBe('61')
      expect(alderArray2[1]).toBe('61+')
    })

    it('returnerer array med alle årene fra og med ett år før alderStart til og med alderSlutt når alderStart er før alderSlutt', () => {
      const alderArray = generateXAxis(62, 75)
      expect(alderArray).toHaveLength(15)
      expect(alderArray).toEqual([
        '61',
        '62',
        '63',
        '64',
        '65',
        '66',
        '67',
        '68',
        '69',
        '70',
        '71',
        '72',
        '73',
        '74',
        '74+',
      ])
    })

    it('kaster feil om start- eller sluttalder er negative', () => {
      expect(() => generateXAxis(-1, 0)).toThrow()
      expect(() => generateXAxis(0, -1)).toThrow()
    })

    it('kaster feil når alderSlutt er før alderStart', () => {
      expect(() => generateXAxis(67, 62)).toThrow()
    })
  })

  describe('getSeriesData', () => {
    const beregning = [
      { alder: 67, belop: 100_000 },
      { alder: 68, belop: 100_000 },
      { alder: 69, belop: 100_000 },
      { alder: 70, belop: 100_000 },
      { alder: 71, belop: 100_000 },
      { alder: 72, belop: 100_000 },
      { alder: 73, belop: 100_000 },
      { alder: 74, belop: 100_000 },
    ]

    it('padder beregninger slik at beregningene inneholder innslag for alle aldere mellom start og slutt inklusive', () => {
      expect(getSeriesData(beregning, { start: 62, end: 75 })).toEqual([
        0, 0, 0, 0, 0, 100_000, 100_000, 100_000, 100_000, 100_000, 100_000,
        100_000, 100_000, 0,
      ])
    })

    it('padder beregning med livsvarige ytelser', () => {
      expect(
        getSeriesData(beregning, { start: 62, end: 75, livsvarig: true })
      ).toEqual([
        0, 0, 0, 0, 0, 100_000, 100_000, 100_000, 100_000, 100_000, 100_000,
        100_000, 100_000, 100_000,
      ])
    })

    it('legger ikke til tidligere beregninger dersom start er større enn første alder i beregningen', () => {
      expect(getSeriesData(beregning, { start: 67, end: 75 })).toEqual([
        100_000, 100_000, 100_000, 100_000, 100_000, 100_000, 100_000, 100_000,
        0,
      ])
    })

    it('legger ikke til senere beregninger dersom end er mindre enn siste alder i beregningen', () => {
      expect(getSeriesData(beregning, { start: 62, end: 74 })).toEqual([
        0, 0, 0, 0, 0, 100_000, 100_000, 100_000, 100_000, 100_000, 100_000,
        100_000, 100_000,
      ])
    })
  })
})
