import { expect } from '@open-wc/testing'
import { Deck } from './deck'
import { Card } from './card'

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
})
