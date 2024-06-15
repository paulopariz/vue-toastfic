import { ToastOptions, addToast } from "./toast";

export const useToast = {
  info(title: string, options: ToastOptions = {}) {
    addToast(title, "info", options);
  },
  success(title: string, options: ToastOptions = {}) {
    addToast(title, "success", options);
  },
  error(title: string, options: ToastOptions = {}) {
    addToast(title, "error", options);
  },
  warning(title: string, options: ToastOptions = {}) {
    addToast(title, "warning", options);
  },
  default(title: string, options: ToastOptions = {}) {
    addToast(title, "default", options);
  },
};
