import * as readline from 'readline'
import { Library } from './library';

/** 正解の桁数。 */
const ANSWER_LENGTH = 3;

/**
 * 回答を要求する。
 */
function prompt(readline: readline.Interface): Promise<number[]> {
    return new Promise<string>(
        resolve => readline.question(
            `1から${ANSWER_LENGTH}までの数字を全て入力してください。>`,
            input => resolve(input))
    )
    .then(input => {
        if (input.length !== ANSWER_LENGTH) {
            throw `入力の個数が異なります。`;
        } else if (!/^\d+$/.test(input)) {
            throw `数字ではない文字が入力されました。`;
        }

        const inputs: number[] = [];

        for (let char of input) {
            inputs.push(Number.parseInt(char));
        }

        return inputs;
    });
}

/**
 * 入力を正解を突き合わせる。
 */
function checkInputs(answers: number[], inputs: number[]): number {
    let hits = 0;

    for (let i = 0; i < ANSWER_LENGTH; i++) {
        if (inputs[i] === answers[i]) {
            ++hits;
        }
    }

    return hits;
}

/**
 * ターンを行う。
 */
function doTurn(readline: readline.Interface, answers: number[]): Promise<void> {
    return prompt(readline)
        .then(inputs => checkInputs(answers, inputs))
        .then(
            (hits: number) => {
                console.log(`${hits}個正解しました。`);

                if (hits < ANSWER_LENGTH) {
                    return doTurn(readline, answers);
                }
            },
            (reason: string | Error) => {
                if (reason instanceof Error) {
                    throw reason;
                } else {
                    console.log(`* ${reason}`);
                    return doTurn(readline, answers);
                }
            }
        )
        .finally(() => readline.close());
}

/**
 * メイン。
 */
function main() {
    const io = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answers = Library.shuffle(Library.createNumbers(1, ANSWER_LENGTH));

    console.log(answers);

    doTurn(io, answers);
}

main();
