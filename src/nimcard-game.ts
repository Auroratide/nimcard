import * as Nimcard from './nimcard'

export class NimcardGame extends HTMLElement {
    static elementName = 'nimcard-game'

    static html = `
        <slot name="board"></slot>
    `

    static css = `
        :host {
            display: block;
        }
    `

    constructor() {
        super()
        this.createRoot()
    }

    start = (game: Nimcard.Game) => {
        this.innerHTML = ''
        const boardElem = document.createElement('ol')
        boardElem.slot = 'board'

        game.board.forEach(row => {
            const rowLi = document.createElement('li')
            const rowElem = document.createElement('ol')
            row.forEach(card => {
                const li = document.createElement('li')
                li.innerHTML = `<playing-card value="${card.card.value}" suit="${card.card.suit}"></playing-card>`
                rowElem.appendChild(li)
            })

            rowLi.appendChild(rowElem)
            boardElem.appendChild(rowLi)
        })

        this.appendChild(boardElem)
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
