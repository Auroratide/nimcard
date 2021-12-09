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

    const onBoard = () => '[slot="board"] '
    const playingCard = (value: Nimcard.Card.Value, suit: Nimcard.Card.Suit) =>
        `playing-card[value="${value}"][suit="${suit}"]`

    it('rendering the board', async () => {
        const elem = await fixture<NimcardGame>(`
            <nimcard-game></nimcard-game>
        `)

        const board = Nimcard.Board.create(deck, [2, 2])
        const game = Nimcard.Game.start(board)

        elem.start(game)

        expect(elem.querySelectorAll('playing-card')).to.have.length(4)
        expect(elem.querySelector(playingCard(Value.Queen, Suit.Diamonds))).to.exist
        expect(elem.querySelector(playingCard(Value.Two, Suit.Spades))).to.exist
        expect(elem.querySelector(playingCard(Value.Three, Suit.Clubs))).to.exist
        expect(elem.querySelector(playingCard(Value.King, Suit.Hearts))).to.exist
    })

    it('playing a move', async () => {
        const elem = await fixture<NimcardGame>(`
            <nimcard-game></nimcard-game>
        `)

        const board = Nimcard.Board.create(deck, [2, 2])
        const game = Nimcard.Game.start(board)

        elem.start(game)

        // Board is:
        // 2s 3c
        // Qd Kh
        elem.querySelector<HTMLElement>(onBoard() + playingCard(Value.Two, Suit.Spades))!.click()

        expect(elem.querySelectorAll(onBoard() + 'playing-card')).to.have.length(2)
    })
})
