import { describe, it } from 'vitest'

import { SanityReadmore } from '@/components/common/SanityReadmore'
import { render, screen } from '@/test-utils'

describe('SanityReadmore', () => {
  describe('Gitt at innhold finnes', () => {
    it('rendrer ReadMore med korrekte props og innhold', async () => {
      render(<SanityReadmore id="hva_er_opphold_utenfor_norge" />)

      const readMoreElement = await screen.findByTestId(
        'hva_er_opphold_utenfor_norge'
      )
      expect(readMoreElement).toBeVisible()

      expect(screen.getByText('Hva som er opphold utenfor Norge')).toBeVisible()
      expect(screen.getByText('Lorem')).toBeInTheDocument()
    })
  })

  describe('Gitt at Sanity innhold ikke finnes', () => {
    it('kaster runtime error når id ikke finnes i readMoreData', async () => {
      expect(() => {
        render(<SanityReadmore id="non-existent-id" />)
      }).toThrow('No content found for readmore with id: non-existent-id')
    })
  })
})
