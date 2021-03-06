import { Deck } from './deck.js'
import { Card } from './card.js'
import { Board } from './board.js'
import { expect } from '@open-wc/testing'

describe('board', () => {
    const QueenOfDiamonds = { value: Card.Value.Queen, suit: Card.Suit.Diamonds, }
    const deck = Deck.createFullDeck()
    const withoutScores = (row: Board.ScoredCard[]) => row.map(card => card.card)

    describe('create', () => {
        it('new default board', () => {
            const d = deck
            const board = Board.create(d)
    
            const unscored = board.map(withoutScores)
    
            expect(unscored).to.deep.equal([
                [d[0], d[1], d[2], d[3]],
                [d[4], d[5], d[6], d[7], d[8]],
                [d[9], d[10], d[11], d[12], d[13]],
                [QueenOfDiamonds, d[14], d[15], d[16], d[17]],
            ])
        })
    
        it('missing queen of diamonds', () => {
            const { deck: missingQueen } = Deck.removeCard(deck, QueenOfDiamonds)
    
            expect(() => Board.create(missingQueen)).to.throw()
        })
    
        it('not enough cards in the deck', () => {
            const d = deck.slice(0, 5)
    
            expect(() => Board.create(d)).to.throw()
        })
    
        it('custom board scheme', () => {
            const d = deck
            const board = Board.create(d, [3, 3])
    
            const unscored = board.map(withoutScores)
    
            expect(unscored).to.deep.equal([
                [d[0], d[1], d[2]],
                [QueenOfDiamonds, d[3], d[4]],
            ])
        })
    
        it('empty board scheme', () => {
            expect(Board.create(deck, [])).to.deep.equal([])
            expect(Board.create(deck, [0])).to.deep.equal([[]])
        })
    })

    describe('standardScoring', () => {
        const clubs = (value: Card.Value) => ({ value, suit: Card.Suit.Clubs })
        it('queen of diamonds', () => {
            expect(Board.standardScoring(QueenOfDiamonds)).to.equal(-10)
        })

        it('face card', () => {
            expect(Board.standardScoring(clubs(Card.Value.Jack))).to.equal(10)
            expect(Board.standardScoring(clubs(Card.Value.Queen))).to.equal(10)
            expect(Board.standardScoring(clubs(Card.Value.King))).to.equal(10)
            expect(Board.standardScoring(clubs(Card.Value.Ace))).to.equal(11)
        })

        it('numerical card', () => {
            expect(Board.standardScoring(clubs(Card.Value.Two))).to.equal(2)
            expect(Board.standardScoring(clubs(Card.Value.Three))).to.equal(3)
            expect(Board.standardScoring(clubs(Card.Value.Four))).to.equal(4)
            expect(Board.standardScoring(clubs(Card.Value.Five))).to.equal(5)
            expect(Board.standardScoring(clubs(Card.Value.Six))).to.equal(6)
            expect(Board.standardScoring(clubs(Card.Value.Seven))).to.equal(7)
            expect(Board.standardScoring(clubs(Card.Value.Eight))).to.equal(8)
            expect(Board.standardScoring(clubs(Card.Value.Nine))).to.equal(9)
            expect(Board.standardScoring(clubs(Card.Value.Ten))).to.equal(10)
        })
    })
})