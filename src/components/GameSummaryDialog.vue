<template>
  <v-dialog v-model="game.isGameOver" max-width="400">
    <v-card>
      <v-card-title>Game over</v-card-title>
      <v-card-subtitle>Player {{ game.gameOverSummary }} wins!</v-card-subtitle>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Prestiege Points</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="player in game.getPlayers"
              :class="{ winner: game.gameOverSummary == player.username }"
            >
              <td>
                {{ player.username }}
              </td>
              <td>{{ player.victoryPoints }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useGameStore } from "@/stores/gameStore"

const game = useGameStore()
</script>

<style scoped>
img {
  display: block;
  width: 20px;
}

th {
  text-align: center !important;
}

td {
  text-align: center !important;
}

.winner {
  color: green;
}
</style>
