export interface IProps {
  close?: boolean;
  automaticClose?: boolean;
  duration?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
  colorful?: boolean;
}

export type IToastType = "success" | "error" | "info" | "warning" | "default";

export interface IToastOptions {
  duration?: number;
  description?: string;
}
export interface IToast {
  id: number;
  title: string;
  type: IToastType;
  duration?: number;
  description?: string;
}
