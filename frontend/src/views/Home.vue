<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-4xl mb-4">Schnick, Schnack, Schnuck</h1>
    <input
      v-model="playerName"
      type="text"
      placeholder="Enter your name"
      class="mb-4 p-2 border border-gray-300 rounded"
    />
    <button @click="createSession" class="bg-green-500 text-white px-4 py-2 rounded mb-4">
      Create Session
    </button>
    <router-link to="/join" class="text-blue-500">Join Session</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const playerName = ref('');

const createSession = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/sessions', {
      playerName: playerName.value,
    });

    // Assuming the response contains a session code
    const sessionCode = response.data.code;

    // Navigate to the waiting screen with the session code
    router.push({ 
      name: 'waiting', 
      query: { sessionCode } 
    });
  } catch (error) {
    console.error('Error creating session:', error);
  }
};
</script>

<style scoped>
/* Add any styles you need here */
</style>

