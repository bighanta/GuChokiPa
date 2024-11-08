<template>
  <div class="waiting-screen flex flex-col items-center justify-center bg-gray-900 min-h-screen text-center text-gray-200 p-6">
    <!-- Heading -->
    <h2 class="text-2xl font-bold mb-4">{{ playerName }} is waiting for another player to join...</h2>

    <!-- Session Code Display -->
    <p class="text-lg bg-gray-800 text-gray-300 rounded-lg py-2 px-4 mb-6">
      Session Code: <span class="text-white font-semibold">{{ sessionCode }}</span>
    </p>

    <!-- Instructional Text -->
    <p class="text-md text-gray-400 mb-4">If both players are ready, the game will start shortly.</p>

    <!-- Session Full Warning -->
    <p v-if="sessionFull" class="text-lg font-semibold text-red-500">
      Session is full! Please wait for the game to start.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';

const route = useRoute();
const sessionCode = route.params.sessionCode; // Access sessionCode from path params
const playerName = route.query.playerName; // Access playerName from query params
const sessionFull = ref(false);
const socket = ref(null);
const router = useRouter();
console.log("Wait", playerName);
// Mounting logic for socket connection
onMounted(() => {
  socket.value = io("http://localhost:8080");  // Adjust URL as needed

  // Emit to the backend to join the session
  socket.value.emit("joinGame", { sessionCode, playerName });

  // Listen for the "sessionFull" event from the backend
  socket.value.on("sessionFull", (message) => {
    sessionFull.value = true;
  });

  // Listen for the "gameStart" event to navigate to the game screen
  socket.value.on("gameStart", () => {
    router.push({ name: "GameScreen", params: { sessionCode }, query: { playerName: playerName} });
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

