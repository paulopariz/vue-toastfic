<script setup lang="ts">
import { Toast, useToast } from "./components/toast";

function success() {
  useToast.success("Cadastro realizado!", {
    description: "Descrição do toast de Success",
  });
}
function error() {
  useToast.error("Ocorreu um erro", {
    description: "Descrição do toast de Error",
  });
}
function info() {
  useToast.info("Aguarde 1 minuto", {
    description: "Descrição do toast de Info",
  });
}
function warning() {
  useToast.warning("Ultímas chances!", {
    description: "Descrição do toast de Warning",
  });
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>

    <button @click="success">success</button>
    <br />
    <br />
    <button @click="error">error</button>
    <br />
    <br />
    <button @click="info">info</button>
    <br />
    <br />
    <button @click="warning">warning</button>
    <br />
    <br />
  </div>

  <Toast :automatic-close="false" position="top-center" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
