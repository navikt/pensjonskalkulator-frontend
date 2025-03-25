import { describe, it } from 'vitest'

import { SanityGuidePanel } from '@/components/common/SanityGuidePanel'
import { mockErrorResponse } from '@/mocks/server'
import { render, screen } from '@/test-utils'

const id = 'vurderer_du_a_velge_afp'
const title = 'Vurderer du å velge AFP?'
const content = 'Lorem'

describe('SanityGuidePanel', () => {
  describe('Gitt at Sanity er aktivert og innhold finnes', () => {
    it('rendrer SanityGuidePanel med korrekte props og innhold når children finnes', async () => {
      render(
        <SanityGuidePanel id={id}>
          <div>Child content</div>
        </SanityGuidePanel>
      )

      const guidePanelElement = await screen.findByTestId(id)
      expect(guidePanelElement).toBeVisible()

      expect(screen.getByText(title)).toBeVisible()

      expect(screen.getByText(content)).toBeInTheDocument()
      expect(screen.queryByText('Child content')).not.toBeInTheDocument()
    })

    it('rendrer ReadMore med korrekte props og innhold når children ikke finnes', async () => {
      render(<SanityGuidePanel id={id} />)

      const guidePanelElement = await screen.findByTestId(id)
      expect(guidePanelElement).toBeVisible()

      expect(screen.getByText(title)).toBeVisible()
      expect(screen.getByText(content)).toBeInTheDocument()
    })
  })

  describe('Gitt at Sanity er deaktivert', () => {
    it('viser fallback innhold og ikke Sanity innhold når children finnes', async () => {
      mockErrorResponse('/feature/pensjonskalkulator.hent-tekster-fra-sanity')

      render(
        <SanityGuidePanel id={id}>
          <p>Fallback innhold</p>
        </SanityGuidePanel>
      )

      expect(screen.getByText('Fallback innhold')).toBeVisible()
      expect(screen.queryByText(title)).toBeNull()
    })

    it('viser Sanity innhold når children ikke finnes, selv om feature toggle er deaktivert', async () => {
      mockErrorResponse('/feature/pensjonskalkulator.hent-tekster-fra-sanity')

      render(<SanityGuidePanel id={id} />)

      const guidePanelElement = await screen.findByTestId(id)
      expect(guidePanelElement).toBeVisible()

      expect(screen.getByText(title)).toBeVisible()
      expect(screen.getByText(content)).toBeInTheDocument()
    })
  })

  describe('Gitt at Sanity innhold ikke finnes', () => {
    it('viser fallback innhold når id ikke finnes i guidePanelData og children finnes', async () => {
      render(
        <SanityGuidePanel id="non-existent-id">
          <p>Fallback innhold</p>
        </SanityGuidePanel>
      )

      expect(screen.getByText('Fallback innhold')).toBeVisible()
      expect(screen.queryByText(title)).toBeNull()
    })

    it('kaster runtime error når id ikke finnes i guidePanelData og children ikke finnes', async () => {
      expect(() => {
        render(<SanityGuidePanel id="non-existent-id" />)
      }).toThrow()
    })
  })
})
