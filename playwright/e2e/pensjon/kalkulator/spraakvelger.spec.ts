import { test } from '../../../base'
import { clickButton, expectElementVisible } from '../../../utils/form'

test.describe('Språkvelger', () => {
  test('setter Norsk Bokmål som default språk i løsningen for innhold styrt av react-intl og Sanity', async ({
    page,
  }) => {
    await expectElementVisible(page, 'stegvisning-start-button')
    await clickButton(page, 'stegvisning-start-button')

    await expectElementVisible(page, 'sivilstand-heading')
    await clickButton(page, 'stegvisning-neste-button')

    await expectElementVisible(page, 'utenlandsopphold-heading')
    await expectElementVisible(page, 'hva_er_opphold_utenfor_norge')
  })
})
