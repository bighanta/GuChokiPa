<template>
  <div class="waiting-screen">
    <h2>Waiting for another player to join...</h2>
    <p>Session Code: {{ sessionCode }}</p>
    <p>If both players are ready, the game will start shortly.</p>
    <p v-if="sessionFull" style="color: red;">Session is full! Please wait for the game to start.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';

// Reactive state
const sessionCode = useRoute().params.sessionCode;
const sessionFull = ref(false);
const socket = ref(null);
const router = useRouter();

// Mounting logic for socket connection
onMounted(() => {
  socket.value = io("http://localhost:8080");  // Adjust URL as needed

  // Emit to the backend to join the session
  socket.value.emit("joinGame", { sessionCode });

  // Listen for the "sessionFull" event from the backend
  socket.value.on("sessionFull", (message) => {
    sessionFull.value = true;
  });

  // Listen for the "gameStart" event to navigate to the game screen
  socket.value.on("gameStart", () => {
    router.push({ name: "GameScreen", params: { sessionCode } });
  });
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});
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

