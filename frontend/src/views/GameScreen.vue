<template>
  <div class="game">
    <h2>Game Screen</h2>
    <p>Session Code: {{ sessionCode }}</p>
    <p>Your Score: {{ playerScore }}</p>
    <p>Opponent Score: {{ opponentScore }}</p>

    <div v-if="!roundResult">
      <button @click="makeMove('rock')">Rock</button>
      <button @click="makeMove('paper')">Paper</button>
      <button @click="makeMove('scissors')">Scissors</button>
    </div>

    <div v-else>
      <p>Round Result: {{ roundResult }}</p>
      <button @click="nextRound">Next Round</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';
import { useRoute, useRouter } from 'vue-router';

// Reactive state
const sessionCode = useRoute().params.sessionCode;
const playerScore = ref(0);
const opponentScore = ref(0);
const roundResult = ref(null);
const socket = ref(null);

// Setup socket connection and event listeners
onMounted(() => {
  // Initialize the socket connection
  socket.value = io("http://localhost:8080");

  // Join the game session
  socket.value.emit("joinGame", { sessionCode });

  // Listen for the round outcome
  socket.value.on("roundOutcome", ({ result, playerScore: newPlayerScore, opponentScore: newOpponentScore }) => {
    roundResult.value = result;
    playerScore.value = newPlayerScore;
    opponentScore.value = newOpponentScore;
  });

  // Listen for game over
  socket.value.on("gameOver", (winner) => {
    alert(`Game Over! ${winner} won!`);
    useRouter().push('/'); // Redirect to the home page
  });
});

// Cleanup socket connection before the component is destroyed
onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

// Methods
const makeMove = (move) => {
  socket.value.emit("playerMove", { move, sessionCode });
};

const nextRound = () => {
  roundResult.value = null; // Clear the round result for the next round
};
</script>

<style scoped>
/* Add your styles here */
</style>

