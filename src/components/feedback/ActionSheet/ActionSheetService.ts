export type ActionRole = 'cancel' | 'destructive' | 'default';

export interface ActionSheetAction {
  text: string;
  value?: any;
  role?: ActionRole;
}

export interface ActionSheetOptions {
  title?: string;
  actions: ActionSheetAction[]; // 主操作列表（不含“取消”）
  cancelText?: string;          // 取消按钮文案（默认“取消”）
  cancelable?: boolean;         // 点击遮罩是否可取消（默认 true）
  enablePanToClose?: boolean;   // 手势下拉关闭（默认 true）
  blocking?: boolean;           // 是否阻断（默认 true）
  maskColor?: string;           // 遮罩色（默认 rgba(0,0,0,0.45)）
  animationDuration?: number;   // 动画时长（默认 220ms）
}

export type ActionSheetState = (
  { visible: true } & Required<Pick<ActionSheetOptions, 'blocking'>> & Omit<ActionSheetOptions, 'blocking'>
) | { visible: false };

export type ActionSheetListener = (state: ActionSheetState) => void;

class ActionSheetServiceImpl {
  private listeners = new Set<ActionSheetListener>();
  private current: ActionSheetState = { visible: false };
  private resolver?: (value: any) => void;

  subscribe(listener: ActionSheetListener): () => void {
    this.listeners.add(listener);
    listener(this.current);
    return () => this.listeners.delete(listener);
  }

  private notify(next: ActionSheetState) {
    this.current = next;
    this.listeners.forEach((l) => l(next));
  }

  show(options: ActionSheetOptions) {
    const {
      title,
      actions,
      cancelText = '取消',
      cancelable = true,
      enablePanToClose = true,
      blocking = true,
      maskColor,
      animationDuration = 220,
    } = options;

    this.notify({
      visible: true,
      blocking,
      title,
      actions,
      cancelText,
      cancelable,
      enablePanToClose,
      maskColor,
      animationDuration,
    });
  }

  open(options: ActionSheetOptions): Promise<any> {
    return new Promise((resolve) => {
      this.resolver = (v: any) => resolve(v);
      this.show(options);
    });
  }

  choose(action?: ActionSheetAction) {
    if (this.resolver) {
      const v = action?.value ?? (action?.role === 'cancel' ? false : true);
      try { this.resolver(v); } finally { this.resolver = undefined; }
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

export const ActionSheetService = new ActionSheetServiceImpl();
export const ActionSheet = ActionSheetService;