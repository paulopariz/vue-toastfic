<script lang="ts" setup>
import { ToastTitle, ToastIcon, ToastAction } from "./index";

import { useToasts } from "./toast";
import { IProps } from "./props";
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
      :class="[`toastfic-position-${position}`, { [`toastfic-${toast.type}`]: theme === 'pastel' }]"
      :style="{ top: `${index * 48}px` }"
      class="toastfic"
      :toastfic-theme="theme"
    >
      <div class="toastfic-header">
        <ToastIcon v-if="toast.type !== 'default'" :type="toast.type" />

        <ToastTitle>
          {{ toast.title }}
        </ToastTitle>
      </div>

      <ToastAction @click="handleToast(toast.handle?.click, toast.id)">{{ toast.handle?.text }}</ToastAction>
    </div>
  </transition-group>
</template>

<style scoped>
.toastfic {
  border-radius: 999px;

  height: 38px;
  width: 300px;

  background-color: var(--toastfic-bg);
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.055) !important;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 0 13px 0 10px;
  margin-top: 10px;

  user-select: none;

  animation: show-toastfic 0.5s ease;
  transition: all 0.5s ease;

  position: absolute;
  overflow: hidden;
}

.toastfic-success {
  color: var(--toastfic-success-text);
  background-color: var(--toastfic-success-bg);
}
.toastfic-error {
  color: var(--toastfic-error-text);
  background-color: var(--toastfic-error-bg);
}
.toastfic-info {
  color: var(--toastfic-info-text);
  background-color: var(--toastfic-info-bg);
}
.toastfic-warning {
  color: var(--toastfic-warning-text);
  background-color: var(--toastfic-warning-bg);
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

.toastfic-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toastfic-position-top-right {
  top: 10px;
  right: 10px;
}

.toastfic-position-top-left {
  top: 10px;
  left: 10px;
}

.toastfic-position-bottom-right {
  bottom: 10px;
  right: 10px;
}

.toastfic-position-bottom-left {
  bottom: 10px;
  left: 10px;
}

.toastfic-position-bottom-center {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.toastfic-position-top-center {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
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
