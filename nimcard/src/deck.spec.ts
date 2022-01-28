import { expect } from '@open-wc/testing'
import { Deck } from './deck.js'
import { Card } from './card.js'

describe('deck', () => {
    describe('createFullDeck', () => {
        it('correct number of cards', () => {
            expect(Deck.createFullDeck()).to.have.length(52)
        })

        it('contains every suit', () => {
            const deck = Deck.createFullDeck()
            const bySuit = (suit: Card.Suit) => (card: Card) => card.suit === suit

            Object.values(Card.Suit).forEach(suit => {
                expect(deck.filter(bySuit(suit))).to.have.length(13)
            })
        })

        it('contains every value', () => {
            const deck = Deck.createFullDeck()
            const byValue = (value: Card.Value) => (card: Card) => card.value === value

            Object.values(Card.Value).forEach(value => {
                expect(deck.filter(byValue(value))).to.have.length(4)
            })
        })
    })

    describe('removeCard', () => {
        const Q = Card.Value.Queen
        const D = Card.Suit.Diamonds
        const S = Card.Suit.Spades

        it('card is in the deck', () => {
            const original = Deck.createFullDeck()

            const { deck: result, card } = Deck.removeCard(original, { value: Q, suit: D })

            expect(result.find(c => c.value === Q && c.suit === D)).to.be.undefined
            expect(card).to.deep.equal({ value: Q, suit: D })
        })

        it('card not in the deck', () => {
            const original = [{ value: Q, suit: S }]

            const { deck: result, card } = Deck.removeCard(original, { value: Q, suit: D })

            expect(result).to.have.length(1)
            expect(card).to.be.null
        })
    })

    describe('shuffle', () => {
        const valueSuit = (card: Card): string => `${card.value}${card.suit}`

        it('is random', () => {
            let deck = Deck.createFullDeck()
            let shuffled = Deck.shuffle(deck)

            expect(deck.map(valueSuit)).to.deep.equal(deck.map(valueSuit))
            expect(shuffled.map(valueSuit)).to.not.deep.equal(deck.map(valueSuit))
            expect(shuffled.length).to.equal(deck.length)
        })
    })
})
