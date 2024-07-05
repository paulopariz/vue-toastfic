<script setup lang="ts">
const emit = defineEmits(["click"]);
</script>

<template>
  <span class="toastific-action" @click="emit('click')">
    <slot />
  </span>
</template>

<style scoped>
.toastific-action {
  font-weight: 600;
  font-size: 12px;
  color: var(--toastfic-text);

  width: min-content;

  cursor: pointer;
  text-decoration-line: underline;
}
</style>
