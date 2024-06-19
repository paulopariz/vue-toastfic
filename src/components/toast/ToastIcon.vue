<script setup lang="ts">
import { Success, Error, Info, Warning } from "./icons";
import { inject } from "vue";

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

const colorful = inject<boolean>("colorful");

if (!colorful) {
  throw new Error("colorful not provided");
}
</script>

<template>
  <component :is="iconComponents[props.type]" class="icon" :class="{ [`icon-${$props.type}`]: colorful }" />
</template>

<style scoped>
.icon {
  animation: show-icon 0.7s both;

  height: 22px;
  width: 22px;

  fill: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;

  &.icon-success {
    fill: #33cc33;
  }
  &.icon-error {
    fill: #ff3333;
  }
  &.icon-info {
    fill: #3385ff;
  }
  &.icon-warning {
    fill: #ff9900;
  }
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
