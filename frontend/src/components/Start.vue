<script>
import App from "../App.vue";
</script>

<template>
  <table>
    <tr>
      <th colspan="2">Spiel erstellen</th>
      <th colspan="2">Spiel beitreten</th>
    </tr>
    <tr>
      <td class="cell-with-border">
        <label for="username-new-input" class="ml-3">Spielername:</label>
      </td>
      <td>
        <input id="username-new-input" type="text" />
      </td>
      <td class="cell-with-border">
        <label for="username-join-input" class="ml-3">Spielername:</label>
      </td>
      <td>
        <input id="username-join-input" type="text" />
      </td>
    </tr>
    <tr>
      <td colspan="2"></td>
      <td class="cell-with-border">
        <label for="game-id-input" class="ml-3">Session Id:</label>
      </td>
      <td>
        <input id="game-id-input" />
      </td>
    </tr>
    <tr>
      <td colspan="2" class="cell-with-border">
        <button @click="">Spiel erstellen</button>
      </td>
      <td colspan="2" class="cell-with-border">
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

.cell-with-border {
  border-left: 1px solid white;
  text-align: end;
}

td {
  text-align: center;
  padding: 1em;
}

th {
  border: 1px solid white;
  text-align: center;
  padding: 1em;
}
</style>
