<script setup lang="ts">
import { Success, Error, Info, Warning } from "./icons";
import { inject } from "vue";

interface IToastIconProps {
  type: "success" | "error" | "info" | "warning";
}

type TTheme = "light" | "dark" | "pastel";

const props = defineProps<IToastIconProps>();

const iconComponents = {
  success: Success,
  error: Error,
  info: Info,
  warning: Warning,
};

const isIconColor = inject<boolean>("isIconColor");
const theme = inject<TTheme>("currentTheme");

if (!isIconColor) {
  throw new Error("isIconColor not provided");
}
if (!theme) {
  throw new Error("theme not provided");
}
</script>

<template>
  <component
    :is="iconComponents[props.type]"
    class="icon"
    :class="{ [`icon-${$props.type}`]: isIconColor || theme === 'pastel' }"
  />
</template>

<style scoped>
.icon {
  animation: show-icon 0.7s both;

  height: 22px;
  width: 22px;

  fill: var(--toastfic-icon);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-success {
  fill: var(--toastfic-success-icon);
}
.icon-error {
  fill: var(--toastfic-error-icon);
}
.icon-info {
  fill: var(--toastfic-info-icon);
}
.icon-warning {
  fill: var(--toastfic-warning-icon);
}

@keyframes show-icon {
  0% {
    transform: scale(0.7);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
</style>
