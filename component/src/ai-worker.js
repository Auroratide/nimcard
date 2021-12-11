import * as Nimcard from '../../nimcard/lib/index.js'

onmessage = (e) => {
    const o = Nimcard.Ai.optimal(e.data.depth)(e.data.game)
    postMessage({
        row: o.row,
        amount: o.amount,
    })
}
