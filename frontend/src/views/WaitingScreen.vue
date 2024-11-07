<template>
  <div class="waiting">
    <h2>Waiting for another player to join...</h2>
    <p>Your session code: {{ sessionCode }}</p>
  </div>
</template>

<script>
import { io } from 'socket.io-client';

export default {
  name: 'WaitingScreen',
  data() {
    return {
      sessionCode: this.$route.params.sessionCode,
      socket: null,
    };
  },
  mounted() {
    this.socket = io();
    this.socket.emit('joinWaitingRoom', { sessionCode: this.sessionCode });

    this.socket.on('playerJoined', () => {
      this.$router.push(`/game/${this.sessionCode}`);
    });
  },
  beforeUnmount() {
    this.socket.disconnect();
  },
};
</script>

<style scoped>
/* Add some basic styling */
</style>

