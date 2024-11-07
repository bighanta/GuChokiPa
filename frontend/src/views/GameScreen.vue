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
import { io } from 'socket.io-client';

export default {
  name: 'GameScreen',
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
    this.socket = io();
    this.socket.emit('joinGame', { sessionCode: this.sessionCode });

    this.socket.on('roundOutcome', ({ result, playerScore, opponentScore }) => {
      this.roundResult = result;
      this.playerScore = playerScore;
      this.opponentScore = opponentScore;
    });

    this.socket.on('gameOver', (winner) => {
      alert(`Game Over! ${winner} won!`);
      this.$router.push('/');
    });
  },
  methods: {
    makeMove(move) {
      this.socket.emit('playerMove', { move, sessionCode: this.sessionCode });
    },
    nextRound() {
      this.roundResult = null;
    },
  },
  beforeUnmount() {
    this.socket.disconnect();
  },
};
</script>

<style scoped>
/* Add some basic styling */
</style>

