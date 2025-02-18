import { FormattedMessage } from 'react-intl'

import { describe, expect, it } from 'vitest'

import { getFormatMessageValues } from '../translations'
import { externalUrls } from '@/router/constants'
import { render, screen } from '@/test-utils'

describe('translations-utils', () => {
  describe('formatMessageValues', async () => {
    it('formaterer eksterne lenker med riktig url og ikon', async () => {
      render(
        <FormattedMessage
          id="translation.test.eksternLink"
          values={{ ...getFormatMessageValues() }}
        />
      )
      expect(
        screen.getByText('lorem ipsum dolor', { exact: false })
      ).toBeInTheDocument()
      expect(screen.getByText('my link', { exact: false })).toBeInTheDocument()
      expect(screen.queryByRole('link')).toHaveAttribute(
        'href',
        externalUrls.detaljertKalkulator
      )
      expect(
        await screen.findByRole('img', { hidden: true })
      ).toBeInTheDocument()
    })

    it('formaterer {br} til <br/>', async () => {
      const { asFragment } = render(
        <FormattedMessage
          id="translation.test.br"
          values={{ ...getFormatMessageValues() }}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('formaterer <strong>', async () => {
      const { asFragment } = render(
        <FormattedMessage
          id="translation.test.strong"
          values={{ ...getFormatMessageValues() }}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })

    it('formaterer <nowrap>', async () => {
      const { asFragment } = render(
        <FormattedMessage
          id="translation.test.nowrap"
          values={{ ...getFormatMessageValues() }}
        />
      )
      expect(asFragment()).toMatchSnapshot()
    })
  })
})
