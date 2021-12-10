<script lang="ts">
    import * as Nimcard from '../../nimcard/lib/index.js'

    let game: Nimcard.Game | null = null

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
</script>

{#if game}
    <ol class="board">
        {#each game.board as row, ri}
            <li>
                <ol>
                    {#each row as card, ci}
                        <li>
                            <button on:click={handleCardClick(ri, ci)}>
                                <playing-card value={card.card.value} suit={card.card.suit}></playing-card>
                            </button>
                        </li>
                    {/each}
                </ol>
            </li>
        {/each}
    </ol>
{/if}

<style>
    ol {
        list-style: none;
        display: flex;
    }

    ol.board {
        flex-direction: column;
    }

    ol.board > li {
        display: block;
        margin-bottom: 0.5em;
    }

    ol.board ol li {
        margin-right: 0.5em;
    }

    ol.board button {
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
    }
</style>