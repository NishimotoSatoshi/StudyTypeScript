import * as readline from 'readline'
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

    const catcher = (reason: any) => {
        if (reason instanceof Error) {
            console.error(reason);
            return false;
        } else {
            console.log(`* ${reason}`);
            return true;
        }
    }

    const conversation = new Conversation<number[]>(
        `1から${ANSWER_LENGTH}までの数字を全て入力してください。>`,
        parser,
        consumer,
        catcher
    );

    const io = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log(answers);
    conversation.start(io);
}

main();
