<script setup lang="ts">
const emit = defineEmits(["click"]);
</script>

<template>
  <span class="action-toastific" @click="emit('click')">
    <slot />
  </span>
</template>

<style scoped>
.action-toastific {
  margin-left: 90px;

  font-weight: 600;
  font-size: 12px;

  cursor: pointer;
  text-decoration-line: underline;
}
</style>
