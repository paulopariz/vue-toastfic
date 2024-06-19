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

        <!-- <button v-if="props.close" @click.stop="removeToast(toast.id)">
          <Close />
        </button> -->

        <ToastTitle>
          {{ toast.title }}
        </ToastTitle>

        <ToastAction @click="toast.handle?.click">{{ toast.handle?.text }}</ToastAction>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toastific-container {
  position: fixed;
  overflow: hidden;
  z-index: 9999;

  max-height: 50%;

  display: flex;
  flex-direction: column;
  gap: 10px;
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

  color: #1a1a1a;
  background-color: #fff;
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.055) !important;

  min-height: 38px;

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
    transform: translateY(-50px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.toastific-leave-active {
  transition: all 0.3s;
}
.toastific-leave-to {
  height: 0;
  opacity: 0.5;

  transform: translateY(-100%);
}
</style>
