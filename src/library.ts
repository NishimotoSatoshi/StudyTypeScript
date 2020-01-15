
export const Library = {
    createNumbers: (min: number, max: number) => {
        const result: number[] = [];

        for (let i = 0; i < max - min + 1; i++) {
            result.push(i + min);
        }

        return result;
    },

    shuffle: <T>(target: T[]) => {
        const result: T[] = target.slice();

        for (let i = 0; i < result.length; i++) {
            const swapTo = Math.floor(Math.random() * result.length);
            [result[i], result[swapTo]] = [result[swapTo], result[i]];
        }

        return result;
    }
};