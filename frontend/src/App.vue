<script setup>
import { defineComponent } from 'vue';
import { RouterView } from 'vue-router'; // Import RouterView for rendering routed components
</script>

<template>
  <head>
    <title>Schnick, Schnack, Schnuck</title>
  </head>

  <body class="flex flex-col m-8" style="width: 90%">
    <h1 class="m-8">Schnick, Schnack, Schnuck</h1>
    <RouterView class="w-full"></RouterView> <!-- Render the current route component -->
  </body>
</template>

<style scoped>
/* Add any styles for the App.vue component here if needed */
</style>

