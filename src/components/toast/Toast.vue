<script lang="ts" setup>
import { Success, Error, Info, Warning } from "./icons";
import { ToastTitle } from "./index";

import { useToasts } from "./toast";
import { IProps } from "./props";
import { watchEffect, onBeforeUnmount } from "vue";

const { toasts, removeToast } = useToasts();

const props = withDefaults(defineProps<IProps>(), {
  close: true,
  duration: 3000,
  automaticClose: true,
  position: "top-right",
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
</script>

<template>
  <div class="toast-container" :class="`toast-position-${position}`">
    <transition-group name="fade">
      <div v-for="toast in toasts" :key="toast.id" :class="['gr-toast', `gr-toast-${toast.type}`]">
        <div v-if="toast.type !== 'default'" class="icon">
          <Success v-if="toast.type === 'success'" />
          <Error v-if="toast.type === 'error'" />
          <Info v-if="toast.type === 'info'" />
          <Warning v-if="toast.type === 'warning'" />
        </div>

        <!-- <button v-if="props.close" @click.stop="removeToast(toast.id)">
          <Close />
        </button> -->

        <ToastTitle>
          {{ toast.title }}
        </ToastTitle>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  overflow: hidden;
  z-index: 9999;

  max-height: 50%;

  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-position-top-right {
  top: 10px;
  right: 10px;
}

.toast-position-top-left {
  top: 10px;
  left: 10px;
}

.toast-position-bottom-right {
  bottom: 10px;
  right: 10px;
}

.toast-position-bottom-left {
  bottom: 10px;
  left: 10px;
}

.toast-position-bottom-center {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-position-top-center {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.gr-toast {
  border-radius: 10px;

  color: #1a1a1a;
  background-color: #fff;
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.055) !important;

  min-height: 38px;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 0 13px 0 10px;

  user-select: none;
  animation: show-toast 0.2s backwards;

  position: relative;

  overflow: hidden;
}

.gr-toast-success {
  .icon {
  }
}

.gr-toast-error {
  .icon {
  }
}

.gr-toast-info {
  .icon {
  }
}

.gr-toast-warning {
  .icon {
  }
}

.icon {
  animation: show-icon 0.7s both;
}

.icon svg {
  height: 20px;
  width: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  outline: none;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  border: none;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
}

section {
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-wrap: break-word;
}

span {
  font-size: 12px;
  line-height: 18px;
}

@keyframes show-toast {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes show-icon {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-leave-active {
  transition: all 0.3s;
}
.fade-leave-to {
  height: 0;
  opacity: 0.5;

  transform: translateY(-100%);
}
</style>
