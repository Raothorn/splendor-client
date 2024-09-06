<template>
  <v-sheet class="player-info-panel" color="surface-light">
    <div class="player-card fill-height" v-for="player in game.getPlayers">
      <PlayerInfoCard :player="player"></PlayerInfoCard>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import PlayerInfoCard from "./PlayerInfoCard.vue";
import { useGameStore } from "@/stores/appStores";

const game = useGameStore();
</script>

<style scoped>

/* small screens */
.player-info-panel {
  height: 100%;
  overflow-x: scroll;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0px;
}
.player-card {
  margin: 0px 10px;
}

</style>
