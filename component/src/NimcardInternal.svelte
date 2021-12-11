<svelte:options accessors />

<script lang="ts">
    import * as Nimcard from '../../nimcard/lib/index.js'
    import { Player, human, ai, doAiTurn } from './players'
    import { onMount, onDestroy } from 'svelte'
    import { crossfade } from 'svelte/transition'

    export let aiworker: string

    let game: Nimcard.Game | null = null
    let players: Player[] = []
    let aiTurn: Promise<Nimcard.Game.Option | null> | null = null

    let aiWaitCard: HTMLElement
    let aiWaitCardInterval: number
    onMount(() => {
        aiWaitCardInterval = setInterval(() => {
            if (aiWaitCard)
                aiWaitCard.toggleAttribute('facedown')
        }, 1000)
    })
    onDestroy(() => {
        clearInterval(aiWaitCardInterval)
    })

    $: options = game ? Nimcard.Game.options(game) : []

    const [ send, receive ] = crossfade({})

    export function getGame(): Nimcard.Game | null {
        return game
    }

    export function startGame(newGame: Nimcard.Game, thePlayers: Player[]) {
        game = newGame
        players = thePlayers
    }

    export function commit(option: Nimcard.Game.Option) {
        game = option.commit()

        if (players[game.currentPlayer] === ai && Nimcard.Game.options(game).length > 0) {
            setTimeout(aiTakeTurn)
        }
    }

    const handleCardClick = (row: number, card: number) => () => {
        const options = Nimcard.Game.options(game!)
        const amount = game!.board[row].length - card
        const option = options.find(it => it.row === row && it.amount === amount)

        if (option) {
            commit(option)
        }
    }

    const isCardEnabled = (game: Nimcard.Game, row: number, card: number) => {
        const isHuman = players[game.currentPlayer ?? 0] === human
        const isOption = null != options.find(o => o.row === row && o.amount === game.board[row].length - card)
        return isHuman && isOption
    }

    const cardId = (card: Nimcard.Board.ScoredCard) => `${card.card.value}${card.card.suit}`

    const aiTakeTurn = async () => {
        aiTurn = doAiTurn(game!, aiworker)
        const option = await aiTurn

        if (option) {
            commit(option)
        }
    }
</script>

<div class="game">
    {#if game}
        <section class="board">
            {#await aiTurn}
                <div class="ai-turn">
                    <p>Taking my turn...</p>
                    <playing-card value="a" suit="s" facedown bind:this={aiWaitCard}></playing-card>
                </div>
            {/await}
            <ol>
                {#each game.board as row, ri}
                    <li class="row-item">
                        <ol>
                            {#each row as card, ci}
                                <li out:send={{key: cardId(card)}}>
                                    <button on:click={handleCardClick(ri, ci)} disabled={!isCardEnabled(game, ri, ci)}>
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
        position: relative;
    }

    ol, ul {
        list-style: none;
        display: flex;
        padding: 0;
    }

    .board {
        position: relative;
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

    button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .ai-turn {
        --playing-card-width: 3em;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 2;
        background: #eee;
        padding: 1em;
        border-radius: 1em;
        box-shadow: 0 0.25em 0.25em rgba(0, 0, 0, 0.25);
    }
</style>