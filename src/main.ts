import { Commons } from './commons'
import { Conversation } from './conversation'

/** 正解の桁数。 */
const ANSWER_LENGTH = 3;

/**
 * メイン。
 */
function main() {
    const answers = Commons.shuffle(Commons.createNumbers(1, ANSWER_LENGTH));

    const parser = (input: string) => {
        if (/\D/.test(input)) {
            throw `数字ではない文字が入力されました。`;
        } else if (input.length !== ANSWER_LENGTH) {
            throw `入力の個数が異なります。`;
        }

        const inputs: number[] = [];

        for (let char of input) {
            inputs.push(Number.parseInt(char));
        }

        return inputs;
    }

    const consumer = (value: number[]) => {
        let hits = 0;

        for (let i = 0; i < ANSWER_LENGTH; i++) {
            if (value[i] === answers[i]) {
                ++hits;
            }
        }

        console.log(`${hits}個正解しました。`);

        return hits !== ANSWER_LENGTH;
    }

    console.log(answers);
    const conversation = new Conversation<number[]>(parser, consumer);
    conversation.query = `1から${ANSWER_LENGTH}までの数字を全て入力してください。>`;
    conversation.start();
}

main();
