import { Card } from './card.js'
import { Board } from './board.js'
import { Game } from './game.js'
import { Ai } from './ai.js'
import { expect } from '@open-wc/testing'

describe('ai', () => {
    // 5 A
    // Q 2 K 7
    // Optimal path: 1:1, 0:2, 1:2, 1:1
    const deck = [
        { value: Card.Value.Queen, suit: Card.Suit.Diamonds, },
        { value: Card.Value.Five, suit: Card.Suit.Hearts, },
        { value: Card.Value.Ace, suit: Card.Suit.Spades, },
        { value: Card.Value.Two, suit: Card.Suit.Spades, },
        { value: Card.Value.King, suit: Card.Suit.Clubs, },
        { value: Card.Value.Seven, suit: Card.Suit.Diamonds, },
    ]

    it('selecting optimal choice', () => {
        const board = Board.create(deck, [2, 4])
        let game = Game.start(board)
        const ai = Ai.optimal()

        const option = ai(game)
        expect(option!.row).to.equal(1)
        expect(option!.amount).to.equal(1)
    })
})