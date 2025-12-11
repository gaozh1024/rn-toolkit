import { Navigation } from '../../../navigation';

export type PickerItem = { label: string; value: any };

type Resolver = {
    resolve: (value: any[]) => void;
    reject: (reason?: any) => void;
};

type Listener = (columns: PickerItem[][]) => void;

class PickerServiceImpl {
    private seq = 0;
    private pending = new Map<string, Resolver>();
    private columns = new Map<string, PickerItem[][]>();
    private listeners = new Map<string, Set<Listener>>();
    private selection = new Map<string, number[]>();
    private selectionListeners = new Map<string, Set<(indices: number[]) => void>>();

    private genId(): string {
        this.seq += 1;
        return `picker_${Date.now()}_${this.seq}`;
    }

    private tryOpenModalWithReady(params: any, maxRetries: number = 12, intervalMs: number = 80): void {
        let tries = 0;
        const attempt = () => {
            if (Navigation.isReady?.()) {
                Navigation.openModal('WheelPickerModal', params);
                return;
            }
            tries += 1;
            if (tries <= maxRetries) {
                setTimeout(attempt, intervalMs);
            } else {
                console.warn('PickerService: navigation not ready after retries, giving up');
            }
        };
        attempt();
    }

    getSelection(id: string): number[] | undefined {
        return this.selection.get(id);
    }

    updateSelection(id: string, indices: number[]): void {
        this.selection.set(id, indices);
        const set = this.selectionListeners.get(id);
        if (set) {
            set.forEach((fn) => {
                try { fn(indices); } catch { }
            });
        }
    }

    subscribeSelection(id: string, fn: (indices: number[]) => void): () => void {
        const set = this.selectionListeners.get(id) ?? new Set<(indices: number[]) => void>();
        set.add(fn);
        this.selectionListeners.set(id, set);
        return () => {
            const s = this.selectionListeners.get(id);
            if (s) {
                s.delete(fn);
                if (s.size === 0) this.selectionListeners.delete(id);
            }
        };
    }

    openPicker(options: {
        columns: PickerItem[][];
        initialIndices?: number[];
        title?: string;
        cancelLabel?: string;
        confirmLabel?: string;
        direction?: 'bottom' | 'top' | 'left' | 'right' | 'fade' | 'none' | 'ios';
    }): Promise<any[]> {
        const id = this.genId();
        this.columns.set(id, options.columns);
        if (options.initialIndices) this.selection.set(id, options.initialIndices);
        return new Promise<any[]>((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
            const params = {
                id,
                title: options.title,
                cancelLabel: options.cancelLabel,
                confirmLabel: options.confirmLabel,
                direction: options.direction ?? 'bottom',
                initialIndices: options.initialIndices,
                columns: options.columns,
            };
            const current = Navigation.getCurrentRouteName?.();

            if (current === 'WheelPickerModal') {
                Navigation.pop?.(1);
                setTimeout(() => this.tryOpenModalWithReady(params), 50);
            } else {
                this.tryOpenModalWithReady(params);
            }
        });
    }

    openPickerControlled(options: {
        columns: PickerItem[][];
        initialIndices?: number[];
        title?: string;
        cancelLabel?: string;
        confirmLabel?: string;
        direction?: 'bottom' | 'top' | 'left' | 'right' | 'fade' | 'none' | 'ios';
    }): { id: string; result: Promise<any[]>; updateColumns: (cols: PickerItem[][]) => void; updateSelection: (indices: number[]) => void; close: () => void } {
        const id = this.genId();
        this.columns.set(id, options.columns);
        if (options.initialIndices) this.selection.set(id, options.initialIndices);
        const result = new Promise<any[]>((resolve, reject) => {
            this.pending.set(id, { resolve, reject });
            const params = {
                id,
                title: options.title,
                cancelLabel: options.cancelLabel,
                confirmLabel: options.confirmLabel,
                direction: options.direction ?? 'bottom',
                initialIndices: options.initialIndices,
                columns: options.columns,
            };
            const current = Navigation.getCurrentRouteName?.();

            if (current === 'WheelPickerModal') {
                Navigation.pop?.(1);
                setTimeout(() => this.tryOpenModalWithReady(params), 50);
            } else {
                this.tryOpenModalWithReady(params);
            }
        });
        return {
            id,
            result,
            updateColumns: (cols: PickerItem[][]) => this.update(id, cols),
            updateSelection: (indices: number[]) => this.updateSelection(id, indices),
            close: () => this.reject(id, 'close'),
        };
    }

    getColumns(id: string): PickerItem[][] | undefined {
        return this.columns.get(id);
    }

    subscribe(id: string, fn: Listener): () => void {
        const set = this.listeners.get(id) ?? new Set<Listener>();
        set.add(fn);
        this.listeners.set(id, set);
        return () => {
            const s = this.listeners.get(id);
            if (s) {
                s.delete(fn);
                if (s.size === 0) this.listeners.delete(id);
            }
        };
    }

    update(id: string, cols: PickerItem[][]): void {
        this.columns.set(id, cols);
        const set = this.listeners.get(id);
        if (set) {
            set.forEach((fn) => {
                try { fn(cols); } catch { }
            });
        }
    }

    resolve(id: string, values: any[]): void {
        const r = this.pending.get(id);
        if (r) {
            r.resolve(values);
            this.pending.delete(id);
            this.columns.delete(id);
            this.listeners.delete(id);
            this.selection.delete(id);
            this.selectionListeners.delete(id);
        }
    }

    reject(id: string, reason?: any): void {
        const r = this.pending.get(id);
        if (r) {
            r.reject(reason);
            this.pending.delete(id);
            this.columns.delete(id);
            this.listeners.delete(id);
            this.selection.delete(id);
            this.selectionListeners.delete(id);
        }
    }
}

export const PickerService = new PickerServiceImpl();
export const openPicker = PickerService.openPicker.bind(PickerService);
export const openPickerControlled = PickerService.openPickerControlled.bind(PickerService);