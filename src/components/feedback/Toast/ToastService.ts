export type ToastPosition = 'top' | 'center' | 'bottom';
export interface ToastOptions {
  message: string;
  duration?: number; // 默认 2000ms
  position?: ToastPosition; // 默认 bottom
}

type Listener = (opts: ToastOptions) => void;

let listeners: Listener[] = [];

export const ToastService = {
  show(opts: ToastOptions) {
    const options: ToastOptions = {
      duration: 2000,
      position: 'bottom',
      ...opts,
    };
    listeners.forEach((l) => l(options));
  },
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
};