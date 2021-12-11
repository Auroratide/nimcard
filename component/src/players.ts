import * as Nimcard from '../../nimcard/lib/index.js'

export type Player = 'human' | 'ai'

export const human = 'human'
export const ai = 'ai'

export const doAiTurn = (game: Nimcard.Game, aiworker: string): Promise<Nimcard.Game.Option | null> => {
    const worker = new Worker(aiworker)
    const promise = new Promise<Nimcard.Game.Option | null>(resolve => {
        if (window.Worker && aiworker !== '') {
            worker.onmessage = (e: MessageEvent<{ row: number, amount: number } | null>) => {
                if (e.data) {
                    resolve({
                        row: e.data.row,
                        amount: e.data.amount,
                        commit: Nimcard.Game.makeCommit(game, e.data.row, e.data.amount)
                    })
                } else {
                    resolve(null)
                }
            }

            worker.postMessage({
                game: game,
                depth: 20,
            })
        } else {
            resolve(Nimcard.Ai.optimal(20)(game))
        }
    })

    return promise
}
