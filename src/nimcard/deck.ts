import { Card } from './card'

export type Deck = Card[]

export namespace Deck {
    export const createFullDeck = (): Deck =>
        Object.values(Card.Value).map(value =>
            Object.values(Card.Suit).map(suit => ({
                value, suit
            }))
        ).flat()
}
