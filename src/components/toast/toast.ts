import { ref } from "vue";
import { IToastOptions, IToast, IToastType } from "./props";

const toasts = ref<IToast[]>([]);

let toastId = 0;

export function addToast(title: string, type: IToastType = "info", options: IToastOptions = {}) {
  const { duration, description, handle } = options;
  toasts.value.unshift({ id: toastId++, title, type, duration, description, handle });
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
