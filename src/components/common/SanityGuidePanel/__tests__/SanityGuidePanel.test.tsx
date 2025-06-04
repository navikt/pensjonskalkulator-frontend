import { describe, it } from 'vitest'

import { SanityGuidePanel } from '@/components/common/SanityGuidePanel'
import { render, screen } from '@/test-utils'

const id = 'vurderer_du_a_velge_afp'
const title = 'Vurderer du å velge AFP?'

describe('SanityGuidePanel', () => {
  describe('Gitt at innhold finnes i Sanity', () => {
    it('rendrer SanityGuidePanel med korrekte props og innhold når children finnes', async () => {
      render(
        <SanityGuidePanel id={id}>
          <div>Child content</div>
        </SanityGuidePanel>
      )

      const guidePanelElement = await screen.findByTestId(id)
      expect(guidePanelElement).toBeVisible()

      expect(screen.getByText(title)).toBeVisible()

      expect(
        screen.getByText(
          /Det er flere ting du må ta stilling til før du sier fra deg uføretrygden/i
        )
      ).toBeInTheDocument()
      expect(screen.queryByText('Child content')).toBeVisible()
    })
  })
})
