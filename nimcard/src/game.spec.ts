import { expect } from '@open-wc/testing'
import { Board } from './board.js'
import { Card } from './card.js'
import { Game } from './game.js'

describe('game', () => {
    // Produces the game:
    // J 2 A
    // Q 2 8
    const deck = [
        { value: Card.Value.Queen, suit: Card.Suit.Diamonds, },
        { value: Card.Value.Jack, suit: Card.Suit.Hearts, },
        { value: Card.Value.Two, suit: Card.Suit.Spades, },
        { value: Card.Value.Ace, suit: Card.Suit.Spades, },
        { value: Card.Value.Two, suit: Card.Suit.Clubs, },
        { value: Card.Value.Eight, suit: Card.Suit.Diamonds, },
    ]

    const rowAndAmount = (option: Game.Option) => ({ row: option.row, amount: option.amount })
    const option = (row: number, amount: number) => (o: Game.Option) => o.row === row && o.amount === amount
    
    it('playing a game', () => {
        const board = Board.create(deck, [3, 3])
        let game = Game.start(board)

        let options = Game.options(game)
        expect(options).to.have.length(4)
        expect(options.map(rowAndAmount)).to.deep.include({ row: 0, amount: 1 })
        expect(options.map(rowAndAmount)).to.deep.include({ row: 0, amount: 2 })
        expect(options.map(rowAndAmount)).to.deep.include({ row: 1, amount: 1 })
        expect(options.map(rowAndAmount)).to.deep.include({ row: 1, amount: 2 })

        // P1 chooses 2 and A from first row
        game = options.find(option(0, 2))!.commit()
        expect(Game.scores(game)).to.deep.equal([13, 0])

        options = Game.options(game)
        expect(options).to.have.length(3)
        expect(options.map(rowAndAmount)).to.deep.include({ row: 0, amount: 1 })
        expect(options.map(rowAndAmount)).to.deep.include({ row: 1, amount: 1 })
        expect(options.map(rowAndAmount)).to.deep.include({ row: 1, amount: 2 })

        // P2 chooses J from first row
        game = options.find(option(0, 1))!.commit()
        expect(Game.scores(game)).to.deep.equal([13, 10])

        options = Game.options(game)
        expect(options).to.have.length(2)
        expect(options.map(rowAndAmount)).to.deep.include({ row: 1, amount: 1 })
        expect(options.map(rowAndAmount)).to.deep.include({ row: 1, amount: 2 })

        // P1 chooses 2 and 8 from second row
        game = options.find(option(1, 2))!.commit()
        expect(Game.scores(game)).to.deep.equal([23, 10])

        options = Game.options(game)
        expect(options).to.have.length(1)
        expect(options.map(rowAndAmount)).to.deep.include({ row: 1, amount: 1 })

        // P2 chooses Q from second row
        game = options.find(option(1, 1))!.commit()
        expect(Game.scores(game)).to.deep.equal([23, 0])
    })
})