<script setup lang="ts">
import { defineProps, inject } from "vue";
import { Success, Error, Info, Warning } from "./icons";

interface IToastIconProps {
  type: "success" | "error" | "info" | "warning";
}

const props = defineProps<IToastIconProps>();

const iconComponents = {
  success: Success,
  error: Error,
  info: Info,
  warning: Warning,
};

const isIconColor = inject<boolean>("isIconColor");

if (!isIconColor) {
  throw new Error("isIconColor not provided");
}
</script>

<template>
  <div>
    <component :is="iconComponents[props.type]" class="icon" :class="{ [`icon-${props.type}`]: isIconColor }" />
  </div>
</template>

<style scoped>
.icon {
  animation: show-icon 0.7s both;

  height: 19px;
  width: 19px;

  fill: var(--toastfic-icon);
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 2px;
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
</style>
