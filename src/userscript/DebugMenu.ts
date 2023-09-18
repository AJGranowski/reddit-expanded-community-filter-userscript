import { Storage, STORAGE_KEY } from "./Storage";

class DebugMenu {
    private readonly storage: Storage;

    private disableDebugId: any | null;
    private enableDebugId: any | null;
    private valueChangeListenerId: any | null;

    constructor() {
        this.storage = new Storage();

        this.disableDebugId = null;
        this.enableDebugId = null;
        this.valueChangeListenerId = null;
    }

    /**
     * Register the debug menu button and monitor for changes.
     */
    draw(): void {
        if (this.valueChangeListenerId != null) {
            return;
        }

        const debugState = this.storage.get(STORAGE_KEY.DEBUG);
        this.setMenuCommand(debugState);
        this.valueChangeListenerId = GM_addValueChangeListener(STORAGE_KEY.DEBUG, this.valueChangeListener);
    }

    /**
     * Unregister the debug menu button and stop monitoring for changes.
     */
    erase(): void {
        GM_removeValueChangeListener(this.valueChangeListenerId);
        this.valueChangeListenerId = null;
        GM_unregisterMenuCommand(this.disableDebugId);
        this.disableDebugId = null;
        GM_unregisterMenuCommand(this.enableDebugId);
        this.enableDebugId = null;
    }

    private setMenuCommand(enableDebug: boolean): void {
        if (enableDebug) {
            if (this.disableDebugId != null) {
                GM_unregisterMenuCommand(this.disableDebugId);
                this.disableDebugId = null;
            }

            if (this.enableDebugId == null) {
                this.enableDebugId = GM_registerMenuCommand("Disable Debug Mode", () => {
                    this.storage.set(STORAGE_KEY.DEBUG, false);
                });
            }
        } else {
            if (this.enableDebugId != null) {
                GM_unregisterMenuCommand(this.enableDebugId);
                this.enableDebugId = null;
            }

            if (this.disableDebugId == null) {
                this.disableDebugId = GM_registerMenuCommand("Enable Debug Mode", () => {
                    this.storage.set(STORAGE_KEY.DEBUG, true);
                });
            }
        }
    }

    private readonly valueChangeListener = (name: string, oldValue: boolean, newValue: boolean): void => {
        this.setMenuCommand(newValue);
    };
}

export { DebugMenu };