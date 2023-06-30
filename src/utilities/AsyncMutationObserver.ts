/**
 * A mutation observer that rejects if the callback errors, or resolves if disconnected.
 * Can be restarted if stopped by observing again.
 */
class AsyncMutationObserver implements MutationObserver {
    private readonly mutationObserver: MutationObserver;
    private promise: Promise<void> | null;
    private promiseResolve: Parameters<ConstructorParameters<typeof Promise<void>>[0]>[0] | null;
    private promiseReject: Parameters<ConstructorParameters<typeof Promise<void>>[0]>[1] | null;

    constructor(callback: (mutations: MutationRecord[], observer: MutationObserver) => void | Promise<void>) {
        this.mutationObserver = this.mutationObserverSupplier(async (mutationList: MutationRecord[]) => {
            try {
                await callback(mutationList, this);
            } catch (e) {
                this.reject(e);
            }
        });

        this.promise = null;
        this.promiseResolve = null;
        this.promiseReject = null;
    }

    disconnect(): void {
        this.resolve();
    }

    observe(target: Node, options?: MutationObserverInit): Promise<void> {
        if (this.promise == null) {
            this.promise = new Promise((resolve, reject) => {
                this.promiseResolve = resolve;
                this.promiseReject = reject;
            });
        }

        this.mutationObserver.observe(target, options);
        return this.promise;
    }

    takeRecords(): MutationRecord[] {
        return this.mutationObserver.takeRecords();
    }

    /* istanbul ignore next */
    protected mutationObserverSupplier(callback: MutationCallback): MutationObserver {
        return new MutationObserver(callback);
    }

    /**
     * Resolve the current promise and restore the state (not observing, no pending promises).
     */
    private resolve(): void {
        this.mutationObserver.disconnect();

        if (this.promise != null) {
            this.promise = null;

            if (this.promiseResolve != null) {
                this.promiseResolve();
                this.promiseResolve = null;
            }
        }
    }

    /**
     * Reject the current promise and restore the state (not observing, no pending promises).
     */
    private reject(reason?: any): void {
        this.mutationObserver.disconnect();

        if (this.promise != null) {
            this.promise = null;

            if (this.promiseReject != null) {
                this.promiseReject(reason);
                this.promiseReject = null;
            }
        }
    }
}

export { AsyncMutationObserver };