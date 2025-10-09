export interface SnackbarOptions {
  message: string;
  duration?: number;      // 默认 3000ms
  actionText?: string;    // 操作按钮文案（可选）
  onAction?: () => void;  // 点击操作按钮回调
  safeArea?: boolean;     // 是否遵守底部安全区（默认 true）
  onClose?: () => void;   // 关闭回调（自动或手动）
}

export type SnackbarState = (
  { visible: true } & Required<Pick<SnackbarOptions, 'safeArea'>> & Omit<SnackbarOptions, 'safeArea'>
) | { visible: false };

export type SnackbarListener = (state: SnackbarState) => void;

class SnackbarServiceImpl {
  private listeners = new Set<SnackbarListener>();
  private current: SnackbarState = { visible: false };

  subscribe(listener: SnackbarListener): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  private notify(next: SnackbarState) {
    this.current = next;
    this.listeners.forEach((l) => l(next));
  }

  show(options: SnackbarOptions) {
    const { message, duration = 3000, actionText, onAction, safeArea = true, onClose } = options;
    this.notify({ visible: true, message, duration, actionText, onAction, safeArea, onClose });
  }

  hide() {
    this.notify({ visible: false });
  }
}

export const SnackbarService = new SnackbarServiceImpl();
export const Snackbar = SnackbarService;