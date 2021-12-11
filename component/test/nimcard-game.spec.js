import { expect, fixture } from '@open-wc/testing'
import * as Nimcard from '../../nimcard/lib/index.js'
import '@auroratide/playing-card/lib/define'
import '../lib/define.js'

const Value = Nimcard.Card.Value
const Suit = Nimcard.Card.Suit

// give svelte time to update itself
const tick = () => new Promise(resolve => setTimeout(resolve))
const seconds = (n) => new Promise(resolve => setTimeout(resolve, n * 1000))

describe('my-component', () => {
    const deck = [
        { value: Value.Queen, suit: Suit.Diamonds },
        { value: Value.Two, suit: Suit.Spades },
        { value: Value.Three, suit: Suit.Clubs },
        { value: Value.King, suit: Suit.Hearts },
    ]

    const query = (q) => {
        const ret = new Query()
        ret.then(q)
        return ret
    }

    const els = {
        board: (elem) => elem.querySelector('.board'),
        playerPile: (i) => (elem) => elem.querySelectorAll('.player-pile')[i],
        card: (value, suit) => (elem) => elem.querySelector(`playing-card[value="${value}"][suit="${suit}"]`),
        cards: (elem) => elem.querySelectorAll('playing-card'),
    }

    const playingCard = (value, suit) =>
        `playing-card[value="${value}"][suit="${suit}"]`

    it('rendering the board', async () => {
        const elem = await fixture(`
            <nimcard-game></nimcard-game>
        `)

        const board = Nimcard.Board.create(deck, [2, 2])
        const game = Nimcard.Game.start(board)

        elem.start(game)
        await tick()

        expect(query(els.cards).apply(elem)).to.have.length(4)
        expect(query(els.card(Value.Queen, Suit.Diamonds)).apply(elem)).to.exist
        expect(query(els.card(Value.Two, Suit.Spades)).apply(elem)).to.exist
        expect(query(els.card(Value.Three, Suit.Clubs)).apply(elem)).to.exist
        expect(query(els.card(Value.King, Suit.Hearts)).apply(elem)).to.exist
    })

    it('playing a move', async () => {
        const elem = await fixture(`
            <nimcard-game></nimcard-game>
        `)

        const board = Nimcard.Board.create(deck, [2, 2])
        const game = Nimcard.Game.start(board)

        elem.start(game)
        await tick()

        // Board is:
        // 2s 3c
        // Qd Kh
        query(els.board).then(els.card(Value.Two, Suit.Spades)).apply(elem).click()
        await seconds(0.5)

        expect(query(els.board).then(els.cards).apply(elem)).to.have.length(2)
        expect(query(els.playerPile(0)).then(els.cards).apply(elem)).to.have.length(2)
    })

    it('ai making a move', async () => {
        const elem = await fixture(`
            <nimcard-game aiworker="component/lib/ai-worker.js"></nimcard-game>
        `)

        const board = Nimcard.Board.create(deck, [2, 2])
        const game = Nimcard.Game.start(board)

        elem.start(game, ['human', 'ai'])
        await tick()

        // Board is:
        // 2s 3c
        // Qd Kh
        query(els.board).then(els.card(Value.Two, Suit.Spades)).apply(elem).click()
        await seconds(1.5)

        // AI should choose Kh but not Qd
        expect(query(els.board).then(els.cards).apply(elem)).to.have.length(1)
        expect(query(els.playerPile(0)).then(els.cards).apply(elem)).to.have.length(2)
        expect(query(els.playerPile(1)).then(els.cards).apply(elem)).to.have.length(1)
    })
})

class Query {
    queries = []

    // HTMLElement => HTMLElement
    then = (q) => {
        this.queries.push(q)
        return this
    }

    apply = (elem) => {
        return this.queries.reduce((curElem, query) => query(curElem), elem)
    }
}
