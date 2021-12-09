import * as Nimcard from './nimcard'

export type Player = (component: NimcardGame) => void

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

    game: Nimcard.Game | null = null

    constructor() {
        super()
        this.createRoot()
    }

    start = (game: Nimcard.Game) => {
        this.game = game
        this.renderBoard()
    }

    private renderBoard = () => {
        this.innerHTML = ''
        const elem = document.createElement('ol')
        elem.slot = 'board'

        this.game!.board.forEach((row, ri) => {
            const li = document.createElement('li')
            li.appendChild(this.renderRow(row, ri))
            elem.appendChild(li)
        })

        this.appendChild(elem)
    }

    private renderRow = (row: Nimcard.Board.ScoredCard[], rowIndex: number): HTMLElement => {
        const elem = document.createElement('ol')

        row.forEach((card, ci) => {
            const li = document.createElement('li')
            li.appendChild(this.renderCard(card.card, rowIndex, ci))
            elem.appendChild(li)
        })

        return elem
    }

    private renderCard = (card: Nimcard.Card, rowIndex: number, cardIndex: number): HTMLElement => {
        const button = document.createElement('button')
        button.innerHTML = `<playing-card value="${card.value}" suit="${card.suit}"></playing-card>`

        button.onclick = () => {
            const options = Nimcard.Game.options(this.game!)
            const targetRow = rowIndex
            const targetAmount = this.game!.board[rowIndex].length - cardIndex
            const option = options.find(o => o.row === targetRow && o.amount === targetAmount)

            if (option) {
                this.game = option.commit()
                this.renderBoard()
            }
        }

        return button
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
