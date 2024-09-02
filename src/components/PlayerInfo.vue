<template>
  <v-sheet class="fill-height" color="surface" rounded>
    <v-card color="surface-light">
      <v-card-title class="text-center"> Player 1 </v-card-title>
      <v-card-text>
        <div class="d-flex">
          <div class="d-flex flex-column justify-space-between mr-2">
            <template v-for="color in ['Black', 'Red', 'Green']">
              <div class="d-flex align-center">
                <img :src="getImgUrl(color)" />
                <h4> {{ tokenDisplay(color) }} </h4>
              </div>
            </template>
          </div>
          <div class="d-flex flex-column justify-space-between">
            <template v-for="color in ['White', 'Blue', 'Gold']">
              <div class="d-flex align-center">
                <img :src="getImgUrl(color)" />
                <h4> {{ tokenDisplay(color) }} </h4>
              </div>
            </template>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/appStores';


const game = useGameStore()

function tokenDisplay(color: string) {
  let playerTokens = game.getPlayerTokens(color);
  let devValue = game.getPlayerDevelopmentValue(color);

  return `${playerTokens} + ${devValue} = ${playerTokens + devValue}`
}

function getImgUrl(color: string) {
  return `/public/assets/token_${color.toLowerCase()}.png`;
}
</script>

<style scoped>
img {
  width: 20px;
  margin-bottom: 2px;
  margin-right: 4px;
}
</style>
