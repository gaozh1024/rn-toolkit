export interface ClipboardOptions {
  showToast?: boolean;
  toastMessage?: string;
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
}