import { addToast } from "./toast";
import { IToastOptions } from "./props";

export const useToast = {
  info(title: string, options: IToastOptions = {}) {
    addToast(title, "info", options);
  },
  success(title: string, options: IToastOptions = {}) {
    addToast(title, "success", options);
  },
  error(title: string, options: IToastOptions = {}) {
    addToast(title, "error", options);
  },
  warning(title: string, options: IToastOptions = {}) {
    addToast(title, "warning", options);
  },
  default(title: string, options: IToastOptions = {}) {
    addToast(title, "default", options);
  },
};
