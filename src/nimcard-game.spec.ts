import { expect, fixture } from '@open-wc/testing'
import { NimcardGame } from './nimcard-game'
import './define'

describe('my-component', () => {
    it('src provided', async () => {
        const elem = await fixture<NimcardGame>(`
            <nimcard-game></nimcard-game>
        `)

        expect(elem.shadowRoot?.textContent).to.contain('Hello!')
    })
})
