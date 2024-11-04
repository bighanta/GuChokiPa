<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-3xl mb-4">Waiting for Players</h1>
    <p class="text-lg mb-4">Session Code: {{ sessionCode }}</p>
    <p>Waiting for another player to join...</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionCode = ref(route.query.sessionCode); // Extract session code from query params

// Watch for changes in the route to update sessionCode if needed
watch(() => route.query.sessionCode, (newCode) => {
  sessionCode.value = newCode;
});
</script>

<style scoped>
/* Add any styles you need here */
</style>

