import { ref } from "vue";

export type ToastType = "success" | "error" | "info" | "warning" | "default";

export interface ToastOptions {
  duration?: number;
  description?: string;
}

interface Toast {
  id: number;
  title: string;
  type: ToastType;
  duration?: number;
  description?: string;
}

const toasts = ref<Toast[]>([]);

let toastId = 0;

export function addToast(title: string, type: ToastType = "info", options: ToastOptions = {}) {
  const { duration, description } = options;
  toasts.value.push({ id: toastId++, title, type, duration, description });
}

export function removeToast(id: number) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

export function useToasts() {
  return {
    toasts,
    addToast,
    removeToast,
  };
}
