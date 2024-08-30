export interface IProps {
  close?: boolean;
  automaticClose?: boolean;
  duration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  colorful?: boolean;
  maxToasts?: number;
  theme?: "light" | "dark";
  progressBar?: boolean;
  classes: {
    toast?: string;
    toasts?: {
      success?: string;
      error?: string;
      info?: string;
      warning?: string;
      default?: string;
    };
    title?: string;
    description?: string;
    buttonHandle?: string;
    buttonClose?: string;
    icon?: string;
    icons?: {
      success?: string;
      error?: string;
      info?: string;
      warning?: string;
    };
  };
}

export type IToastType = "success" | "error" | "info" | "warning" | "default";

export interface IToastOptions {
  duration?: number;
  description?: string;
  handle?: {
    text: string;
    click: () => void;
  };
}

export interface IToast {
  id: number;
  title: string;
  type: IToastType;
  duration?: number;
  description?: string;
  handle?: {
    text: string;
    click: () => void;
  };
}
