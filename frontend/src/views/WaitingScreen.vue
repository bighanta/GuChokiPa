<!-- WaitingScreen.vue -->
<template>
  <div class="waiting-screen">
    <h2>Waiting for another player to join...</h2>
    <p>Session Code: {{ sessionCode }}</p>
    <p>If both players are ready, the game will start shortly.</p>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      sessionCode: null,
    };
  },
  mounted() {
    // Get the session code from the route parameters
    this.sessionCode = this.$route.params.sessionCode;

    // Connect to the socket and join the session room
    this.socket = io("http://localhost:8080");  // Adjust URL as needed
    this.socket.emit("joinSession", this.sessionCode);

    // Listen for the "session_full" event from the backend
    this.socket.on("session_full", () => {
      // Redirect to the game screen when session is full
      this.$router.push({ name: "GameScreen", params: { sessionCode: this.sessionCode } });
    });
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
};
</script>

<style scoped>
.waiting-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

