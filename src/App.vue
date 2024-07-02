<script setup lang="ts">
import { Toast, useToast } from "./components/toast";

function success() {
  useToast.success("Cadastro realizado!", {
    description: "Descrição do toast de Successaaaass",
  });
}
function error() {
  useToast.error("Ocorreu um erro", {
    description: "Lorem, ipsum dolor sit amet consers",
  });
}
function info() {
  useToast.info("Aguarde 1 minuto", {
    handle: {
      text: "Beleza",
      click: () => console.log("w"),
    },
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

    <p style="color: aliceblue; cursor: pointer" @click="success">success</p>
    <br />
    <br />
    <p style="color: aliceblue; cursor: pointer" @click="error">error</p>
    <br />
    <br />
    <p style="color: aliceblue; cursor: pointer" @click="info">info</p>
    <br />
    <br />
    <p style="color: aliceblue; cursor: pointer" @click="warning">warning</p>
    <br />
    <br />
  </div>

  <Toast :automatic-close="false" position="top-right" theme="dark" :max-toasts="10" />
</template>
