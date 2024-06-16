import { ref } from "vue";
import { IToastOptions, IToast, IToastType } from "./props";

const toasts = ref<IToast[]>([]);

let toastId = 0;

export function addToast(title: string, type: IToastType = "info", options: IToastOptions = {}) {
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
