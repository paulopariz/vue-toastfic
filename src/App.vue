<script setup lang="ts">
import { Toast, useToast } from "./components/toast";

function success() {
  useToast.success("Toast success!", {
    description: "Description toast success",
  });
}
function error() {
  useToast.error("Toast error!", {
    description: "Description toast error",
  });
}
function info() {
  useToast.info("Toast info!", {
    handle: {
      text: "OK",
      click: () => console.log("ok"),
    },
  });
}
function warning() {
  useToast.warning("Toast warning!", {
    description: "Description toast warning",
    handle: {
      text: "Yes",
      click: () => console.log("Yes"),
    },
  });
}

function defaultT() {
  useToast.default("Toast defaut!");
}
</script>

<template>
  <div>
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

  <Toast
    :duration="6500"
    position="top-right"
    :close="true"
    :colorful="true"
    theme="dark"
    :max-toasts="7"
    :progress-bar="true"
    :classes="{
      title: 'classe-title',
      description: 'classe-description',
      buttonHandle: 'classe-handle',
      buttonClose: 'classe-close',
      toast: 'classe-toast',
      toasts: {
        success: 'classe-toast-success',
        error: 'classe-toast-error',
        info: 'classe-toast-info',
        warning: 'classe-toast-warning',
        default: 'classe-toast-default',
      },
      icon: 'classe-icon',
      icons: {
        success: 'classe-icon-success',
        error: 'classe-icon-error',
        info: 'classe-icon-info',
        warning: 'classe-icon-warning',
      },
    }"
  />
</template>
