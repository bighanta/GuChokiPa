<template>
  <div class="waiting-screen">
    <h2>Waiting for another player to join...</h2>
    <p>Session Code: {{ sessionCode }}</p>
    <p>If both players are ready, the game will start shortly.</p>
    <p v-if="sessionFull" style="color: red;">Session is full! Please wait for the game to start.</p>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      sessionCode: null,
      sessionFull: false,  // Flag to check if session is full
    };
  },
  mounted() {
    // Get the session code from the route parameters
    this.sessionCode = this.$route.params.sessionCode;

    // Connect to the socket and join the session room
    this.socket = io("http://localhost:8080");  // Adjust URL if needed

    // Emit to the backend to join the session
    this.socket.emit("joinGame", { sessionCode: this.sessionCode });

    // Listen for the "sessionFull" event from the backend
    this.socket.on("sessionFull", (message) => {
      // Set the flag to true if session is full
      this.sessionFull = true;
    });

    // Listen for the "gameStart" event to navigate to the game screen
    this.socket.on("gameStart", (message) => {
      // Redirect to the Game Screen when both players have joined
      this.$router.push({ name: "GameScreen", params: { sessionCode: this.sessionCode } });
    });
  },
  beforeUnmount() {
    // Disconnect the socket when the component is destroyed
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style scoped>
.waiting-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
}

.waiting-screen p {
  font-size: 18px;
}

.waiting-screen h2 {
  font-size: 24px;
  margin-bottom: 20px;
}
</style>

