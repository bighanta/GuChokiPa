<!-- src/views/GameScreen.vue -->
<template>
  <div>
    <h2 class="text-2xl">Game Session: {{ sessionId }}</h2>
    <p id="result" v-if="result">{{ result }}</p>
    <p>Player 1 Score: {{ player1Score }}</p>
    <p>Player 2 Score: {{ player2Score }}</p>

    <div v-if="!gameEnded">
      <h3 class="mt-4">Choose your option:</h3>
      <button @click="makeChoice('rock')" class="bg-blue-500 text-white px-4 py-2 rounded">Rock</button>
      <button @click="makeChoice('paper')" class="bg-blue-500 text-white px-4 py-2 rounded">Paper</button>
      <button @click="makeChoice('scissors')" class="bg-blue-500 text-white px-4 py-2 rounded">Scissors</button>
    </div>

    <div v-if="gameEnded">
      <h3 class="text-2xl">{{ winner }} Wins!</h3>
      <button @click="resetGame" class="bg-green-500 text-white px-4 py-2 rounded">Play Again</button>
      <button @click="leaveSession" class="bg-red-500 text-white px-4 py-2 rounded mt-4">Leave Session</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const sessionId = route.query.sessionId;

const player1Score = ref(0);
const player2Score = ref(0);
const result = ref('');
const gameEnded = ref(false);
const winner = ref('');

const maxScore = 3;

onMounted(() => {
  // Initialize game logic or fetch initial data if necessary
});

const makeChoice = async (choice) => {
  try {
    // Send player's choice to the backend
    const response = await axios.post(`http://localhost:8080/api/games/${sessionId}`, { player_id: 1, choice });
    
    // Assume response contains the outcome of the round
    result.value = response.data.outcome; // The result from backend (e.g., "Player 1 wins this round!")
    
    // Update scores based on the backend response
    if (response.data.winner === 1) {
      player1Score.value++;
    } else if (response.data.winner === 2) {
      player2Score.value++;
    }
    
    // Check if the game has ended
    checkGameEnd();
  } catch (error) {
    console.error("Error making choice:", error);
  }
};

const checkGameEnd = () => {
  if (player1Score.value >= maxScore) {
    winner.value = 'Player 1';
    gameEnded.value = true;
  } else if (player2Score.value >= maxScore) {
    winner.value = 'Player 2';
    gameEnded.value = true;
  }
};

const resetGame = () => {
  player1Score.value = 0;
  player2Score.value = 0;
  result.value = '';
  gameEnded.value = false;
  winner.value = '';
};

const leaveSession = () => {
  // Logic to leave the session
  router.push('/'); // Redirect to home
};
</script>

<style scoped>
/* Add any additional styles here */
</style>

