<!-- src/views/Results.vue -->
<template>
  <div style="width: 80%">
    <h1 class="text-2xl font-bold">Game Over!</h1>
    <p v-if="winner">The winner is: {{ winner }}</p>
    <table style="width: 100%">
      <tr style="background-color: darkslategrey">
        <th>Platz</th>
        <th>Punkte</th>
        <th>Spieler</th>
      </tr>
      <tr v-for="(score, index) in scores" :key="score.id">
        <th style="background-color: gold;">{{ index + 1 }}</th>
        <td>{{ score.score }}</td>
        <td>{{ score.player_name }}</td>
      </tr>
    </table>
    <button @click="goHome" class="mt-5 bg-blue-500 text-white px-4 py-2 rounded">Back to Home</button>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const scores = ref([]);
const winner = ref('');

onMounted(async () => {
  await fetchScores();
  determineWinner();
});

const fetchScores = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/scores?limit=10"); // Ensure your backend supports limiting
    scores.value = response.data;
  } catch (error) {
    console.error("Error fetching scores:", error);
  }
};

const determineWinner = () => {
  // You may want to pass the winner's name from the previous component through router params or state
  // For example:
  // winner.value = router.currentRoute.value.params.winnerName || 'Player 1'; // Modify accordingly
};

const goHome = () => {
  router.push({ name: 'home' }); // Navigate back to the home screen
};
</script>

<style scoped>
/* Add any additional styles here */
</style>

