<script setup>
import { defineComponent } from "vue";
import { RouterView } from "vue-router"; // Import RouterView for rendering routed components
import Game from "./components/Game.vue";
import Start from "./components/Start.vue";
import { provide, ref } from "vue";

let sessionState = ref(false);
</script>

<template>
  <head>
    <title>GuChokiPa</title>
  </head>

  <body class="flex flex-col" style="width: 100%">
    <h1 class="mb-2">GuChokiPa</h1>
    <h3 class="mb-6">Schnick, Schnack, Schnuck</h3>
    <Start v-if="!sessionState"></Start>
    <Game
      style="width: 90%"
      v-if="sessionState"
      :sessionState="sessionState"
    ></Game>
    <button @click="sessionState = !sessionState">Switch into session</button>
  </body>
</template>

<style scoped></style>
