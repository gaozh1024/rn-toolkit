// LoadingOverlayService: 提供全局 show/hide 与订阅
export type LoadingMode = 'blocking' | 'semi';

export interface LoadingOptions {
  message?: string;
  mode?: LoadingMode; // 默认 blocking
  cancelable?: boolean;      // 默认 false
  onCancel?: () => void;
  maskColor?: string;        // 默认 rgba(0,0,0,0.45)
  animationDuration?: number;// 默认 200ms
}

export type LoadingState = (
  { visible: true } & Required<Pick<LoadingOptions, 'mode'>> & Omit<LoadingOptions, 'mode'>
) | { visible: false };

export type LoadingListener = (state: LoadingState) => void;

class LoadingServiceImpl {
  private listeners = new Set<LoadingListener>();
  private current: LoadingState = { visible: false };

  subscribe(listener: LoadingListener): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  private notify(next: LoadingState) {
    this.current = next;
    this.listeners.forEach(l => l(next));
  }

  show(options: LoadingOptions = {}) {
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

export const LoadingService = new LoadingServiceImpl();
export const Loading = LoadingService;
