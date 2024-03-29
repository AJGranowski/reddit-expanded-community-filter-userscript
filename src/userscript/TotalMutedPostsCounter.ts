import { Localization } from "../i18n/Localization";
import { Storage, STORAGE_KEY } from "./Storage";

const i18n = Localization.SINGLETON;

class TotalMutedPostsCounter {
    private readonly storage: Storage;

    private counterId: any | null;
    private valueChangeListenerId: any | null;

    constructor() {
        this.storage = new Storage();

        this.counterId = null;
        this.valueChangeListenerId = null;
    }

    /**
     * Register the counter and monitor for changes.
     */
    draw(): void {
        if (this.valueChangeListenerId != null) {
            return;
        }

        this.updateCounter(this.storage.get(STORAGE_KEY.TOTAL_MUTED_POSTS));
        this.valueChangeListenerId = GM_addValueChangeListener(STORAGE_KEY.TOTAL_MUTED_POSTS, this.valueChangeListener);
    }

    /**
     * Unregister the counter and stop monitoring for changes.
     */
    erase(): void {
        GM_removeValueChangeListener(this.valueChangeListenerId);
        this.valueChangeListenerId = null;
        GM_unregisterMenuCommand(this.counterId);
        this.counterId = null;
    }

    private readonly emptyFunction = (): void => {};

    private updateCounter(count: number): void {
        if (this.counterId != null) {
            GM_unregisterMenuCommand(this.counterId);
            this.counterId = null;
        }

        const name = i18n.get().totalMutedPosts.text.replaceAll("{#}", count.toString());
        this.counterId = GM_registerMenuCommand(name, this.emptyFunction);
    }

    private readonly valueChangeListener = (name: string, oldValue: number, newValue: number): void => {
        this.updateCounter(newValue);
    };
}

export { TotalMutedPostsCounter };