<script setup lang="ts">
import { Toast, useToast } from "./components/toast";

function success() {
  useToast.success("Cadastro realizado!", {
    description: "Descrição do toast de Successaaaass s s s",
  });
}
function error() {
  useToast.error("Ocorreu um erro", {
    description: "Lorem, ipsum dolor sit amet conseraaaaa aaaaaaaa aa aa a aaaaaaaaaa aa aaaa aaaaaaaaaaaaaaaaas",
    handle: {
      text: "Beleza",
      click: () => console.log("w"),
    },
  });
}
function info() {
  useToast.info("Aguarde 1 minuto para atualizar o seu dados cadastrados", {
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

function defaultT() {
  useToast.default("Aguarde 1 minutoewqeqweqwsdfsdfsdf dwqdqwdwdqwdqwdqwdddddddddddddddddddddddddddw qwewe", {
    description: "Descrição do toast de Warning",
    handle: {
      text: "Beleza",
      click: () => console.log("w"),
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
    <p style="color: aliceblue; cursor: pointer" @click="defaultT">default</p>
  </div>

  <Toast :automatic-close="false" position="bottom-center" :close="true" theme="dark" :max-toasts="10" />
</template>
