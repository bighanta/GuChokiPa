<!-- src/views/JoinSession.vue -->
<template>
  <div>
    <h1>Join a Session</h1>
    <input type="text" v-model="sessionId" placeholder="Enter session ID" class="mt-4 mb-4 p-2 border border-gray-300 rounded" />
    <input type="text" v-model="playerName" placeholder="Enter your name" class="mt-4 mb-4 p-2 border border-gray-300 rounded" />
    <button @click="joinSession" class="bg-blue-500 text-white px-4 py-2 rounded">Join Session</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const sessionId = ref('');
const playerName = ref('');

const joinSession = async () => {
  try {
    const response = await axios.post(`http://localhost:8080/api/sessions/${sessionId.value}/join`, { player_name: playerName.value });
    if (response.data.success) {
      // Navigate to the GameScreen with the session ID
      router.push({ name: 'game', query: { sessionId: sessionId.value } });
    }
  } catch (error) {
    console.error("Error joining session:", error);
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>

