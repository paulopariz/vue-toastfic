<template>
  <h1>
    <slot />
  </h1>
</template>

<style scoped>
h1 {
  font-size: 14px;
  font-weight: 700;
  color: var(--toastfic-text);

  margin-top: 2px;

  white-space: nowrap;
  max-width: 230px;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 600px) {
  h1 {
    max-width: 85%;
  }
}
</style>
