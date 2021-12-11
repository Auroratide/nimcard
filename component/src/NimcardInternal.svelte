<script lang="ts">
    import * as Nimcard from '../../nimcard/lib/index.js'
    import { crossfade } from 'svelte/transition'

    let game: Nimcard.Game | null = null

    const [ send, receive ] = crossfade({})

    export function getGame(): Nimcard.Game | null {
        return game
    }

    export function startGame(newGame: Nimcard.Game) {
        game = newGame
    }

    const handleCardClick = (row: number, card: number) => () => {
        const options = Nimcard.Game.options(game!)
        const amount = game!.board[row].length - card
        const option = options.find(it => it.row === row && it.amount === amount)

        if (option) {
            game = option.commit()
        }
    }

    const cardId = (card: Nimcard.Board.ScoredCard) => `${card.card.value}${card.card.suit}`
</script>

<div class="game">
    {#if game}
        <section class="board">
            <ol>
                {#each game.board as row, ri}
                    <li>
                        <ol>
                            {#each row as card, ci}
                                <li out:send={{key: cardId(card)}}>
                                    <button on:click={handleCardClick(ri, ci)}>
                                        <playing-card value={card.card.value} suit={card.card.suit}></playing-card>
                                    </button>
                                </li>
                            {/each}
                        </ol>
                    </li>
                {/each}
            </ol>
        </section>
        <div class="player-piles">
            {#each game.players as player, pi}
                <section class="player-pile">
                    <strong>Player {pi}</strong>
                    <ul>
                        {#each player as card}
                            <li in:receive={{key: cardId(card)}}>
                                <playing-card value={card.card.value} suit={card.card.suit}></playing-card>
                            </li>
                        {/each}
                    </ul>
                </section>
            {/each}
        </div>
    {/if}
</div>

<style>
    .game {
        --playing-card-width: 5em;
    }

    ol, ul {
        list-style: none;
        display: flex;
        padding: 0;
    }

    .board {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .board > ol {
        flex-direction: column;
    }

    .board ol > li {
        display: block;
        margin-bottom: 0.5em;
    }

    .board ol ol li,
    .player-pile ul li {
        margin-right: 0.5em;
    }

    .board button {
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        font-size: 1em;
    }

    .player-piles {
        display: flex;
    }

    .player-pile {
        flex: 1 1 50%;
    }

    .player-pile:nth-child(odd) {
        text-align: right;
    }

    .player-pile:nth-child(odd) ul {
        justify-content: right;
        flex-direction: row-reverse;
    }
</style>