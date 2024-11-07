<template>
  <div class="home">
    <h1>Schnick, Schnack, Schnuck</h1>
    <button @click="createSession">Create Session</button>
    <button @click="$router.push('/join')">Join Session</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeScreen',
  methods: {
    async createSession() {
      try {
        const response = await axios.post('http://localhost:8080/api/sessions/create', { playerName: 'Player1' });
        const sessionCode = response.data.code;
        this.$router.push({ path: `/waiting/${sessionCode}`, query: { isHost: true } });
      } catch (error) {
        console.error('Error creating session:', error);
        alert('Could not create session. Please try again.');
      }
    },
  },
};
</script>

<style scoped>
/* Add some basic styling */
</style>

