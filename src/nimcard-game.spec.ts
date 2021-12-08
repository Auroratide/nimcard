import { expect, fixture } from '@open-wc/testing'
import * as Nimcard from './nimcard'
import { NimcardGame } from './nimcard-game'
import '@auroratide/playing-card/lib/define'
import './define'

const Value = Nimcard.Card.Value
const Suit = Nimcard.Card.Suit

describe('my-component', () => {
    const deck = [
        { value: Value.Queen, suit: Suit.Diamonds },
        { value: Value.Two, suit: Suit.Spades },
        { value: Value.Three, suit: Suit.Clubs },
        { value: Value.King, suit: Suit.Hearts },
    ]

    it('rendering the board', async () => {
        const elem = await fixture<NimcardGame>(`
            <nimcard-game></nimcard-game>
        `)

        const board = Nimcard.Board.create(deck, [2, 2])
        const game = Nimcard.Game.start(board)

        elem.start(game)

        expect(elem.querySelectorAll('playing-card')).to.have.length(4)
        expect(elem.querySelector('playing-card[value="q"][suit="d"]')).to.exist
        expect(elem.querySelector('playing-card[value="2"][suit="s"]')).to.exist
        expect(elem.querySelector('playing-card[value="3"][suit="c"]')).to.exist
        expect(elem.querySelector('playing-card[value="k"][suit="h"]')).to.exist
    })
})
