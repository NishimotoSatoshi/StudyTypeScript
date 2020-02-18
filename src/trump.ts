import { Commons } from "./commons";

export namespace Trump {
    export enum Suit {
        BLANK,
        SPADE,
        HEART,
        DIAMOND,
        CLUB,
        JOKER
    }

    export class Card {

        private suit: Suit;

        constructor(
            suit: Suit | keyof typeof Suit,
            public readonly num: number = 1
        ) {
            if (typeof suit === 'number') {
                this.suit = suit as Suit;
            } else {
                this.suit = Suit[suit];
            }
        }

        getSuit(): Suit {
            return this.suit;
        }

        getSuitKey(): keyof typeof Suit {
            return Suit[this.suit] as keyof typeof Suit;
        }

        getIndex(): number {
            return this.suit * 13 + this.num;
        }

        getString(): string {
            return `${this.getSuitKey()} ${this.num}`;
        }
    }

    export function createStack(withJoker: boolean = false): Card[] {
        const stack: Card[] = [];
        const Suits = [Suit.SPADE, Suit.HEART, Suit.DIAMOND, Suit.CLUB];

        for (const suit of Suits) {
            for (let num = 1; num <= 13; num++) {
                stack.push(new Card(suit, num));
            }
        }

        if (withJoker) {
            stack.push(new Card(Suit.JOKER));
        }

        return stack;
    }

    export class Deck {

        private cardSet: Card[] = [];
        private stack: Card[] = [];

        constructor(
            public readonly withJoker: boolean = false
        ) {
            this.cardSet = createStack(this.withJoker);
            this.initialize();
        }

        initialize(): void {
            this.stack = Commons.shuffle(this.cardSet);
        }

        draw(): Card | undefined {
            return this.stack.pop();
        }
    }

    export class Hand {

        private static BLANK_CARD = new Card(Suit.BLANK);

        public cards: Card[] = [];

        constructor(
            private readonly deck: Deck,
            public readonly maxCount: number
        ) {
        }

        castAll(): void {
            this.cards = [];
        }

        cast(index: number): void {
            if (index < 0 || index >= this.maxCount) {
                throw new Error(`indexが範囲外です: ${index}`);
            }

            this.cards[index] = Hand.BLANK_CARD;
        }

        drawMax(sorting: boolean = false): boolean {
            this.cards = this.cards.filter(e => e.getSuit() !== Suit.BLANK);

            while (this.cards.length < this.maxCount) {
                const drawn = this.deck.draw();

                if (drawn === undefined) {
                    return false;
                }

                this.cards.push(drawn);
            }

            if (sorting) {
                this.sort();
            }

            return true;
        }

        sort(): void {
            this.cards.sort((a, b) => a.getIndex() - b.getIndex());
        }
    }
}
