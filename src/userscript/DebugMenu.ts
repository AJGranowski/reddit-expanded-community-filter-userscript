import { Localization } from "../i18n/Localization";
import { Storage, STORAGE_KEY } from "./Storage";

const i18n = Localization.SINGLETON;

class DebugMenu {
    private readonly callback?: (enableDebug: boolean) => void;
    private readonly storage: Storage;

    private disableDebugId: any | null;
    private enableDebugId: any | null;
    private valueChangeListenerId: any | null;

    constructor(callback?: (enableDebug: boolean) => void) {
        this.callback = callback;
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

    private enableDebug(): void {
        if (this.disableDebugId != null) {
            GM_unregisterMenuCommand(this.disableDebugId);
            this.disableDebugId = null;
        }

        if (this.enableDebugId == null) {
            this.enableDebugId = GM_registerMenuCommand(i18n.get().debugMenu.disableDebugMode.text, () => {
                this.storage.set(STORAGE_KEY.DEBUG, false);
            });
        }
    }

    private disableDebug(): void {
        if (this.enableDebugId != null) {
            GM_unregisterMenuCommand(this.enableDebugId);
            this.enableDebugId = null;
        }

        if (this.disableDebugId == null) {
            this.disableDebugId = GM_registerMenuCommand(i18n.get().debugMenu.enableDebugMode.text, () => {
                this.storage.set(STORAGE_KEY.DEBUG, true);
            });
        }
    }

    private setMenuCommand(enableDebug: boolean): void {
        if (enableDebug) {
            this.enableDebug();
        } else {
            this.disableDebug();
        }

        if (this.callback != null) {
            this.callback(enableDebug);
        }
    }

    private readonly valueChangeListener = (name: string, oldValue: boolean, newValue: boolean): void => {
        this.setMenuCommand(newValue);
    };
}

export { DebugMenu };