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

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      sessionCode: this.$route.params.sessionCode,
      playerScore: 0,
      opponentScore: 0,
      roundResult: null,
      socket: null,
    };
  },
  mounted() {
    this.socket = io("http://localhost:8080");  // Adjust URL as needed
    this.socket.emit("joinGame", { sessionCode: this.sessionCode });

    // Listen for the round outcome
    this.socket.on("roundOutcome", ({ result, playerScore, opponentScore }) => {
      this.roundResult = result;
      this.playerScore = playerScore;
      this.opponentScore = opponentScore;
    });

    // Listen for game over
    this.socket.on("gameOver", (winner) => {
      alert(`Game Over! ${winner} won!`);
      this.$router.push('/');
    });
  },
  methods: {
    makeMove(move) {
      this.socket.emit("playerMove", { move, sessionCode: this.sessionCode });
    },
    nextRound() {
      this.roundResult = null;  // Clear round result for the next round
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>

