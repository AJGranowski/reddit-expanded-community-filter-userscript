/**
 * Wraps a function with another that returns a promise.
 */
function promisify<F extends (...args: any[]) => any>(func: F): (...args: Parameters<F>) => Promise<ReturnType<F>> {
    return (...args) => {
        return new Promise((resolve) => {
            resolve(func.call(this, ...args));
        });
    };
}

export { promisify };