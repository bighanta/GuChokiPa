<template>
  <div class="join-screen flex flex-col items-center justify-center bg-gray-900 min-h-screen text-center text-gray-200 p-6">
    <!-- Heading -->
    <h2 class="text-2xl font-bold mb-6 text-white">Join a Session</h2>

    <!-- Player Name Input -->
    <input
      v-model="playerName"
      placeholder="Enter your name"
      class="w-3/4 md:w-1/2 p-3 mb-4 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 bg-gray-800"
    />

    <!-- Session Code Input -->
    <input 
      v-model="sessionCode" 
      placeholder="Enter session code" 
      class="w-3/4 md:w-1/2 p-3 mb-4 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 bg-gray-800"
    />
    
    <!-- Join Button -->
    <button 
      @click="joinSession" 
      class="w-3/4 md:w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
    >
      Join
    </button>
    
    <!-- Error Message -->
    <p v-if="errorMessage" class="mt-4 text-red-500 font-semibold">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';

// Reactive state
const sessionCode = ref('');
const playerName = ref(''); // For storing player's name
const errorMessage = ref('');
const socket = ref(null);
const router = useRouter();
console.log("Join", playerName);
const joinSession = async () => {
  if (!playerName.value || !sessionCode.value) {
    errorMessage.value = 'Please enter both player name and session code.';
    return;
  }

  try {
    socket.value = io('http://localhost:8080');
    socket.value.emit('joinSession', { sessionCode: sessionCode.value, playerName: playerName.value });

    const response = await fetch(`http://localhost:8080/api/sessions/${sessionCode.value}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName: playerName.value }),
    });

    const result = await response.json();
    if (result.success) {
      // Pass playerName as query param here
      router.push({ name: 'WaitingScreen', params: { sessionCode: sessionCode.value }, query: { playerName: playerName.value } });
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

