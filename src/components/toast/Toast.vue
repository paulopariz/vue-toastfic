<script lang="ts" setup>
import { ToastTitle, ToastIcon, ToastAction, ToastDescription, ToastClose } from "./index";

import { useToasts } from "./toast";
import { IProps, IToastOptions } from "./props";
import { watchEffect, onBeforeUnmount, provide, ref, computed } from "vue";

const { toasts, removeToast } = useToasts();

const props = withDefaults(defineProps<IProps>(), {
  close: true,
  duration: 4000,
  automaticClose: true,
  position: "top-right",
  colorIcon: true,
  maxToasts: 7,
  theme: "light",
});

//limite de toasts a serem exibidos
const activeToasts = computed(() => toasts.value.slice(0, props.maxToasts));

const activeTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
function closeAutoToasts() {
  if (!props.automaticClose) return;

  toasts.value.forEach((toast) => {
    // se existir evento handle o toast não irá fechar automaticamente
    if (toast.handle?.click) return;

    //fecha o toast automaticamente, com a duration das options ou da props
    if (!activeTimeouts.has(toast.id)) {
      const toastDuration = toast.duration ?? props.duration;
      const timeout = setTimeout(() => {
        removeToast(toast.id);
        activeTimeouts.delete(toast.id);
      }, toastDuration);

      activeTimeouts.set(toast.id, timeout);
    }
  });
}

//executa o evento handle das options
function handleToast(action?: () => void, id?: number) {
  if (action && id !== undefined) {
    action();
    removeToast(id);
  }
}

// define o top do toast de acordo com a sua altura
function getToastStyle(index: number, toast: IToastOptions) {
  let baseHeight = toast.description ? (toast.description.length < 36 ? 58 : 80) : 38;
  if (toast.handle?.click && toast.description) {
    baseHeight += 30; // aumenta 30px se existir evento de clique e descrição
  } else if (toast.handle?.click) {
    baseHeight += 20; // aumenta em 20px se existir apenas evento de clique
  }

  let offset = 0;
  for (let i = 0; i < index; i++) {
    const prevToast = activeToasts.value[i];
    let prevHeight = prevToast.description ? (prevToast.description.length < 36 ? 58 : 80) : 38;
    if (prevToast.handle?.click && prevToast.description) {
      prevHeight += 30;
    } else if (prevToast.handle?.click) {
      prevHeight += 20;
    }
    offset += prevHeight + 10; // margem entre os toasts
  }

  const isBottom = props.position.includes("bottom");
  return {
    [isBottom ? "bottom" : "top"]: `${offset}px`,
    height: `${baseHeight}px`,
  };
}

//limite de caracteres
function limitText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
}

watchEffect(() => {
  closeAutoToasts();
});

onBeforeUnmount(() => {
  activeTimeouts.forEach((timeout) => clearTimeout(timeout));
});

provide("isIconColor", ref(props.colorIcon));
provide("currentTheme", ref(props.theme));
</script>

<template>
  <transition-group :name="props.position.includes('bottom') ? 'toastfic-bottom' : 'toastfic-top'">
    <div
      v-for="(toast, index) in activeToasts"
      :key="toast.id"
      :class="[`toastfic-position-${props.position}`, { 'toastfic-description': toast.description }]"
      :style="[
        getToastStyle(index, toast),
        { alignItems: !toast.description && !toast.handle?.click ? 'center' : 'flex-start' },
      ]"
      class="toastfic"
      :toastfic-theme="theme"
    >
      <ToastClose v-if="props.close" @click="removeToast(toast.id)" />

      <ToastIcon v-if="toast.type !== 'default'" :type="toast.type" />

      <section>
        <div>
          <ToastTitle> {{ toast.title }} </ToastTitle>
          <ToastDescription v-if="toast.description">
            {{ limitText(toast.description || "", 65) }}
          </ToastDescription>
        </div>

        <ToastAction v-if="toast.handle?.click" @click="handleToast(toast.handle?.click, toast.id)">
          {{ toast.handle?.text }}
        </ToastAction>
      </section>
    </div>
  </transition-group>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap");

[toastfic-theme="dark"] {
  --toastfic-bg: #171b22;
  --toastfic-icon: #ffffff;
  --toastfic-text: #ffffff;

  --toastfic-success-icon: #388e3c;

  --toastfic-info-icon: #1976d2;

  --toastfic-warning-icon: #f57c00;

  --toastfic-error-icon: #d32f2f;
}

