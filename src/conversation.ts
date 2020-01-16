import * as readline from 'readline'

export class Conversation<T> {

    constructor(
        private query: string,
        private parser: (input: string) => T,
        private consumer: (value: T) => boolean,
        private catcher: (reason: any) => boolean
    ) {
    }

    start(io: readline.Interface): Promise<void> {
        return new Promise<string>(
            resolve => io.question(this.query, input => resolve(input))
        )
        .then(input => this.parser(input))
        .then(value => this.consumer(value))
        .catch(reason => this.catcher(reason))
        .then(repeat => {
            if (repeat) {
                return this.start(io);
            }
        })
        .finally(() => io.close());
    }
}
