<!-- JoinScreen.vue -->
<template>
  <div class="join-screen">
    <h2>Join a Session</h2>
    <input v-model="sessionCode" placeholder="Enter session code" />
    <button @click="joinSession">Join</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      sessionCode: "",
      errorMessage: "",
      socket: null,
    };
  },
  methods: {
    async joinSession() {
      try {
        // Connect to the backend via WebSocket
        this.socket = io("http://localhost:8080");  // Update URL if different
        this.socket.emit("joinSession", this.sessionCode);

        // Attempt to join session via API
        const response = await fetch(`http://localhost:8080/api/sessions/${this.sessionCode}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName: "Player2" }),
        });

        const result = await response.json();
        if (result.success) {
          // Navigate to waiting screen if join was successful
          this.$router.push({ name: "GameScreen", params: { sessionCode: this.sessionCode } });
        } else {
          this.errorMessage = result.message;
        }
      } catch (error) {
        console.error("Error joining session:", error);
        this.errorMessage = "Failed to join session. Please try again.";
      }
    }
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

