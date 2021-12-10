export type Card = {
    value: Card.Value,
    suit: Card.Suit,
}

export namespace Card {
    export enum Value {
        Two = '2',
        Three = '3',
        Four = '4',
        Five = '5',
        Six = '6',
        Seven = '7',
        Eight = '8',
        Nine = '9',
        Ten = '10',
        Jack = 'j',
        Queen = 'q',
        King = 'k',
        Ace = 'a',
    }

    export enum Suit {
        Diamonds = 'd',
        Hearts = 'h',
        Spades = 's',
        Clubs = 'c',
    }
}
