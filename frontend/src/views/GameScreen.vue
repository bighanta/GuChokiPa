<template>
  <div class="game flex flex-col items-center justify-center bg-gray-900 min-h-screen text-center text-gray-200 p-6">
    <!-- Game Title -->
    <h2 class="text-2xl font-bold mb-4 text-white">Game Screen</h2>

    <!-- Session and Scores -->
    <p class="text-lg mb-2">
      Session Code: <span class="font-semibold">{{ sessionCode }}</span>
    </p>
    
    <!-- Player Names and Scores -->
    <p class="text-lg mb-2">
      <span class="font-semibold">{{ playerName }}</span>: <span class="font-semibold">{{ playerScore }}</span>
    </p>
    <p class="text-lg mb-6">
      <span class="font-semibold">{{ opponentName }}</span>: <span class="font-semibold">{{ opponentScore }}</span>
    </p>

    <!-- Choices for Player -->
    <div v-if="!roundResult && !gameOverMessage" class="flex space-x-4">
      <button 
        @click="makeMove('rock')" 
        :disabled="moveMade"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        Rock
      </button>
      <button 
        @click="makeMove('paper')" 
        :disabled="moveMade"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        Paper
      </button>
      <button 
        @click="makeMove('scissors')" 
        :disabled="moveMade"
        class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
        Scissors
      </button>
    </div>

    <!-- Round Result and Next Round Button -->
    <div v-if="roundResult && !gameOverMessage" class="mt-6">
      <p class="text-xl font-semibold text-yellow-400 mb-4">Round Result: {{ roundResult }}</p>
      <button 
        @click="nextRound" 
        class="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transform transition hover:scale-105">
        Next Round
      </button>
    </div>

    <!-- Game Over Message -->
    <div v-if="gameOverMessage" class="mt-6">
      <p class="text-2xl font-bold text-yellow-500">{{ gameOverMessage }}</p>
      <p class="text-gray-400 mt-2">You will be redirected shortly...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { io } from 'socket.io-client';
import { useRoute, useRouter } from 'vue-router';

const sessionCode = useRoute().params.sessionCode;
const playerName = useRoute().query.playerName; // Player name from query params
const opponentName = ref(''); // To hold the opponent's name
const playerScore = ref(0);
const opponentScore = ref(0);
const roundResult = ref(null);
const moveMade = ref(false);
const gameOverMessage = ref(""); // Display winner message
const socket = ref(null);
const router = useRouter(); // Use router for navigation
console.log("Game", playerName);
onMounted(() => {
  socket.value = io("http://localhost:8080");

  socket.value.emit("joinGame", { sessionCode, playerName });

  socket.value.on("gameStart", ({ player1Name, player2Name }) => {
    if (playerName === player1Name) {
      opponentName.value = player2Name;
    } else {
      opponentName.value = player1Name;
    }
  });

  socket.value.on("roundOutcome", ({ result, playerScore: newPlayerScore, opponentScore: newOpponentScore }) => {
    roundResult.value = result;
    playerScore.value = newPlayerScore;
    opponentScore.value = newOpponentScore;
    moveMade.value = false;
  });

  socket.value.on("gameOver", (winnerName) => {
    gameOverMessage.value = `${winnerName.winner} won the game!`;
    sendFinalScore(winnerName.winner, playerName);
  });
});

onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

const makeMove = (move) => {
  if (!moveMade.value) {
    socket.value.emit("playerMove", { move, sessionCode });
    moveMade.value = true;
  }
};

const nextRound = () => {
  roundResult.value = null; // Clear the round result for the next round
};

// Function to calculate the score difference, send to API, and redirect
const sendFinalScore = async (winnerName, sessionPlayerName) => {
  // Only send the score if the winning player is the session player
  if (winnerName !== sessionPlayerName) {
    console.log("Winner is not the session player, score not sent.");
  } else {

    const scoreDifference = Math.abs(playerScore.value - opponentScore.value);

    try {
      // Send the score to the server
      await fetch("http://localhost:8080/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_name: winnerName,
          score: scoreDifference,
        }),
      });
      console.log("Score sent successfully!");

    } catch (error) {
      console.error("Error sending score:", error);
    }
  }
    setTimeout(() => {
      router.push('/');
    }, 3000); // Delay of 3 seconds for the player to see the message
};
</script>
