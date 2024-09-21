<template>
  <main>
    <AllocateGoldDialog></AllocateGoldDialog>
    <GameSummaryDialog></GameSummaryDialog>
    <div v-if="game.isGameStarted">
      <div v-if="app.isJoined">
        <MainBoard />
      </div>
      <div v-else>
        <Rejoin></Rejoin>
      </div>
    </div>
    <div v-else>
      <Lobby />
    </div>
  </main>
</template>

<script lang="ts" setup>
import Lobby from '@/components/Lobby.vue';
import MainBoard from '@/components/MainBoard.vue';
import Rejoin from '@/components/Rejoin.vue';
import { useAppStore } from '@/stores/appStores';
import { useGameStore } from '@/stores/gameStore';
import AllocateGoldDialog from "@/components/AllocateGoldDialog.vue";
import GameSummaryDialog from "@/components/GameSummaryDialog.vue";

const game = useGameStore()
// This is necessary
const app = useAppStore();
</script>

