import { Game } from './game'

export type Ai = (game: Game) => Game.Option | null

export namespace Ai {
    export const optimal: (depth?: number) => Ai = (depth = 20) => (game: Game) => {
        return minimax(game, game.currentPlayer === 0, depth).option ?? null
    }

    type EvaluatedOption = {
        score: number,
        option?: Game.Option,
    }
    const evaluate = (game: Game): number => {
        const s = Game.scores(game)
        return s[0] - s[1]
    }
    const minimax = (game: Game, maximizer: boolean, maxDepth: number, curDepth: number = 0, alpha: number = -Infinity, beta: number = Infinity): EvaluatedOption => {
        const options = Game.options(game)

        if (curDepth >= maxDepth || options.length === 0) {
            return {
                score: evaluate(game),
            }
        }
    
        let bestOption: EvaluatedOption = { score: maximizer ? -Infinity : Infinity }
        for (let option of options) {
            const candidate = minimax(option.commit(), !maximizer, maxDepth, curDepth + 1, alpha, beta)
            candidate.option = option
    
            if (maximizer) {
                bestOption = bestOption.score > candidate.score ? bestOption : candidate
                alpha = Math.max(alpha, bestOption.score)
            } else {
                bestOption = bestOption.score < candidate.score ? bestOption : candidate
                beta = Math.min(beta, bestOption.score)
            }
    
            if (beta < alpha)
                break
        }
    
        return bestOption
    }
}