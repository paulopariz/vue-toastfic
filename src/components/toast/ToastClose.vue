<template>
  <button class="toastfic-close">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="var(--toastfic-icon)" viewBox="0 0 256 256">
      <path
        d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
      />
    </svg>
  </button>
</template>

<style scoped>
.toastfic-close {
  position: absolute;
  top: 6px;
  right: 4px;

  width: 18px;
  height: 18px;

  border-radius: 999px;

  opacity: 0.8;
  transition: all 0.3s;
}

.toastfic-close:hover {
  transform: scale(1.03);
  opacity: 1;
}
</style>
