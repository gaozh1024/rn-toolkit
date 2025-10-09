// LoadingOverlayService: 提供全局 show/hide 与订阅
export type LoadingOverlayMode = 'blocking' | 'semi';

export interface LoadingOverlayOptions {
  message?: string;
  mode?: LoadingOverlayMode; // 默认 blocking
  cancelable?: boolean;      // 默认 false
  onCancel?: () => void;
  maskColor?: string;        // 默认 rgba(0,0,0,0.45)
  animationDuration?: number;// 默认 200ms
}

export type LoadingOverlayState = (
  { visible: true } & Required<Pick<LoadingOverlayOptions, 'mode'>> & Omit<LoadingOverlayOptions, 'mode'>
) | { visible: false };

export type LoadingOverlayListener = (state: LoadingOverlayState) => void;

class LoadingOverlayServiceImpl {
  private listeners = new Set<LoadingOverlayListener>();
  private current: LoadingOverlayState = { visible: false };

  subscribe(listener: LoadingOverlayListener): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  private notify(next: LoadingOverlayState) {
    this.current = next;
    this.listeners.forEach(l => l(next));
  }

  show(options: LoadingOverlayOptions = {}) {
    const {
      message,
      mode = 'blocking',
      cancelable = false,
      onCancel,
      maskColor,
      animationDuration,
    } = options;
    this.notify({
      visible: true,
      mode,
      message,
      cancelable,
      onCancel,
      maskColor,
      animationDuration,
    });
  }

  hide() {
    this.notify({ visible: false });
  }
}

export const LoadingOverlayService = new LoadingOverlayServiceImpl();
export const LoadingOverlay = LoadingOverlayService;