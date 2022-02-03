import { NimcardGame } from './index.js'

if (!window.customElements.get(NimcardGame.elementName)) {
    window.customElements.define(NimcardGame.elementName, NimcardGame)
}