[toastfic-theme="light"] {
  --toastfic-bg: #ffffff;
  --toastfic-icon: #171b22;
  --toastfic-text: #171b22;

  --toastfic-success-icon: #388e3c;

  --toastfic-info-icon: #1976d2;

  --toastfic-warning-icon: #f57c00;

  --toastfic-error-icon: #d32f2f;
}

* {
  font-family: "Nunito", sans-serif;
  padding: 0;
  box-sizing: border-box;
  margin: 0;
}

.toastfic {
  border-radius: 10px;

  width: 300px;
  height: min-content;

  background-color: var(--toastfic-bg);
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.055);

  padding: 10px;

  user-select: none;
  transition: all 0.5s ease;

  position: fixed;
  overflow: hidden;

  display: flex;
  gap: 8px;
}

.toastfic section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.toastfic section div {
  display: flex;
  flex-direction: column;
}

.toastfic.toastfic-description {
  height: 90px;
}

.toastfic.toastfic-position-top-right {
  top: 10px;
  right: 10px;
  margin-top: 10px;
}

.toastfic.toastfic-position-top-left {
  top: 10px;
  left: 10px;
  margin-top: 10px;
}

.toastfic.toastfic-position-top-center {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 10px;
}

.toastfic.toastfic-position-bottom-right {
  bottom: 10px;
  right: 10px;
  margin-bottom: 10px;
}

.toastfic.toastfic-position-bottom-left {
  bottom: 10px;
  left: 10px;
  margin-bottom: 10px;
}

.toastfic.toastfic-position-bottom-center {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
}

@media (max-width: 600px) {
  .toastfic.toastfic-position-top-right,
  .toastfic.toastfic-position-top-left,
  .toastfic.toastfic-position-top-center {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }

  .toastfic.toastfic-position-bottom-right,
  .toastfic.toastfic-position-bottom-left,
  .toastfic.toastfic-position-bottom-center {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    right: auto;
  }
}
.toastfic-bottom-enter-active,
.toastfic-bottom-leave-active,
.toastfic-top-enter-active,
.toastfic-top-leave-active {
  transition: all 0.5s ease;
}

.toastfic-bottom-enter-from,
.toastfic-bottom-leave-to,
.toastfic-top-enter-from,
.toastfic-top-leave-to {
  opacity: 0;
  z-index: -1;
}

.toastfic-bottom-enter-to,
.toastfic-bottom-leave-from,
.toastfic-top-enter-to,
.toastfic-top-leave-from {
  opacity: 1;
}

.toastfic-bottom-enter-from,
.toastfic-bottom-leave-to {
  transform: translate(-50%, 100%) !important;
}

.toastfic-top-enter-from,
.toastfic-top-leave-to {
  transform: translateY(-100%) !important;
}

.toastfic-bottom-center-enter-from,
.toastfic-bottom-center-leave-to,
.toastfic-top-center-enter-from,
.toastfic-top-center-leave-to {
  opacity: 0;
  z-index: -1;
  transform: translate(-50%, 100%) scale(0.9) !important;
}

.toastfic-bottom-center-enter-to,
.toastfic-bottom-center-leave-from,
.toastfic-top-center-enter-to,
.toastfic-top-center-leave-from {
  opacity: 1;
  transform: translate(-50%, 0) scale(1) !important;
}

@media (max-width: 600px) {
  .toastfic-bottom-enter-from,
  .toastfic-bottom-leave-to {
    transform: translate(-50%, 100%) scale(0.9) !important;
  }

  .toastfic-bottom-enter-to,
  .toastfic-bottom-leave-from {
    transform: translate(-50%, 0) scale(1) !important;
  }

  .toastfic-top-enter-from,
  .toastfic-top-leave-to {
    transform: translate(-50%, -100%) scale(0.9) !important;
  }

  .toastfic-top-enter-to,
  .toastfic-top-leave-from {
    transform: translate(-50%, 0) scale(1) !important;
  }
}

@media (max-width: 600px) {
  .toastfic {
    width: 95%;
    left: 50%;
    transform: translateX(-50%);
  }

  .toastfic section {
    max-width: 100%;
  }
}
</style>
