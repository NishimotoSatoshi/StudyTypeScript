import * as readline from 'readline'

const readStdin = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (prompt: string) => new Promise(
    resolve => readStdin.question(prompt, answer => resolve(answer))
);

question('数字を入力してください。')
    .then(answer => console.log(answer))
    .finally(() => readStdin.close());
