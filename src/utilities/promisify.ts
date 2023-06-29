/**
 * Wraps a function with another that returns a promise.
 */
type Func = (...args: any[]) => any;
function promisify<F extends Func>(func: F): (...args: Parameters<F>) => Promise<ReturnType<F>> {
    return (...args) => {
        return new Promise((resolve) => {
            resolve(func.call(this, ...args));
        });
    };
}

export { promisify };