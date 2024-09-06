<template>
  <v-card class="w-50 mx-auto my-10">
    <v-card-title>Current game</v-card-title>
    <v-card-text>
      <v-table>
        <thead>
          <tr>
            <h1>Players</h1>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in game.getPlayers">
            <td>
              <div class="d-flex justify-space-between align-end">
                <h3>{{ player.username }}</h3>
                <v-btn @click="rejoin(player.username)" variant="tonal" disabled>Rejoin</v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
      <hr />
      <br />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useAppStore, useGameStore } from "@/stores/appStores";

const app = useAppStore();
const game = useGameStore();

function rejoin(rejoinAs: string) {
  app.username = rejoinAs;
}
</script>
