<template>
  <div class="home">
    <h1>Schnick, Schnack, Schnuck</h1>
    <button @click="createSession">Create Session</button>
    <button @click="$router.push('/join')">Join Session</button>

    <table style="width: 80%; margin-top: 2rem;">
      <tr style="background-color: darkslategrey; color: white;">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Reactive state
const scores = ref([]);
const router = useRouter();

// Methods
const createSession = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/sessions/create', { playerName: 'Player1' });
    const sessionCode = response.data.code;
    router.push({ path: `/waiting/${sessionCode}`, query: { isHost: true } });
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Could not create session. Please try again.');
  }
};

// Fetch scores when the component is mounted
onMounted(async () => {
  await fetchScores();
});

const fetchScores = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/scores?limit=10");
    scores.value = response.data;
  } catch (error) {
    console.error("Error fetching scores:", error);
  }
};
</script>

<style scoped>
/* Add some basic styling */
</style>

