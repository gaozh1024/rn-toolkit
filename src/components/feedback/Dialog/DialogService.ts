export type DialogType = 'info' | 'warning' | 'error' | 'success';

export interface DialogAction {
  text: string;
  role?: 'cancel' | 'destructive' | 'default';
  value?: any;
}

export interface DialogOptions {
  title?: string;
  message?: string;
  type?: DialogType;
  blocking?: boolean;          // 是否阻断（默认 true）
  cancelable?: boolean;        // 点击遮罩取消（默认 false）
  confirmText?: string;        // 确认按钮文案（confirm/alert 快捷）
  cancelText?: string;         // 取消按钮文案（confirm 快捷）
  actions?: DialogAction[];    // 自定义按钮组（存在时覆盖 confirm/cancel 文案）
  maskColor?: string;          // 遮罩色，默认 rgba(0,0,0,0.45)
  animationDuration?: number;  // 动画时长，默认 200ms
}

export type DialogState = (
  { visible: true } & Required<Pick<DialogOptions, 'blocking'>> & Omit<DialogOptions, 'blocking'>
) | { visible: false };

export type DialogListener = (state: DialogState) => void;

class DialogServiceImpl {
  private listeners = new Set<DialogListener>();
  private current: DialogState = { visible: false };
  private resolver?: (value: any) => void;

  subscribe(listener: DialogListener): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  private notify(next: DialogState) {
    this.current = next;
    this.listeners.forEach(l => l(next));
  }

  show(options: DialogOptions = {}) {
    const {
      title,
      message,
      type = 'info',
      blocking = true,
      cancelable = false,
      confirmText,
      cancelText,
      actions,
      maskColor,
      animationDuration,
    } = options;

    const finalActions: DialogAction[] | undefined = actions?.length
      ? actions
      : undefined;

    this.notify({
      visible: true,
      blocking,
      title,
      message,
      type,
      cancelable,
      confirmText,
      cancelText,
      actions: finalActions,
      maskColor,
      animationDuration,
    });
  }

  alert(options: Omit<DialogOptions, 'actions'>): Promise<void> {
    return new Promise((resolve) => {
      this.resolver = () => resolve();
      this.show({ ...options, confirmText: options.confirmText ?? '确定' });
    });
  }

  confirm(options: Omit<DialogOptions, 'actions'>): Promise<boolean> {
    return new Promise((resolve) => {
      this.resolver = (v?: any) => resolve(!!v);
      const confirmText = options.confirmText ?? '确定';
      const cancelText = options.cancelText ?? '取消';
      this.show({ ...options, confirmText, cancelText });
    });
  }

  submit(result?: any) {
    if (this.resolver) {
      try { this.resolver(result); } finally { this.resolver = undefined; }
    }
    this.hide();
  }

  cancel() {
    if (this.resolver) {
      try { this.resolver(false); } finally { this.resolver = undefined; }
    }
    this.hide();
  }

  hide() {
    this.notify({ visible: false });
  }
}

export const DialogService = new DialogServiceImpl();
export const Dialog = DialogService;