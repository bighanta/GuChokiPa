<script>
import App from "../App.vue";
</script>

<template>
  <table>
    <tr>
      <th>Spiel erstellen</th>
      <th>Spiel beitreten</th>
    </tr>
    <tr>
      <td>
        <label for="username-new-input" class="mr-2">Spielername:</label>
        <input id="username-new-input" type="text" />
      </td>
      <td>
        <label for="username-join-input" class="mr-2">Spielername:</label>
        <input id="username-join-input" type="text" />
      </td>
    </tr>
    <tr>
      <td></td>
      <td>
        <label for="game-id-input" class="mr-2">Session Id:</label>
        <input id="game-id-input" />
      </td>
    </tr>
    <tr>
      <td>
        <button @click="">Spiel erstellen</button>
      </td>
      <td>
        <button @click="">Spiel beitreten</button>
      </td>
    </tr>
  </table>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  border: 1px solid white;
}

td {
  border-left: 1px solid white;
  text-align: center;
  padding: 1em;
}

th {
  border: 1px solid white;
  text-align: center;
  padding: 1em;
}
</style>
