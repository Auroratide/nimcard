import type { Board } from './board.js'

export type Game = {
    board: Board,
    currentPlayer: number,
    players: Board.ScoredCard[][],
}

export namespace Game {
    export type Option = {
        row: number,
        amount: number,
        commit: () => Game,
    }

    export const makeCommit = (game: Game, row: number, amount: number) => (): Game => {
        const r = game.board[row]
        const takenCards = r.slice(r.length - amount, r.length)

        return {
            board: game.board.map((r, i) => r.slice(0, r.length - (i === row ? amount : 0))),
            currentPlayer: (game.currentPlayer + 1) % game.players.length,
            players: game.players.map((p, i) => p.concat(i === game.currentPlayer ? takenCards : [])),
        }
    }

    const moveOption = (game: Game, row: number, amount: number): Option => {
        return {
            row, amount,
            commit: makeCommit(game, row, amount)
        }
    }

    export const start = (board: Board): Game => {
        return {
            board,
            currentPlayer: 0,
            players: [[], []],
        }
    }

    export const options = (game: Game): Option[] => {
        return game.board.flatMap((row, i) => {
            const o: Option[] = []
            if (row.length > 1) o.push(moveOption(game, i, 2))
            if (row.length > 0) o.push(moveOption(game, i, 1))

            return o
        })
    }

    const sumBy = <T>(val: (it: T) => number) => (sum: number, cur: T) => sum + val(cur)
    export const scores = (game: Game): number[] =>
        game.players.map(player => player.reduce(sumBy(it => it.score), 0))
}