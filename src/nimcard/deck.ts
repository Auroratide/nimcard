import { Card } from './card'

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
}
