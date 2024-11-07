<template>
  <div class="join-screen">
    <h1>Join Session</h1>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <form @submit.prevent="joinSession">
      <div>
        <label for="sessionCode">Session Code</label>
        <input
          v-model="sessionCode"
          type="text"
          id="sessionCode"
          placeholder="Enter Session Code"
          required
        />
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Joining...' : 'Join Session' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import io from "socket.io-client"; // Assuming you have Socket.IO installed

export default {
  name: "JoinScreen",
  setup() {
    const sessionCode = ref("");
    const errorMessage = ref("");
    const loading = ref(false);
    const router = useRouter();
    const socket = io(); // Connect to the server

    // Listen for the session_full event
    socket.on("session_full", (data) => {
      if (data.success) {
        // Redirect to the game screen once session is full
        router.push(`/game/${data.sessionCode}`);
      }
    });

    const joinSession = async () => {
      // Validate input
      if (!sessionCode.value) {
        errorMessage.value = "Session code is required.";
        return;
      }

      loading.value = true;
      errorMessage.value = "";

      try {
        // Join the session by calling the backend
        const response = await fetch(`http://localhost:8080/api/sessions/${sessionCode.value}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playerName: "Player 2" }),
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
          // If successfully joined, emit the session_full event
          console.log("Successfully joined session:", data);
        } else {
          // Handle errors (session not found, already full, etc.)
          errorMessage.value = data.message || "Failed to join session.";
        }
      } catch (error) {
        errorMessage.value = "An error occurred while trying to join the session.";
        console.error("Error joining session:", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      sessionCode,
      errorMessage,
      loading,
      joinSession,
    };
  },
};
</script>

