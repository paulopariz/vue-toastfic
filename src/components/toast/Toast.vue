<script lang="ts" setup>
import { Success, Error, Info, Warning, Close } from "./icons";
import { useToasts } from "./toast";
import { IProps } from "./props";
import { onBeforeUnmount, watchEffect } from "vue";

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
  <div class="toast-container" :class="`toast-postion-${position}`">
    <transition-group name="toast-transition">
      <div
        v-for="toast in toasts"
        :id="'toast-' + toast.id"
        :key="toast.id"
        :class="['gr-toast', `gr-toast-${toast.type}`]"
      >
        <div v-if="toast.type !== 'default'" class="icon">
          <Success v-if="toast.type === 'success'" />
          <Error v-if="toast.type === 'error'" />
          <Info v-if="toast.type === 'info'" />
          <Warning v-if="toast.type === 'warning'" />
        </div>

        <button v-if="props.close" @click.stop="removeToast(toast.id)">
          <Close />
        </button>

        <section>
          <p>
            {{ toast.title }}
          </p>
          <span v-if="toast.description">{{ toast.description }}</span>
        </section>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;

  z-index: 9999;

  max-height: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-postion-top-right {
  top: 10px;
  right: 10px;
}

.toast-postion-top-left {
  top: 10px;
  left: 10px;
}

.toast-postion-bottom-right {
  bottom: 10px;
  right: 10px;
}

.toast-postion-bottom-left {
  bottom: 10px;
  left: 10px;
}

.toast-postion-bottom-center {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.toast-postion-top-center {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.gr-toast {
  padding: 4px;
  border-radius: 20px;
  color: #ffffff;
  background-color: #1a1a1a;
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.055) !important;
  width: 290px;
  display: flex;
  align-items: start;
  gap: 3px;
  user-select: none;
  animation: show-toast 0.2s backwards;
  position: relative;
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
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: show-icon 0.7s both;
}

.icon svg {
  height: 20px;
  width: 20px;
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

/* Animação de entrada para os toasts */
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

/* Animação de saída para os toasts */
/* .toast-transition-leave-active,
.toast-transition-enter-active {
  transition: all 0.5s;
}

.toast-transition-enter-from,
.toast-transition-leave-to {
  transform: translateY(-80px);
  overflow: hidden;
} */

.fade-out {
  transition: all 0.3s;
}

/* Estilo da animação de ícone */
@keyframes fade-out {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
