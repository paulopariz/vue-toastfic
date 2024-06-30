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
    baseHeight += 30; //aumenta 30px se existir evento de clique e descrição
  } else if (toast.handle?.click) {
    baseHeight += 20; //aumenta em 20px se existir apenas evento de clique
  }

  let top = 0;
  for (let i = 0; i < index; i++) {
    const prevToast = activeToasts.value[i];
    let prevHeight = prevToast.description ? (prevToast.description.length < 36 ? 58 : 80) : 38;
    if (prevToast.handle?.click && prevToast.description) {
      prevHeight += 30;
    } else if (prevToast.handle?.click) {
      prevHeight += 20;
    }
    top += prevHeight + 10; //margem entre os toasts
  }

  return {
    top: `${top}px`,
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
  <transition-group name="toastfic">
    <div
      v-for="(toast, index) in activeToasts"
      :key="toast.id"
      :class="[`toastfic-position-${position}`, { 'toastific-description': toast.description }]"
      :style="[
        getToastStyle(index, toast),
        { alignItems: !toast.description && !toast.handle?.click ? 'center' : 'flex-start' },
      ]"
      class="toastfic"
      :toastfic-theme="theme"
    >
      <ToastClose />

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

<style scoped lang="scss">
.toastfic {
  border-radius: 10px;

  width: 300px;
  height: min-content;

  background-color: var(--toastfic-bg);
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.055) !important;

  padding: 10px;
  margin-top: 10px;

  user-select: none;

  animation: show-toastfic 0.5s ease;
  transition: all 0.5s ease;

  position: absolute;
  // overflow: hidden;

  display: flex;
  gap: 10px;

  section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    max-width: 235px;
    height: 100%;

    div {
      display: flex;
      flex-direction: column;
    }
  }

  &.toastific-description {
    height: 90px;
  }

  &.toastfic-position-top-right {
    top: 10px;
    right: 10px;
  }

  &.toastfic-position-top-left {
    top: 10px;
    left: 10px;
  }

  &.toastfic-position-bottom-right {
    bottom: 10px;
    right: 10px;
  }

  &.toastfic-position-bottom-left {
    bottom: 10px;
    left: 10px;
  }

  &.toastfic-position-bottom-center {
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  &.toastfic-position-top-center {
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }

  @keyframes show-toastfic {
    0% {
      opacity: 0;
      transform: translateY(-100%) scale(0.9);
    }
    100% {
      opacity: 1;
      transform: translateY(1) scale(1);
    }
  }
}

.toastfic-enter-active,
.toastfic-leave-active {
  transition: all 0.5s ease;
}

.toastfic-enter-from,
.toastfic-leave-to {
  opacity: 0;
}

.toastfic-enter-to,
.toastfic-leave-from {
  opacity: 1;
}
</style>
