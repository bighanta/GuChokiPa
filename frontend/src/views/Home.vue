<template>
  <div class="home flex flex-col items-center bg-gray-900 min-h-screen py-8">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-white mb-6">Schnick, Schnack, Schnuck</h1>
    
    <div class="mb-6">
      <input 
        v-model="playerName" 
        type="text" 
        placeholder="Enter your player name"
        class="bg-gray-800 text-white p-2 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        @click="createSession" 
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold ml-2 py-2 px-4 rounded-lg focus:outline-none transform transition hover:scale-105">
        Create Session
      </button>
    </div>
      <div>
      <button 
        @click="$router.push('/join')" 
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transform transition hover:scale-105">
        Join Session
      </button>
    </div>

    <table class="w-4/5 mt-8 text-center text-gray-200">
      <thead>
        <tr class="bg-gray-700">
          <th class="px-4 py-2">Platz</th>
          <th class="px-4 py-2">Punkte</th>
          <th class="px-4 py-2">Spieler</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(score, index) in scores" 
          :key="score.id" 
          class="border-b border-gray-700 even:bg-gray-800">
          <th class="bg-yellow-500 text-gray-900 px-4 py-2">{{ index + 1 }}</th>
          <td class="px-4 py-2">{{ score.score }}</td>
          <td class="px-4 py-2">{{ score.player_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Reactive state
const scores = ref([]);
const playerName = ref('');
const router = useRouter();

const createSession = async () => {
  if (!playerName.value) {
    alert("Please enter a player name.");
    return;
  }

  try {
    const response = await axios.post('http://localhost:8080/api/sessions/create', { playerName: playerName.value });
    const sessionCode = response.data.code;
    // Pass the player name as part of the URL query params when navigating
    router.push({ path: `/waiting/${sessionCode}`, query: { playerName: playerName.value } });
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Could not create session. Please try again.');
  }
};

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

