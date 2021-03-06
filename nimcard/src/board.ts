import { Deck } from './deck.js'
import { Card } from './card.js'

export type Board = Board.ScoredCard[][]

export namespace Board {
    export type ScoredCard = {
        card: Card,
        score: number,
    }
    export type Scheme = number[]
    export type Scoring = (card: Card) => number

    export const TERMINAL_CARD = {
        value: Card.Value.Queen,
        suit: Card.Suit.Diamonds,
    }

    export const create = (deck: Deck, scheme: Scheme = [4, 5, 5, 5], scoring: Scoring = standardScoring): Board => {
        const { deck: d, card: terminalCard } = Deck.removeCard(deck, TERMINAL_CARD)

        if (terminalCard == null) {
            throw `ERROR creating board: ${TERMINAL_CARD.value} of ${TERMINAL_CARD.suit} must be in the deck`
        }
        
        let deckPosition = 0
        const board = scheme.map(num => {
            deckPosition += num
            return d.slice(deckPosition - num, deckPosition)
        })

        board[board.length - 1] = [terminalCard].concat(board[board.length - 1]).slice(0, scheme[scheme.length - 1])

        return board.map(row => row.map(card => ({ card, score: scoring(card) })))
    }

    export const standardScoring: Scoring = (card: Card): number => {
        if (card.value === TERMINAL_CARD.value && card.suit === TERMINAL_CARD.suit)
            return -10
    
        switch(card.value) {
            case Card.Value.Jack:
            case Card.Value.Queen:
            case Card.Value.King:
                return 10
            case Card.Value.Ace:
                return 11
            default:
                return Number(card.value)
        }
    }
}