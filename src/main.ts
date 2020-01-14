import * as readline from 'readline'

/** 正解の桁数。 */
const ANSWER_LENGTH = 3;

/**
 * 正解を作成する。
 */
function createAnswers(): number[] {
    const answers: number[] = [];

    for (let i = 0; i < ANSWER_LENGTH; i++) {
        answers[i] = i + 1;
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
        const swapTo = Math.floor(Math.random() * ANSWER_LENGTH);
        [answers[i], answers[swapTo]] = [answers[swapTo], answers[i]];
    }

    return answers;
}

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
            throw new Error(`入力の個数が異なります。`);
        } else if (!/^\d+$/.test(input)) {
            throw new Error(`数字ではない文字が入力されました。`);
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
            (reason: Error) => {
                console.log(`* ${reason.message}`);
                return doTurn(readline, answers);
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

    const answers = createAnswers();

    console.log(answers);

    doTurn(io, answers);
}

main();
