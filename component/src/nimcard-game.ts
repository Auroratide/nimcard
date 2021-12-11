import type * as Nimcard from '../../nimcard/lib'
import type { Player } from './players'
import { human, ai } from './players'
import NimcardInternal from './NimcardInternal.svelte'

export class NimcardGame extends HTMLElement {
    static elementName = 'nimcard-game'

    static html = `
        <slot></slot>
    `

    static css = `
        :host {
            display: block;
        }
    `

    private internal: NimcardInternal

    constructor() {
        super()
        this.createRoot()

        this.internal = new NimcardInternal({
            target: this,
        })
    }

    get game(): Nimcard.Game | null {
        return this.internal.getGame()
    }

    start = (game: Nimcard.Game, players: Player[] = [human, human]) => {
        this.internal.startGame(game, players)
    }

    private createRoot(): ShadowRoot {
        const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' })

        const style = document.createElement('style')
        style.innerHTML = (this.constructor as typeof NimcardGame).css

        const template = document.createElement('template')
        template.innerHTML = (this.constructor as typeof NimcardGame).html

        root.appendChild(style)
        root.appendChild(template.content)

        return root
    }
}
