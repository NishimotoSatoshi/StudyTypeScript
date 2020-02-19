import { Conversation } from './conversation'
import { Trump } from './trump'

const deck = new Trump.Deck();
const hand = new Trump.Hand(deck, 5);

hand.drawMax(true);

interface ParseResult {
    nums: number[],
    suits: number[],
    pairs: number[],
    strait: boolean,
    hiAce: boolean,
    flash: boolean
}

function basicParseHand(hand: Trump.Card[]): ParseResult {
    const result: ParseResult = {
        nums: Array(13).fill(0),
        suits: Array(6).fill(0),
        pairs: Array(5).fill(0),
        strait: false,
        hiAce: false,
        flash: false
    }

    for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        const suit = card.getSuit();
        ++result.nums[card.num - 1];
        ++result.suits[suit];
    }

    for (let i = 0; i < 13; i++) {
        const count = result.nums[i];

        if (count > 1) {
            ++result.pairs[count];
        }
    }

    return result;
}

function checkStrait(result: ParseResult, hand: Trump.Card[]): void {
    const sortByNum = hand.concat();
    sortByNum.sort((a, b) => a.num - b.num);

    if (sortByNum[0].num === 1) {
        if (sortByNum[1].num === 2
            && sortByNum[2].num === 3
            && sortByNum[3].num === 4
            && sortByNum[4].num === 5) {

            result.strait = true;
            return;
        } else if (sortByNum[1].num === 10
            && sortByNum[2].num === 11
            && sortByNum[3].num === 12
            && sortByNum[4].num === 13) {

            result.strait = true;
            result.hiAce = true;
            return;
        }
    }

    for (let i = 1; i < hand.length; i++) {
        if (sortByNum[i].num !== sortByNum[i - 1].num + 1) {
            return;
        }
    }

    result.strait = true;
}

function checkFlash(result: ParseResult): void {
    const suits = [
        Trump.Suit.SPADE,
        Trump.Suit.HEART,
        Trump.Suit.DIAMOND,
        Trump.Suit.CLUB
    ];

    for (const suit of suits) {
        if (result.suits[suit] === 5) {
            result.flash = true;
            return;
        }
    }
}

function parseHand(hand: Trump.Card[]): ParseResult {
    const result = basicParseHand(hand);
    checkStrait(result, hand);
    checkFlash(result);
    return result;
}

enum HandType {
    ONE_PAIR,
    TWO_PAIR,
    THREE_CARD,
    STRAIT,
    FLASH,
    FULL_HOUSE,
    FOUR_CARD,
    STRAIT_FLASH,
    ROYAL_STRAIT_FLASH
}

interface HandChecker {
    type: HandType,
    check: (result: ParseResult) => boolean
}

const HandCheckers: HandChecker[] = [];

HandCheckers.push({
    type: HandType.ROYAL_STRAIT_FLASH,
    check: result => result.strait && result.hiAce && result.flash
});

HandCheckers.push({
    type: HandType.STRAIT_FLASH,
    check: result => result.strait && result.flash
});

HandCheckers.push({
    type: HandType.FOUR_CARD,
    check: result => result.pairs[4] > 0
});

HandCheckers.push({
    type: HandType.FULL_HOUSE,
    check: result => result.pairs[3] > 0 && result.pairs[2] > 0
});

HandCheckers.push({
    type: HandType.FLASH,
    check: result => result.flash
});

HandCheckers.push({
    type: HandType.STRAIT,
    check: result => result.strait
});

HandCheckers.push({
    type: HandType.THREE_CARD,
    check: result => result.pairs[3] > 0
});

HandCheckers.push({
    type: HandType.TWO_PAIR,
    check: result => result.pairs[2] === 2
});

HandCheckers.push({
    type: HandType.ONE_PAIR,
    check: result => result.pairs[2] === 1
});

function setupper(): void {
    hand.cards.forEach(
        (card, index) => console.log(`${index}: ${card.getString()}`)
    );

    const result = parseHand(hand.cards);
    const checker = HandCheckers.find(checker => checker.check(result));

    if (checker) {
        console.log(HandType[checker.type]);
    }
}

function parser(input: string): number[] {
    if (input === '') {
        throw '入力がありません。';
    } else if (/\D/.test(input)) {
        throw `数字ではない文字が入力されました。`;
    }

    const inputs: number[] = [];

    for (let char of input) {
        const position = Number.parseInt(char);

        if (position >= hand.maxCount) {
            throw `${hand.maxCount - 1}以下の数字を指定してください。`;
        }

        inputs.push(position);
    }

    return inputs;
}

function consumer(value: number[]): boolean {
    for (const position of value) {
        hand.cast(position);
    }

    return hand.drawMax(true);
}

const conversation = new Conversation(parser, consumer);
conversation.query = `cast cards>`;
conversation.setupper = setupper;
conversation.start();
