<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const sessionCode = ref('');
const playerName = ref('');
const router = useRouter();
const errorMessage = ref('');

const joinSession = async () => {
  try {
    // Check if both fields are filled
    if (!sessionCode.value || !playerName.value) {
      errorMessage.value = "Please enter both session code and player name.";
      return;
    }

    // Send request to join the session
    const response = await axios.post(`http://localhost:8080/api/sessions/${sessionCode.value}/join`, {
      playerName: playerName.value
    });

    if (response.status === 200) {
      // Redirect to the GameScreen view with the session code as a parameter
      router.push({ name: 'game', params: { sessionCode: sessionCode.value } });
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error joining session. Please check the session code and try again.';
  }
};
</script>

<template>
  <div class="join-session flex flex-col items-center justify-center h-screen space-y-4">
    <h1 class="text-2xl font-bold">Join a Session</h1>

    <input
      v-model="sessionCode"
      type="text"
      placeholder="Enter Session Code"
      class="border p-2 rounded w-64"
    />

    <input
      v-model="playerName"
      type="text"
      placeholder="Enter Your Name"
      class="border p-2 rounded w-64"
    />

    <button @click="joinSession" class="bg-blue-500 text-white p-2 rounded w-64">
      Join Game
    </button>

    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.join-session {
  max-width: 400px;
  margin: 0 auto;
}
</style>

