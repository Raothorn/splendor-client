<template>
  <v-card class="w-50 mx-auto my-10">
    <v-card-title class="text-center">Rejoin ongoing game</v-card-title>
    <v-card-text>
      <v-table>
        <tbody>
          <tr>
            <td>
              <div class="d-flex justify-space-between align-end">
                <h3>{{ username }}</h3>
                <v-btn @click="rejoin(username)" variant="tonal">Rejoin</v-btn>
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
import { useAppStore } from '@/stores/appStores';
import { useGameStore } from '@/stores/gameStore';


const app = useAppStore();
const game = useGameStore();

const username = computed(() => {
  return game.getUserPlayer?.username ?? "";
})

function rejoin(rejoinAs: string) {
  app.username = rejoinAs;
}
</script>
