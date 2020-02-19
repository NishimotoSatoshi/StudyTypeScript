
/** 共通ライブラリ。 */
export namespace Commons {

    /**
     * 数値の配列を生成する。
     */
    export function createNumberArray(min: number, max: number, shuffle: boolean = false): number[] {
        const result: number[] = [];

        for (let i = 0; i < max - min + 1; i++) {
            result.push(i + min);
        }

        if (shuffle) {
            return Commons.shuffle(result);
        } else {
            return result;
        }
    }

    /**
     * 配列をコピーしてシャッフルする。
     */
    export function shuffle<T>(target: T[]): T[] {
        const result: T[] = target.concat();

        for (let i = 0; i < result.length; i++) {
            const swapTo = Math.floor(Math.random() * result.length);
            [result[i], result[swapTo]] = [result[swapTo], result[i]];
        }

        return result;
    }
};
