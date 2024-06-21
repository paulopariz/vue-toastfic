<script lang="ts" setup>
import { ToastTitle, ToastIcon, ToastAction } from "./index";

import { useToasts } from "./toast";
import { IProps } from "./props";
import { watchEffect, onBeforeUnmount, provide, ref } from "vue";

const { toasts, removeToast } = useToasts();

const props = withDefaults(defineProps<IProps>(), {
  close: true,
  duration: 3000,
  automaticClose: true,
  position: "top-right",
  colorful: true,
});

const activeTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

function closeAutoToasts() {
  if (!props.automaticClose) return;

  toasts.value.forEach((toast) => {
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

provide("colorful", ref(props.colorful));
</script>

<template>
  <div class="toastific-container" :class="`toastific-position-${position}`">
    <transition-group name="toastific">
      <div v-for="toast in toasts" :key="toast.id" class="toastific">
        <ToastIcon v-if="toast.type !== 'default'" :type="toast.type" />

        <ToastTitle>
          {{ toast.title }}
        </ToastTitle>

        <ToastAction @click="handleToast(toast.handle?.click, toast.id)">{{ toast.handle?.text }}</ToastAction>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toastific-container {
  position: fixed;
  overflow: hidden;
  z-index: 9999;

  overflow-y: auto;
  max-height: 50%;

  display: grid;
  gap: 10px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.toastific-position-top-right {
  top: 10px;
  right: 10px;
}

.toastific-position-top-left {
  top: 10px;
  left: 10px;
}

.toastific-position-bottom-right {
  bottom: 10px;
  right: 10px;
}

.toastific-position-bottom-left {
  bottom: 10px;
  left: 10px;
}

.toastific-position-bottom-center {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.toastific-position-top-center {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.toastific {
  border-radius: 10px;

  height: 38px;

  color: #1a1a1a;
  background-color: #fff;
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.055) !important;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 0 13px 0 10px;

  user-select: none;

  animation: show-toastific 0.2s backwards;

  position: relative;
  overflow: hidden;
}

@keyframes show-toastific {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.toastific-enter-active,
.toastific-leave-active {
  transition: all 0.3s ease;
}

.toastific-enter-from,
.toastific-leave-to {
  opacity: 0;
  height: 0;
}

.toastific-enter-to,
.toastific-leave-from {
  opacity: 1;
  height: 38px;
}
</style>
