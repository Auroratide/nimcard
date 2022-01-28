import type * as Nimcard from '../../nimcard/lib/index.js'
import type { Player } from './players.js'
import { human } from './players.js'
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
            props: {
                aiworker: this.aiworker,
            }
        })
    }

    get game(): Nimcard.Game | null {
        return this.internal.getGame()
    }

    start = (game: Nimcard.Game, players: Player[] = [human, human]) => {
        this.internal.startGame(game, players)
    }

    static get observedAttributes(): string[] {
        return ['aiworker']
    }

    attributeChangedCallback() {
        this.internal.aiworker = this.aiworker
    }

    get aiworker(): string {
        return this.getAttribute('aiworker') ?? ''
    }
    set aiworker(value: string) {
        this.setAttribute('aiworker', value)
    }

    get onnewgame(): null | (() => void) {
        return this.internal.onnewgame
    }
    set onnewgame(v: null | (() => void)) {
        this.internal.onnewgame = v
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
