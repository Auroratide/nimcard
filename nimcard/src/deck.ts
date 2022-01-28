import { Card } from './card.js'

export type Deck = Card[]

export namespace Deck {
    export const createFullDeck = (): Deck =>
        Object.values(Card.Value).map(value =>
            Object.values(Card.Suit).map(suit => ({
                value, suit
            }))
        ).flat()
    
    export const removeCard = (deck: Deck, matcher: { value: Card.Value, suit: Card.Suit }): {
        deck: Deck, card: Card | null,
    } => {
        const card = deck.find(c => c.value === matcher.value && c.suit === matcher.suit) ?? null
        return {
            deck: deck.filter(c => c !== card),
            card,
        }
    }

    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    export const shuffle = (deck: Deck): Deck => {
        const clone = deck.slice()

        for (let i = clone.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clone[i], clone[j]] = [clone[j], clone[i]];
        }

        return clone
    }
}
