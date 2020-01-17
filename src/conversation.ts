import * as readline from 'readline'

/**
 * 期待する入力を受け取るまで、入力を繰り返す。
 * 
 * @param <T> 入力された文字列をパースする型
 */
export class Conversation<T> {

    /** 入力時に表示する文字列。 */
    public query: string = '>';

    /**
     * コンストラクタ。
     * 
     * consumer が true を返却するまで、入力が繰り返される。
     * 
     * @param parser 入力された文字列をパースする関数
     * @param consumer パースした値を受け取る関数
     */
    constructor(
        private parser: (input: string) => T,
        private consumer: (value: T) => boolean,
    ) {
    }

    /**
     * 入出力に用いるオブジェクトを生成する。
     */
    createReadline(): readline.Interface {
        return readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * 入力を開始する。
     */
    start(): Promise<void> {
        const io = this.createReadline();
        return this.process(io);
    }

    /**
     * 入力処理を1回行う。
     * 
     * @param io 入出力に用いるオブジェクト
     */
    process(io: readline.Interface): Promise<void> {
        return this.prompt(io)
            .then(input => this.parser(input))
            .then(value => this.consumer(value))
            .catch(reason => this.catcher(reason))
            .then(repeat => {
                if (repeat) {
                    return this.process(io);
                }
            })
            .finally(() => io.close());
    }

    /**
     * 入力を要求する。
     * 
     * @param io 入出力に用いるオブジェクト
     */
    prompt(io: readline.Interface): Promise<string> {
        return new Promise<string>(
            resolve => io.question(this.query, input => resolve(input))
        );
    }

    /**
     * 例外を処理する。
     * 
     * 例外が Error オブジェクトの場合は、エラー出力して入力を中断する。
     * 例外が Error オブジェクトでない場合は、標準出力して入力を繰り返す。
     * 
     * @param reason 例外
     */
    catcher(reason: any): boolean {
        if (reason instanceof Error) {
            console.error(reason);
            return false;
        } else {
            console.log(`* ${reason}`);
            return true;
        }
    }
}
