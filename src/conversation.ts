import * as readline from 'readline'

const DEFAULT_CATCHER = (reason: any) => {
    if (reason instanceof Error) {
        console.error(reason);
        return false;
    } else {
        console.log(`* ${reason}`);
        return true;
    }
}

/**
 * 期待する入力を受け取るまで、入力を繰り返す。
 * 
 * @param <T> 入力された文字列をパースする型
 */
export class Conversation<T> {

    /** 入力時に表示する文字列。 */
    public query: string = '>';

    /** オプション。 */
    public options: readline.ReadLineOptions = {
        input: process.stdin,
        output: process.stdout
    };

    public setupper: (result: T | null) => void = () => {}
    public catcher: (reason: any) => boolean = DEFAULT_CATCHER;

    /** 結果。 */
    private result: T | null = null;

    /**
     * コンストラクタ。
     * 
     * consumer が true を返却するまで、入力が繰り返される。
     * 
     * parser または consumer で例外が発生した場合、
     * それが Error オブジェクトの場合は入力が中断される。
     * Error オブジェクト出ない場合は、コンソールに出力され、再入力が行われる。
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
        return readline.createInterface(this.options);
    }

    /**
     * 入力を開始する。
     */
    start(): Promise<T|null> {
        const io = this.createReadline();

        return this.process(io)
            .then(() => this.result)
            .finally(() => io.close());
    }

    /**
     * 入力処理を1回行う。
     * 
     * @param io 入出力に用いるオブジェクト
     */
    process(io: readline.Interface): Promise<void> {
        this.result = null;

        return this.prompt(io)
            .then(input => {
                this.result = this.parser(input);
                return this.result;
            })
            .then(value => this.consumer(value))
            .catch(reason => this.catcher(reason))
            .then(again => {
                if (again) {
                    return this.process(io);
                }
            });
    }

    /**
     * 入力を要求する。
     * 
     * @param io 入出力に用いるオブジェクト
     */
    prompt(io: readline.Interface): Promise<string> {
        this.setupper(this.result);

        return new Promise(
            resolve => io.question(this.query, input => resolve(input))
        );
    }
}
