<template>
  <v-card class="container fill-height" color="surface-light">
    <div class="fill-height d-flex flex-column justify-space-around">
      <div class="d-flex">
        <v-sheet class="card card-back" rounded elevation="10">
          <img
            src="/public/assets/developments_1/back_3.png"
            :class="game.unshownDevelopmentCardsAmt(2) == 0 ? 'hidden' : ''"
          />
        </v-sheet>
        <v-sheet
          class="card"
          v-for="cardId in game.getDevelopmentCards(2)"
          rounded
          :class="isSelected(cardId) ? 'selected' : ''"
          @click="selectCard(cardId)"
          :elevation="isSelected(cardId) ? 6 : 3"
        >
          <img :src="getCardImgUrl(cardId)" />
        </v-sheet>
      </div>
      <div class="d-flex">
        <v-sheet class="card card-back" rounded elevation="10">
          <img
            src="/public/assets/developments_1/back_2.png"
            :class="game.unshownDevelopmentCardsAmt(1) == 0 ? 'hidden' : ''"
          />
        </v-sheet>
        <v-sheet
          class="card"
          v-for="cardId in game.getDevelopmentCards(1)"
          rounded
          :class="isSelected(cardId) ? 'selected' : ''"
          @click="selectCard(cardId)"
          :elevation="isSelected(cardId) ? 6 : 3"
        >
          <img :src="getCardImgUrl(cardId)" />
        </v-sheet>
      </div>
      <div class="d-flex">
        <v-sheet class="card card-back" rounded elevation="10">
          <img
            src="/public/assets/developments_1/back_1.png"
            :class="game.unshownDevelopmentCardsAmt(0) == 0 ? 'hidden' : ''"
          />
        </v-sheet>
        <v-sheet
          class="card"
          v-for="cardId in game.getDevelopmentCards(0)"
          rounded
          :class="isSelected(cardId) ? 'selected' : ''"
          @click="selectCard(cardId)"
          :elevation="isSelected(cardId) ? 6 : 3"
        >
          <img :src="getCardImgUrl(cardId)" />
        </v-sheet>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useGameStore, useUiStore } from "@/stores/appStores";

const game = useGameStore();
const ui = useUiStore();

function selectCard(index: number) {
  if (ui.isPurchasingDevelopment) {
    console.log(index);
    // Toggle selected
    if (ui.selectedDevelopment == index) {
      ui.selectedDevelopment = -1;
    } else {
      ui.selectedDevelopment = index;
    }
  }
}

function isSelected(index: number) {
  return ui.isPurchasingDevelopment && ui.selectedDevelopment == index;
}

function getCardImgUrl(index: number) {
  return `/public/assets/developments_1/${index}.png`;
}
</script>

<style scoped>
img {
  max-height: 100%;
  max-width: auto;
}

.card {
  height: 15vh;
  overflow: hidden;
  margin-right: 10px;
}

.card-back {
  margin-left: 20px;
  margin-right: 20px;
}

.card-group {
  width: 100%;
  margin-right: 10px;
}

.selected {
  transform: scale(1.1);
}

.hidden {
  visibility: hidden;
}
</style>
