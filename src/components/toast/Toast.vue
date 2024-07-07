<script lang="ts" setup>
import { ToastTitle, ToastIcon, ToastAction, ToastDescription, ToastClose } from "./index";

import { useToasts } from "./toast";
import { IProps, IToastOptions, IToastType } from "./props";
import { watchEffect, onBeforeUnmount, provide, ref, computed } from "vue";

const { toasts, removeToast } = useToasts();

const props = withDefaults(
  defineProps<
    Pick<
      IProps,
      | "close"
      | "duration"
      | "automaticClose"
      | "position"
      | "colorful"
      | "maxToasts"
      | "theme"
      | "progressBar"
      | "classes"
    >
  >(),
  {
    close: true,
    duration: 4000,
    automaticClose: true,
    position: "top-right",
    colorful: true,
    maxToasts: 7,
    theme: "light",
    progressBar: true,
    classes: undefined,
  }
);

//transition do toast
const transitionName = computed(() => {
  switch (props.position) {
    case "top-center":
      return "toastfic-top-center";
    case "top-left":
      return "toastfic-top-left";
    case "top-right":
      return "toastfic-top-right";
    case "bottom-left":
      return "toastfic-bottom-left";
    case "bottom-right":
      return "toastfic-bottom-right";
    case "bottom-center":
      return "toastfic-bottom-center";
    default:
      return "toastfic";
  }
});

//limite de toasts a serem exibidos
const activeToasts = computed(() => toasts.value.slice(0, props.maxToasts));

const activeTimeouts = new Map<number, ReturnType<typeof setTimeout>>();
const progressMap = ref<Record<number, number>>({});

