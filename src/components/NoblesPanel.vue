<template>
  <v-sheet class="nobles-panel" color="surface-light"> 
    <div class="noble-icon" v-for="noble in game.nobles">
      <v-tooltip activator="parent">
        <div class="noble-expanded-icon">
          <img :src="getNobleImgUrl(noble)" alt="">
        </div>
      </v-tooltip>
      <img :src="getNobleImgUrl(noble)">
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';

const game = useGameStore()

function getNobleImgUrl(nobleId: number) {
  return `./assets/nobles/${nobleId}.webp`
}
</script>

<style scoped>
.nobles-panel {
  height: 100%;

  display: flex;
  justify-content: space-evenly;
}

.noble-icon {
  border-radius: 5px;
  overflow: hidden;
}

.noble-icon img {
  width: 100%;
  height: 100%;
  display: block;
}

.noble-expanded-icon {
  margin: -5px -16px;
  border-radius: 50px;
  overflow: hidden;
}
</style>
