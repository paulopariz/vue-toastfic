<template>
  <span>
    <slot />
  </span>
</template>

<style scoped>
span {
  font-size: 14px;
  font-weight: 400;
  color: var(--toastfic-text);
  opacity: 0.8;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
