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
    handle: {
      text: "OK",
      click: () => console.log("e"),
    },
  });
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>

    <button style="color: aliceblue" @click="success">success</button>
    <br />
    <br />
    <button style="color: aliceblue" @click="error">error</button>
    <br />
    <br />
    <button style="color: aliceblue" @click="info">info</button>
    <br />
    <br />
    <button style="color: aliceblue" @click="warning">warning</button>
    <br />
    <br />
  </div>

  <Toast :automatic-close="false" position="top-right" theme="pastel" :max-toasts="10" />
</template>
