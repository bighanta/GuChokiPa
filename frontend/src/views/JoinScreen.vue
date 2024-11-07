<template>
  <div class="join-screen">
    <h2>Join a Session</h2>
    <input v-model="sessionCode" placeholder="Enter session code" />
    <button @click="joinSession">Join</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';

// Reactive state
const sessionCode = ref('');
const errorMessage = ref('');
const socket = ref(null);
const router = useRouter();

// Method to join the session
const joinSession = async () => {
  try {
    // Connect to the backend via WebSocket
    socket.value = io('http://localhost:8080'); // Update URL if different
    socket.value.emit('joinSession', sessionCode.value);

    // Attempt to join session via API
    const response = await fetch(`http://localhost:8080/api/sessions/${sessionCode.value}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName: 'Player2' }),
    });

    const result = await response.json();
    if (result.success) {
      // Navigate to waiting screen if join was successful
      router.push({ name: 'WaitingScreen', params: { sessionCode: sessionCode.value } });
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    console.error('Error joining session:', error);
    errorMessage.value = 'Failed to join session. Please try again.';
  }
};
</script>

<style scoped>
.join-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error {
  color: red;
}
</style>

