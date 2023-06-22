import { describe, expect, it } from 'vitest'

import { formatUttaksalder, getAldere } from '../utils'

describe('VelgUttaksalder-utils', () => {
  describe('getAldere', () => {
    it('returnerer array med én verdi når start og slutt er like', () => {
      const start = { aar: 64, maaned: 3, uttaksdato: '2031-11-01' }
      const end = { ...start }

      const aldere = getAldere(start, end)
      expect(aldere).toHaveLength(1)
      expect(aldere[0]).toEqual(start)
    })

    it('tar kun hensyn til måned når det er snakk om start-alder', () => {
      const start = { aar: 64, maaned: 3, uttaksdato: '2031-11-01' }
      const end = { aar: 66, maaned: 5, uttaksdato: '2033-11-01' }

      const aldere = getAldere(start, end)
      expect(aldere).toHaveLength(3)
      expect(aldere[0]).toEqual(start)
      expect(aldere[2]).toEqual({ ...end, maaned: 0 })
    })

    it('returnerer tomt array når sluttalder er lavere enn startalder', () => {
      const aldere = getAldere(
        { aar: 67, maaned: 0, uttaksdato: '2031-11-01' },
        { aar: 66, maaned: 0, uttaksdato: '2031-11-01' }
      )
      expect(aldere).toHaveLength(0)
    })

    it('returnerer array med alle årene fra og med startalder til og med sluttalder', () => {
      const aldere = getAldere(
        { aar: 62, maaned: 2, uttaksdato: '2031-11-01' },
        { aar: 75, maaned: 0, uttaksdato: '2044-11-01' }
      )
      expect(aldere).toHaveLength(14)
      expect(aldere).toEqual([
        { aar: 62, maaned: 2, uttaksdato: '2031-11-01' },
        { aar: 63, maaned: 0, uttaksdato: '2032-11-01' },
        { aar: 64, maaned: 0, uttaksdato: '2033-11-01' },
        { aar: 65, maaned: 0, uttaksdato: '2034-11-01' },
        { aar: 66, maaned: 0, uttaksdato: '2035-11-01' },
        { aar: 67, maaned: 0, uttaksdato: '2036-11-01' },
        { aar: 68, maaned: 0, uttaksdato: '2037-11-01' },
        { aar: 69, maaned: 0, uttaksdato: '2038-11-01' },
        { aar: 70, maaned: 0, uttaksdato: '2039-11-01' },
        { aar: 71, maaned: 0, uttaksdato: '2040-11-01' },
        { aar: 72, maaned: 0, uttaksdato: '2041-11-01' },
        { aar: 73, maaned: 0, uttaksdato: '2042-11-01' },
        { aar: 74, maaned: 0, uttaksdato: '2043-11-01' },
        { aar: 75, maaned: 0, uttaksdato: '2044-11-01' },
      ])
    })
  })

  describe('formatUttaksalder', () => {
    it('returnerer riktig streng med år og måned', () => {
      const streng = formatUttaksalder({
        aar: 62,
        maaned: 3,
        uttaksdato: '2031-11-01',
      })
      expect(streng).toBe('62 år og 3 måneder')
    })
    it('returnerer riktig streng med år og uten  måned', () => {
      const streng = formatUttaksalder({
        aar: 62,
        maaned: 0,
        uttaksdato: '2031-11-01',
      })
      expect(streng).toBe('62 år')
    })
    it('returnerer riktig streng med år og kompakt måned', () => {
      const streng = formatUttaksalder(
        { aar: 62, maaned: 3, uttaksdato: '2031-11-01' },
        { compact: true }
      )
      expect(streng).toBe('62 år og 3 md.')
    })
  })
})