function closeAutoToasts() {
  if (!props.automaticClose) return;

  activeToasts.value.forEach((toast) => {
    if (toast.handle?.click) return;

    if (!activeTimeouts.has(toast.id)) {
      const toastDuration = toast.duration ?? props.duration;
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min((elapsedTime / toastDuration) * 100, 100);
        progressMap.value[toast.id] = progress;

        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);

      const timeout = setTimeout(() => {
        clearInterval(interval);
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
  let baseHeight = toast.description ? (toast.description.length < 36 ? 58 : 80) : 52;
  if (toast.handle?.click && toast.description) {
    baseHeight += 30; // aumenta 30px se existir evento de clique e descrição
  } else if (toast.handle?.click) {
    baseHeight += 20; // aumenta em 20px se existir apenas evento de clique
  }

  let offset = 0;
  for (let i = 0; i < index; i++) {
    const prevToast = activeToasts.value[i];
    let prevHeight = prevToast.description ? (prevToast.description.length < 36 ? 58 : 80) : 52;

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

//adiciona a classe no icon de acordo com o type
function getIconClass(type: IToastType) {
  if (props.classes?.icons && type) {
    if (type === "success") return props.classes.icons.success;
    if (type === "error") return props.classes.icons.error;
    if (type === "info") return props.classes.icons.info;
    if (type === "warning") return props.classes.icons.warning;
  } else {
    return props.classes?.icon || "";
  }
}

watchEffect(() => {
  closeAutoToasts();
});

onBeforeUnmount(() => {
  activeTimeouts.forEach((timeout) => clearTimeout(timeout));
});

provide("isIconColor", ref(props.colorful));
</script>

<template>
  <transition-group :name="transitionName">
    <div
      v-for="(toast, index) in activeToasts"
      :key="toast.id"
      :class="[
        `toastfic-position-${props.position}`,
        props.classes?.toast,
        { 'toastfic-description': toast.description },
      ]"
      :style="[
        getToastStyle(index, toast),
        { alignItems: !toast.description && !toast.handle?.click ? 'center' : 'flex-start' },
      ]"
      class="toastfic"
      :toastfic-theme="theme"
    >
      <ToastClose v-if="props.close" :class="props.classes?.buttonClose" @click="removeToast(toast.id)" />

      <ToastIcon
        v-if="toast.type !== 'default'"
        :class="[getIconClass(toast.type), props.classes?.icon]"
        :type="toast.type"
      />

      <section :style="{ justifyContent: !toast.description && !toast.handle?.click ? 'center' : 'space-between' }">
        <div>
          <ToastTitle :class="props.classes?.title"> {{ toast.title }} </ToastTitle>
          <ToastDescription v-if="toast.description" :class="props.classes?.description">
            {{ limitText(toast.description || "", 65) }}
          </ToastDescription>
        </div>

        <ToastAction
          v-if="toast.handle?.click"
          :class="props.classes?.buttonHandle"
          @click="handleToast(toast.handle?.click, toast.id)"
        >
          {{ toast.handle?.text }}
        </ToastAction>
      </section>

      <div
        v-if="props.progressBar"
        class="progress-bar"
        :style="[
          { width: `${progressMap[toast.id]}%` },
          {
            backgroundColor:
              toast.type !== 'default' && props.colorful
                ? `var(--toastfic-${toast.type}-icon)`
                : 'var(--toastfic-icon)',
          },
        ]"
      />
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
  box-shadow: 3px 3px 12px rgba(53, 53, 53, 0.137);

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
  height: 100%;
}

.toastfic section div {
  display: flex;
  flex-direction: column;
}

.toastfic.toastfic-description {
  height: 90px;
}

.progress-bar {
  height: 15px;
  transition: width 0.1s linear;

  position: absolute;
  bottom: 0;
  left: 0;

  border-radius: 5px;
  background-color: var(--toastfic-success-icon);

  height: 3px;
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
.toastfic-top-leave-active,
.toastfic-top-center-enter-active,
.toastfic-top-center-leave-active,
.toastfic-bottom-center-enter-active,
.toastfic-bottom-center-leave-active,
.toastfic-top-left-enter-active,
.toastfic-top-left-leave-active,
.toastfic-top-right-enter-active,
.toastfic-top-right-leave-active,
.toastfic-bottom-left-enter-active,
.toastfic-bottom-left-leave-active,
.toastfic-bottom-right-enter-active,
.toastfic-bottom-right-leave-active {
  transition: all 0.5s ease;
}

.toastfic-bottom-enter-from,
.toastfic-bottom-leave-to,
.toastfic-top-enter-from,
.toastfic-top-leave-to,
.toastfic-top-center-enter-from,
.toastfic-top-center-leave-to,
.toastfic-bottom-center-enter-from,
.toastfic-bottom-center-leave-to,
.toastfic-top-left-enter-from,
.toastfic-top-left-leave-to,
.toastfic-top-right-enter-from,
.toastfic-top-right-leave-to,
.toastfic-bottom-left-enter-from,
.toastfic-bottom-left-leave-to,
.toastfic-bottom-right-enter-from,
.toastfic-bottom-right-leave-to {
  opacity: 0;
  z-index: -1 !important;
}

.toastfic-bottom-enter-to,
.toastfic-bottom-leave-from,
.toastfic-top-enter-to,
.toastfic-top-leave-from,
.toastfic-top-center-enter-to,
.toastfic-top-center-leave-from,
.toastfic-bottom-center-enter-to,
.toastfic-bottom-center-leave-from,
.toastfic-top-left-enter-to,
.toastfic-top-left-leave-from,
.toastfic-top-right-enter-to,
.toastfic-top-right-leave-from,
.toastfic-bottom-left-enter-to,
.toastfic-bottom-left-leave-from,
.toastfic-bottom-right-enter-to,
.toastfic-bottom-right-leave-from {
  opacity: 1;
}

.toastfic-bottom-enter-from {
  transform: translateY(100%) !important;
}

.toastfic-bottom-leave-to {
  transform: translateY(-100%) !important;
}

.toastfic-top-enter-from {
  transform: translateY(-100%) !important;
}

.toastfic-top-leave-to {
  transform: translateY(100%) !important;
}

.toastfic-top-center-enter-from {
  transform: translate(-50%, -100%) !important;
}

.toastfic-top-center-leave-to {
  transform: translate(-50%, -100%) !important;
}
.toastfic-bottom-center-leave-to {
  transform: translate(-50%, 100%) !important;
}
.toastfic-bottom-center-enter-from {
  transform: translate(-50%, 100%) !important;
}

.toastfic-top-left-enter-from {
  transform: translateY(-100%) !important;
}

.toastfic-top-left-leave-to {
  transform: translateY(-100%) !important;
}

.toastfic-top-right-enter-from {
  transform: translateY(-100%) !important;
}

.toastfic-top-right-leave-to {
  transform: translateY(-100%) !important;
}

.toastfic-bottom-left-enter-from {
  transform: translateY(100%) !important;
}

.toastfic-bottom-left-leave-to {
  transform: translateY(100%) !important;
}

.toastfic-bottom-right-enter-from {
  transform: translateY(100%) !important;
}

.toastfic-bottom-right-leave-to {
  transform: translateY(100%) !important;
}

@media (max-width: 600px) {
  .toastfic-bottom-enter-from,
  .toastfic-bottom-leave-to,
  .toastfic-top-enter-from,
  .toastfic-top-leave-to,
  .toastfic-top-center-enter-from,
  .toastfic-top-center-leave-to,
  .toastfic-top-left-enter-from,
  .toastfic-top-left-leave-to,
  .toastfic-top-right-enter-from,
  .toastfic-top-right-leave-to,
  .toastfic-bottom-left-leave-to {
    transform: translate(-50%, -100%) scale(0.9) !important;
  }

  .toastfic-bottom-left-enter-from,
  .toastfic-bottom-right-enter-from,
  .toastfic-bottom-left-leave-to,
  .toastfic-bottom-right-leave-to {
    transform: translate(-50%, 100%) scale(0.9) !important;
  }

  .toastfic-bottom-enter-to,
  .toastfic-bottom-leave-from,
  .toastfic-top-enter-to,
  .toastfic-top-leave-from,
  .toastfic-top-center-enter-to,
  .toastfic-top-center-leave-from,
  .toastfic-bottom-center-enter-to,
  .toastfic-bottom-center-leave-from,
  .toastfic-top-left-enter-to,
  .toastfic-top-left-leave-from,
  .toastfic-top-right-enter-to,
  .toastfic-top-right-leave-from,
  .toastfic-bottom-left-enter-to,
  .toastfic-bottom-left-leave-from,
  .toastfic-bottom-right-enter-to,
  .toastfic-bottom-right-leave-from {
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
